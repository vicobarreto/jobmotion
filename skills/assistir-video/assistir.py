"""
assistir.py: deixa o Claude "assistir" um vídeo (reel, TikTok, YouTube ou arquivo local).

Saída numa pasta:
  info.json        título, autor, legenda/descrição, duração (do yt-dlp)
  folha-NN.jpg     folhas de quadros (3x3), em ordem, com o segundo de cada quadro no nome do arquivo de índice
  quadros.txt      segundo de cada quadro, na ordem das folhas
  transcricao.txt  a fala com o tempo de cada trecho (faster-whisper, local)
  legenda.vtt      a legenda do próprio vídeo, quando existe (YouTube)

Uso:
  python assistir.py <url-ou-arquivo> [--saida PASTA] [--sem-fala] [--a-cada 2] [--modelo small]

Nada aqui usa login, cookie do navegador ou chave de API.
"""
import argparse
import json
import math
import os
import shutil
import subprocess
import sys
import tempfile


def rodar(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", **kw)


def baixar(url, pasta):
    """Baixa o vídeo (até 720p), a legenda quando existir e as informações. Devolve o caminho do mp4."""
    if os.path.isfile(url):
        destino = os.path.join(pasta, "video" + os.path.splitext(url)[1])
        shutil.copyfile(url, destino)
        return destino, {"titulo": os.path.basename(url)}
    r = rodar([
        "yt-dlp", "--no-playlist", "--no-warnings",
        "-f", "bv*[height<=720]+ba/b[height<=720]/b",
        "--merge-output-format", "mp4",
        "--write-info-json", "--write-subs", "--write-auto-subs",
        "--sub-langs", "pt.*,en.*", "--sub-format", "vtt", "--convert-subs", "vtt",
        "-o", os.path.join(pasta, "video.%(ext)s"),
        url,
    ])
    mp4 = os.path.join(pasta, "video.mp4")
    if not os.path.exists(mp4):
        candidatos = [f for f in os.listdir(pasta) if f.startswith("video.") and f.split(".")[-1] in ("mp4", "webm", "mkv", "mov")]
        if not candidatos:
            erro = (r.stderr or r.stdout).strip().splitlines()[-3:]
            raise SystemExit(
                "Não consegui baixar o vídeo.\n" + "\n".join(erro) +
                "\nSe for Instagram/TikTok pedindo login: abra o post no Playwright, leia a URL do <video> "
                "(ou og:video) e rode de novo com essa URL, ou baixe o arquivo e passe o caminho local."
            )
        mp4 = os.path.join(pasta, candidatos[0])
    info = {}
    caminho_info = os.path.join(pasta, "video.info.json")
    if os.path.exists(caminho_info):
        bruto = json.load(open(caminho_info, encoding="utf-8"))
        info = {
            "titulo": bruto.get("title"),
            "autor": bruto.get("uploader") or bruto.get("channel"),
            "descricao": bruto.get("description"),
            "duracao_s": bruto.get("duration"),
            "url": bruto.get("webpage_url") or url,
        }
        os.remove(caminho_info)  # o bruto tem muita coisa; fica só o resumo
    for f in os.listdir(pasta):
        if f.endswith(".vtt"):
            os.replace(os.path.join(pasta, f), os.path.join(pasta, "legenda.vtt"))
            break
    return mp4, info


def baixar_faixas(arquivo_json, pasta):
    """Instagram: o yt-dlp pede login, mas o navegador do Playwright MCP toca o reel sem login.
    Lá, `performance.getEntriesByType('resource')` lista as faixas .mp4 que a página baixou (vídeo e
    áudio separados, em pedaços). Sem `bytestart`/`byteend`, cada endereço devolve a faixa inteira.
    Recebe o JSON com essa lista, baixa tudo, escolhe o melhor vídeo e o áudio e junta."""
    import urllib.request
    urls = json.load(open(arquivo_json, encoding="utf-8"))
    faixas = []
    for i, u in enumerate(dict.fromkeys(urls)):
        arq = os.path.join(pasta, f"faixa{i}.mp4")
        pedido = urllib.request.Request(u, headers={"User-Agent": "Mozilla/5.0", "Referer": "https://www.instagram.com/"})
        try:
            with urllib.request.urlopen(pedido, timeout=60) as r, open(arq, "wb") as f:
                shutil.copyfileobj(r, f)
        except Exception:
            continue
        s = rodar(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,height", "-of", "csv=p=0", arq]).stdout
        altura = 0
        for linha in s.splitlines():
            partes = linha.split(",")
            if partes[0] == "video" and len(partes) > 1 and partes[1].isdigit():
                altura = max(altura, int(partes[1]))
        faixas.append({"arq": arq, "video": "video" in s, "audio": "audio" in s, "altura": altura, "tamanho": os.path.getsize(arq)})
    videos = sorted((f for f in faixas if f["video"]), key=lambda f: (f["altura"], f["tamanho"]), reverse=True)
    audios = sorted((f for f in faixas if f["audio"] and not f["video"]), key=lambda f: f["tamanho"], reverse=True)
    if not videos:
        raise SystemExit("Nenhuma das faixas é vídeo: o reel pode não ter tocado. Deixe tocar ~5 s antes de listar.")
    destino = os.path.join(pasta, "video.mp4")
    cmd = ["ffmpeg", "-v", "error", "-y", "-i", videos[0]["arq"]]
    if audios and not videos[0]["audio"]:
        cmd += ["-i", audios[0]["arq"], "-map", "0:v:0", "-map", "1:a:0"]
    rodar(cmd + ["-c", "copy", destino])
    for f in faixas:
        os.remove(f["arq"])
    return destino


def duracao(mp4):
    r = rodar(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4])
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 0.0


def quadros(mp4, pasta, a_cada):
    """Um quadro a cada `a_cada` segundos (no máximo 54), em folhas 3x3 de 1440 px de largura."""
    total = duracao(mp4)
    passo = max(a_cada, total / 54) if total else a_cada
    tempos = [round(i * passo, 1) for i in range(int(total / passo) + 1)] if total else [0]
    tmp = tempfile.mkdtemp(prefix="quadros-", dir=pasta)
    for i, t in enumerate(tempos):
        rodar(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", mp4, "-frames:v", "1",
               "-vf", "scale=480:-2", os.path.join(tmp, f"q{i:03d}.jpg")])
    gerados = sorted(f for f in os.listdir(tmp) if f.endswith(".jpg"))
    folhas = []
    for n in range(math.ceil(len(gerados) / 9)):
        lote = gerados[n * 9:(n + 1) * 9]
        lista = os.path.join(tmp, f"lote{n}.txt")
        with open(lista, "w", encoding="utf-8") as f:
            for g in lote:
                f.write(f"file '{os.path.join(tmp, g)}'\n")
        saida = os.path.join(pasta, f"folha-{n + 1:02d}.jpg")
        rodar(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lista,
               "-vf", "scale=480:-2,tile=3x3:padding=6:color=white", "-frames:v", "1", saida])
        folhas.append(saida)
    with open(os.path.join(pasta, "quadros.txt"), "w", encoding="utf-8") as f:
        for n in range(len(folhas)):
            seg = tempos[n * 9:(n + 1) * 9]
            f.write(f"folha-{n + 1:02d}.jpg: " + ", ".join(f"{s}s" for s in seg) + " (da esquerda para a direita, linha a linha)\n")
    shutil.rmtree(tmp, ignore_errors=True)
    return folhas, total


def transcrever(mp4, pasta, modelo):
    from faster_whisper import WhisperModel  # import tardio: só quem quer a fala paga o carregamento
    wav = os.path.join(pasta, "audio.wav")
    rodar(["ffmpeg", "-v", "error", "-y", "-i", mp4, "-ac", "1", "-ar", "16000", wav])
    if not os.path.exists(wav) or os.path.getsize(wav) < 2000:
        return None
    m = WhisperModel(modelo, device="cpu", compute_type="int8")
    trechos, info = m.transcribe(wav, vad_filter=True)
    linhas = [f"[{s.start:6.1f}s] {s.text.strip()}" for s in trechos]
    os.remove(wav)
    caminho = os.path.join(pasta, "transcricao.txt")
    with open(caminho, "w", encoding="utf-8") as f:
        f.write(f"# idioma detectado: {info.language} ({info.language_probability:.0%})\n")
        f.write("\n".join(linhas) + "\n")
    return caminho


def main():
    p = argparse.ArgumentParser()
    p.add_argument("fonte")
    p.add_argument("--saida")
    p.add_argument("--sem-fala", action="store_true")
    p.add_argument("--a-cada", type=float, default=2.0)
    p.add_argument("--modelo", default="small")
    p.add_argument("--faixas", help="JSON com as URLs .mp4 lidas no Playwright (Instagram)")
    a = p.parse_args()

    pasta = a.saida or tempfile.mkdtemp(prefix="assistir-")
    os.makedirs(pasta, exist_ok=True)
    if a.faixas:
        mp4, info = baixar_faixas(a.faixas, pasta), {"url": a.fonte}
    else:
        mp4, info = baixar(a.fonte, pasta)
    folhas, total = quadros(mp4, pasta, a.a_cada)
    info["duracao_s"] = info.get("duracao_s") or round(total, 1)
    json.dump(info, open(os.path.join(pasta, "info.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    fala = None if a.sem_fala else transcrever(mp4, pasta, a.modelo)
    os.remove(mp4)  # o vídeo não fica guardado
    print(json.dumps({
        "pasta": pasta,
        "info": os.path.join(pasta, "info.json"),
        "folhas": folhas,
        "quadros": os.path.join(pasta, "quadros.txt"),
        "transcricao": fala,
        "legenda": os.path.join(pasta, "legenda.vtt") if os.path.exists(os.path.join(pasta, "legenda.vtt")) else None,
    }, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()

---
name: assistir-video
description: Faz o Claude "assistir" um vídeo de verdade (reel do Instagram, TikTok, YouTube, X ou arquivo local) — baixa sem login, tira quadros em folhas 3x3, transcreve a fala localmente (faster-whisper) e lê a legenda/descrição — para dizer o que o vídeo ensina, quais ferramentas/sites/repositórios aparecem na tela e os passos mostrados. Use quando o usuário disser "assiste esse vídeo", "o que esse reel ensina", "lê esse TikTok", "quais ferramentas aparecem nesse vídeo", "resume esse YouTube", ou quando uma leitura de post só pela legenda não bastar.
argument-hint: "<url ou caminho do vídeo> [--sem-fala]"
user-invocable: true
---

# Assistir vídeo

Leitura completa de um vídeo: **o que aparece na tela** (quadros) + **o que é falado** (transcrição) + **o que o autor escreveu** (legenda/descrição). Sem login, sem cookie do navegador, sem chave de API.

## Ferramenta

`python ~/.claude/skills/assistir-video/assistir.py <url-ou-arquivo> --saida <pasta> [--sem-fala] [--a-cada 2] [--modelo small] [--faixas urls.json]`

Saída na pasta (use o scratchpad da sessão):
- `info.json` — título, autor, descrição/legenda, duração, url
- `folha-NN.jpg` — folhas 3x3 de quadros (até 54 quadros, ~1 a cada 2 s); `quadros.txt` diz o segundo de cada quadro
- `transcricao.txt` — fala com tempo (`[  12.3s] ...`) e idioma detectado
- `legenda.vtt` — legenda do próprio vídeo, quando existe (YouTube)

O vídeo baixado é apagado no fim; só ficam quadros e textos.

Dependências (já instaladas nesta máquina): `yt-dlp`, `ffmpeg`/`ffprobe`, `faster-whisper` (Python). O modelo `small` é baixado na primeira transcrição (~460 MB, uma vez); em CPU leva ~1 min por minuto de vídeo. `--modelo base` é mais rápido e menos preciso.

## Passo a passo

1. **YouTube, TikTok, X, Vimeo, arquivo local:** rode direto o `assistir.py` com a URL.
2. **Instagram** (o yt-dlp pede login): use o navegador do **Playwright MCP**, que toca o reel deslogado:
   1. `browser_navigate` para o post.
   2. `browser_evaluate` que espera ~3 s, faz `video.muted=true; video.play()`, espera ~5 s e devolve as URLs `.mp4` de `performance.getEntriesByType('resource')`, **removendo os parâmetros `bytestart` e `byteend`** (assim cada URL baixa a faixa inteira). Salve com o parâmetro `filename` dentro de `<pasta-do-playwright-mcp>` (a única pasta que o MCP aceita).
   3. `browser_close`.
   4. `assistir.py <url-do-post> --faixas <pasta-do-playwright-mcp>/<arquivo>.json --saida <pasta>` — ele baixa as faixas, escolhe o melhor vídeo + o áudio e junta.
   5. Apague o JSON de faixas depois (as URLs são assinadas e expiram, mas não precisam ficar).
3. **Leia tudo:** `info.json` (legenda), `transcricao.txt` e **cada** `folha-NN.jpg` com a ferramenta Read. Nomes de repositório, sites e comandos costumam estar só na tela — leia os quadros com atenção e cruze com a fala (o Whisper erra nomes próprios: "matpokok" = Matt Pocock).
4. **Responda** em português, no formato:
   - **O que é** (2–4 frases)
   - **Passos / pontos mostrados** (na ordem do vídeo, com o segundo)
   - **Ferramentas, sites e repositórios** (nome + URL quando der para identificar; marque "provável" quando for leitura incerta)
   - **Como usar no nosso trabalho** (1–2 frases)
   - **De onde veio** (quadros, fala, legenda) e o que ficou ilegível

## Regras

- Nunca use `--cookies-from-browser`, login ou senha. Se nem o Playwright tocar o vídeo, diga que o post exige login e leia só a legenda (og:description).
- Não publique, curta, comente nem siga nada.
- Não guarde o vídeo; guarde só o que o usuário pedir (fichas, notas).
- Para muitos vídeos de uma vez, rode um por vez (memória da máquina é curta) e use `--modelo base` se o tempo apertar.
- Para salvar o resultado na biblioteca, use a skill `/referencias-salvas`.

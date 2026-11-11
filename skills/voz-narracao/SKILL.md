---
name: voz-narracao
description: Gera a narração em português do Brasil dos vídeos — a voz de cada cena em MP3 e a legenda com tempo — com o mesmo código usado nos vídeos do kit (Edge TTS grátis, Piper local, ou OpenAI e ElevenLabs com chave), com cache, controle de velocidade e dicionário de pronúncia para marcas e siglas. Use quando o usuário disser "gera a voz do vídeo", "narra esse texto", "troca a voz", "a voz leu o nome da marca errado", "quero a mesma voz dos outros vídeos", "legenda sincronizada com a fala".
argument-hint: "<texto ou roteiro.json> [--voz pt-BR-FranciscaNeural] [--velocidade +5%]"
user-invocable: true
---

# Voz e narração

Onde a voz dos vídeos é gerada: `voz/narrar.mjs` (neste repositório; no kit de vídeo é `src/narrar.mjs`). Ele recebe os trechos de fala do roteiro, gera um MP3 por trecho, mede a duração e devolve a legenda com tempo. O vídeo é gravado e montado no tempo dessa fala.

Guia completo, com tabelas e exemplos: `docs/voz.md` do repositório.

## Uso rápido

```bash
cd <pasta-do-repositorio>

# um texto
node voz/falar.mjs "Seu pet merece mais que um banho." --saida saida-voz

# todas as falas de um roteiro do kit (abertura, cenas, fechamento)
node voz/falar.mjs --roteiro roteiro.json --saida saida-voz
```

Saída em `saida-voz/audio/<id>-<hash>.mp3` (mais `.srt` no motor `edge`) e `saida-voz/narracao.json` com `duracao` e `legenda` de cada trecho.

Dentro de um vídeo do kit a voz é gerada sozinha na etapa `narrar` (`node src/video.mjs roteiro.json`).

## Voz padrão dos vídeos

`motor: "edge"`, `voz: "pt-BR-FranciscaNeural"`, `velocidade: "+4%"` a `"+5%"`.

Alternativa local e sem internet: motor `piper` (voz `jeff`), ver `docs/voz.md`. Para trocar, edite o bloco `voz` do roteiro ou use `--voz`. Lista de vozes: `python -m edge_tts --list-voices | grep pt-BR`.

## Passo a passo

1. **Requisitos:** Node 22+, Python 3.10+ com `pip install edge-tts`, e `ffprobe` (vem com o FFmpeg) no PATH.
2. **Escreva a fala curta:** uma ou duas frases por cena. A fala define a duração da cena.
3. **Rode** o comando acima e ouça os MP3.
4. **Marca ou sigla lida errado?** Use `pronuncia` no roteiro (ver `docs/voz.md`): a voz lê a forma falada, a legenda mantém a escrita.
5. **Só reescreva o que mudou:** o áudio é guardado por texto + voz + velocidade; trocar uma cena refaz só ela.

## Regras

- **Chave de API só por variável de ambiente** (`OPENAI_API_KEY`, `ELEVENLABS_API_KEY`), nunca no roteiro nem no repositório.
- O motor `edge` usa o serviço online da Microsoft de forma não oficial: bom para rascunho e uso interno; para entrega comercial a cliente, confirme se o risco é aceitável ou use `openai` ou `elevenlabs`.
- Voz clonada de uma pessoa só com autorização dela por escrito.
- Música de fundo: só faixa com licença comprovada.

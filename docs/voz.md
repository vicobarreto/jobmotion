# Como a voz dos vídeos é gerada

A narração vem de um arquivo só: [`voz/narrar.mjs`](../voz/narrar.mjs). É o mesmo código do kit de vídeo de lançamento (`src/narrar.mjs`), copiado aqui com os dois utilitários que ele precisa para rodar sozinho.

## O fluxo

```
roteiro.json ──► trechos (abertura, cenas, fechamento)
                    │
                    ▼
        pronúncia: troca a marca pela forma falada
                    │
                    ▼
        motor de voz ──► MP3 por trecho (+ SRT no motor edge)
                    │
                    ▼
   ffprobe mede a duração ──► legenda quebrada em linhas de até 52 caracteres
                    │
                    ▼
        narracao.json  { id: { arquivo, duracao, legenda } }
```

A duração real do áudio define o tempo de cada cena: o kit grava a tela e monta o vídeo para durar exatamente a fala.

## Arquivos

| Arquivo | Para quê |
|---|---|
| `voz/narrar.mjs` | gera os áudios e as legendas (motores `edge`, `piper`, `openai`, `elevenlabs`) |
| `voz/piper_falar.py` | chamado pelo motor `piper`: gera o WAV com o modelo local |
| `scripts/instalar-piper.sh` | instala o `piper-tts` e baixa vozes pt_BR |
| `voz/falar.mjs` | linha de comando: um texto avulso ou um roteiro inteiro |
| `voz/roteiro.mjs` | lê as falas do roteiro (abertura, cenas, fechamento) |
| `voz/util.mjs` | executa programas, mede duração com `ffprobe`, calcula o hash do cache |
| `skills/voz-narracao/` | a skill `/voz-narracao`, para pedir isso ao Claude Code |

## Instalação (uma vez)

```bash
pip install edge-tts      # voz grátis
# Node 22+ e FFmpeg (ffprobe) no PATH
```

Para instalar a skill: `./scripts/instalar.sh`.

## Gerar a voz

```bash
# um texto
node voz/falar.mjs "Seu pet merece mais que um banho." --saida saida-voz

# trocando voz e velocidade
node voz/falar.mjs "Olá!" --voz pt-BR-AntonioNeural --velocidade +0% --saida saida-voz

# todas as falas de um roteiro do kit
node voz/falar.mjs --roteiro roteiro.json --saida saida-voz
```

Resultado:

```
saida-voz/
├── audio/
│   ├── fala-c1786d3f1d76.mp3     # o áudio
│   └── fala-c1786d3f1d76.srt     # legenda do próprio motor (edge)
└── narracao.json                 # duração e legenda de cada trecho
```

Num roteiro, a voz é o bloco `voz`. Quando você roda `node src/video.mjs roteiro.json` no kit, essa etapa (`narrar`) roda sozinha:

```jsonc
"voz": { "motor": "edge", "voz": "pt-BR-FranciscaNeural", "velocidade": "+5%" }
```

## Motores

| Motor | Custo | Configuração |
|---|---|---|
| `edge` (padrão) | grátis | `voz.voz` (ex.: `pt-BR-FranciscaNeural`), `voz.velocidade` (ex.: `+5%`), `voz.tom` (ex.: `-15Hz`, mais grave) |
| `piper` | grátis, 100% local, sem internet | `voz.voz` (`jeff`, `cadu`, `faber`, `edresson`), `voz.pasta` (modelos `.onnx`), `voz.python`, `voz.escala` (padrão 1.15; maior = mais devagar). Ver a seção Piper abaixo |
| `openai` | centavos por vídeo | variável `OPENAI_API_KEY`; `voz.voz` (ex.: `nova`), `voz.modelo` (padrão `gpt-4o-mini-tts`), `voz.instrucoes` |
| `elevenlabs` | pago | variável `ELEVENLABS_API_KEY`; `voz.voz` = id da voz; `voz.modelo` (padrão `eleven_multilingual_v2`) |

Vozes pt-BR do `edge`: `pt-BR-FranciscaNeural` (a usada nos vídeos), `pt-BR-AntonioNeural`, `pt-BR-ThalitaMultilingualNeural`. A lista completa:

```bash
python -m edge_tts --list-voices | grep pt-BR
```

Só o motor `edge` devolve a legenda com o tempo de cada trecho de frase. Nos outros dois, a legenda é estimada: as frases são distribuídas pelo tamanho ao longo da duração do áudio.

## Piper: voz local e leve

Rede neural pequena (cerca de 63 MB por voz) que roda na CPU, sem internet nem chave. O texto vira fonemas
(espeak-ng), os fonemas entram num modelo VITS (`.onnx`) e saem as amostras de áudio. Gera uma fala em
menos de 1 s depois de carregar o modelo. A voz é fixa, de uma pessoa só: não tem sotaque regional nem
atuação (grito, deboche), e o que se ajusta é velocidade e variação de entonação.

```bash
./scripts/instalar-piper.sh modelos-piper jeff        # instala piper-tts e baixa a voz
node voz/falar.mjs "Coé, parceiro. Papo reto." --motor piper --pasta modelos-piper --saida saida-voz
```

No roteiro:

```jsonc
"voz": { "motor": "piper", "voz": "jeff", "pasta": "modelos-piper", "escala": 1.15 }
```

| Opção | O que faz |
|---|---|
| `voz.voz` | `jeff`, `cadu`, `faber`, `edresson` (ou o caminho de um `.onnx`) |
| `voz.pasta` | pasta dos modelos; também vale a variável `PIPER_DIR` |
| `voz.python` | Python que tem o `piper-tts`; também vale `PIPER_PYTHON` (use quando o Python do sistema não o tem) |
| `voz.escala` | velocidade: maior = mais devagar |
| `voz.ruido`, `voz.ruidoW` | variação de entonação e de ritmo (opcional) |

O Piper gera WAV; o kit converte para MP3 com o FFmpeg. Não devolve legenda com tempo: ela é estimada pela
duração, como nos motores `openai` e `elevenlabs`.

**Licença das vozes:** a ficha da `jeff` diz dados CC0 e base CC0. Cada voz tem a sua ficha
(`MODEL_CARD` no Hugging Face): confira antes de uso comercial, principalmente `faber` e `cadu`.

## Pronúncia de marcas e siglas

Se a voz lê o nome errado, o roteiro leva um dicionário. A voz lê a forma falada; a legenda volta à escrita original.

```jsonc
"pronuncia": { "DR Marketing": "Dê Érre Marketing", "EuPet": "Êu Pét" }
```

Dica: ouça primeiro, e só ajuste o que soou errado.

## Cache

O nome do arquivo leva um hash do texto, da voz e da velocidade. Se nada disso mudou, o MP3 é reaproveitado, então trocar a fala de uma cena refaz só aquela cena. Para forçar de novo, apague o MP3 da pasta `audio/`.

## Cuidados

- **Chave de API só por variável de ambiente.** Nunca no roteiro, no `.env` versionado ou no repositório.
- **Edge TTS** usa o serviço online da Microsoft de forma não oficial: é bom para rascunho e uso interno. Para entrega comercial a cliente, avalie o risco ou use `openai` ou `elevenlabs`.
- **Voz clonada** de uma pessoa só com autorização dela, por escrito.
- **Fala curta:** uma ou duas frases por cena; texto longo vira cena longa e vídeo lento.
- **Alternativa local:** o `media-use` tem `npx hyperframes tts` (Kokoro, no próprio computador, sem serviço online). Serve para projetos HyperFrames avulsos, fora do kit.

## Problemas comuns

| Sintoma | Causa e solução |
|---|---|
| `No module named edge_tts` | `pip install edge-tts` |
| `ffprobe` não encontrado | instale o FFmpeg e ponha no PATH |
| Marca lida errado | acrescente a marca em `pronuncia` |
| Voz diferente do resto do vídeo | outra `voz.voz` no roteiro; use sempre a mesma |
| Erro 401 ou 403 (OpenAI, ElevenLabs) | variável de ambiente ausente ou chave inválida |
| Legenda desalinhada | motores `openai` e `elevenlabs` estimam o tempo; prefira `edge` quando a legenda tem que bater |

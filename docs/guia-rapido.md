# Skills de geração e edição de vídeo

Referência rápida do que está instalado nesta máquina, em `~/.claude/skills/`. Para usar, digite `/nome-da-skill` no
Claude Code ou peça em linguagem normal. O guia completo de cada uma fica no `SKILL.md` da pasta dela.

## Qual usar

| Quero… | Use |
|---|---|
| Demonstração de um sistema, gravada da tela real | `/video-lancamento` (mod, ver abaixo) |
| Vídeo de motion graphics a partir de um roteiro, sem gravar tela | `/video-lancamento`, com cenas `"tipo": "animada"` |
| Filme, explicativo, gráfico, mapa, vertical ou legenda sob medida, em HTML | `/hyperframes` |
| Música, efeito sonoro, voz, imagem, logo, avatar ou recorte | `/media-use` |
| Objeto 3D girando, nas cores da marca, com fundo transparente | `/objeto-3d` |
| Mover, cortar ou dividir clipes de um projeto, e renderizar | `/hyperframes-cli` |
| Corrigir imagem escura ou sem vida, ou mixar o áudio | `/media-use` |
| Regravar só uma cena | `node src/video.mjs` com `--cenas` (ver abaixo) |
| Conferir um MP4 pronto ou estudar um vídeo de terceiros | `/assistir-video` |

## Geração

### `/video-lancamento` (mod deste kit)

Não é skill: é um mod do Claude Code que estuda o sistema aberto na sessão, escreve `video/roteiro.json`, mostra o
roteiro e, com o seu ok, gera o vídeo pela ferramenta `gerar_video`: narrar → gravar → montar → renderizar.

```bash
/video-lancamento                        # estuda o sistema e propõe o roteiro
/video-lancamento caminho/roteiro.json   # gera a partir de um roteiro existente
```

O formato do roteiro está no [README](README.md).

### `/hyperframes`

Vídeo feito em HTML e renderizado quadro a quadro, sempre com o mesmo resultado. É a skill a ler primeiro para criar,
editar, animar ou renderizar com HyperFrames: traz as regras da composição, o ciclo de trabalho e o que cada tipo de
vídeo pede (lançamento, explicativo, clipe musical, dados, vertical, 3D, personagem).

```bash
npx hyperframes init <pasta>             # projeto novo
npx hyperframes capture <url> --json     # usa um site como tema do vídeo
```

### `/media-use`

Encontra ou gera a mídia e a salva em `assets/` do projeto. Há um caminho pago (HeyGen) e um grátis para quase tudo.

```bash
npx hyperframes media-use resolve --type <tipo> --intent "<o que precisa>" --project <pasta>
```

| Mídia | HeyGen (pago) | Grátis, sem conta |
|---|---|---|
| Música | catálogo com mais de 10 mil faixas | MusicGen local |
| Efeitos sonoros | | Openverse; 21 embutidos |
| Imagens e ícones | busca com mais de 75 mil itens | FLUX local, se instalado |
| Logos | | theSVG, avatar do GitHub, favicon |
| Voz | vozes da HeyGen e clonagem | `npx hyperframes tts` (Kokoro) |
| Apresentador falando | vídeo com avatar | LTX local para clipes genéricos, se instalado |
| Transcrição | | `npx hyperframes transcribe` |
| Recorte de fundo | `heygen background-removal` | `npx hyperframes remove-background` |
| Correção de cor e looks | | `npx hyperframes media-treatment` |

### `/objeto-3d`

Objeto animado em laço de 3 s, em WebM com transparência, renderizado no Blender. Há três caminhos: modelo existente
(`queijo`, `voucher`, `presente`, `pino`, `moeda`), modelo novo por código em `src/blender/gerar.py`, ou peça sob
medida no Blender aberto, via MCP.

```bash
node src/objeto3d.mjs --listar
node src/objeto3d.mjs presente --como presente-eupet --cores caixa=#0b3d2e,fita=#f2c14e
node src/objeto3d.mjs voucher --como voucher-10 --texto "R$10" --quadros 8 --tamanho 256   # teste rápido de cor
```

Cada objeto leva cerca de 5 min nesta máquina, mais ~1 min para abrir o Blender. Rode um por vez.

## Edição

### `/hyperframes-cli`: linha do tempo, conferência e render

```bash
npx hyperframes timeline --json                             # o que toca e quando
npx hyperframes timeline move|trim|split|set|duplicate|delete <ref> --plan --json   # prévia; sem --plan, aplica
npx hyperframes timeline apply plano.json --json            # várias edições de uma vez
npx hyperframes timeline undo recibo.json                   # desfaz pelo recibo salvo
npx hyperframes history undo --who <quem>                   # desfaz pelo histórico do projeto
npx hyperframes check --json                                # valida antes de entregar
npx hyperframes snapshot --at 3,8                           # vê quadros sem renderizar
npx hyperframes preview --background                        # abre a pré-visualização
npx hyperframes render --quality looks --output saida.mp4   # draft, looks ou delivery
```

Nenhum comando de `timeline` muda a duração total: se um clipe passar do fim, aumente antes o `data-duration` da raiz.

### `/media-use`: imagem e som de material já pronto

| Pedido | Guia em `~/.claude/skills/media-use/references/` |
|---|---|
| Imagem escura, sem vida ou com aparência retrô; esconder um rosto; revelações | `media-treatments.md` |
| Correção de cor, LUTs, comparação de cor | `grading.md` |
| Cortar, reenquadrar ou transformar mídia | `operations.md` |
| Fades, ganho, ducking e efeitos nas faixas | `mixing.md` |
| Voz, música, legendas e transcrição | `audio.md` |

### Refazer partes de um vídeo do kit

```bash
node src/video.mjs roteiro.json --etapas=gravar,montar,renderizar --cenas=clientes   # regrava uma cena
node src/video.mjs roteiro.json --etapas=montar,renderizar --workers=1               # só remonta, sem regravar
```

## Conferência

### `/assistir-video`

Tira folhas de quadros, transcreve a fala e lê a legenda. Serve para ver se a fala bate com a legenda, se algum dado
real ficou legível e se nada cobre a tela do sistema. Também lê vídeos de YouTube, TikTok, X, Vimeo e Instagram, sem
login.

```bash
python ~/.claude/skills/assistir-video/assistir.py <url-ou-arquivo> --saida <pasta>
```

## Apoio

- **`/design-md`:** extrai as cores e a identidade da marca do cliente, usadas no roteiro e nos objetos 3D.
- **`/social`:** ganchos e estruturas de vídeo curto para Reels, TikTok e Shorts. Não gera vídeo.

## Cuidados

- **Memória curta:** renderize com 1 processo (`--workers=1`, já é o padrão do kit e do mod) e rode um trabalho pesado por vez.
- **Dados reais:** tela com dados de pessoas só é gravada com a máscara do kit (ver [README](README.md)).
- **Custo:** chamadas à HeyGen são pagas. O CLI `heygen` tem credencial e cobrança próprias, separadas do login do
  HyperFrames. Geração por IA no Blender (`generate_3d`) também pode gastar crédito.
- **Skills que faltam:** o guia do HyperFrames cita `/hyperframes-registry`, `/slideshow`, `/remotion-to-hyperframes` e
  `/figma`, que não estão instaladas nesta máquina. O pacote 0.8.222 só traz `hyperframes`, `hyperframes-cli` e `media-use`.
- **Atualização:** essas três são cópias do pacote `hyperframes` do kit (0.8.222). Ao atualizar o pacote, copie de novo
  de `node_modules/hyperframes/dist/skills/` para `~/.claude/skills/`, para o guia bater com a versão.

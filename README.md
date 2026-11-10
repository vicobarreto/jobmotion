# JobMotion: skills de vídeo para Claude Code

Nove skills que cobrem o caminho completo de um vídeo: criar, editar, trocar mídia, gerar objetos 3D e conferir o MP4 pronto. Funcionam juntas com o kit de vídeo de lançamento (`video-lancamento`) (grava a tela real de um sistema e monta o MP4).

## Sumário

1. [O que tem aqui](#o-que-tem-aqui)
2. [Como as peças se encaixam](#como-as-peças-se-encaixam)
3. [Instalação](#instalação)
4. [Uso, por tarefa](#uso-por-tarefa)
5. [Requisitos](#requisitos)
6. [Custos e cuidados](#custos-e-cuidados)
7. [Estrutura do repositório](#estrutura-do-repositório)
8. [Origem e licenças](#origem-e-licenças)
9. [Divulgação](#divulgação)

## O que tem aqui

| Skill | Faz | Origem |
|---|---|---|
| `hyperframes` | Cria, edita e renderiza vídeo feito em HTML (lançamento, explicativo, dados, vertical, 3D, personagem). Ler primeiro. | HeyGen, Apache-2.0 |
| `hyperframes-cli` | Linha do tempo (mover, cortar, dividir), conferência, pré-visualização e render. | HeyGen, Apache-2.0 |
| `media-use` | Música, efeitos, voz, imagens, logos, recortes, correção de cor e mixagem de áudio. | HeyGen, Apache-2.0 |
| `objeto-3d` | Objeto 3D em laço de 3 s, com fundo transparente, nas cores da marca (Blender). | Autoral |
| `assistir-video` | Folhas de quadros, transcrição e legenda de um vídeo, para conferir ou estudar. | Autoral |
| `video-por-nicho` | Roteiro pronto por nicho (pet, restaurante, clínica, advocacia, imobiliária, loja, SaaS, curso, salão, academia). | Autoral |
| `estilos-de-motion` | Dez estilos de animação (lúdico, corporativo, neon, editorial, cinético, glass, brutalista, VHS, luxo, pop) com easing, tempos e transições. | Autoral |
| `estilos-de-edicao` | Nove estilos de edição (demo calma, reels, anúncio, explicativo, depoimento, tutorial, antes e depois, tour, lançamento) com ritmo e ajustes. | Autoral |
| `voz-narracao` | Gera a narração pt-BR (MP3 + legenda com tempo) com o mesmo código dos vídeos; pronúncia de marcas. | Autoral |

## Como as peças se encaixam

```
 nicho (video-por-nicho) → roteiro
      │
      ▼
 hyperframes ──── media-use   (voz, música, imagens, cor)
      │      ├─── estilos-de-motion  (visual da animação)
      │      ├─── estilos-de-edicao  (ritmo e cortes)
      │      └─── objeto-3d   (objetos 3D transparentes)
      ▼
 hyperframes-cli  (check → snapshot → preview → render)
      │
      ▼
   MP4 ──► assistir-video  (a fala bate com a legenda? algum dado real legível?)
```

1. **Criar:** `hyperframes` define as regras da composição e qual tipo de vídeo seguir.
2. **Abastecer:** `media-use` e `objeto-3d` colocam os arquivos em `assets/` ou `objetos3d/`.
3. **Editar e conferir:** `hyperframes-cli` valida (`check`), mostra quadros (`snapshot`), abre a prévia e renderiza.
4. **Revisar o resultado:** `assistir-video` "assiste" o MP4 final antes de entregar.

## Instalação

```bash
git clone https://github.com/vicobarreto/jobmotion.git
cd jobmotion
./scripts/instalar.sh            # copia para ~/.claude/skills (não sobrescreve as que já existem)
./scripts/instalar.sh /outra/pasta
```

Abra uma sessão nova do Claude Code e confira com `/hyperframes` ou `/assistir-video`.

## Uso, por tarefa

| Quero… | Digite |
|---|---|
| Criar um vídeo de lançamento ou explicativo | `/hyperframes` |
| Trocar música, voz ou imagem; corrigir imagem escura | `/media-use` |
| Mover, cortar ou renderizar | `/hyperframes-cli` |
| Um presente, voucher ou moeda 3D com a cor da marca | `/objeto-3d presente --como presente-marca --cores caixa=#0b3d2e,fita=#f2c14e` |
| Conferir um MP4 ou estudar um vídeo de terceiros | `/assistir-video caminho-ou-url` |
| Roteiro para um nicho | `/video-por-nicho clinica` |
| Escolher o visual da animação | `/estilos-de-motion` |
| Dar ritmo e cortar | `/estilos-de-edicao` |
| Gerar a voz do vídeo | `/voz-narracao` ou `node voz/falar.mjs "texto" --saida pasta` |

Comandos mais usados do HyperFrames:

```bash
npx hyperframes init <pasta>                        # projeto novo
npx hyperframes check --json                        # validar
npx hyperframes snapshot --at 3,8                   # ver quadros sem renderizar
npx hyperframes preview --background                # prévia
npx hyperframes render --quality looks -o saida.mp4 # draft, looks ou delivery
```

Mais exemplos em [docs/guia-rapido.md](docs/guia-rapido.md). A voz está explicada em [docs/voz.md](docs/voz.md).

## Requisitos

- Node 22+ e FFmpeg no PATH (HyperFrames).
- Python 3.10+ com `yt-dlp` e `faster-whisper` (`assistir-video`) e `edge-tts` (`voz-narracao`).
- Blender 4+ (`objeto-3d`).
- `objeto-3d` usa o gerador do kit de vídeo (`src/objeto3d.mjs`); indique a pasta do kit onde a skill pede `<pasta-do-kit>`.

## Custos e cuidados

- A parte da HeyGen em `media-use` é paga; o caminho grátis existe para quase tudo. A skill pede confirmação antes de gastar.
- Um objeto 3D leva cerca de 5 min de render. Rode um por vez em máquinas com pouca memória.
- Nunca grave telas com dado real de pessoas sem máscara; nunca ponha senha no roteiro.

## Estrutura do repositório

```
skills/            as nove skills, prontas para copiar
scripts/           instalar.sh e validar.sh
voz/               código que gera a narração (narrar.mjs, falar.mjs)
docs/              guia rápido, como funciona a voz e plano de divulgação
.github/workflows/ validação automática das skills
NOTICE             créditos e licenças de terceiros
```

`./scripts/validar.sh` confere o frontmatter de cada skill; o mesmo teste roda a cada push no GitHub.

## Origem e licenças

`hyperframes`, `hyperframes-cli` e `media-use` são cópias do pacote `hyperframes` 0.8.222 (Apache-2.0). Veja o [NOTICE](NOTICE). Ao atualizar o pacote, copie de novo `dist/skills/` e atualize este número.
`objeto-3d`, `assistir-video`, `video-por-nicho`, `estilos-de-motion` e `estilos-de-edicao` são autorais. **Licença das skills autorais: a definir pelo autor** (sugestão: MIT).

## Divulgação

O plano de lançamento, com textos prontos e checklist, está em [docs/divulgacao.md](docs/divulgacao.md).

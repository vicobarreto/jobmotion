# Plano de divulgação

Fluxo para lançar o repositório em ordem, do preparo ao acompanhamento. Nada aqui é publicado sozinho: cada passo é manual.

## 1. Antes de publicar (checklist)

- [ ] Escolher a licença das skills autorais e criar o `LICENSE`.
- [ ] Rodar `./scripts/validar.sh` e `grep -rIn -E 'senha|token|E:\\job' skills` (nenhum segredo ou caminho pessoal).
- [ ] Gravar um vídeo curto (30 a 60 s) feito com as próprias skills: ele é a melhor peça de divulgação.
- [ ] Trocar a URL do kit no README e preencher a URL do repositório no passo de instalação.
- [ ] Criar o repositório no GitHub com descrição e tópicos: `claude-code`, `claude-skills`, `video`, `hyperframes`, `blender`, `motion-graphics`.
- [ ] Criar a release `v0.1.0` com notas curtas.

## 2. Mensagem central

> Um vídeo de demonstração do seu sistema, gravado da tela real, com voz em português e objetos 3D na cor da marca, sem editor de vídeo. Cinco skills do Claude Code que fazem o caminho todo.

## 3. Calendário sugerido

| Dia | Canal | Peça |
|---|---|---|
| 0 | GitHub | Release v0.1.0 + README |
| 0 | LinkedIn | Post com o vídeo e o link (texto abaixo) |
| 1 | Instagram / TikTok | Reel de 30 s: antes (tela) e depois (vídeo pronto) |
| 2 | X | Fio de 4 posts com um GIF por skill |
| 3 | Comunidades de Claude Code e de vídeo | Post de mostra, sem spam, com o link |
| 7 | Todos | Resultado de um cliente real ou um caso novo |

## 4. Textos prontos

**LinkedIn**

Publiquei um conjunto de 5 skills do Claude Code que gera vídeo de demonstração de sistema a partir da tela real: roteiro, voz em português, objetos 3D na cor da marca e conferência do MP4 no fim. O vídeo abaixo foi feito só com elas. Link nos comentários.

**X (fio)**

1/ Publiquei 5 skills do Claude Code para fazer vídeo de produto sem editor.
2/ `hyperframes` e `hyperframes-cli`: o vídeo é HTML, renderizado quadro a quadro.
3/ `objeto-3d`: um presente ou voucher 3D na cor da marca, com fundo transparente.
4/ `assistir-video`: o Claude confere o MP4 pronto. Código: <link>

**Descrição do repositório**

Skills do Claude Code para criar, editar e conferir vídeos: HyperFrames, mídia, objetos 3D e revisão do MP4.

## 5. Depois de publicar

- Responder issues em até 48 h; marcar as que viram novas skills.
- Registrar o que as pessoas perguntam e levar para o README.
- Mensalmente: atualizar as três skills da HeyGen conforme o [NOTICE](../NOTICE) e subir uma release.

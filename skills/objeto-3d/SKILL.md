---
name: objeto-3d
description: Gera objetos 3D animados com fundo transparente (WebM com alfa, laço de 3 s) nas cores da marca, para entrar nos vídeos do kit de vídeo (HyperFrames) — queijo, voucher com valor, presente, pino de mapa, moeda com símbolo — renderizando no Blender headless; e cria modelos novos por código no gerador, ou peças sob medida no Blender aberto (MCP). Use quando o usuário disser "faz um objeto 3D", "põe um 3D no vídeo", "gera o voucher/presente/moeda em 3D com a cor da marca", "quero um ícone 3D girando", "objeto 3D para o vídeo do cliente".
argument-hint: "<modelo> [--como nome] [--cores peca=#hex,…] [--texto \"R$5\"] [--animacao giro|flutua]"
user-invocable: true
---

# Objeto 3D para vídeo

Kit: `<pasta-do-kit>` (o repositório `video-lancamento`). Os objetos ficam em `objetos3d/<nome>.webm` e entram no roteiro do vídeo com `"objeto3d": "<nome>"` numa cena, ou `"objetos3d": ["<nome>", …]` na abertura e no fechamento (um de cada lado do texto). A montagem repete o clipe sem recodificar, então a transparência se mantém.

## Caminho 1 — modelo que já existe (o normal)

```bash
cd <pasta-do-kit>
node src/objeto3d.mjs --listar                       # modelos, peças coloríveis e o que já está renderizado
node src/objeto3d.mjs presente --como presente-eupet --cores caixa=#0b3d2e,fita=#f2c14e
node src/objeto3d.mjs voucher --como voucher-10 --texto "R$10" --cores cartao=#1b3a8f,faixa=#f2b705
node src/objeto3d.mjs moeda --animacao flutua --texto "R"
```

- **Cores:** sempre as da marca (`DESIGN.md` do cliente, skill `/design-md`, ou `marca.cor`/`corDestaque` do roteiro). Nome do arquivo com a marca (`--como presente-eupet`), para não sobrescrever o de outro cliente.
- **Tempo:** ~3,5 s por quadro em 512 px nesta máquina: 90 quadros ≈ 5 min, mais ~1 min de abertura do Blender. Rode em segundo plano, um por vez (memória curta). Para testar a cor antes, use `--quadros 8 --tamanho 256` e leia um PNG de `objetos3d/<nome>/`.
- **Saída:** `[pronto] objetos3d/<nome>.webm · KB · transparência: sim`. Se disser "NÃO", não use o arquivo: confira o `objetos3d/<nome>.log`.
- Os PNGs em `objetos3d/<nome>/` ficam fora do git (só o `.webm` é versionado).

## Caminho 2 — modelo novo, por código

Quando o vídeo pede um objeto que não existe (cadeado, escudo, troféu, pata, celular…):
1. Em `src/blender/gerar.py`, escreva `obj_<nome>()` no padrão dos existentes: primitivas e `bmesh`, materiais com `material(nome, cor('peça', '#padrão'), metal=…, rugosidade=…, verniz=…)`, texto com `texto3d()`. Nada de modelo baixado de terceiros (licença) — desenhe por código.
2. Acrescente o modelo e as peças no mapa `MODELOS` de `src/objeto3d.mjs`.
3. Teste com `--quadros 8 --tamanho 256`, leia 2 ou 3 PNGs, ajuste proporção/ângulo/luz, e só então renderize os 90 quadros.
4. Regras do visual (aprendidas): transformação de cor **Standard** (AgX desbota as cores de marca), HDRI de estúdio do Blender, 3 luzes de área, objeto inclinado ~60° no giro para mostrar volume, laço sem salto (rotação linear de 0 a 360°).

## Caminho 3 — peça sob medida no Blender aberto (MCP)

Se o Blender estiver aberto com o addon do MCP (`mcp__blender__get_addon_status` responde), dá para modelar interativamente (`execute_blender_code`, `look`), importar de bibliotecas com licença aberta (`search_assets`/`import_asset`: Poly Haven é CC0) ou gerar por IA (`generate_3d`, pode custar crédito — pergunte antes). Depois, renderize com as **mesmas regras do gerador** (Eevee, fundo transparente, PNG RGBA, 512 px, 90 quadros, laço) para uma pasta `objetos3d/<nome>/q_####.png` e codifique com:

```bash
ffmpeg -framerate 30 -i objetos3d/<nome>/q_%04d.png -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 26 -auto-alt-ref 0 objetos3d/<nome>.webm
```

Tarefa longa no Blender: confira o disco antes de repetir (memória `blender-mcp-tarefa-longa`).

## Conferir no vídeo

Depois de pôr o objeto no roteiro, `npx hyperframes snapshot --at <segundos> --no-end -o <pasta>` na pasta do projeto montado mostra o quadro sem renderizar o vídeo inteiro. Objeto não pode cobrir título nem a tela do sistema.

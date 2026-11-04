# Fichas dos estilos de motion

Cada ficha traz os valores para começar. Duração de entrada de movimento: 0,3–0,6 s; saída: 40–50% da entrada. O texto que precisa ser lido segura cerca de 0,5 s + 0,3 s por palavra.

## Lúdico (pronto no kit)
- **Fonte:** arredondada (Fredoka, OFL). **Paleta:** cores saturadas da marca sobre fundo claro; destaque quente.
- **Easing:** `back.out(1.6)` nas entradas; mola de amortecimento 0,4–0,6 (posição e tamanho podem quicar, opacidade e cor nunca).
- **Título:** palavra a palavra, 80–120 ms entre elas, com escala 0,6 → 1.
- **Extras:** mascote que entra, pisca e pula; confete em cena de festa; legenda em balão.
- **Transição:** zoom com clarão curto. **Evite:** mascote cobrindo a tela do sistema.

## Corporativo limpo
- **Fonte:** sans-serif neutra, peso 500 a 700. **Paleta:** 1 cor da marca, branco, cinza-azulado; destaque em 1 palavra.
- **Easing:** `power3.out` nas entradas, `power2.inOut` em câmera.
- **Título:** `blur(6px)` → 0 e opacidade 0 → 1 em 0,13 s, palavra a palavra com 0,067 s de intervalo, sem deslocamento.
- **Transição:** troca com desfoque no mesmo palco (saída: opacidade → 0 com 8 px de blur em 0,13–0,2 s; entrada: blur → 0 em 0,13 s).
- **Ritmo:** planos de 2 a 3 s, demo de 7 a 10 s. **Evite:** sombras pesadas, brilho.

## Tech neon
- **Fonte:** geométrica ou mono. **Paleta:** fundo quase preto, ciano, magenta ou verde-limão; brilho com `text-shadow` contido.
- **Easing:** `expo.out` rápido (0,3 s) e `power3.in` para sair.
- **Título:** letra a letra, um quadro entre elas, opacidade 0,3 → 1 com leve desfoque.
- **Transição:** *whip* horizontal de 0,13–0,3 s; o elemento que chega entra borrado e foca em ~0,13 s.
- **Extras:** grade ou partículas de fundo girando devagar (3–5° por segundo). **Evite:** brilho em todo texto; baixo contraste.

## Minimalista editorial
- **Fonte:** serifada elegante para título + sans para apoio. **Paleta:** off-white, preto, 1 acento.
- **Easing:** `power2.out` longo (0,8–1,2 s).
- **Título:** linha inteira entrando com blur 8 → 0 em 0,13–0,2 s; depois, imóvel.
- **Transição:** corte seco, com *dip* (o quadro que sai escurece ~40% por 3 quadros antes do corte).
- **Ritmo:** poucos elementos, muito espaço; planos longos com *Ken Burns* de 3% a 5%. **Evite:** mais de 2 fontes.

## Tipografia cinética
- **Fonte:** grotesca pesada. **Paleta:** 2 cores de alto contraste.
- **Compasso:** quadros por batida = fps × 60 / BPM; calcule cada batida pelo índice e arredonde, nunca some batidas arredondadas.
- **Título:** a palavra que carrega o sentido ocupa 60–90% da largura; as demais ficam a 2,5–4% da altura.
- **Easing:** `expo.out` na chegada, corte na batida; mude o layout no compasso, não na batida.
- **Evite:** mais de 3 palavras por tela; texto sem relação com a fala.

## Glass (demo premium)
- **Fonte:** sans moderna. **Paleta:** fundo em degradê suave, cartões translúcidos com borda de 1 px.
- **Easing:** mola de amortecimento 0,8 (premium, sem quicar).
- **Título:** surge de trás do vidro com desfoque 12 → 0.
- **Transição:** *morph*, em que um cartão se alarga para virar o seguinte (ex.: 110 → 880 px em 0,2 s `power3.out`, com blur horizontal 12 → 0). Zoom automático nos cliques da gravação.
- **Evite:** vidro demais cobrindo a tela do sistema; blur que reduz a leitura de dados.

## Brutalista
- **Fonte:** condensada pesada ou mono. **Paleta:** preto, branco, 1 cor de alerta.
- **Easing:** linear ou `steps(4)`; sem mola.
- **Título:** bloco que bate na tela em 2 quadros, com tremor de 4 px.
- **Transição:** corte seco, cartela de cor em 3 quadros.
- **Evite:** texto pequeno; fundo com textura que atrapalha a leitura.

## Retrô VHS
- **Fonte:** pixelada ou mono. **Paleta:** magenta e ciano deslocados, grão.
- **Easing:** `power1.out` com tremor horizontal de 2–6 px.
- **Título:** *glitch* de 3 quadros com separação de canais.
- **Transição:** faixa de *tracking* de fita e ruído de 0,2 s.
- **Grão, vinheta e aberração:** aplique com `npx hyperframes media-treatment` (`/media-use`), nunca com filtros CSS.
- **Evite:** ruído constante que cansa; legenda sobre glitch.

## Luxo escuro
- **Fonte:** serifada fina com espaçamento entre letras. **Paleta:** preto, dourado ou champanhe, 1 acento.
- **Easing:** `power4.out` lento (1 a 1,5 s); saída com `power3.in`.
- **Título:** letra a letra, 0,1 s entre elas, opacidade 0,3 → 1 com desfoque leve.
- **Transição:** fade por preto; luz que varre o objeto.
- **Ritmo:** planos longos de 3 a 5 s. **Evite:** cores vivas, mola, elementos que se mexem sem motivo.

## Pop
- **Fonte:** arredondada pesada. **Paleta:** 3 cores vivas e contornos grossos.
- **Easing:** `elastic.out(1, 0.5)` em formas; `back.out(1.4)` em texto.
- **Título:** pula com escala 0 → 1,15 → 1; palavra de destaque em outra cor.
- **Transição:** formas coloridas que "colam" a cena seguinte.
- **Evite:** mola em número e preço (atrapalha a leitura).

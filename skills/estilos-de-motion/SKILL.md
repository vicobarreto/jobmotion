---
name: estilos-de-motion
description: Catálogo de estilos de motion para vídeos HyperFrames e do kit de vídeo — lúdico, corporativo limpo, tech neon, minimalista editorial, tipografia cinética, glass (demo premium), brutalista, retrô VHS, luxo escuro e pop — cada um com curvas de easing, tempos, entradas de título, transições, tipografia e paleta, mais o que evitar. Use quando o usuário disser "que estilo de animação uso", "quero um visual mais [X]", "deixa o vídeo mais premium/divertido/tech", "muda o estilo do motion", ou ao montar a composição de um vídeo novo.
argument-hint: "<estilo> | listar"
user-invocable: true
---

# Estilos de motion

Um estilo é um conjunto de decisões que se repetem no filme inteiro: curva de easing, duração, jeito de entrar o título, transição, fonte e paleta. Escolha **um** estilo por vídeo e use os valores abaixo como ponto de partida; a regra do pedido do cliente vale mais que a tabela.

## Antes de aplicar

1. Leia `/hyperframes` (contrato da composição) e `hyperframes/references/motion.md` (as medidas de base: 0,3–0,6 s por movimento, saída 40–50% mais curta que a entrada, sobreposição de 30–50%).
2. Só as fontes embutidas resolvem pelo nome; qualquer outra precisa de `@font-face` para um arquivo em `assets/fonts/` (ver `hyperframes/references/format.md`). Use fontes com licença livre (OFL).
3. Cor e logo vêm da marca do cliente (`/design-md`). O estilo manda no movimento, a marca manda na cor.
4. Depois de montar: `npx hyperframes check --json` e `snapshot` de um quadro por cena.

## Como o kit usa os estilos

- **`lúdico`** está pronto no kit (`"estilo": "ludico"` no roteiro; código em `src/estilos/ludico.mjs`).
- Os outros nove são **receitas** para projetos HyperFrames escritos à mão ou para virar novos arquivos em `src/estilos/` com a mesma interface do `ludico.mjs`.

Os valores de easing são do GSAP: `expo.out`, `power4.out`, `power2.inOut`, `power3.in`, `back.out(1.4)`, `elastic.out(1, 0.5)`.

## Os estilos

Ver `references/estilos.md` para a ficha completa de cada um. Resumo:

| Estilo | Sensação | Easing de entrada | Título entra | Transição típica | Bom para |
|---|---|---|---|---|---|
| lúdico | simpático, colorido | `back.out(1.6)`, mola 0,5 | pula e estala por palavra | zoom com clarão | pet, infantil, apps leves |
| corporativo limpo | confiança, calma | `power3.out` | borrão 6 px → 0, palavra a palavra | blur swap no mesmo palco | saúde, jurídico, B2B |
| tech neon | futuro, energia | `expo.out` | letra a letra com brilho | whip horizontal | SaaS, games, cripto |
| minimalista editorial | elegância, espaço | `power2.out`, lento | linha inteira com blur | corte seco + dip | imobiliário, moda, arquitetura |
| tipografia cinética | ritmo, fala | `expo.out` | palavra grande no compasso | corte na batida | infoproduto, trailer, música |
| glass (demo premium) | produto polido | mola 0,8 | surge do vidro com desfoque | morph de cartão | demonstração de sistema |
| brutalista | cru, direto | linear e `steps` | bloco que bate | corte seco | academia, streetwear |
| retrô VHS | nostalgia, ruído | `power1.out` com tremor | glitch de 3 quadros | tracking de fita | barbearia, eventos, música |
| luxo escuro | sofisticação | `power4.out`, muito lento | letra a letra com opacidade | fade por preto | joalheria, advocacia, gastronomia fina |
| pop | divertido, impacto | `elastic.out(1, 0.5)` | pula com escala | colar de formas | varejo, promoção, delivery |

## Pedido do cliente → ajuste

| Cliente diz | Mude |
|---|---|
| "está muito rápido" | todos os zooms e pans a 0,7× da velocidade, mais nada |
| "parece genérico" | troque o easing por papel (entrada longa, saída curta) e varie a entrada dos títulos |
| "mais premium" | passe para `corporativo limpo` ou `luxo escuro`: menos movimento, mais pausa |
| "mais divertido" | passe para `lúdico` ou `pop`: mola de amortecimento 0,4–0,6 |
| "parece slide" | entre na cena seguinte por um objeto da tela e corte um movimento no meio |

## Evite em qualquer estilo

Pulsar ou flutuar títulos como se fosse movimento; título que continua crescendo depois de pousar; a mesma entrada em todas as cenas; salto (bounce) em interface; anéis de clique; mais de 3 a 5 tipos de transição num filme.

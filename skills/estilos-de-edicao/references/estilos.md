# Fichas dos estilos de edição

Estrutura de cada ficha: quando usar, estrutura em tempo, receita no HyperFrames, erros comuns.

## Demo calma
- **Quando:** mostrar um sistema funcionando (kit de vídeo de lançamento).
- **Estrutura (60 s):** abertura com marca 4 s · 4 a 6 cenas de 7 a 10 s · fechamento 4 s.
- **Receita:** um enquadramento por cena; zoom automático nos cliques; rótulo da cena; fala de 1 ou 2 frases por cena.
- **Erros:** cortar no meio da ação; legenda cobrindo o botão clicado.

## Reels dinâmico
- **Quando:** Instagram, TikTok, Shorts.
- **Estrutura (30 s):** gancho 0–3 s · 3 a 5 blocos de 4 a 6 s · chamada 3 s.
- **Receita:** formato 9:16; montagem cortando a cada 0,13–0,8 s nos picos; cortes na batida (`npx hyperframes beats`); legendas de 2 a 3 palavras; whoosh nas trocas.
- **Erros:** cortar toda hora sem pausa; legenda dentro da área que o app cobre.

## Anúncio direto
- **Quando:** anúncio pago, com uma só oferta.
- **Estrutura (15 a 30 s):** problema 0–3 s · solução 3–10 s · prova 10–18 s · oferta e chamada 18–25 s.
- **Receita:** 1 mensagem; texto grande; o botão ou endereço aparece por 3 s ou mais.
- **Erros:** mais de uma oferta; chamada que aparece só no último quadro.

## Explicativo
- **Quando:** ideia ou processo difícil de entender.
- **Estrutura (60 a 90 s):** pergunta · 3 ideias de 12 a 20 s · resumo · chamada.
- **Receita:** uma ideia por plano; ilustração ou gráfico que muda com a fala; música baixa; veja `hyperframes/references/types/explainer.md`.
- **Erros:** falar de duas ideias na mesma tela.

## Depoimento com legendas
- **Quando:** prova social em vídeo vertical.
- **Estrutura (30 a 45 s):** frase mais forte primeiro · história · resultado.
- **Receita:** transcreva (`npx hyperframes transcribe --model small --language pt`), corte pausas longas e respirações, destaque a palavra-chave, legenda com `captions.md`.
- **Erros:** texto sobre o rosto; depoimento sem autorização por escrito.

## Tutorial passo a passo
- **Quando:** ensinar a usar algo.
- **Estrutura:** problema 5 s · passo 1…n de 4 a 7 s com número na tela · resultado.
- **Receita:** número do passo + rótulo curto; clique destacado; mesmo lugar para o número em todos os passos.
- **Erros:** passo sem rótulo; ritmo que muda a cada passo.

## Antes e depois
- **Quando:** transformação visível (reforma, estética, design).
- **Estrutura (15 a 20 s):** antes 3 s · transição 1 s · depois 4 s · detalhe 3 s · chamada.
- **Receita:** mesmo enquadramento nos dois lados; transição por cortina (`clip-path` num contêiner interno).
- **Erros:** enquadramentos diferentes; resultado sem autorização (e conferir a regra do setor).

## Tour / documentário
- **Quando:** imóvel, espaço, produção artesanal.
- **Estrutura (60 a 90 s):** chegada · percurso por 4 a 6 espaços · detalhe · convite.
- **Receita:** movimento lento dentro do plano (*push* ou *pan* de 3 a 5%); fade ou corte em movimento; trilha suave.
- **Erros:** movimento de câmera diferente em cada plano; sem fala nem texto de apoio.

## Lançamento cinematográfico
- **Quando:** produto novo, filme de marca.
- **Estrutura (45 a 75 s):** mistério · revelação · demonstração · chamada.
- **Receita:** planos de 1,8 a 3 s com movimento dentro; cortes no quadro mais rápido; trilha e efeitos nas ações; veja `hyperframes/references/types/launch.md` e `story.md`.
- **Erros:** cortar sem causa visível; música sem relação com o ritmo das imagens.

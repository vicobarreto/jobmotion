---
name: estilos-de-edicao
description: Catálogo de estilos de edição de vídeo — demo calma, reels dinâmico, anúncio direto, explicativo, depoimento com legendas, tutorial passo a passo, antes e depois, tour/documentário e lançamento cinematográfico — com ritmo de cortes, duração de planos, uso de punch-in, legendas, áudio e formato, e como ajustar quando o cliente diz "está lento", "está corrido" ou "parece amador". Use quando o usuário pedir para editar, cortar, dar ritmo ou "fazer a edição estilo [X]" de um vídeo, ou ao decidir a estrutura de tempo de um vídeo novo.
argument-hint: "<estilo> | listar"
user-invocable: true
---

# Estilos de edição

Edição é ritmo: quanto dura cada plano, onde cai o corte, quando entra a legenda e o som. Escolha **um** estilo por vídeo, ajuste o tempo ao conteúdo e confira no `snapshot` antes de renderizar.

## Como aplicar

1. Escolha o estilo na tabela e abra `references/estilos.md` para a ficha dele.
2. Meça o material: `npx hyperframes timeline --json` mostra o que toca e quando.
3. Edite com `/hyperframes-cli`: `timeline move|trim|split|set|duplicate|delete <ref> --plan --json` para prévia; sem `--plan` para aplicar. Várias edições juntas: `timeline apply plano.json`. Desfaça com `timeline undo recibo.json`.
4. Nenhum comando de `timeline` muda a duração total: se o clipe passar do fim, aumente antes o `data-duration` da raiz.
5. Legendas: `/hyperframes` (`references/captions.md`). Voz e música: `/media-use`.
6. Confira: `check --json`, `snapshot --at …` no corte e logo depois dele, e `/assistir-video` no MP4 final.

## Os estilos

| Estilo | Plano médio | Corte | Legenda | Áudio | Formato |
|---|---|---|---|---|---|
| demo calma | 7–10 s num enquadramento | raro; zoom nos cliques | frases curtas, 4–6 palavras por grupo | voz + efeitos de clique | 16:9 |
| reels dinâmico | 0,13–0,8 s em montagem; 1,5–3 s no resto | na batida | 2–3 palavras, palavra a palavra | música + whoosh | 9:16 |
| anúncio direto | 1,5–3 s | no fim de cada frase | grandes, 2–3 palavras | voz firme + música baixa | 9:16 ou 1:1 |
| explicativo | 3–5 s por ideia | ao trocar de ideia | 4–6 palavras | voz calma, música a −20 dB da voz | 16:9 |
| depoimento com legendas | plano da pessoa de 4–8 s | em pausa da fala | 3–5 palavras, destaque na palavra-chave | voz limpa, sem música alta | 9:16 |
| tutorial passo a passo | 4–7 s por passo | a cada passo, com número na tela | rótulo curto do passo | voz + clique | 16:9 |
| antes e depois | 2–3 s cada lado | corte seco ou cortina | rótulos "antes" e "depois" | som de transição | 9:16 ou 1:1 |
| tour / documentário | 3–6 s com movimento lento | fade ou corte em movimento | mínima | ambiente + música suave | 16:9 |
| lançamento cinematográfico | 1,8–3 s com movimento dentro | em movimento, na batida | só títulos | trilha + efeitos nas ações | 16:9 |

## Regras de ritmo (valem para todos)

- **Contraste de velocidade:** alterne trecho rápido e trecho que respira; o payoff entra em velocidade normal depois de 0,3–0,75 s de pausa.
- **Gancho em 3 s:** o primeiro plano mostra o resultado, o problema ou a pergunta, não o logo.
- **Corte no quadro mais rápido do movimento**, com a mesma direção e velocidade dos dois lados.
- **Último texto fica ≥ 2 s** na tela; texto lido segura 0,5 s + 0,3 s por palavra.
- **Punch-in:** anime `scale` e `x`/`y` num contêiner dentro do clipe, nunca no elemento de mídia temporizado.
- **Velocidade:** constante com `data-playback-rate` (0,1 a 10); rampa com a faixa `rate` em `data-automation`.
- **Congelar:** exporte o quadro como imagem e coloque como clipe próprio.
- **Corte em J e L:** o áudio é um `<audio>` separado, com `id`, começando antes ou depois da imagem.
- **Texto e legenda** dentro da área segura de título (80%); em vertical, legenda a ~600–700 px da base, nunca sobre o rosto.

## Pedido → ajuste

| Cliente diz | Mude |
|---|---|
| "está lento" | encurte cada plano em 15–20% e corte a pausa antes da fala; mantenha a pausa do payoff |
| "está corrido" | alongue os planos de leitura, deixe 0,3 s a mais depois de cada texto, remova um efeito em cada três |
| "parece amador" | alinhe os cortes à batida ou ao fim da frase, varie as entradas de título, tire efeito repetido |
| "quero mais energia" | passe para `reels dinâmico`, acrescente punch-ins e sons nas ações |
| "tem que caber em 30 s" | corte uma cena inteira antes de acelerar todas |
| "o som está ruim" | `npx hyperframes normalize-audio`; música ~20 dB abaixo da voz (`/media-use`, `mixing.md`) |

# Voz de personagem "jovem de rua" para o Brasil

Ficha para criar uma voz **original** em português do Brasil com a energia de um protagonista jovem, relaxado e confiante, no estilo de um jogo de rua. Serve para mascote, vinheta e narração de vídeo.

## O que não fazer

Não clonar a voz do CJ de GTA San Andreas. Ela foi dublada pelo rapper e dublador Chris Bellard (Young Maylay), e o áudio do jogo é protegido por direito autoral. Imitar a voz de uma pessoa real para vídeo de cliente cria risco jurídico e de reputação. Esta ficha descreve **um estilo**, não uma pessoa: o resultado é uma voz nova.

Fontes consultadas: a entrevista com o dublador e as fichas do personagem confirmam que a direção pediu uma interpretação natural, sem exagero, e que a voz original era áspera. Nenhuma fonte descreve timbre, altura ou ritmo com detalhe nem mede a velocidade de fala. Os números abaixo são **metas nossas**, medidas em amostras geradas aqui, e não medições da voz do jogo.

## Ficha de voz

| Item | Alvo |
|---|---|
| Idade percebida | 25 a 35 anos |
| Timbre | grave a médio, quente, com um fundo levemente rouco |
| Tom (altura) | na parte baixa da faixa masculina |
| Atitude | calmo, seguro, meio irônico; fala como quem não precisa se esforçar |
| Dinâmica | pouca variação de volume; ênfase por pausa, não por grito |
| Sotaque | brasileiro urbano (paulistano ou carioca), a escolher e manter igual no vídeo todo |
| Respiração | pausas curtas entre frases, 0,3 a 0,5 s |

## Tempo de fala

Medido nas amostras geradas com `pt-BR-AntonioNeural` (texto de 28 palavras, incluindo o silêncio final):

| Configuração | Duração | Palavras por minuto | Sensação |
|---|---|---|---|
| velocidade `+0%`, tom `+0Hz` | 13,1 s | 128 | narração neutra |
| velocidade `-5%`, tom `-20Hz` | 13,8 s | 122 | pesado, devagar |
| velocidade `+10%`, tom `-10Hz` | 11,9 s | 141 | relaxado, conversa |
| velocidade `+15%`, tom `-20Hz` | 11,4 s | 147 | confiante, com pressa leve |

Meta para o personagem: **140 a 150 palavras por minuto** na fala corrente (por volta de 2,4 palavras por segundo), com pausas de 0,3 a 0,5 s no fim das frases. Acima de 160 vira locutor de anúncio; abaixo de 125 perde a atitude.

## Como gerar

### 1. Grátis e imediato (Edge TTS)

```bash
node voz/falar.mjs "Fala, mano! Voltei pra quebrada e o bagulho tá diferente." \
  --voz pt-BR-AntonioNeural --velocidade +12% --tom -15Hz --saida saida-voz
```

No roteiro do kit:

```jsonc
"voz": { "motor": "edge", "voz": "pt-BR-AntonioNeural", "velocidade": "+12%", "tom": "-15Hz" }
```

O Edge TTS não faz voz rouca, mas o tom grave e a velocidade já aproximam a atitude. Ouça e ajuste o tom entre `-10Hz` e `-25Hz`.

### 2. Voz própria, local (VoiceStudio)

Use o *voice design* por descrição, que cria uma voz nova sem copiar ninguém. Descrição sugerida, em inglês porque a maioria dos motores entende melhor:

> Brazilian Portuguese, adult male, 28 to 32 years old, low warm voice with a slight rasp, relaxed and confident, ironic undertone, urban São Paulo accent, steady pace around 145 words per minute, short pauses between sentences.

Para clonar uma voz de verdade, grave de 10 a 30 s de uma pessoa **que autorizou por escrito**, sem música de fundo.

### 3. Voz paga (ElevenLabs ou OpenAI)

`motor: "elevenlabs"` com o id de uma voz brasileira de que você tenha licença, ou `openai` com a instrução abaixo em `voz.instrucoes`:

> Fale em português do Brasil, voz masculina grave e relaxada, tom confiante e levemente irônico, ritmo de conversa, pausas curtas, sem gritar.

## Adaptando o texto para o Brasil

O personagem original é da Califórnia dos anos 90. No Brasil, troque o contexto, não só as palavras.

| Evite | Prefira |
|---|---|
| tradução literal de gíria do inglês | gíria brasileira de uso real e atual |
| referências a gangues, armas e crime | volta ao bairro, trabalho, amizade, dinheiro, corrida |
| o mesmo sotaque misturado | uma região só: "mano", "tá ligado" (SP) ou "caraca", "mermão" (RJ) |
| gíria envelhecida | confirme com alguém da faixa de idade do público |

Exemplos de falas curtas, de 2 a 3 s cada:

- "Fala, mano. Bora pro corre."
- "Tá ligado como é. Quem faz bem-feito, volta sempre."
- "Sem enrolação: é isso, é aqui, é agora."
- "Voltei. E dessa vez trouxe o sistema."

## Regras de uso

- Não use o nome, as frases famosas nem a imagem de personagem de jogo ou filme em vídeo de cliente.
- Dê ao personagem um nome e uma história próprios.
- Registre por escrito a origem da voz: motor, modelo, descrição e, se houver, a autorização de quem gravou a referência.

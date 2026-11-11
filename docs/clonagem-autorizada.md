# Clonagem de voz com autorização

Como criar uma voz parecida com a de uma pessoa, com o consentimento dela, para testes com o OmniVoice (VoiceStudio). Vale também como checklist para qualquer outro clonador.

## Antes de tudo

- **Só com autorização por escrito** da pessoa que fala. Nada de voz de ator de jogo, streamer, famoso ou de quem não sabe. Isso inclui o CJ de GTA San Andreas.
- **Bases abertas de voz não servem de atalho.** Os projetos de dataset (como o SOTAQUE) autorizam treinar modelos, mas o próprio termo do SOTAQUE diz que não se destina a imitar uma pessoa identificada. Não use a gravação de um contribuinte como referência de clone.
- **O OmniVoice é CC-BY-NC** (mais licenças do Higgs Audio 2 e do Meta Llama 3): serve para teste pessoal, não para vídeo comercial. A autorização da pessoa não muda a licença do modelo.
- **Selo de IA** em todo vídeo publicado com voz sintética.

## 1. Termo de autorização (modelo)

> Este é um modelo de apoio, não é aconselhamento jurídico. Peça a um advogado que revise antes de usar com clientes ou em produção.

**TERMO DE AUTORIZAÇÃO DE USO DE VOZ**

**Autorizante:** nome completo, CPF, e-mail e telefone.
**Responsável pelo uso:** nome do projeto ou empresa e contato.

1. **Objeto.** O autorizante permite a gravação de sua voz e a criação de uma voz sintética a partir dela (clonagem), por meio de inteligência artificial.
2. **Finalidade.** Marque o que vale:
   - [ ] teste interno, sem publicação;
   - [ ] vídeos publicados em canais e redes do projeto, com aviso de voz sintética;
   - [ ] uso comercial (anúncios, vídeos de clientes). *Exige modelo com licença comercial.*
3. **Prazo e território.** A autorização vale por ____ meses/anos, no território ____.
4. **Remuneração.** ( ) sem remuneração  ( ) R$ ____ por ____.
5. **Proibições.** A voz sintética não será usada para enganar ou se passar pelo autorizante, em golpes, em conteúdo político, sexual, ofensivo ou ilegal, nem para dizer o que o autorizante não aprovou.
6. **Aprovação.** O autorizante pode ouvir as amostras e vetar frases e usos.
7. **Transparência.** Todo conteúdo com a voz sintética informará que usa inteligência artificial.
8. **Dados pessoais (LGPD).** A voz é dado pessoal e, quando usada para identificar a pessoa, pode ser dado sensível. Os arquivos ficam guardados apenas para o projeto, sem compartilhamento com terceiros além dos necessários para gerar a voz.
9. **Revogação.** O autorizante pode revogar a autorização a qualquer momento por e-mail. O responsável deixará de gerar novos áudios e apagará a gravação e a voz criada em até ___ dias. Conteúdo já publicado ____ (remover / manter até a data ____).
10. **Foro.** Cidade e estado.

Local e data. Assinatura do autorizante e do responsável.

**Gravação de consentimento (recomendado):** além do papel, grave em áudio separado a pessoa dizendo: *"Eu, [nome completo], autorizo [responsável] a criar e usar uma voz sintética a partir da minha voz, para [finalidade], conforme o termo assinado em [data]."* Guarde junto do termo. **Esse arquivo não é a referência da clonagem.**

## 2. Gravação de referência

**Duração:** de 10 a 20 s (o OmniVoice usa até 20 s).
**Onde:** quarto silencioso, com cortina ou colchão por perto, sem ventilador, sem eco.
**Como:** celular a uns 20 cm da boca, sem música ao fundo. Salve em WAV ou M4A.
**Jeito de falar:** natural e expressivo, do jeito que a pessoa fala com os amigos, e não leitura travada. O sotaque e o ritmo da gravação é o que a voz vai herdar.

Texto sugerido para ler à vontade, mudando as palavras ao natural:

> Fala, galera! Tô aqui pra mostrar como a gente resolve as coisas. É papo reto, sem enrolação, mas com respeito, tá ligado? Se tu curtiu, chega mais, que a gente resolve isso rapidinho.

**Anote exatamente o que foi dito.** Esse texto vai no campo `ref_text`.

## 3. Preparar o áudio

```bash
./scripts/preparar-referencia.sh gravacao.m4a referencia.wav
```

O script deixa o áudio em mono, 24 kHz, sem silêncio no começo, com volume padronizado e no máximo 20 s, e avisa se ficou curto (menos de 8 s), estourado ou baixo.

## 4. Clonar e testar

1. Abra o VoiceStudio e espere até 2 minutos (o backend sobe em `localhost:3900`; o `clonar.mjs` espera ele ficar pronto). Feche o Chrome se a memória estiver curta.
2. **Aceite as licenças no Catálogo de Modelos do app.** A clonagem exige duas: `k2-fsa/OmniVoice` (CC-BY-NC, Higgs Audio 2, Meta Llama 3) e `eustlb/higgs-audio-v2-tokenizer`, o tokenizador de áudio, que tem termos próprios. Sem o aceite, a API responde `403 model_licence_required`. O aceite é seu: o Claude Code não aceita licença por você, e o app pode pedir de novo depois de reiniciar.
3. Rode:

```bash
node voz/clonar.mjs --ref referencia.wav \
  --ref-texto "Fala, galera! Tô aqui pra mostrar como a gente resolve as coisas..." \
  --saida saida-clone \
  "Caraca, mermão! Olha essa cidade, papo reto!" \
  "Coé, parceiro. Respeita minha caminhada."
```

4. Ouça `saida-clone/clone-01.wav` e `clone-02.wav` e compare com a gravação original.

Cada fala leva de 30 a 70 s na CPU e pede cerca de 6 GB de memória livre.

## 5. O que esperar

- A voz clonada herda o timbre e, em parte, o jeito de falar. **O sotaque carioca pode ou não vir; só o teste mostra.**
- Gravação ruim gera voz ruim: ruído, eco e cortes se repetem na voz clonada.
- A pessoa deve ouvir e aprovar o resultado antes de qualquer uso, como diz o termo.
- Para voz comercial, use um serviço com licença comercial e consentimento (por exemplo, ElevenLabs), conferindo o plano. O ElevenLabs cobra por uso.

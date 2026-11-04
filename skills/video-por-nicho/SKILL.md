---
name: video-por-nicho
description: Monta o roteiro de um vídeo de divulgação ou demonstração para um nicho específico (pet shop e veterinária, restaurante e delivery, clínica e odontologia, advocacia, imobiliária, loja virtual, sistema SaaS, curso e infoproduto, salão e estética, academia) — gancho, cenas, prova, chamada para ação, duração, formato, estilo de motion e objeto 3D sugeridos. Use quando o usuário disser "vídeo para [nicho]", "roteiro de vídeo do cliente [X]", "que vídeo funciona para clínica/restaurante/…", ou antes de rodar o /video-lancamento ou o /hyperframes para um cliente de um nicho conhecido.
argument-hint: "<nicho> [--formato 16:9|9:16] [--duracao 30|45|60]"
user-invocable: true
---

# Vídeo por nicho

Escolhe o nicho, abre a ficha dele em `references/nichos.md` e devolve um roteiro pronto para virar o `roteiro.json` do kit (`/video-lancamento`) ou um projeto HyperFrames (`/hyperframes`).

## Passo a passo

1. **Identifique o nicho** pelo pedido ou pelo site do cliente. Se não houver ficha, use a mais próxima e avise.
2. **Leia a ficha** em `references/nichos.md` (só a seção do nicho).
3. **Pergunte o que falta**, no máximo três coisas: nome e cor da marca (ou rode `/design-md` no site), a oferta ou o resultado principal, e onde o vídeo vai passar (Reels, site, WhatsApp, anúncio).
4. **Escreva o roteiro** na estrutura da ficha: gancho nos 3 primeiros segundos, 3 a 6 cenas, prova, chamada para ação. Cada cena tem fala (uma ou duas frases), o que aparece e a duração.
5. **Escolha o estilo** com `/estilos-de-motion` e o ritmo com `/estilos-de-edicao`; a ficha sugere um par para começar.
6. **Entregue** o roteiro em texto e, se pedido, como `roteiro.json` no formato do kit (cenas com `tipo: "animada"` quando não houver sistema para gravar).

## Regras

- **Mostre coisa real:** tela do sistema, fachada, produto, prato, consultório. Desenhe só o que não tem imagem.
- **Nada de promessa que o cliente não possa provar:** número, depoimento e antes e depois só com dado ou autorização dele.
- **Dado de pessoa:** gravação de tela com cliente real só com a máscara do kit. Rosto de paciente, aluno ou criança só com autorização escrita.
- **Setores regulados** (saúde, odontologia, advocacia, corretagem, finanças): a ficha lista os cuidados gerais; confirme a regra do conselho da categoria antes de publicar.
- Duração padrão: 30 a 45 s para Reels e anúncio, 60 a 90 s para site e apresentação. Mais que isso só com motivo.

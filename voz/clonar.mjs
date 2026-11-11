#!/usr/bin/env node
// Clona uma voz a partir de uma gravação de referência, pelo OmniVoice do VoiceStudio (API local).
//
//   node voz/clonar.mjs --ref referencia.wav --ref-texto "o que a pessoa disse na gravação" \
//        --saida pasta [--idioma "Portuguese (Brazil)"] [--velocidade 1.0] [--api http://localhost:3900] \
//        "Texto que a voz clonada vai falar."
//   (várias frases: repita o texto como argumentos ou use --texto-arquivo falas.txt, uma frase por linha)
//
// SÓ use gravação de pessoa que autorizou por escrito (docs/clonagem-autorizada.md).
// O OmniVoice é CC-BY-NC: serve para teste pessoal, não para vídeo comercial.
// O VoiceStudio precisa estar aberto (o app sobe o backend em localhost:3900).
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const opcoes = {};
const textos = [];
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) opcoes[args[i].slice(2)] = args[++i];
  else textos.push(args[i]);
}

const api = opcoes.api ?? 'http://localhost:3900';
const ref = opcoes.ref;
const refTexto = opcoes['ref-texto'];
if (opcoes['texto-arquivo']) {
  const linhas = (await readFile(opcoes['texto-arquivo'], 'utf8')).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  textos.push(...linhas);
}
if (!ref || !refTexto || textos.length === 0) {
  console.error('uso: node voz/clonar.mjs --ref ref.wav --ref-texto "fala da referência" --saida pasta "texto 1" ["texto 2" ...]');
  process.exit(1);
}

// O backend responde "starting" (HTTP 503) enquanto carrega o PyTorch: espera até 3 min ficar "ok".
let pronto = false;
let ultimo = 'sem resposta';
for (let t = 0; t < 36 && !pronto; t++) {
  try {
    const h = await fetch(`${api}/health`, { signal: AbortSignal.timeout(5000) });
    const corpo = await h.json().catch(() => ({}));
    pronto = h.ok && corpo.status === 'ok';
    ultimo = corpo.label ?? `HTTP ${h.status}`;
  } catch (e) {
    ultimo = e.message;
  }
  if (!pronto) await new Promise((r) => setTimeout(r, 5000));
}
if (!pronto) {
  console.error(`O VoiceStudio não ficou pronto em ${api} (${ultimo}). Abra o app e tente de novo.`);
  process.exit(1);
}

const saida = path.resolve(opcoes.saida ?? 'saida-clone');
await mkdir(saida, { recursive: true });
const audioRef = new Blob([await readFile(ref)], { type: 'audio/wav' });

for (const [i, texto] of textos.entries()) {
  const form = new FormData();
  form.set('text', texto);
  form.set('language', opcoes.idioma ?? 'Portuguese (Brazil)');
  form.set('engine', 'omnivoice');
  form.set('speed', opcoes.velocidade ?? '1.0');
  form.set('ref_text', refTexto);
  form.set('ref_audio', audioRef, path.basename(ref));
  const inicio = Date.now();
  const r = await fetch(`${api}/generate`, { method: 'POST', body: form, signal: AbortSignal.timeout(900_000) });
  if (!r.ok) {
    console.error(`falha na frase ${i + 1}: HTTP ${r.status} ${(await r.text()).slice(0, 300)}`);
    process.exit(1);
  }
  const destino = path.join(saida, `clone-${String(i + 1).padStart(2, '0')}.wav`);
  await writeFile(destino, Buffer.from(await r.arrayBuffer()));
  console.log(`${destino} (${((Date.now() - inicio) / 1000).toFixed(0)} s)`);
}

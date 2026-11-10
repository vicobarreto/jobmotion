// Narração: gera um áudio por trecho (abertura, cada cena, fechamento) e as legendas dele.
//
// Motores (roteiro.voz.motor):
//   edge        — Edge TTS (grátis, vozes neurais pt-BR; usa o serviço online da Microsoft de forma
//                 não oficial). Padrão. Precisa de `pip install edge-tts`.
//   openai      — OPENAI_API_KEY no ambiente; voz.modelo (padrão gpt-4o-mini-tts), voz.voz (ex.: "nova").
//   elevenlabs  — ELEVENLABS_API_KEY no ambiente; voz.voz = id da voz; modelo eleven_multilingual_v2.
// Chave de API só por variável de ambiente, nunca no roteiro.
//
// Cache: o áudio só é refeito quando o texto, a voz ou a velocidade mudam.
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { trechos } from './roteiro.mjs';
import { duracao, garantirPasta, hash, log, rodar } from './util.mjs';

/** Legenda em blocos: [{ inicio, fim, texto }] em segundos. */
function lerSrt(texto) {
  const tempo = (t) => {
    const [h, m, s] = t.replace(',', '.').split(':');
    return Number(h) * 3600 + Number(m) * 60 + Number(s);
  };
  return texto
    .split(/\r?\n\r?\n/)
    .map((bloco) => {
      const linhas = bloco.trim().split(/\r?\n/);
      const marca = linhas.find((l) => l.includes('-->'));
      if (!marca) return null;
      const [ini, fim] = marca.split('-->').map((x) => tempo(x.trim()));
      const txt = linhas.slice(linhas.indexOf(marca) + 1).join(' ').trim();
      return txt ? { inicio: ini, fim, texto: txt } : null;
    })
    .filter(Boolean);
}

/** Sem legenda do motor: frases distribuídas pelo tamanho ao longo da duração. */
function legendaEstimada(fala, total) {
  const frases = fala.match(/[^.!?]+[.!?]*/g)?.map((f) => f.trim()).filter(Boolean) ?? [fala];
  const pesos = frases.map((f) => f.length);
  const soma = pesos.reduce((a, b) => a + b, 0);
  let t = 0;
  return frases.map((texto, i) => {
    const d = (pesos[i] / soma) * total;
    const bloco = { inicio: t, fim: t + d, texto };
    t += d;
    return bloco;
  });
}

/** Quebra cada frase em linhas de legenda de até `max` caracteres; o tempo vai pelo tamanho. */
function agruparEmLinhas(blocos, max = 52) {
  const linhas = [];
  for (const b of blocos) {
    const palavras = b.texto.split(/\s+/);
    const partes = [];
    let atual = '';
    for (const p of palavras) {
      if (atual && (atual + ' ' + p).length > max) {
        partes.push(atual);
        atual = p;
      } else {
        atual = atual ? `${atual} ${p}` : p;
      }
    }
    if (atual) partes.push(atual);
    const total = partes.reduce((s, p) => s + p.length, 0);
    let t = b.inicio;
    for (const texto of partes) {
      const d = ((b.fim - b.inicio) * texto.length) / total;
      linhas.push({ inicio: t, fim: t + d, texto });
      t += d;
    }
  }
  return linhas;
}

async function edge(trecho, voz, mp3, srt) {
  // voz.tom (opcional): "-10Hz" deixa a voz mais grave, "+10Hz" mais aguda.
  const tom = voz.tom ? [`--pitch=${voz.tom}`] : [];
  await rodar('python', [
    '-m', 'edge_tts', '--voice', voz.voz, `--rate=${voz.velocidade}`, ...tom,
    '--text', trecho.fala, '--write-media', mp3, '--write-subtitles', srt,
  ]);
}

async function openai(trecho, voz, mp3) {
  const chave = process.env.OPENAI_API_KEY;
  if (!chave) throw new Error('motor openai: defina OPENAI_API_KEY no ambiente');
  const r = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: voz.modelo ?? 'gpt-4o-mini-tts',
      voice: voz.voz ?? 'nova',
      input: trecho.fala,
      instructions: voz.instrucoes ?? 'Fale em português do Brasil, tom de apresentação de produto, claro e animado.',
      response_format: 'mp3',
    }),
  });
  if (!r.ok) throw new Error(`OpenAI TTS respondeu ${r.status}`);
  await writeFile(mp3, Buffer.from(await r.arrayBuffer()));
}

async function elevenlabs(trecho, voz, mp3) {
  const chave = process.env.ELEVENLABS_API_KEY;
  if (!chave) throw new Error('motor elevenlabs: defina ELEVENLABS_API_KEY no ambiente');
  if (!voz.voz) throw new Error('motor elevenlabs: informe voz.voz (o id da voz)');
  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voz.voz}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: { 'xi-api-key': chave, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: trecho.fala, model_id: voz.modelo ?? 'eleven_multilingual_v2' }),
  });
  if (!r.ok) throw new Error(`ElevenLabs respondeu ${r.status}`);
  await writeFile(mp3, Buffer.from(await r.arrayBuffer()));
}

const MOTORES = { edge, openai, elevenlabs };

/** Gera (ou reaproveita) a narração de todos os trechos. Devolve { [id]: { arquivo, duracao, legenda } }. */
export async function narrar(roteiro, pastaTrabalho) {
  const pasta = await garantirPasta(path.join(pastaTrabalho, 'audio'));
  const motor = MOTORES[roteiro.voz.motor];
  if (!motor) throw new Error(`motor de voz desconhecido: ${roteiro.voz.motor}`);
  // Pronúncia (roteiro.pronuncia = { "DR Marketing": "Dê Érre Marketing" }): a VOZ lê a forma falada,
  // a LEGENDA volta à escrita. A volta é feita na frase inteira, antes de quebrar em linhas.
  const pronuncia = Object.entries(roteiro.pronuncia ?? {});
  const escapar = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const falado = (txt) => pronuncia.reduce((t, [escrito, dito]) => t.replace(new RegExp(escapar(escrito), 'g'), dito), txt);
  const escrito = (txt) => pronuncia.reduce((t, [esc, dito]) => t.replace(new RegExp(escapar(dito), 'gi'), esc), txt);
  const resultado = {};
  for (const t0 of trechos(roteiro)) {
    const t = { ...t0, fala: falado(t0.fala) };
    const chave = hash(JSON.stringify([t.fala, roteiro.voz]));
    const mp3 = path.join(pasta, `${t.id}-${chave}.mp3`);
    const srt = path.join(pasta, `${t.id}-${chave}.srt`);
    if (!existsSync(mp3)) {
      log('narrar', `${t.id}: gerando voz (${roteiro.voz.motor}, ${roteiro.voz.voz})`);
      await motor(t, roteiro.voz, mp3, srt);
    }
    const d = await duracao(mp3);
    const blocos = existsSync(srt) ? lerSrt(await readFile(srt, 'utf8')) : legendaEstimada(t.fala, d);
    const legenda = agruparEmLinhas(blocos.map((b) => ({ ...b, texto: escrito(b.texto) })));
    resultado[t.id] = { arquivo: mp3, duracao: d, legenda };
    log('narrar', `${t.id}: ${d.toFixed(1)} s`);
  }
  await writeFile(path.join(pastaTrabalho, 'narracao.json'), JSON.stringify(resultado, null, 2));
  return resultado;
}

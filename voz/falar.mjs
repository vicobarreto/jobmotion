#!/usr/bin/env node
// Gera a voz de um texto (ou de todas as falas de um roteiro) com o mesmo código do kit de vídeo.
//
//   node voz/falar.mjs "Texto a ser falado." --saida pasta [--voz pt-BR-FranciscaNeural] [--velocidade +5%] [--motor edge]
//   node voz/falar.mjs --roteiro roteiro.json --saida pasta
//
// Saída: <pasta>/audio/<id>-<hash>.mp3 (+ .srt no motor edge) e <pasta>/narracao.json
// com duração e legenda de cada trecho. Chave de API (openai, elevenlabs) só por variável de ambiente.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { narrar } from './narrar.mjs';

const args = process.argv.slice(2);
const opcao = (nome, padrao) => {
  const i = args.indexOf(`--${nome}`);
  return i >= 0 ? args[i + 1] : padrao;
};
const texto = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
const caminhoRoteiro = opcao('roteiro');
const saida = path.resolve(opcao('saida', 'voz-saida'));

if (!texto && !caminhoRoteiro) {
  console.error('uso: node voz/falar.mjs "texto" --saida pasta   |   node voz/falar.mjs --roteiro roteiro.json --saida pasta');
  process.exit(1);
}

const voz = {
  motor: opcao('motor', 'edge'),
  voz: opcao('voz', 'pt-BR-FranciscaNeural'),
  velocidade: opcao('velocidade', '+5%'),
  ...(opcao('tom') ? { tom: opcao('tom') } : {}),
};

const roteiro = caminhoRoteiro
  ? JSON.parse(await readFile(caminhoRoteiro, 'utf8'))
  : { cenas: [{ id: 'fala', fala: texto }] };
// Opções da linha de comando só valem sem voz no roteiro; com roteiro, a voz dele manda.
roteiro.voz = { ...voz, ...(caminhoRoteiro ? roteiro.voz : {}) };

const resultado = await narrar(roteiro, saida);
for (const [id, r] of Object.entries(resultado)) console.log(`${id}: ${r.duracao.toFixed(1)} s → ${r.arquivo}`);

// Utilitários do kit: caminhos, execução de programas externos, duração de mídia.
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const RAIZ_DO_KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Roda um programa e devolve a saída. Lança com o stderr se o código de saída não for 0. */
export function rodar(programa, argumentos, opcoes = {}) {
  return new Promise((resolve, reject) => {
    const filho = spawn(programa, argumentos, { windowsHide: true, ...opcoes });
    let saida = '';
    let erro = '';
    filho.stdout?.on('data', (d) => (saida += d));
    filho.stderr?.on('data', (d) => (erro += d));
    filho.on('error', reject);
    filho.on('close', (codigo) =>
      codigo === 0
        ? resolve(saida)
        : reject(new Error(`${programa} saiu com ${codigo}: ${erro.slice(-800)}`)),
    );
  });
}

/** Duração de um arquivo de áudio ou vídeo, em segundos. */
export async function duracao(arquivo) {
  const saida = await rodar('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', arquivo,
  ]);
  const s = Number.parseFloat(saida.trim());
  if (!Number.isFinite(s)) throw new Error(`não consegui medir a duração de ${arquivo}`);
  return s;
}

export function hash(texto) {
  return createHash('sha256').update(texto).digest('hex').slice(0, 12);
}

export async function garantirPasta(pasta) {
  await mkdir(pasta, { recursive: true });
  return pasta;
}

export const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

export function log(etapa, texto) {
  console.log(`[${etapa}] ${texto}`);
}

#!/usr/bin/env bash
# Prepara uma gravação de referência para clonagem de voz: mono, 24 kHz, sem silêncio no começo,
# volume padronizado e no máximo 20 s. Mostra avisos sobre duração, volume e estouro.
#   ./scripts/preparar-referencia.sh gravacao.m4a [saida.wav]
# Só use gravação de pessoa que autorizou por escrito (ver docs/clonagem-autorizada.md).
set -euo pipefail
ENTRADA="${1:?uso: preparar-referencia.sh <gravacao> [saida.wav]}"
SAIDA="${2:-${ENTRADA%.*}-referencia.wav}"
MAX=20

[ -f "$ENTRADA" ] || { echo "arquivo não encontrado: $ENTRADA"; exit 1; }

ffmpeg -y -loglevel error -i "$ENTRADA" \
  -af "highpass=f=70,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.1,loudnorm=I=-20:TP=-2:LRA=7" \
  -ac 1 -ar 24000 -t "$MAX" "$SAIDA"

dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SAIDA")
stats=$(ffmpeg -i "$SAIDA" -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume" || true)
media=$(echo "$stats" | sed -n 's/.*mean_volume: \(-\?[0-9.]*\) dB.*/\1/p')
pico=$(echo "$stats" | sed -n 's/.*max_volume: \(-\?[0-9.]*\) dB.*/\1/p')
orig=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$ENTRADA")

printf 'Entrada: %.1f s | referência: %.1f s | volume médio %s dB | pico %s dB\n' "$orig" "$dur" "${media:-?}" "${pico:-?}"
aviso=0
python3 - "$dur" "$orig" "${media:-0}" "${pico:-0}" "$MAX" <<'PY' || true
import sys
dur, orig, media, pico, mx = map(float, sys.argv[1:6])
if dur < 8: print("AVISO: menos de 8 s; grave de 10 a 20 s para a voz sair parecida.")
if orig > mx: print(f"AVISO: a gravação passou de {mx:.0f} s; usei só o começo. Corte o trecho mais expressivo se preferir.")
if pico > -0.5: print("AVISO: o áudio estourou (pico perto de 0 dB). Regrave mais longe do microfone.")
if media < -35: print("AVISO: gravação muito baixa. Fale mais perto do microfone.")
PY
echo "Pronto: $SAIDA"
echo "Anote exatamente o que foi dito: vai no campo ref_text da clonagem."

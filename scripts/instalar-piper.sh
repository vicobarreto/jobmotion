#!/usr/bin/env bash
# Instala o Piper (voz local) e baixa vozes pt_BR do rhasspy/piper-voices.
#   ./scripts/instalar-piper.sh [pasta-dos-modelos] [voz ...]
# Padrão: ./modelos-piper e a voz jeff. Vozes: jeff cadu faber edresson
# Confira a ficha (MODEL_CARD) de cada voz antes de uso comercial.
set -euo pipefail
PASTA="${1:-modelos-piper}"; shift || true
VOZES=("$@"); [ ${#VOZES[@]} -eq 0 ] && VOZES=(jeff)
BASE=https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR
python -m pip install --quiet --disable-pip-version-check piper-tts
mkdir -p "$PASTA"
for v in "${VOZES[@]}"; do
  q=medium; [ "$v" = edresson ] && q=low
  for ext in onnx onnx.json; do
    arq="pt_BR-$v-$q.$ext"
    [ -s "$PASTA/$arq" ] || curl -fsSL -o "$PASTA/$arq" "$BASE/$v/$q/$arq"
  done
  echo "voz $v pronta em $PASTA"
  echo "  ficha: $BASE/$v/$q/MODEL_CARD"
done
echo "Use no roteiro: \"voz\": { \"motor\": \"piper\", \"voz\": \"${VOZES[0]}\", \"pasta\": \"$PASTA\" }"

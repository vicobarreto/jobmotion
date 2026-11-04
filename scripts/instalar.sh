#!/usr/bin/env bash
# Copia as skills para ~/.claude/skills (ou para a pasta dada como argumento).
set -euo pipefail
ORIGEM="$(cd "$(dirname "$0")/../skills" && pwd)"
DESTINO="${1:-$HOME/.claude/skills}"
mkdir -p "$DESTINO"
for s in "$ORIGEM"/*/; do
  nome="$(basename "$s")"
  if [ -e "$DESTINO/$nome" ]; then echo "já existe, mantida: $nome (apague para reinstalar)"; continue; fi
  cp -r "$s" "$DESTINO/$nome" && echo "instalada: $nome"
done

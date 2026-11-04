#!/usr/bin/env bash
# Confere que cada skill tem SKILL.md com name e description no frontmatter.
set -euo pipefail
cd "$(dirname "$0")/../skills"
erro=0
for d in */; do
  d="${d%/}"; f="$d/SKILL.md"
  [ -f "$f" ] || { echo "FALTA $f"; erro=1; continue; }
  head -1 "$f" | grep -q '^---' || { echo "$f: sem frontmatter"; erro=1; }
  grep -q "^name: $d\$" "$f" || { echo "$f: 'name' diferente da pasta"; erro=1; }
  grep -q '^description: ' "$f" || { echo "$f: sem description"; erro=1; }
done
[ $erro -eq 0 ] && echo "ok: todas as skills válidas"
exit $erro

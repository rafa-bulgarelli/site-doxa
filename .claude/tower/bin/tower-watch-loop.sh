#!/usr/bin/env bash
# Aba do WATCHDOG: roda o tick em loop, para ficar aberta e visível no Orca.
# Zero token — é git e grep, não modelo. Ctrl-C encerra.
#
# Uso:  .claude/tower/bin/tower-watch-loop.sh [intervalo-em-segundos]
set -uo pipefail

INTERVAL="${1:-60}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

while true; do
  clear
  printf '╔══════════════════════════════════════════════════════════════╗\n'
  printf '║  WATCHDOG — alerta, não age.  tick a cada %-3ss   Ctrl-C sai  ║\n' "$INTERVAL"
  printf '╚══════════════════════════════════════════════════════════════╝\n\n'

  git -C "$HERE/../../.." fetch -q origin 2>/dev/null
  "$HERE/tower-watch.sh"

  printf '\n── próximo tick em %ss ──\n' "$INTERVAL"
  sleep "$INTERVAL"
done

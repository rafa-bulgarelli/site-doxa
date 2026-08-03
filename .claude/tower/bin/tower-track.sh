#!/usr/bin/env bash
# Abre uma track: branch nova a partir da base + worktree isolada.
# 1 track = 1 executor = 1 worktree = 1 branch = 1 context pack.
#
# Uso:  .claude/tower/bin/tower-track.sh <nome-da-track>
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "uso: $0 <nome-da-track>   (ex: feat-hero)" >&2
  exit 2
fi

BRANCH="$1"
REPO_ROOT="$(git rev-parse --show-toplevel)"
REPO_NAME="$(basename "$REPO_ROOT")"
WORKTREE="$HOME/orca/workspaces/$REPO_NAME/$BRANCH"
PACK="$REPO_ROOT/.claude/tower/packs/$BRANCH.md"

if git rev-parse --verify --quiet "$BRANCH" >/dev/null; then
  echo "ERRO: branch '$BRANCH' já existe. Outra track pode estar nela." >&2
  exit 1
fi
if [ -e "$WORKTREE" ]; then
  echo "ERRO: '$WORKTREE' já existe." >&2
  exit 1
fi

if git rev-parse --verify --quiet origin/main >/dev/null; then
  BASE="origin/main"
else
  BASE="main"
fi

git worktree add -b "$BRANCH" "$WORKTREE" "$BASE" >/dev/null
echo "worktree: $WORKTREE"
echo "branch:   $BRANCH  (a partir de $BASE)"

if [ -f "$PACK" ]; then
  echo "pack:     .claude/tower/packs/$BRANCH.md"
else
  echo "pack:     FALTANDO — .claude/tower/packs/$BRANCH.md"
  echo
  echo "Track sem context pack não deve receber executor: sem a seção '## SCOPE'"
  echo "o watchdog não consegue verificar escopo, e sem VERIFY executável a track"
  echo "está mal escopada. Peça o pack ao @gestor antes de spawnar."
fi

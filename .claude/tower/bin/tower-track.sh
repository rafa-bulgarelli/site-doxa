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
# Nome do repo pelo .git COMUM, não pelo toplevel: rodando de dentro de uma worktree
# (ex.: a workspace do Orca em ~/orca/workspaces/site-doxa/<nome>), o toplevel é a
# própria worktree e o basename viraria "<nome>" — a track nasceria em
# ~/orca/workspaces/<nome>/<track>, fora do lugar. O common-dir aponta sempre para
# o checkout principal (…/site-doxa/.git).
REPO_NAME="$(basename "$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")")"
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

# Base = de onde a track parte. Sozinho, origin/main (ou main local). Tracks de uma
# feature branch (noite de tracks seriais) passam a base por env, como o watch e o
# close já aceitam:
#   BASE=origin/feat/xyz .claude/tower/bin/tower-track.sh <track>
if [ -n "${BASE:-}" ]; then
  if ! git rev-parse --verify --quiet "$BASE" >/dev/null; then
    echo "ERRO: base '$BASE' não existe." >&2
    exit 1
  fi
elif git rev-parse --verify --quiet origin/main >/dev/null; then
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

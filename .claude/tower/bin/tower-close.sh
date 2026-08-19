#!/usr/bin/env bash
# Fecha uma track já mergeada: remove a worktree e apaga a branch.
# Executor com task mergeada se FECHA — worktree ociosa acumulando é anti-pattern.
#
# Uso:  .claude/tower/bin/tower-close.sh <nome-da-track>
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "uso: $0 <nome-da-track>" >&2
  exit 2
fi

BRANCH="$1"
# Nome do repo pelo .git COMUM (ver tower-track.sh): de dentro de uma worktree o
# toplevel é a própria worktree, e o basename apontaria a pasta errada.
REPO_NAME="$(basename "$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")")"
WORKTREE="$HOME/orca/workspaces/$REPO_NAME/$BRANCH"

# Base = onde a track foi mergeada. Sozinho, origin/main (ou main local). Track
# mergeada numa feature branch (noite de tracks seriais) passa a base por env:
#   BASE=origin/feat/xyz .claude/tower/bin/tower-close.sh <track>
if [ -n "${BASE:-}" ]; then
  :
elif git rev-parse --verify --quiet origin/main >/dev/null; then
  BASE="origin/main"
else
  BASE="main"
fi

if ! git rev-parse --verify --quiet "$BRANCH" >/dev/null; then
  echo "ERRO: branch '$BRANCH' não existe." >&2
  exit 1
fi

# Recusa fechar track não mergeada: fechar aqui perde trabalho.
# Merge é por squash (histórico linear), então o commit da track NUNCA vira
# ancestral da base — contar commits diria "não mergeada" para toda track
# entregue. O critério é a ÁRVORE: se o conteúdo da track está todo na base
# (`git diff` vazio), o trabalho não se perde ao fechar.
# A track pode estar ATRÁS da base (outras tracks mergearam depois dela), então
# a comparação é só nos arquivos que ELA tocou desde o merge-base.
unmerged="$(git rev-list --count "$BASE..$BRANCH")"
if [ "$unmerged" -ne 0 ]; then
  mb="$(git merge-base "$BASE" "$BRANCH")"
  tocados="$(git diff --name-only "$mb" "$BRANCH")"
  if [ -n "$tocados" ] && ! printf '%s\n' "$tocados" | xargs git diff --quiet "$BASE" "$BRANCH" --; then
    echo "ERRO: '$BRANCH' tem $unmerged commit(s) fora de $BASE e arquivos tocados que diferem da base — não está mergeada." >&2
    echo "Fechar agora perde esse trabalho. Mergeie primeiro, ou apague à mão se for descarte." >&2
    printf '%s\n' "$tocados" | xargs git diff --stat "$BASE" "$BRANCH" -- | tail -5 >&2
    exit 1
  fi
fi

if [ -d "$WORKTREE" ]; then
  git worktree remove "$WORKTREE"
  echo "worktree removida: $WORKTREE"
fi
git branch -d "$BRANCH"
echo "branch apagada:   $BRANCH"

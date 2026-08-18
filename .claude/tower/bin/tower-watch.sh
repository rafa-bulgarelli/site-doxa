#!/usr/bin/env bash
# Tick do WATCHDOG — lê estado observável do git e reporta. NÃO age.
#
# Uso:  .claude/tower/bin/tower-watch.sh [branch ...]
#       sem argumento = todas as branches menos a base.
#
# Sai 0 sempre: o watchdog reporta, quem decide é o GESTOR.
set -uo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
PACK_DIR="$REPO_ROOT/.claude/tower/packs"

# Base de comparação: origin/main quando existe remote, senão main local.
# Base = de onde as tracks partem. Sozinho, origin/main (ou main local). Quando as
# tracks de uma noite mergeiam numa feature branch, passe-a por env:
#   BASE=origin/feat/xyz .claude/tower/bin/tower-watch.sh <tracks>
# — senão tudo que já está na feature branch aparece como "fora do pack".
if [ -n "${BASE:-}" ]; then
  :
elif git rev-parse --verify --quiet origin/main >/dev/null; then
  BASE="origin/main"
else
  BASE="main"
fi

# Parado por mais que isto = reporta o fato (NÃO é sinal de travado: executor em
# thinking longo fica minutos sem commitar, e interromper reseta o raciocínio).
IDLE_ALERT_MIN=20

HYGIENE_RE='as any|@ts-ignore|@ts-nocheck|: any|console\.log|TODO|FIXME'
CONFIG_RE='(^|/)(eslint|tsconfig|prettier|vite|next|tailwind)[^/]*\.(json|js|cjs|mjs|ts|yaml|yml)$|^\.github/workflows/|(^|/)\.eslintrc|(^|/)package\.json$'
SECRET_RE='(api[_-]?key|secret|password|passwd|access[_-]?token|auth[_-]?token|bearer|private[_-]?key)[[:space:]]*[:=]|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|sk-[A-Za-z0-9]{20,}'

branches=("$@")
if [ ${#branches[@]} -eq 0 ]; then
  while IFS= read -r b; do
    [ "$b" = "${BASE#origin/}" ] || branches+=("$b")
  done < <(git for-each-ref --format='%(refname:short)' refs/heads/)
fi

printf 'tick %s  (base: %s)\n' "$(date '+%H:%M:%S')" "$BASE"

if [ ${#branches[@]} -eq 0 ]; then
  echo "  nenhuma branch de track — nada a reportar."
  exit 0
fi

for branch in "${branches[@]}"; do
  if ! git rev-parse --verify --quiet "$branch" >/dev/null; then
    printf '  %-24s ⚠ branch não existe\n' "$branch"
    continue
  fi

  sha="$(git rev-parse --short "$branch")"
  ahead="$(git rev-list --count "$BASE..$branch" 2>/dev/null || echo 0)"
  last_epoch="$(git log -1 --format=%ct "$branch")"
  idle_min=$(( ( $(date +%s) - last_epoch ) / 60 ))

  idle_note=""
  if [ "$idle_min" -ge "$IDLE_ALERT_MIN" ]; then
    idle_note="  (sem commit há ${idle_min}min)"
  fi
  printf '  %-24s %s  +%s commit(s)%s\n' "$branch" "$sha" "$ahead" "$idle_note"

  changed="$(git diff --name-only "$BASE...$branch" 2>/dev/null)"
  [ -z "$changed" ] && { echo "      (sem diff vs $BASE)"; continue; }

  # --- ESCOPO: o pack declara os arquivos permitidos na seção "## SCOPE" ---
  pack="$PACK_DIR/$branch.md"
  if [ -f "$pack" ]; then
    # Uma entrada por linha, prefixo "- ". Anotação entre parênteses depois do
    # caminho é ignorada ("- public/sitemap.xml (remoção)"). Entrada terminada em
    # "/**" cobre tudo abaixo do diretório — é como as tracks de conteúdo declaram
    # um diretório exclusivo sem listar arquivos que ainda não existem.
    scope="$(awk '/^## SCOPE/{f=1;next} /^## /{f=0} f' "$pack" \
             | sed -n 's/^[[:space:]]*-[[:space:]]*//p' \
             | sed -E 's/[[:space:]]+\(.*$//; s/[[:space:]]+$//' \
             | sed -E 's/^`(.*)`$/\1/')"
    if [ -n "$scope" ]; then
      while IFS= read -r file; do
        [ -z "$file" ] && continue
        ok=0
        while IFS= read -r entry; do
          [ -z "$entry" ] && continue
          case "$entry" in
            */\*\*) [[ "$file" == "${entry%\*\*}"* ]] && ok=1 ;;
            *)      [ "$file" = "$entry" ] && ok=1 ;;
          esac
          [ "$ok" = 1 ] && break
        done <<< "$scope"
        if [ "$ok" != 1 ]; then
          printf '      ⚠ ESCOPO: %s está fora do pack\n' "$file"
        fi
      done <<< "$changed"
    else
      echo "      ⚠ pack sem seção '## SCOPE' — escopo não verificável"
    fi
  else
    printf '      ⚠ sem pack em %s — escopo não verificável\n' ".claude/tower/packs/$branch.md"
  fi

  # --- CONFIG PROTECTION: afrouxar gate para passar check é banido ---
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    if printf '%s' "$file" | grep -qE "$CONFIG_RE"; then
      printf '      ⚠ CONFIG: %s alterado dentro de uma track\n' "$file"
    fi
  done <<< "$changed"

  # --- HIGIENE e SEGREDO: file:line reais na ponta da branch ---
  while IFS= read -r file; do
    [ -z "$file" ] && continue
    git cat-file -e "$branch:$file" 2>/dev/null || continue   # arquivo deletado

    git grep -nIE "$HYGIENE_RE" "$branch" -- "$file" 2>/dev/null \
      | sed "s|^$branch:|      ⚠ HIGIENE: |"

    # Segredo: aponta onde, nunca reproduz o valor.
    git grep -nIE "$SECRET_RE" "$branch" -- "$file" 2>/dev/null \
      | cut -d: -f2,3 \
      | sed 's|^|      ⚠ SEGREDO (confira, valor omitido): |'
  done <<< "$changed"
done

exit 0

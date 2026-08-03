# <Feature> — Track <X>: <nome> (task_<slug>)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/<branch>`,
branch **`<branch>`** (JÁ criada pelo `tower-track.sh` a partir da base).

## STEP 0 (obrigatório, antes de qualquer edit)
`git branch --show-current` = `<branch>` · `git status --porcelain` vazio · você está no
diretório da worktree, não no repo principal. Divergiu → **PARE e reporte** (não conserte
por conta própria: na branch errada, outra track pode estar nela).

## A VISÃO DO DONO
<2-4 frases na língua do dono — o que ele quer VER funcionando>

## CONTEXTO (não perca tempo redescobrindo — o GESTOR preenche via graphify)
- <o que já existe no repo que esta track USA: routers, helpers, componentes — caminhos exatos>
- <vizinhança do módulo (quem importa/é importado) — saída do graphify affected>
- <decisões já tomadas pelo GESTOR + porquê>
- Armadilhas do repo: <copie da seção "Armadilhas" do CLAUDE.md — só as que ESTA track pode
  pisar, com caminho exato. Vazio enquanto o repo não tiver nenhuma registrada.>
  <Tipos de armadilha que merecem virar linha aqui: mudança de schema que precisa ser
  espelhada em outro lugar; regra de autorização que a track pode furar sem perceber;
  coluna cujo nome não deixa óbvio a qual tabela pertence; escrita concorrente que exige
  lock. Preencha com as DESTE repo, com caminho exato.>
- **Estilo OBRIGATÓRIO**: leia `.claude/STYLE-GOOGLE-TS.md` e siga.

## A TASK
1. <passo concreto, arquivo exato>
2. <…>

## SCOPE
<!-- Escopo FECHADO. Um arquivo por linha, caminho relativo à raiz do repo, prefixo "- ".
     O WATCHDOG lê ESTA seção (tower-watch.sh) — formato diferente = escopo não verificável.
     Precisa tocar arquivo fora daqui → PARE e reporte (outra track pode estar nele). -->
- <caminho/exato/do/arquivo.ts>
- <…>

## DEPENDS ON
<prelude/track que precisa estar em main antes — ou "nada">

## VERIFY (pass/fail executável — cole a saída no report)
- `<comando de typecheck do repo>` = 0 erros
- `<comando de teste> <arquivos-de-teste-da-track>` verde (novos testes DESTA track inclusos)
- `<comando de build>` ok
- `git diff origin/main...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- <check específico da feature: endpoint+payload+shape esperado, grep no diff, etc.>

<!-- Package manager/test runner ainda "a definir" no CLAUDE.md: o GESTOR confirma no
     package.json ANTES de escrever este bloco. Não assuma npm/pnpm/yarn. -->

## COMMIT + PUSH
`<tipo>(<escopo> #<task>): <resumo>` → `git push -u origin <branch>`. **NÃO mergeie.**
Ao terminar: sumário do que fez + verdict READY/NOT READY + saída colada do VERIFY.
Merge/deploy/LIVE são do GESTOR.

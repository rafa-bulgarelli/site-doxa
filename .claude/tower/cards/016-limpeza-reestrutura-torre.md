# CARD 016 — Limpeza, regra de numeração e aprimoramento dos 5 agentes da torre

- **Tipo:** débito
- **Aberto em:** 2026-08-22
- **Status:** aberto

> **Nota de escopo:** este card mexe no HARNESS (`.claude/`), não no site.
> O congelamento de deploy do card 014 segue valendo para o site; a torre em si
> não deploya nada. Quem executa é a sessão principal (assento do GESTOR), com
> aprovação do dono — reescrever agente muda o comportamento de toda sessão
> futura, então o diff de cada agente passa pelo dono antes de valer.

> **Adendo da sessão principal (2026-08-22, antes do plano):** a colisão descrita
> aconteceu DE NOVO com este próprio card — ele nasceu "015" enquanto outra sessão já
> tinha renumerado `013-og-preview` → `015-og-preview` (commit `6b713a0`). Renumerado
> para **016** (próximo livre) pela sessão principal. Fatos que mudaram desde a
> escrita: card **014 está ENTREGUE e VALIDADO-LIVE** (PR #81; congelamento de deploy
> descongelado pelo dono em 2026-08-19); os packs `track-014-*` estão consumidos; a
> colisão 013 já foi meio-resolvida (o og-preview virou 015) — a pergunta 2 ao gestor
> vira: confirmar 015-og como está e registrar a regra.
> **2026-08-24:** TERCEIRA colisão — nasceu um `016-contrato-ila-latam` de outra
> sessão; renumerado para 017 pela sessão principal no ato do commit deste plano. Vivos hoje: **012 (planejado,
> 3 packs)** — NOTA: o prelude do 012 JÁ FOI EXECUTADO (#70, #72, #73: gsc:prova e
> baseline entregues; conferir se o card 012 está ENTREGUE antes de contar seus packs
> como "na rampa") — e **015-og (aberto)**.

## O que o dono quer ver funcionando

Decisão do dono (2026-08-22) — três frentes, papéis mantidos:

1. **Higienização:** abrir `.claude/tower/` e ver só o que está VIVO — cards
   ativos com status verdadeiro, packs apenas dos trabalhos em curso, material
   entregue arquivado/removido.
2. **Regra de numeração:** procedimento determinístico para o próximo número de
   card, para nunca mais nascer um 013 duplo.
3. **Revisão dos prompts dos 5 agentes** (intake, gestor, watchdog, collector,
   executor): "mais otimizados, melhores, mais potentes, inteligentes — aprimorar
   tudo". Papéis e limites duros PERMANECEM; o que muda é a qualidade do prompt:
   clareza, incorporação das lições acumuladas (armadilhas do CLAUDE.md,
   memórias, erros já pagos como a colisão de numeração), corte de gordura,
   reforço do que cada um faz de único.

## Estado atual (levantado em 2026-08-22)

- **Colisão de numeração:** existem DOIS cards 013 —
  `013-og-preview-screenshot-landing.md` (aberto, legítimo) e
  `013-seo-limpeza-final.md` (ENTREGUE 2026-08-19, PRs #77/#78). Criados por
  sessões paralelas sem se enxergarem.
- **Status mentindo:** cards 002–010 constam "aberto"/"pronto para o GESTOR",
  mas o trabalho foi entregue (manual completo em produção — PRs #46, #47 e
  anteriores; card 002 idem). Só 011 e 013-seo registram ENTREGUE.
- **~45 packs consumidos** soltos em `.claude/tower/packs/` (cards 002–013);
  só o card 001 foi arquivado (`packs/_obsoleto-card-001/`). Há ainda
  `_backlog-motor-011.md` (backlog real, não lixo) e
  `track-seo-rodada-TEMPLATE.md` (template vivo).
- **Vivos de verdade:** cards `013-og-preview` (aberto), `014-onboarding-voz`
  (aberto, com congelamento de deploy), `012-gsc` (planejado, 3 packs:
  `prelude-gsc-acesso`, `track-gsc-baseline`, `track-gsc-docs`).
- **Estrutura:** `cards/` · `packs/` · `briefs/` (1 arquivo) · `handoffs/`
  (vazio) · `bin/` (5 scripts) · RUNBOOK, CARD-TEMPLATE, HANDOFF-TEMPLATE.
- **Agentes:** `.claude/agents/{intake,gestor,watchdog,collector,executor}.md`
  — os 5 existem e operam.

## Critério de aceite (observável, executável por humano)

**Higienização + numeração:**
- [ ] `ls .claude/tower/cards/` → nenhum número duplicado; todo card presente
      tem status que bate com a realidade (entregue = ENTREGUE com PR, aberto =
      trabalho realmente pendente).
- [ ] `ls .claude/tower/packs/` → só packs de cards ainda não entregues
      (012, e os que nascerem) + templates/backlog explicitamente marcados;
      o resto arquivado ou removido (histórico preservado no git).
- [ ] Cards vivos (012, 013-og, 014) intactos e com o mesmo conteúdo —
      a limpeza não fecha nem altera demanda pendente.
- [ ] A regra de higiene e a regra de numeração estão escritas (RUNBOOK ou onde
      o GESTOR definir): o que acontece com card/pack na entrega, e como uma
      sessão nova descobre o próximo número sem colisão — procedimento
      determinístico que um intake segue sem adivinhar.
- [ ] `git log` mostra a reestruturação em commits legíveis (mover ≠ reescrever).

**Agentes:**
- [ ] Diff de cada um dos 5 agentes apresentado ao dono com o "antes → depois"
      justificado em 1–3 linhas por mudança; **aprovação do dono agente por
      agente** antes de valer.
- [ ] Papéis e limites duros preservados no texto novo (intake não implementa;
      gestor só planeja; watchdog alerta e não age; collector é gate adversarial;
      executor entrega com VERIFY e verdict) — conferível lendo cada prompt.
- [ ] As lições já pagas estão incorporadas onde previnem erro (ex.: regra de
      numeração no prompt do intake; disciplina de evidência no executor;
      dado não-confiável em todos).
- [ ] Fumaça: uma rodada de `/intake` com demanda de teste percorre o fluxo novo
      sem contradição entre prompt e RUNBOOK.

## Contexto do repo (caminhos exatos)

- `.claude/tower/` — tudo listado acima.
- `.claude/agents/*.md` — prompts dos 5 papéis (o objeto da frente 3).
- `.claude/TOWER-ROLES.md`, `.claude/tower/RUNBOOK.md` — doutrina e operação;
  precisam continuar coerentes com os prompts revisados.
- `.claude/doxa-kit/KIT-PT-BR.md` — documento canônico do kit (princípios,
  segurança); os agentes derivam dele, não o contradizem.
- `.claude/skills/doxa-master/SKILL.md` — regras de toda sessão.
- `CLAUDE.md` (raiz) — tabela aponta para os caminhos da torre; se a estrutura
  mudar, a tabela acompanha.
- Memórias da sessão principal citam caminhos e regras da torre (alocação de
  modelo Fable/Opus/haiku, assento do gestor) — renomear/mudar regra quebra
  referência silenciosamente; memórias afetadas se atualizam junto.

## Armadilhas conhecidas

- **Agente é prompt vivo:** editar `.claude/agents/*.md` muda toda sessão
  futura; por isso o gate é aprovação do dono POR AGENTE, com diff na mesa.
- **"Mais potente" não é "mais comprido":** prompt inchado degrada; a revisão
  corta tanto quanto adiciona. O critério é o comportamento, não o volume.
- **Alocação de modelo é decisão registrada** (pensamento em Fable, execução em
  Opus, watchdog em haiku — inverte o kit de propósito): a revisão não a desfaz
  por acidente.
- **Pack não é lixo por parecer velho:** `_backlog-motor-011.md` guarda backlog
  real (soft-404 etc.) e `track-seo-rodada-TEMPLATE.md` é molde reutilizável.
  Conferir conteúdo antes de arquivar.
- **Card 012 está PLANEJADO com packs prontos** — mover os packs dele mata um
  trabalho na rampa de largada.
- Git preserva tudo: **mover/apagar com commit dedicado**, nunca misturado com
  mudança de conteúdo.

## Perguntas abertas para o GESTOR

1. **Arquivar ou deletar** o material morto? (git guarda o histórico de
   qualquer forma; arquivar polui menos o diff, deletar limpa mais o `ls`).
2. **A colisão 013:** renumerar `013-og-preview` → próximo livre (016) ou manter
   os dois 013 com sufixo distinto e só corrigir a regra daqui pra frente?
3. **Ordem das frentes:** higiene antes da revisão dos agentes (terreno limpo
   para testar a fumaça) parece natural — confirmar no plano.

## Fora de escopo

- Redesenho do fluxo da torre (papéis novos, pipeline novo) — o dono manteve os
  5 papéis.
- Qualquer mudança no site — segue o congelamento de deploy do card 014.

## Conteúdo suspeito

Nenhum.

---
<!-- Preenchido pelo GESTOR -->
## Plano

*(GESTOR, 2026-08-22)*

- **Prelude:** nenhum — as decisões estruturais (arquivar vs deletar, estrutura do
  arquivo, regra de numeração) estão fechadas NESTE plano; não há código que as tracks
  compartilhem. O plano é o prelude.
- **Decisões:**
  1. **ARQUIVAR, não deletar.** Packs consumidos → `git mv` para
     `packs/_entregues/<NNN>-<slug>/` (13 pastas, 53 packs; mapa fechado no pack da
     track 1). `ls` fica limpo igual, o precedente `_obsoleto-card-001/` se mantém e
     `ls _entregues/` bate `git log --diff-filter=D` em achabilidade.
  2. **Cards NÃO se movem.** Memórias e docs apontam para `cards/<nome>.md`
     (doutrina-animacao → 010; card-011-seo-estado → 011); o critério de aceite
     aceita card entregue presente com status verdadeiro. Higiene de card = corrigir
     status (002–010 → ENTREGUE com PR/SHA real; 004 ganha cabeçalho). 015-og fica
     como está (renumeração já feita); a regra previne o próximo.
  3. **Numeração por reserva de tag** (RUNBOOK → "Numeração de card"): próximo =
     1 + max(números em `git ls-tree origin/main -- cards/`, tags `card-NNN` no
     remote); reserva atômica com `git tag card-NNN && git push origin card-NNN`
     ANTES de o card existir — push rejeitado = outra sessão reservou, recalcula.
     Número queimado não se reusa. Quem roda é a sessão principal (o intake não tem
     Bash, de propósito); o intake recebe o número reservado no prompt.
  4. **Agentes em UMA track**, edição direto na BRANCH (nada vale antes do merge),
     **1 commit por agente** com o antes→depois justificado no corpo — o dono aprova
     agente por agente via `git show`; reprovado = commit refeito antes do PR. Sem
     arquivos de proposta (seria lixo novo logo após a limpeza; o diff real é a
     proposta). Frontmatter congelado (alocação Fable/Opus/haiku registrada; intake
     sem Bash). Teto: 5 arquivos ≤ 400 linhas no total.
  5. **Ordem: higiene ∥ agentes → coerência → fumaça.** Higiene primeiro confirmada
     (terreno limpo), mas agentes não depende dela — arquivos disjuntos, correm em
     paralelo. Coerência (RUNBOOK/TOWER-ROLES/commands/CLAUDE.md) só depois das duas.
  - Nada de `.claude/` entra no build do site: vitest exclui `.claude/**`
    (`vite.config.ts`) e `pnpm build` (tsc + vite + prerender) não lê `.claude/` —
    os merges deployam um site idêntico.
- **Tracks:**
  | # | branch | arquivos | VERIFY (resumo) | depende de |
  |---|---|---|---|---|
  | 1 | `chore-torre-higiene` | cards 002–010 (status) · `packs/**` (mv) · RUNBOOK (2 seções novas) · `commands/intake.md` | ls/grep/rename-count + typecheck/test | — |
  | 2 | `chore-torre-agentes` | os 5 `.claude/agents/*.md` | greps de limite duro + model lines + ≤400 linhas + typecheck/test | — |
  | 3 | `chore-torre-coerencia` | RUNBOOK · TOWER-ROLES · TRACK-TEMPLATE · `commands/**` · CLAUDE.md | grep "a definir"=0 + loop de caminhos do CLAUDE.md + typecheck/test | 1 e 2 mergeadas |
- **Packs:** `.claude/tower/packs/chore-torre-higiene.md` ·
  `.claude/tower/packs/chore-torre-agentes.md` ·
  `.claude/tower/packs/chore-torre-coerencia.md`
- **Sequência de merge (SERIAL, PR + gate cada):**
  1. `chore-torre-higiene` — gate: `/review` + OK do dono no critério de higiene
     (ls/grep do VERIFY reproduzidos pela sessão principal).
  2. `chore-torre-agentes` — gate: `/review` + **aprovação do dono AGENTE POR
     AGENTE** (`git show` de cada um dos 5 commits); reprovou um → refaz o commit
     antes do merge.
  3. `chore-torre-coerencia` — gate: `/review` + OK do dono.
- **VALIDAR-LIVE (fumaça, sessão principal + dono, após o merge 3):**
  1. Rodar o procedimento novo do RUNBOOK: deve calcular **017** e reservar
     (`git tag card-017 && git push origin card-017` → sucesso).
  2. Provar a trava: numa segunda cópia, `card-017` apontando para outro commit →
     push rejeitado ("already exists").
  3. `/intake` com demanda de teste (ou a próxima demanda real, se houver) passando o
     número reservado → card `017-*.md` nasce com número certo, template certo, sem
     número inventado, sem contradição prompt↔RUNBOOK no caminho.
  4. Card de teste: descartado em commit próprio (a tag fica — número queimado);
     demanda real: o card fica. Só então: card 016 → ENTREGUE, packs das 3 tracks →
     `_entregues/016-limpeza-torre/`, `tower-close.sh` nas 3 branches.

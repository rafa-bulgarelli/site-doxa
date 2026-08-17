# Manual por passos — Track A: redes primeiro e o slot da cena no cartão (task_manual_passos_fluxo)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em MAIN).

## STEP 0 (obrigatório, antes de qualquer edit)
A worktree do harness NÃO nasce na base desta track. Rode:
`git fetch origin && git checkout -B track/manual-passos-fluxo origin/feat/manual-passos`
e confirme: `ls src/manual/cenas/passos/*.tsx | wc -l` = **9** (os esqueletos do prelude)
e `grep -c cenaDoPasso src/manual/cenas/contrato.tsx` ≥ 2. `git status --porcelain`
vazio · worktree, não o repo principal. Divergiu → **PARE e reporte.**

## A VISÃO DO DONO (card 009)
No capítulo 1, "preencher os links das redes sociais da forma correta" é o PRIMEIRO
passo, não o último — e a legenda que diz "No fim do onboarding entram os três perfis"
precisa acompanhar. E cada "Passo X de Y" dos caps. 1–3 ganha uma animação própria EM
CIMA do rótulo do passo, que conta o conteúdo daquele passo (as cenas em si são de
OUTRA track — você liga o slot).

## CONTEXTO (não perca tempo redescobrindo — diagnóstico do GESTOR)

### O fato que muda tudo: caps. 1–3 não têm obrigatória nenhuma
Toda regra de `onboarding`/`voz`/`clone` é `obrigatoria = false` → em `etapasDo`
(`maquina.ts`) cada uma vira etapa `cartao`, renderizada por `TelaDoCartao` em
`src/manual/publico/Capitulo.tsx` (~linha 184) com o rótulo "Passo {numero} de
{total}". O slot da animação é AQUI — não em `Aceites.tsx`, que é o item da garantia.

### A — o slot da cena no cartão (`Capitulo.tsx`)
Espelhe o desenho que o dono já aprovou na garantia (`Aceites.tsx:38`, `MiniCena`):
```tsx
function MiniCenaDoPasso({ codigo }: { codigo: string }) {
  const Desenho = cenaDoPasso(codigo);
  if (Desenho == null) return null;
  return <div className="mb-8"><Desenho /></div>;
}
```
- `import { cenaDaSecao, cenaDoPasso } from '../cenas/contrato';` — o `cenaDoPasso`
  JÁ EXISTE (prelude), mapeando ON-0/ON-1/ON-2/VZ-1..3/CL-1..3 para esqueletos que a
  track de cenas vai substituir. Código sem cena → cartão sem ilustração, sem erro.
- Em `TelaDoCartao`: a `MiniCenaDoPasso` entra ACIMA do `<Rotulo>Passo…` — exatamente
  como `TelaDoItem` põe a `MiniCena` acima da `Posicao`.
- `TelaDoPrint`, `TelaDeIntro`, `Fotos`, `Rodape`: INTOCADOS. Print não ganha cena
  (decisão do GESTOR confirmada no card: o print é o protagonista da tela dele).

### B — redes primeiro é DADO, não código (decisão do GESTOR, não reabra)
`maquina.ts` NÃO muda. A ordem do cap. 1 nasce da ordem das regras + âncoras dos
prints, então:
1. **`supabase/manual-seed-v7.sql` (NOVO)** — copie o esqueleto do
   `manual-seed-v6.sql`: guarda de idempotência por `numero = 7`,
   `nova := manual_criar_rascunho(v6, null)`, corpo, `manual_publicar_versao` no fim.
   O corpo é UM insert em `manual_regras`, na seção `onboarding` do rascunho:
   - codigo `'ON-0'` · severidade `'normal'` · obrigatoria `false` · **ordem 0**
     (ON-1/ON-2 estão em 1/2 — o `ordem * 10` do seed v5 foi SÓ na garantia; ainda
     assim, deixe no arquivo o comentário com a query de conferência da ordem, como
     o v6 faz).
   - titulo: `Comece pelos perfis de redes sociais`
   - instrucao: `Logo no começo do onboarding, preencha os links dos seus três
     perfis — Instagram, TikTok e YouTube — e confira letra por letra antes de
     confirmar.`
   - porque: `São esses links que a rotina de publicação usa. Um caractere errado
     manda os seus vídeos para o lugar errado — ou para lugar nenhum.`
   - exemplo: `Abra o app da rede, toque no seu perfil, copie o link e cole no
     campo — sem digitar à mão.`
   (Copy do GESTOR — o dono revê no gate. Ajuste de tom permitido, fato não.)
2. **`src/manual/publico/prints.ts`** — no print `onboarding-redes`:
   `apos: 'ON-2'` → `apos: 'ON-0'`, e a legenda reescrita: sai "No fim do
   onboarding…", entra a posição real (logo no começo) mantendo o "confira letra
   por letra". O `alt` NÃO muda — ele descreve o que a tela mostra, e a tela não
   diz posição (armadilha que já custou revisão no 008).
3. Ordem resultante do cap. 1 (v7): intro · **ON-0 (Passo 1 de 3)** · print redes ·
   ON-1 (Passo 2 de 3) · scan · negócio · autoridade · ON-2 (Passo 3 de 3).
4. **Degradação é feature**: convite fixa a versão. Num convite preso à v6 (sem
   ON-0), o print re-ancorado vira "solto" e cai no FIM do capítulo — que é onde
   ele está hoje. Nada quebra; a legenda nova é fato verdadeiro nas duas posições.

### Testes (o perigo aqui é passar POR ACIDENTE)
As fixtures atuais não têm ON-0 — nelas o print re-ancorado cai no fim, e o teste
antigo de ordem (`telas.test.tsx` ~546: "intro · ON-1 · … · redes") continuaria
verde SEM provar nada. Obrigatório:
- `maquina.test.ts`: a fixture ONBOARDING (~271) ganha a regra ON-0 (ordem menor);
  asserte a ordem nova (ON-0 → redes → ON-1 → scan → negócio → autoridade → ON-2).
  NOVO teste de degradação: fixture SEM ON-0 (o mundo v6) → redes no fim, como hoje.
- `telas.test.tsx`: fixture do onboarding (~133) ganha ON-0; a sequência ~546 vira a
  nova; asserte que a tela do cartão contém `<svg` (o esqueleto do prelude já
  desenha um — é a prova de que o slot está ligado) e que a legenda do print de
  redes não contém "No fim do onboarding".
- `previa.test.tsx` (admin) SÓ se quebrar — ajuste de índice, sem afrouxar asserção.

### Armadilhas do repo (já morderam)
**pnpm**, não npm · `maquina.ts`/`Aceites.tsx` INTOCÁVEIS (a reordenação é 100%
dados; se achar que precisa tocar → PARE e reporte) · seeds v1–v6, `manual.sql` e
`schema.sql` intocáveis · **NÃO aplique seed no banco** (o arquivo é o entregável;
quem aplica é a sessão principal) · `.focus(` só com `{ preventScroll: true }` ·
`tailwind.config.js`/`index.css` intocáveis · classe nunca montada por template
string · manual é PT-only: nada passa pelo i18n do site.

### Estilo OBRIGATÓRIO
`.claude/STYLE-GOOGLE-TS.md`. Comentários em PT. Sem `any`, sem `@ts-ignore`, sem
dependência nova. Atualize os comentários de bloco que ficarem mentirosos (o de
`prints.ts` sobre a âncora do redes, o fixture doc dos testes).

## A TASK
1. `Capitulo.tsx`: `MiniCenaDoPasso` acima do rótulo em `TelaDoCartao`.
2. `prints.ts`: re-âncora `ON-0` + legenda nova do redes.
3. `supabase/manual-seed-v7.sql`: a regra ON-0, idempotente, publicando v7.
4. Testes: ordem nova com ON-0, degradação sem ON-0, slot ligado.

## SCOPE
- src/manual/publico/Capitulo.tsx
- src/manual/publico/prints.ts
- src/manual/publico/maquina.test.ts
- src/manual/publico/telas.test.tsx
- src/manual/admin/previa.test.tsx
- supabase/manual-seed-v7.sql

## DEPENDS ON
Prelude em `feat/manual-passos` (contrato `cenaDoPasso` + 9 esqueletos — STEP 0
confirma). A track de cenas (`track/manual-passos-cenas`) roda em paralelo SÓ em
`cenas/passos/**` — integração no merge serial, não aqui.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde — sem falha NOVA vs baseline do main (**360/360**), novos inclusos
- `pnpm build` ok
- `git diff --name-only origin/feat/manual-passos...HEAD` — todo arquivo pertence ao
  SCOPE, e estão presentes: Capitulo.tsx, prints.ts, maquina.test.ts, telas.test.tsx,
  supabase/manual-seed-v7.sql
- `grep -c "apos: 'ON-0'" src/manual/publico/prints.ts` = 1 ·
  `grep -n "No fim do onboarding" src/manual/publico/prints.ts` = vazio
- `grep -c "cenaDoPasso" src/manual/publico/Capitulo.tsx` ≥ 2
- `grep -n "numero = 7" supabase/manual-seed-v7.sql` presente ·
  `grep -c "'ON-0'" supabase/manual-seed-v7.sql` ≥ 1 ·
  `grep -ic "insert into public.manual_regras" supabase/manual-seed-v7.sql` = 1
- `git diff origin/feat/manual-passos...HEAD -- src/manual/publico/maquina.ts src/manual/publico/Aceites.tsx` = vazio
- `git diff origin/feat/manual-passos...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff origin/feat/manual-passos...HEAD | grep -n "\.focus("` = vazio

## COMMIT + PUSH
`feat(manual): redes sociais abre o cap 1 (seed v7) e o cartao ganha o slot da cena`
→ `git push -u origin track/manual-passos-fluxo`. **NÃO mergeie. NÃO aplique seed.**
Report: sumário + verdict READY/NOT READY + VERIFY colado + a ordem ANTES → DEPOIS
das telas do cap. 1 + a legenda ANTES → DEPOIS do print de redes (é com isso que o
dono decide o gate). Merge/deploy/seed/LIVE são do GESTOR.

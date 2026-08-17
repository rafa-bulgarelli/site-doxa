# Manual — polimento das animações (card 010) — Track C: ajuste fino dos itens da garantia (task_polimento_itens_ajuste)

Você é o EXECUTOR, numa worktree isolada criada pelo harness.

## STEP 0 (obrigatório, antes de qualquer edit)
A worktree do harness NÃO nasce na base desta track. Rode:
`git fetch origin && git checkout -B track/polimento-itens-ajuste origin/feat/manual-polimento`
e confirme: `git status --porcelain` vazio · worktree, não o repo principal ·
`ls src/manual/cenas/redes.tsx` **existe** (prelude — sem ele, PARE e reporte).

## A VISÃO DO DONO (card 010 — veredito cena a cena)
Cinco mini-cenas de item aprovadas NO CONCEITO, cada uma com ajuste dirigido:
- **№8 `itens/Meta.tsx`** ("90 dias / 0" contador): manter; "mais smooth +
  ícones reais TikTok/YouTube/Instagram".
- **№9 `itens/Sessenta.tsx`** (vídeo replicado em 3): mesmos ajustes do №8.
- **№11 `itens/Semana.tsx`** (S-T-Q-Q-S-S-D): "animação excelente, mas a
  NARRATIVA precisa ser" outra — critério de aceite do card, literal:
  **"sequência visível = seg✓ ter✓ qua✗ qui✓ sex✓, sáb/dom sem vídeo"**
  (fim de semana não tem vídeo da DOXA, só dias úteis).
- **№13 `itens/SemImpulso.tsx`**: "ideia boa, simples demais; o 'pause com
  flechinha' não faz sentido — repensar o símbolo com mais detalhe."
- **№15 `itens/PergunteAntes.tsx`**: "ideia excelente; alinhar ao centro,
  espaçar o ícone da conversa, hierarquia."

## A DOUTRINA DO DONO (o "porquê" de cada traço — aplicar só o "o quê" produz outra reprovação)
1. **Equilíbrio**: "não tão parecendo festa, mas também não tão discreta.
   Elegante, chamando atenção na medida certa."
2. **Respiro**: elementos espaçados, "respirando, conversando entre si". Círculo
   apertado em volta de ícone ("enforcando", "afogado") é defeito NOMEADO — 2x.
3. **Hierarquia** visual clara — traços e ícones que "ornam" entre si.
4. **Cor com significado**: verde = certo, vermelho = errado. Colorido sem
   função "não é bonito, não é elegante". "Tudo colorido" = "horrível".
5. **Ícones reais** das plataformas onde a regra fala de redes.
6. **Ritmo**: nem lenta ("a pessoa não vai esperar para entender"), smooth,
   fluida, com ação (fade-in, entradas).
7. **Narrativa fiel à regra**, com começo-meio-fim ("nem pé, nem cabeça, nem
   meio, nem final" é o xingamento máximo).
8. **Réguas nota-10** (olhe ANTES de desenhar, e NÃO toque):
   `src/manual/cenas/CenaVoz.tsx` (№3) e `src/manual/cenas/itens/Relogio.tsx`
   (№10 — está NO SEU DIRETÓRIO; não encoste).

## CONTEXTO (não perca tempo redescobrindo)
- **№8/№9 — ícones reais**: `Meta.tsx` e `Sessenta.tsx` usam `Sinal`/`TRES_REDES`
  de `itens/comuns.tsx` (glifo genérico em círculo — o defeito). Troque pelos
  `IconeDaRede` de `src/manual/cenas/redes.tsx` (prelude): `{ rede, x, y,
  tamanho, cor, acesa }`, sem círculo em volta, espaçados. `itens/comuns.tsx`
  fica INTOCADO (o `Sinal` morre depois, num commit da sessão principal).
- **⚠️ TRAP de teste em №9**: `cenas.test.tsx` ("a cena dos sessenta") cobra:
  o único `<text>` do quadro final é `60`; `20` não aparece em fase nenhuma;
  ≥4 preenchimentos `fill="${ARCO[0]}"` (o vídeo + cópias). Mantenha o cartão e
  as cópias em `ARCO[0]` e não escreva número novo — se esse teste quebrar, a
  SUA mudança está errada, não o teste.
- **№11 — a narrativa nova substitui a atual**: hoje `Semana.tsx` conta "seu
  vídeo barrado na quarta desliza pro sábado" — o dono CORTOU essa história.
  A nova: os dias úteis vão sendo cumpridos um a um (seg✓ ter✓), a quarta fica
  SEM vídeo e leva o ✗ vermelho (o dia perdido), a rotina retoma (qui✓ sex✓), e
  sáb/dom ficam SEM cartão de vídeo nenhum — vazios/apagados, folga de verdade.
  Quadro final: a semana inteira legível com o ✗ da quarta visível. Reaproveite
  a qualidade de movimento que o dono elogiou ("animação excelente").
- **№13 — o símbolo repensado (direção do gestor, liberdade dentro dela)**: a
  "campanha que já roda" vira um mini-cartão de anúncio com barra de progresso
  CORRENDO; pausar = a barra PARA e o pause acende verde, e só então o primeiro
  vídeo entra. Some a flechinha solta. O botão de impulsionar cortado em
  vermelho (que funciona) fica.
- **№15 — composição, não conceito**: centralizar o conjunto no palco, espaçar
  o balão "?" do selo da conversa, hierarquizar os dois caminhos
  (perguntou→visto / fez sem perguntar→escudo rachado). A história fica.
- Peças: `pecas.tsx`, `luz.tsx`, `tempo.ts` (`useRoteiro` dá fases +
  `prefers-reduced-motion` com quadro final parado), `itens/comuns.tsx`
  (`MiniPalco`, `Cartao`, `Selo`) — reuse, não edite.
- `cenas.test.tsx` cobre todas estas cenas (render, `aria-hidden`, tintas
  definidas, `data-fase > 0` parado). NÃO é seu.

### Armadilhas do repo (já morderam — os comentários das cenas documentam cada uma)
**pnpm**, não npm · nenhuma dependência nova · framer + SVG: `attrY` (não `y`);
`translate` no grupo de FORA da animação; raio em vez de `scale`; `pathLength`
× `strokeDasharray` brigam · `initial` tem de olhar o estado quando `parado`
(vide comentário em `Sessenta.tsx` → `Copias`) · ids de gradiente únicos por
instância (o palco cuida — nada de `<defs>` com id fixo) · opacidade Tailwind
fora da escala de 5 só `[0.78]` · nada de `.focus(` · classes nunca por
template string · `tailwind.config.js` e `index.css` INTOCÁVEIS.

### Estilo OBRIGATÓRIO
`.claude/STYLE-GOOGLE-TS.md`. Comentários em PT, cada cena abre narrando o item
e o arco (atualize os blocos — eles são a memória das rodadas do dono). Sem
`any`, sem `@ts-ignore`. Arquivos ≤800 linhas, funções ≤50.

## A TASK
1. `Meta.tsx` e `Sessenta.tsx`: `IconeDaRede` no lugar de `Sinal`, transições
   mais smooth (doutrina 6), respeitando a trap de teste do №9.
2. `Semana.tsx`: a narrativa nova (aceite literal acima).
3. `SemImpulso.tsx`: o símbolo repensado (direção acima).
4. `PergunteAntes.tsx`: centro, respiro, hierarquia.
5. **Verificação VISUAL obrigatória**: renderize cada cena por SSR nas
   fases-chave (primeira, a da quebra, a final — mock de `useRoteiro` em script
   descartável força a fase) e OLHE. Salve os quadros no scratchpad e liste os
   caminhos no report.

## SCOPE
- src/manual/cenas/itens/Meta.tsx
- src/manual/cenas/itens/Sessenta.tsx
- src/manual/cenas/itens/Semana.tsx
- src/manual/cenas/itens/SemImpulso.tsx
- src/manual/cenas/itens/PergunteAntes.tsx

(`itens/Relogio.tsx` é nota-10: INTOCÁVEL. `itens/Intacto.tsx` e
`itens/SemCompra.tsx` são de outra track. `itens/comuns.tsx`, `pecas.tsx`,
`luz.tsx`, `tempo.ts`, `contrato.tsx`, `cenas.test.tsx`, `redes.tsx`,
`Cena*.tsx`, `passos/**`: importar pode, editar não.)

## DEPENDS ON
Prelude `track/polimento-prelude` mergeado em `feat/manual-polimento`
(`redes.tsx` presente — STEP 0 confirma).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde — sem falha NOVA vs a base `origin/feat/manual-polimento`
  (baseline main 364/364 + testes do prelude); os testes da "cena dos sessenta"
  passam INALTERADOS
- `pnpm build` ok
- `git diff --name-only origin/feat/manual-polimento...HEAD | sort` = exatamente
  os 5 arquivos do SCOPE
- `git diff --name-only origin/feat/manual-polimento...HEAD | grep -E "CenaVoz|itens/Relogio"`
  = vazio (as nota-10 intactas)
- `grep -n "Sinal" src/manual/cenas/itens/Meta.tsx src/manual/cenas/itens/Sessenta.tsx`
  = vazio (ícone genérico trocado pelo real)
- `git diff origin/feat/manual-polimento...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff origin/feat/manual-polimento...HEAD | grep -n "\.focus("` = vazio

## COMMIT + PUSH
`feat(manual): itens da garantia na doutrina — icones reais, semana com a historia certa`
→ `git push -u origin track/polimento-itens-ajuste`. **NÃO mergeie.**
Report: sumário + verdict READY/NOT READY + VERIFY colado + para CADA cena: o
ajuste feito e o porquê na língua da doutrina + caminhos dos quadros
renderizados que você OLHOU (o №11 tem de mostrar seg✓ ter✓ qua✗ qui✓ sex✓ no
quadro final).

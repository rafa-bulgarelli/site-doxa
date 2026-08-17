# Manual — polimento das animações (card 010) — Track A: as cenas de capítulo (task_polimento_capitulos)

Você é o EXECUTOR, numa worktree isolada criada pelo harness.

## STEP 0 (obrigatório, antes de qualquer edit)
A worktree do harness NÃO nasce na base desta track. Rode:
`git fetch origin && git checkout -B track/polimento-capitulos origin/feat/manual-polimento`
e confirme: `git status --porcelain` vazio · worktree, não o repo principal ·
`ls src/manual/cenas/redes.tsx` **existe** (é o prelude — sem ele, PARE e
reporte).

## A VISÃO DO DONO (card 010 — review animação a animação, 2026-08-17)
O dono reviu TODAS as animações do manual na prévia e deu veredito uma a uma.
Nesta track estão três cenas de capítulo:
- **№1 `CenaOnboarding`** — aprovada com UM ajuste: "remover as partículas
  coloridas/gradiente que sobem quando as linhas completam, ANTES do check —
  'não é cor nenhuma… não é elegante'. A partícula do check VERDE fica. Só isso."
- **№6 `CenaClone`** — "MUITO LENTA — mais ação: fade-in dos dois clones 'sendo
  subidos', mais viva."
- **№7 `CenaGarantia`** — "quadrados verdes sem significado, ícones afogados em
  círculo cinza, '24' colado nos quadrados. Espaçar, hierarquizar, ícones reais,
  mais smooth."

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
   `src/manual/cenas/CenaVoz.tsx` (№3, "impecável") e
   `src/manual/cenas/itens/Relogio.tsx` (№10, "sensacional").

## CONTEXTO (não perca tempo redescobrindo)
- **№1 — o corte cirúrgico**: em `CenaOnboarding.tsx`, as partículas condenadas
  são o `<Faiscas ativo={fase === COMPLETA} …>` dentro de `Campo` (hoje linhas
  ~150–157, cores default do arco). As que FICAM são as do `Fecho`
  (`cores={[TINTA.protege]}` — verdes). Não "melhore" mais nada: o dono disse
  "só isso", e mexer no aprovado é reabrir gate ganho.
- **№6 — lenta por decisão documentada**: o comentário de `CenaClone.tsx` conta
  que a v1 foi reprovada por excesso de movimento e a v2 ficou lenta de
  propósito (`FASES = [1800, 2400, 1800, 4200]`). O dono agora pede o MEIO:
  encurte fases, dê entrada viva aos dois retratos (fade-in/subida "sendo
  subidos") e ao clone — sem voltar à festa da v1. Atualize o comentário do
  arquivo: ele narra a história das reprovações, e esta é a terceira rodada.
- **№7 — três defeitos nomeados** em `CenaGarantia.tsx`:
  (a) os quadrados dos dias cumpridos em `VERDE_FRACO` + Brilho verde = "quadrado
  verde sem significado" — o VISTO verde já diz "cumprido"; hierarquize para o
  verde julgar, não pintar caixa;
  (b) o componente local `Redes` desenha glifos genéricos DENTRO de `circle`
  r=21 — troque pelos `IconeDaRede` do prelude (`src/manual/cenas/redes.tsx`),
  SEM círculo em volta, espaçados;
  (c) `Vinte4Horas` cola o "24h" nos quadrados — descole, dê respiro.
  Mantenha o arco narrativo (semana → cumprida → o que quebra → conserto), que o
  dono não reprovou.
- Peças: `pecas.tsx` (`Palco`, `Painel`, `Legenda`, `Marca`, `TINTA`, `TRACO`),
  `luz.tsx` (`Brilho`, `Faiscas`, `TracoDeLuz`, `ARCO`, `CERTO`, `QUEBRA`,
  `useTintas`), `tempo.ts` (`useRoteiro`, `tempo`, `EASE`) — reuse, não
  reinvente, não edite.
- `cenas.test.tsx` cobre estas cenas (render, `aria-hidden`, tintas definidas,
  `data-fase > 0` no reduced-motion). Ele NÃO é seu: se um teste quebrar, a sua
  mudança está errada, não o teste.

### Armadilhas do repo (já morderam — os comentários das cenas documentam cada uma)
**pnpm**, não npm · nenhuma dependência nova · framer + SVG: `attrY` (não `y`)
para atributo; `translate` no grupo de FORA da animação; raio em vez de `scale`;
`pathLength` e `strokeDasharray` brigam pelo mesmo atributo · ids de
gradiente/filtro únicos por instância (o `Palco`/`useTintas` já cuidam — não
crie `<defs>` com id fixo) · `prefers-reduced-motion`: toda mudança de fase tem
de manter o quadro FINAL parado ensinando · opacidade Tailwind fora da escala de
5 só `[0.78]` · nada de `.focus(` · classes nunca por template string ·
`tailwind.config.js` e `index.css` INTOCÁVEIS.

### Estilo OBRIGATÓRIO
`.claude/STYLE-GOOGLE-TS.md`. Comentários em PT, cada cena abre narrando o item
e o arco. Sem `any`, sem `@ts-ignore`. Arquivos ≤800 linhas, funções ≤50.

## A TASK
1. `CenaOnboarding.tsx`: remover SÓ as faíscas coloridas pré-check (as verdes do
   `Fecho` ficam).
2. `CenaClone.tsx`: ritmo mais vivo — fases mais curtas, fade-in dos dois
   retratos e do clone, equilíbrio doutrina 1/6.
3. `CenaGarantia.tsx`: hierarquizar o verde (o visto julga, a caixa não grita),
   `IconeDaRede` reais e espaçados no lugar dos círculos genéricos, "24h" com
   respiro, transições mais smooth.
4. **Verificação VISUAL obrigatória**: renderize cada cena por SSR nas
   fases-chave (primeira, a da quebra, a final — mock de `useRoteiro` num script
   descartável força a fase) e OLHE cada quadro. Salve os quadros no scratchpad
   e liste os caminhos no report: o gate visual é do dono, o seu olho é o
   primeiro filtro.

## SCOPE
- src/manual/cenas/CenaOnboarding.tsx
- src/manual/cenas/CenaClone.tsx
- src/manual/cenas/CenaGarantia.tsx

(`CenaVoz.tsx` e `itens/Relogio.tsx` são as nota-10: INTOCÁVEIS. `pecas.tsx`,
`luz.tsx`, `tempo.ts`, `contrato.tsx`, `itens/**`, `passos/**`,
`cenas.test.tsx`, `redes.tsx`: de outras tracks ou do prelude — importar pode,
editar não.)

## DEPENDS ON
Prelude `track/polimento-prelude` mergeado em `feat/manual-polimento`
(`redes.tsx` presente — STEP 0 confirma).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde — sem falha NOVA vs a base `origin/feat/manual-polimento`
  (baseline main 364/364 + testes do prelude)
- `pnpm build` ok
- `git diff --name-only origin/feat/manual-polimento...HEAD | sort` = exatamente
  os 3 arquivos do SCOPE
- `git diff --name-only origin/feat/manual-polimento...HEAD | grep -E "CenaVoz|itens/Relogio"`
  = vazio (as nota-10 intactas)
- `grep -c "Faiscas" src/manual/cenas/CenaOnboarding.tsx` → as ocorrências
  restantes são SÓ as verdes do Fecho (`cores={[TINTA.protege]}`) — cole o grep
- `grep -n "Sinal\|circle" src/manual/cenas/CenaGarantia.tsx` — nenhum ícone de
  rede dentro de círculo (cole a saída e justifique cada `circle` restante)
- `git diff origin/feat/manual-polimento...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff origin/feat/manual-polimento...HEAD | grep -n "\.focus("` = vazio

## COMMIT + PUSH
`feat(manual): capitulos na doutrina — onboarding sem confete, clone vivo, garantia respirando`
→ `git push -u origin track/polimento-capitulos`. **NÃO mergeie.**
Report: sumário + verdict READY/NOT READY + VERIFY colado + para CADA cena: o
que mudou e por quê (na língua da doutrina), e os caminhos dos quadros
renderizados que você OLHOU.

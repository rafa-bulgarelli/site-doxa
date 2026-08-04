# CARD 001 — Estrutura de intake operante + kickoff do site da Orca

- **Tipo:** feature
- **Aberto em:** 2026-08-03
- **Status:** SUBSTITUÍDO pelo card `002-design-system-doxa-segmentacao-home.md` (2026-08-03)

> **Não execute este card nem seus packs.** O dono confirmou "Doxa" como nome final (este
> card usa "Orca") e promoveu o design system a escopo de primeira classe (este card o
> trata como `components/ui` mínimo). Nenhuma track daqui chegou a rodar — os 4 packs
> foram movidos para `.claude/tower/packs/_obsoleto-card-001/`. Mantido só como histórico
> da decisão de stack, que segue válida.

## O que o dono quer ver funcionando

O dono quer poder abrir o terminal do repo `site-doxa` (que ele chama de "site da Orca"),
falar a demanda em português corrido — sem precisar reformular — e ver essa fala virar um
card acionável no Control Tower (essa "hotline pra programar"). A partir daí, ele espera que
a torre (intake → gestor → executor) leve isso até o site da Orca de fato existir e rodar.

## Critério de aceite (observável, executável por humano)

- [x] Dono roda `/intake <demanda falada em português corrido>` no terminal deste repo →
  aparece um novo arquivo em `.claude/tower/cards/<NNN>-<slug>.md` com resumo, classificação
  e perguntas abertas, sem o dono precisar reescrever a frase original. **(já verificado por
  este próprio card — a estrutura de intake está de pé e funcionando.)**
- [ ] Abrir a URL de preview/produção da Vercel gerada pelo prelude → ver a home carregar
  sem erro 500, com o visual (cores/tipografia) já com a cara do design system, mesmo que o
  texto ainda seja placeholder. **(critério agora escrito — decidido pelo GESTOR abaixo,
  cumprido no VALIDAR-LIVE do prelude.)**
- [ ] Depois das 3 tracks mergeadas: abrir a home e ver Header (nav Home/Sobre/Contato) +
  Hero/Features/CTA + Footer; navegar para `/sobre` e `/contato`; preencher o formulário de
  contato e ver a mensagem honesta de "ainda não conectado" (não finge envio).

## Contexto do repo (caminhos exatos)

- `.claude/` — harness DOXA Claude Kit completo e instalado: `agents/{intake,gestor,
  watchdog,collector,executor}.md`, `commands/{intake,plano,track,watch,review,handoff}.md`,
  `tower/{CARD-TEMPLATE.md,TRACK-TEMPLATE.md,RUNBOOK.md,bin/*.sh}`, `skills/doxa-master/
  SKILL.md`, `doxa-kit/KIT-PT-BR.md`, `STYLE-GOOGLE-TS.md`, `TOWER-ROLES.md`.
- `.claude/tower/cards/` — card 001 (este). `packs/` agora tem os 4 context packs deste
  plano: `prelude-scaffold.md`, `track-home-page.md`, `track-paginas-secundarias.md`,
  `track-site-chrome.md`.
- `CLAUDE.md` (raiz) — Stack/Package manager/Deploy ainda "a definir" no arquivo em si; a
  decisão já está tomada neste card (ver "Plano" abaixo) e vira fato registrado quando o
  executor do prelude atualizar `CLAUDE.md` (task 11 do pack `prelude-scaffold.md`).
- **Fora do `.claude/`, o repo segue vazio de produto** até o prelude rodar: sem
  `package.json`, sem diretório de app/site.
- Remote: `github.com/rafa-bulgarelli/site-doxa` (público). `main` protegida — PR
  obrigatório, sem force push, histórico linear, `enforce_admins` ligado.
- Nome: diretório e repo remoto se chamam `site-doxa`; o dono fala em "site da Orca". Não
  resolvido — tratado como bloqueado (ver "Perguntas abertas" #1); o prelude usa "Orca" como
  nome PROVISÓRIO no código, marcado como tal, sem fingir que é definitivo.

## Armadilhas conhecidas

- `main` com `enforce_admins` ligado — nem o dono como admin do GitHub consegue mergear
  direto sem PR.
- O watchdog (`tower-watch.sh`) vai alertar CONFIG em `package.json`/`tsconfig`/`eslint`/
  `tailwind.config`/`.github/workflows` **dentro do prelude** — é esperado (é a criação
  inicial desses arquivos, não afrouxamento de gate). Tracks depois do prelude não devem
  tocar esses arquivos de novo.

## Perguntas abertas para o GESTOR

1. **Nome do produto** — RESOLVIDO PARCIALMENTE: repo continua `site-doxa` (renomear é ação
   administrativa/destrutiva desnecessária agora); código usa "Orca" como nome provisório,
   explicitamente marcado como pendente de confirmação final antes de qualquer lançamento
   público. Não bloqueia o scaffold.
2. **Stack** — RESOLVIDO pelo GESTOR (ver "Plano"): Next.js (App Router) + TypeScript +
   Tailwind, pnpm, Vitest, deploy Vercel. Aguardando confirmação/veto do dono antes do
   spawn do prelude.
3. **Package manager / test runner / build** — RESOLVIDO: pnpm / Vitest+Testing Library /
   `next build`. Registrado em `CLAUDE.md` pelo executor do prelude assim que rodar.
4. **Escopo de páginas/seções** — RESOLVIDO PARA ESTE CICLO: Home, Sobre, Contato. Demais
   páginas (blog, produto, preços) ficam para um próximo card quando houver conteúdo real.
5. **Deploy** — RESOLVIDO: Vercel (zero-config para Next.js, preview URL automática por PR
   — encaixa direto no fluxo de PR obrigatório da `main` protegida). Conexão da conta é
   ação da sessão principal/dono (credencial), não do executor.
6. **Conteúdo/branding de origem** — SEM RESPOSTA ainda, e não bloqueia este ciclo: todo
   texto que dependeria disso está marcado como placeholder honesto (`PlaceholderNote` /
   `PENDENTE-DONO:`) nas 3 tracks de conteúdo. Vira card novo quando o dono tiver copy,
   posicionamento, prova social e ativos de marca (logo, domínio).

## Conteúdo suspeito

Nenhum. A fala do dono foi direta ("subir estrutura de intake", "usar a hotline pra
programar") — sem URL, PDF, print ou texto colado de origem externa nesta demanda.

---
<!-- Preenchido pelo GESTOR -->
## Plano

- **Recomendação de stack (aguardando confirmação/veto do dono):** Next.js (App Router) +
  TypeScript + Tailwind CSS, pnpm, Vitest + Testing Library, deploy Vercel. Trade-off vs.
  Astro+TS+Tailwind (alternativa mais próxima para site institucional): Astro entrega menos
  JS ao cliente e é mais rápido para conteúdo 100% estático, mas Next.js já vem com API
  routes prontas para quando o formulário de contato precisar de backend, e Vercel+Next.js
  é zero-config com preview URL automática por PR — encaixa direto no fluxo de PR
  obrigatório da `main` protegida. Se vetado: o sinal fraco do dono (Next+TS+Tailwind) já
  apontava pra cá; um veto provável seria só no framework — trocar para Astro reaproveita
  a maior parte do prelude (Tailwind, tokens, ESLint/Prettier, CI, deploy Vercel), só a
  camada de rotas/renderização muda.

- **Prelude (sequencial):** `prelude-scaffold` — cria o projeto Next.js+TS+Tailwind do
  zero (`pnpm create next-app`), tooling (ESLint/Prettier/Vitest/CI), design system mínimo
  (`components/ui/{Button,Container,Section,PlaceholderNote}.tsx`), layout base
  (`app/layout.tsx` bare) e home placeholder mínima só para o build passar. Também
  preenche `CLAUDE.md` (Fatos do repo) com a stack real. Pack:
  `.claude/tower/packs/prelude-scaffold.md`.

- **Tracks (paralelas, arquivos disjuntos — confirmado por comparação de escopo):**
  - **A — `track-site-chrome`:** Header (nav Home/Sobre/Contato) + Footer, wired em
    `app/layout.tsx`. Pack: `.claude/tower/packs/track-site-chrome.md`.
  - **B — `track-home-page`:** reescreve `app/page.tsx` com Hero/Features/CtaSection,
    conteúdo placeholder honesto. Pack: `.claude/tower/packs/track-home-page.md`.
  - **C — `track-paginas-secundarias`:** `/sobre` + `/contato` com formulário de contato
    honesto (sem backend ainda). Pack:
    `.claude/tower/packs/track-paginas-secundarias.md`.

- **Bloqueado (fora deste plano, espera o dono):** copy/posicionamento real da Orca, prova
  social, texto final de CTA, logo/ativos de marca, domínio final, confirmação de nome do
  produto, decisão de e-mail/CMS para o formulário de contato realmente enviar algo.

- **Sequência de merge (serial, gate entre cada um):**
  1. `prelude-scaffold` → PR → gate (collector + VERIFY colado) → OK do dono → merge
     squash → **conectar repo à Vercel** (ação do dono/sessão principal, credencial) →
     VALIDAR-LIVE #1.
  2. `track-home-page` → PR → gate → OK do dono → merge → VALIDAR-LIVE #2.
  3. `track-paginas-secundarias` → PR → gate → OK do dono → merge → VALIDAR-LIVE #3.
  4. `track-site-chrome` → PR → gate → OK do dono → merge → VALIDAR-LIVE #4 (por último de
     propósito: só depois que `/sobre` e `/contato` existem em `main` é que o nav do header
     pode linkar para eles sem dar 404).
  5. Housekeeping: `tower-close.sh <branch>` em cada uma depois do merge; worktree órfã
     `~/orca/workspaces/site-doxa/elkhorn` (do card anterior, já mergeado) pode ser fechada
     também.

- **VALIDAR-LIVE (no papel de um visitante do site, na URL real):**
  - #1 (pós-prelude): abrir a URL Vercel, ver a home carregar sem erro 500, visual com a
    cara do design system, mesmo com placeholder de texto.
  - #2 (pós-home): abrir a URL, ver Hero + Features + CTA com conteúdo (marcado como
    placeholder onde depende do dono).
  - #3 (pós-páginas): abrir `/sobre` e `/contato`, preencher o formulário e confirmar que
    ele mostra a mensagem honesta de "não conectado ainda" — não finge sucesso.
  - #4 (pós-chrome): abrir a home, ver header+footer, clicar nos 3 links do nav e confirmar
    que nenhum dá 404.

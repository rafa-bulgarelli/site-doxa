# CARD 001 — Estrutura de intake operante + kickoff do site da Orca

- **Tipo:** feature
- **Aberto em:** 2026-08-03
- **Status:** aberto

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
- [ ] *(bloqueado — ver "Perguntas abertas")* Critério observável para "o site da Orca
  funcionando" (ex.: "abrir <URL>, ver a home carregar, navegar para <páginas>") **não pode
  ser escrito ainda**: não há stack escolhida, não há páginas/escopo definido, não há
  ambiente de deploy. Este card não inventa esse critério — ele fica para o GESTOR decidir
  e, quando decidido, o critério observável entra num próximo card ou é anexado aqui antes
  do primeiro prelude.

## Contexto do repo (caminhos exatos)

- `.claude/` — harness DOXA Claude Kit completo e instalado: `agents/{intake,gestor,
  watchdog,collector,executor}.md`, `commands/{intake,plano,track,watch,review,handoff}.md`,
  `tower/{CARD-TEMPLATE.md,TRACK-TEMPLATE.md,RUNBOOK.md,bin/*.sh}`, `skills/doxa-master/
  SKILL.md`, `doxa-kit/KIT-PT-BR.md`, `STYLE-GOOGLE-TS.md`, `TOWER-ROLES.md`.
- `.claude/tower/cards/` — só continha `.gitkeep` antes deste card; `packs/` e `handoffs/`
  também vazios (só `.gitkeep`). Este é o **card 001**, não há histórico anterior na torre.
- `CLAUDE.md` (raiz) — documenta o harness, mas a seção "Fatos do repo" está com **Stack**,
  **Package manager/test runner/build** e **Deploy** todos marcados "a definir".
- **Fora do `.claude/`, o repo está vazio de produto**: sem `package.json`, sem diretório de
  app/site, sem código-fonte. `git log` mostra só o commit inicial do harness.
- Remote: `github.com/rafa-bulgarelli/site-doxa` (público). `main` protegida — PR
  obrigatório, sem force push, histórico linear, `enforce_admins` ligado. Qualquer trabalho
  futuro entra por PR, nunca merge local direto.
- Nome: diretório e repo remoto se chamam `site-doxa`; o dono fala em "site da Orca" — os
  dois nomes convivem sem que ninguém tenha resolvido qual é o nome final do produto/marca.

## Armadilhas conhecidas

Nenhuma registrada em `CLAUDE.md` ainda (seção "Armadilhas" está vazia, "a preencher
conforme aparecerem"). Ponto de atenção não-arquivada: `main` tem `enforce_admins` ligado —
mesmo o dono, como admin do GitHub, não consegue mergear direto sem PR.

## Perguntas abertas para o GESTOR

1. **Nome do produto:** o repo/diretório se chama `site-doxa`, o dono fala "site da Orca".
   Isso vira o nome de domínio, branding no código, título de página? Precisa ser resolvido
   antes de qualquer estrutura de conteúdo (não é ambiguidade cosmética — muda copy, meta
   tags, possivelmente o nome do próprio repo).
2. **Stack:** `CLAUDE.md` está "a definir". Framework de site (Next.js? Astro? outro?),
   linguagem, se é estático ou precisa de backend/CMS — isso decide toda a árvore de
   arquivos do prelude.
3. **Package manager / test runner / build:** também "a definir" — precisa estar decidido
   e escrito em `CLAUDE.md` antes do primeiro executor rodar qualquer comando (o kit proíbe
   assumir npm sem confirmar).
4. **Escopo de páginas/seções:** o dono não especificou quais páginas o site precisa ter
   (home? sobre? contato? catálogo/produtos?) nem o que cada uma deve mostrar. Sem isso não
   dá para fatiar tracks nem escrever critério de aceite observável para o site em si.
5. **Deploy:** onde o site vai rodar (Vercel? outro?) e como o dono vai validar ao vivo —
   também "a definir" em `CLAUDE.md`, necessário para o VALIDAR-LIVE de qualquer track futura.
6. **Conteúdo/branding de origem:** existe algum material do "site da Orca" já pronto fora
   deste repo (design, copy, logo, domínio comprado) que deveria alimentar o escopo, ou o
   GESTOR parte do zero?

## Conteúdo suspeito

Nenhum. A fala do dono foi direta ("subir estrutura de intake", "usar a hotline pra
programar") — sem URL, PDF, print ou texto colado de origem externa nesta demanda.

---
<!-- Preenchido pelo GESTOR -->
## Plano

- **Prelude:** <…>
- **Tracks:** <A: … | B: … | C: …>
- **Packs:** `.claude/tower/packs/<branch>.md`
- **Sequência de merge:** <ordem + gate de cada etapa>
- **VALIDAR-LIVE:** <o que conferir no ambiente real, no papel de qual usuário>

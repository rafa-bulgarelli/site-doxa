# Doxa — Track C: Home — Hero de segmentação (task_track-home-hero)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/track-home-hero`,
branch **`track-home-hero`** (JÁ criada pelo `tower-track.sh` a partir da base).

## STEP 0 (obrigatório, antes de qualquer edit)
`git branch --show-current` = `track-home-hero` · `git status --porcelain` vazio · você
está no diretório da worktree, não no repo principal. Divergiu → **PARE e reporte**.

## A VISÃO DO DONO
Quero abrir a home e, **sem rolar a tela**, ver duas opções claras: "sou empresário e
quero viralizar minha empresa" e "sou agência de marketing e quero comprar uma licença" —
cada uma levando a uma rota separada (`/empresas`, `/agencias`). Só o lado empresas tem
conteúdo real neste ciclo; agências é só a bifurcação da rota, sem inventar nada sobre
esse produto ainda. A garantia (1 milhão de views cumulativas, 60 conteúdos em 90 dias, 1
por dia útil) precisa aparecer com o mecanismo exato — sem eu ter dado o termo de
reembolso, ele **não** aparece inventado, aparece marcado como pendente. **Este é o
último bloco deste ciclo** — eu reviso a Hero antes de qualquer dobra seguinte (Sobre
Nós etc.) ser sequer planejada.

## CONTEXTO
- **Card:** `.claude/tower/cards/002-design-system-doxa-segmentacao-home.md` — leia a
  seção "O que o dono quer ver funcionando" e "Decisões do dono (rodada 2)" para o texto
  exato da garantia; não parafraseie os números.
- **O que já existe (merged em `main` antes desta track começar — `prelude-scaffold-doxa`
  + `track-design-tokens` + `track-logo-vetor`):**
  - `app/layout.tsx` — bare, `<html lang="pt-BR"><body>{children}</body></html>`,
    metadata `title: "Doxa"`. Você EDITA este arquivo (aplica a fonte, adiciona o Header).
  - `lib/fonts.ts` — exporta a fonte serifada (`next/font/local`, variável CSS
    `--font-serif`). Importe e aplique a `className`/`variable` no elemento raiz do
    layout (é isso que ativa o token em toda a árvore).
  - `app/globals.css` — tokens P&B/cinza, utilitário de glow radial, foco visível,
    `prefers-reduced-motion`. Use as classes/tokens de lá — não redeclare cor nova.
  - `components/ui/Button.tsx`, `Container.tsx`, `Section.tsx` — primitivos prontos, use-os
    em vez de recriar layout do zero.
  - `components/ui/Logo.tsx` — componente do wordmark vetorizado, `fill="currentColor"`.
  - `components/ui/PlaceholderNote.tsx` — para os stubs de `/empresas`/`/agencias`.
  - `app/icon.svg` — favicon já resolvido, você não mexe nele.
- **Escopo deste ciclo — restrição forte:** só o lado **empresas**. `/agencias` existe
  como rota (o dono confirmou "a bifurcação das rotas está certíssima"), mas **sem
  nenhum conteúdo específico de agência** — nem um parágrafo. Um stub honesto.
- **Conteúdo travado — não invente:**
  - Garantia: "pelo menos 1 milhão de views cumulativas (Instagram + TikTok + YouTube
    Shorts, somando todos os vídeos) em 60 conteúdos publicados ao longo de 90 dias — um
    conteúdo por dia de segunda a sexta — ou devolve o dinheiro." Isso é fala literal do
    dono, pode ir no texto como está (ajuste só fluidez, não o conteúdo/números).
  - **Termos de reembolso** (prazo, processo, o que exatamente conta como "view"): o dono
    decidiu explicitamente **não fornecer agora**. Escreva `PENDENTE-DONO: <o que falta>`
    no lugar — nunca invente prazo, processo ou definição.
  - Preço: **não aparece** em nenhum dos dois produtos.
  - CTA final "quero viralizar meu negócio": o **link do formulário ainda não existe** —
    use `href="#"` (ou um valor claramente placeholder) e marque com
    `PENDENTE-DONO: link do formulário`. Não invente URL.
  - Prova social (números/clientes): vai existir, mas conteúdo chega depois — não
    invente número nenhum agora; se for incluir um bloco de prova social na Hero, ele é
    `PENDENTE-DONO`, não um número fabricado. (Avalie se cabe nesta primeira dobra dado o
    requisito de caber sem scroll — se não couber, deixe de fora, é conteúdo de uma dobra
    futura, não desta.)
- **Referência de estrutura (não de paleta):** `replit.com` — estrutura de dobra
  hero-pergunta como inspiração de tom, não copie o tema claro dela (o site é dark).
  `21st.dev` — hierarquia tipográfica grande, prova social por número grande (se/quando
  houver número real).
- **Acessibilidade é parte do critério de aceite, não polimento:** contraste
  branco-sobre-preto real (não cinza-claro-sobre-cinza-escuro de contraste baixo), anel
  de foco visível em cada CTA/link navegável por teclado, motion reduzido respeitado (os
  tokens de `globals.css` já cobrem o `prefers-reduced-motion` global — se você adicionar
  qualquer animação/transição própria no glow decorativo, garanta que ela também obedece).
- **Caber sem scroll:** o Header (compacto, só logo) consome parte da viewport — dimensione
  a Hero considerando isso (`min-h-dvh` menos a altura do header, ou o header sendo parte
  do mesmo container flex da Hero) para a tela inteira (headline + duas opções + garantia)
  caber sem rolagem em viewport comum de laptop.
- **Estilo OBRIGATÓRIO**: leia `.claude/STYLE-GOOGLE-TS.md` e siga.

## A TASK
1. `components/chrome/Header.tsx`: barra superior compacta e fixa/sticky, só com
   `<Logo />` linkando para `/`. Sem navegação (não há outras páginas com conteúdo ainda).
   Teste `Header.test.tsx`: renderiza o logo, o link aponta para `/`.
2. `components/sections/SegmentationCard.tsx`: cartão reutilizável — título, subtítulo,
   CTA (usa `Button`), `href` de destino. Foco visível, alvo de toque adequado (área
   clicável generosa). Teste `SegmentationCard.test.tsx`: renderiza título/CTA, `href`
   correto, é navegável por teclado (role/tag certos).
3. `components/sections/HeroSegmentation.tsx`: monta a dobra completa —
   headline institucional (sóbria, técnica, premium — sem hype vazio), o texto da
   garantia (ver "Conteúdo travado" acima, com `PENDENTE-DONO:` onde aplicável), e os
   dois `SegmentationCard` lado a lado (desktop) / empilhados (mobile):
   - "Sou empresário" / "Quero viralizar meu negócio" → `href="/empresas"`
   - "Sou agência de marketing" / "Quero uma licença Doxa" → `href="/agencias"`
   Use o utilitário de glow radial de `globals.css` como elemento decorativo de fundo
   (sutil, não compete com o texto — contraste continua alto).
   Teste `HeroSegmentation.test.tsx`: os dois links existem com os `href` corretos, o
   texto da garantia contém os números exatos (1 milhão, 60 conteúdos, 90 dias, segunda a
   sexta), e o texto contém literalmente `PENDENTE-DONO` em pelo menos um ponto (prova de
   que nada foi inventado no lugar do termo de reembolso/link do formulário).
4. `app/layout.tsx`: aplique a `variable`/`className` de `lib/fonts.ts` no elemento raiz,
   importe e renderize `<Header />` antes de `{children}`. Metadata: mantenha
   `title: "Doxa"` (pode refinar `description` se tiver conteúdo real; senão mantenha o
   `PENDENTE-DONO` do prelude).
5. `app/page.tsx`: reescreva por completo — renderiza só `<HeroSegmentation />` (dentro de
   `Container`/`Section` conforme fizer sentido). Nada abaixo da Hero neste ciclo.
6. `app/empresas/page.tsx`: rota nova, stub honesto —
   `<PlaceholderNote texto="PENDENTE: página de empresas — conteúdo do próximo ciclo." />`.
7. `app/agencias/page.tsx`: rota nova, stub honesto, **zero conteúdo de agência** —
   `<PlaceholderNote texto="PENDENTE: rota de agências — fora do escopo deste ciclo." />`.
8. Confira: buscar "Orca" em tudo que você tocou → zero ocorrências. Buscar "Francisco" →
   zero ocorrências.

## SCOPE
- app/layout.tsx
- app/page.tsx
- app/empresas/page.tsx
- app/agencias/page.tsx
- components/chrome/Header.tsx
- components/chrome/Header.test.tsx
- components/sections/HeroSegmentation.tsx
- components/sections/HeroSegmentation.test.tsx
- components/sections/SegmentationCard.tsx
- components/sections/SegmentationCard.test.tsx

## DEPENDS ON
`prelude-scaffold-doxa` **e** `track-design-tokens` **e** `track-logo-vetor` — os três já
mergeados em `main`. Esta track é **sequencial**, não roda em paralelo com nenhuma outra
(ritmo bloco-por-bloco pedido pelo dono: a Hero é o único bloco de conteúdo deste ciclo).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde (`Header`, `SegmentationCard`, `HeroSegmentation` `.test.tsx` inclusos)
- `pnpm build` conclui sem erro (gera estaticamente `/`, `/empresas`, `/agencias` sem
  lançar erro de render)
- `git diff origin/main...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `grep -ri "orca" app/ components/ | grep -v node_modules` = vazio
- `grep -ri "francisco" app/ components/` = vazio
- `grep -c "PENDENTE-DONO" components/sections/HeroSegmentation.tsx` > 0 (garantia de que
  o que não foi dado literalmente está marcado, não inventado)
- `grep -E "1 milhão|60 conteúdos|90 dias|segunda a sexta" components/sections/HeroSegmentation.tsx`
  encontra os quatro (ou equivalentes exatos) — cole a saída
- **Manual (colar no report):** `pnpm dev`, abra `/` numa viewport de laptop comum
  (ex. 1440×900) sem rolar — confirme visualmente que as duas opções aparecem inteiras;
  clique em cada CTA e confirme que `/empresas` e `/agencias` abrem sem erro 500; navegue
  só por Tab e confirme foco visível em cada CTA; ative "reduzir movimento" no SO e
  confirme ausência de animação abrupta no glow.

## COMMIT + PUSH
`feat(home): primeira dobra — Hero de segmentação empresário/agência` →
`git push -u origin track-home-hero`. **NÃO mergeie.**
Ao terminar: sumário do que fez + verdict READY/NOT READY + saída colada do VERIFY.
Merge/deploy/LIVE são do GESTOR. **Este é o último bloco do ciclo** — não proponha nem
comece a próxima dobra (Sobre Nós etc.), mesmo que pareça óbvio o que vem depois; isso é
decisão do próximo ciclo de planejamento, depois do dono aprovar esta Hero.

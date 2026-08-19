# CARD 013 — SEO: as pendências que ficaram (porta na landing, #faq, 404 real, PENDENTES)

- **Tipo:** feature + débito (3 tracks pequenas e disjuntas)
- **Aberto em:** 2026-08-19 — ordem do dono: "faça tudo isso para deixar o SEO o mais
  limpo e rápido possível" (depois dos cards 011 e 012 entregues)
- **Status:** **ENTREGUE e VALIDADO-LIVE em 2026-08-19** — PRs #77 (docs), #78 (404 real),
  #79 (landing) em `main`; evidência abaixo.

## O que o dono quer ver funcionando
1. A landing **aponta para a biblioteca** (hoje nenhum link sai da home para `/guias`):
   "Guias" no rodapé, sem estourar a 320px e sem quebrar "Falar com a gente" no meio.
2. `/#faq` vindo de fora (rodapé das páginas SEO) **rola até o FAQ**, como `/#forms`
   já faz; reload com `#faq` continua no topo.
3. Caminho desconhecido devolve **404 de verdade** (hoje `/guias/nao-existe` = 200 com a
   landing — soft-404 para o Google), com uma página 404 da casa apontando para as
   seções; as 5 rotas da SPA continuam funcionando.
4. `docs/seo/source-of-truth.md` §9.1 e o array `PENDENTES` de `faq/config.ts`
   reconciliados com o que DUVIDAS_PT já publica (`preco`, `volume`, `direitos`).

## Fora do escopo (e por quê)
- Service account Total → Restrita: painel do Google, mão do dono; perde só `--submeter`.
- Prerender da landing (SSG da primeira dobra) para LCP mobile: mudança estrutural
  com risco §68; o LCP de 2,7–3,2 s é a renderização CSR do H1, pré-existente. Fica
  para card próprio se o dono quiser.
- As duas inferências de copy ("não se contrata a Doxa só para clonar uma voz";
  "LinkedIn fora das três redes da garantia") ficam como estão — derivam do repo; o
  dono veta se discordar.

## Critério de aceite
- [ ] `curl -s https://www.doxaviral.com/ | grep -c 'href="/guias"'` ≥ 1; rodapé a 320/390
      sem overflow (`mobile-shot`), "Falar com a gente" inteiro, desktop inalterado
- [ ] `/#faq` em produção: hash mantido, `#faq` no topo da janela após montar; `/#forms`
      continua; `/` e reload no topo
- [ ] `curl -s -o /dev/null -w '%{http_code}' https://www.doxaviral.com/guias/nao-existe`
      = **404** com a página 404 da casa; `/leads`, `/admin`, `/conversor`, `/manual-doxa`
      = 200 com o `<title>` da landing; `/solucoes/…` sem barra = 200; com barra = 308
- [ ] `grep -c` das 3 chaves em PENDENTES = 0; §9.1 marca as 3 como "publicada com a
      não-resposta autorizada"
- [ ] `pnpm typecheck` · `pnpm test` · `pnpm build` verdes; Lighthouse SEO 100 mantido

## Tracks (packs em `.claude/tower/packs/`)
| Track | Arquivos | Gate |
|---|---|---|
| `track-landing-porta-faq` | `src/components/Rodape.tsx`, `src/components/rodape/config.ts`, `src/App.tsx`, `src/fragmento.ts`, `src/fragmento.test.ts` | collector (landing!) + mobile-shot 320/390 + CDP do `#faq` |
| `track-404-real` | `vercel.json`, `vercel.README.md`, `scripts/prerender.mjs`, `src/seo/prerender/entrada.tsx`, `src/seo/layout/Pagina404.tsx`, `src/seo/seo.test.ts` | collector + `vercel build` (config.json) + VALIDAR-LIVE das 5 rotas |
| `track-docs-pendentes` | `docs/seo/source-of-truth.md`, `src/components/faq/config.ts` (só `PENDENTES`) | gate leve |

Sequência de merge: `track-docs-pendentes` → `track-landing-porta-faq` → `track-404-real`
(o 404 por último porque é o que mais precisa de VALIDAR-LIVE em produção).

---
## Entrega e VALIDAR-LIVE (2026-08-19, 16:27–17:10)

- **#77 docs** — `PENDENTES`/§9.1/régua reconciliados; o executor NÃO removeu as 3 do
  array (10 arquivos citam índice e linha), marcou no lugar com contagem de linhas
  idêntica. Observação: item 9 ("Preciso aparecer no vídeo?") também parece coberto por
  `gravar`.
- **#78 404 real** — dois rewrites (`/leads` e `/admin` são EXATOS no `App.tsx`; o pack
  errava com `(/.*)?`), `Pagina404.tsx` prerenderizada (noindex, sem canonical, cards das
  5 seções), sitemap 69. Collector APROVADO. **Produção**: `/guias/nao-existe`,
  `/leads/xpto`, `/adminx` → **404** "Página não encontrada — Doxa" (noindex);
  `/leads`, `/admin`, `/conversor`, `/manual-doxa`, `/manual-doxa/sub` → 200 landing;
  `/solucoes/…` 200; `/api/lead` POST → 400 (função viva); `/qualquer.txt` 404.
- **#79 landing** — `Guias` (PT) / `Guides` (EN) → `/guias` como 1º atalho; rodapé em
  duas linhas abaixo de `sm` (nada partido), idêntico de `sm` para cima; `#faq` com o
  seguro do `#forms` (`HONRADOS`, 12 testes; `App.tsx` 35 linhas, 0 `focus()`).
  Collector APROVADO. **Produção (CDP 390px)**: `/#faq` → faqTop **0**; `/#forms` →
  formsTop **0**; `/` → scrollY 0; rodapé publicado com `Guias · Perguntas · Falar com a
  gente` e `href="/guias"` (o HTML estático não mostra — o rodapé é chunk `lazy`; a
  prova é no DOM). 29/1040 testes; build 68 rotas + `404.html`.
- Lição: `curl` na home NUNCA vai ter o link do rodapé — é React; medir no DOM.

### Fica para o dono (opcional)
Total → Restrita na service account (painel); `Guides` no EN aponta para página PT (1
linha para esconder); prerender da primeira dobra da landing (card próprio, risco §68).


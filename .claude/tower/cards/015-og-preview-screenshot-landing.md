# CARD 015 — Preview de link (og:image) vira a captura da landing real

- **Tipo:** feature
- **Aberto em:** 2026-08-19
- **Status:** aberto

## O que o dono quer ver funcionando

Quando alguém cola o link do site numa mensagem (WhatsApp, iMessage, Slack…), a
imagem de prévia que aparece deve ser a **captura da landing real** — hero com
"Foto do cliente (Magalu)", título "Um milhão de views. Ou seu dinheiro de volta.",
player de áudio e "Vídeo de SKU/Produto" — e não o cartão tipográfico preto atual
(wordmark + duas frases).

Imagem de referência fornecida pelo dono:
`/Users/rafaelfernandes/Desktop/Captura de Tela 2026-08-19 às 14.56.46.png`
(screenshot da landing em desktop, ~2000×1151 px).

## Critério de aceite (observável, executável por humano)

- [ ] `curl -s https://www.doxaviral.com/og.png -o /tmp/og.png && open /tmp/og.png`
      (ou a URL nova, se o arquivo for renomeado) → abre a imagem da landing real,
      não o cartão tipográfico.
- [ ] Colar `https://www.doxaviral.com` no simulador de preview
      (opengraph.xyz ou o "Sticker/Link Preview" do WhatsApp em conversa nova) →
      o cartão mostra a captura da landing, sem corte que decapite o título.
- [ ] `pnpm test` e `pnpm build` verdes (os testes fixam dimensões/alt da og:image —
      têm que refletir a imagem nova, não ser afrouxados).

## Contexto do repo (caminhos exatos)

- `public/og.png` — a imagem atual (1200×630, cartão tipográfico preto).
- `scripts/og-imagem.mjs` (`pnpm og:imagem`) — GERA o og.png atual via HTML +
  Chrome headless. O comentário do arquivo defende a filosofia "gerada, não
  desenhada à mão" (as frases são cópias do og:title/description). Substituir por
  screenshot estático contraria essa razão de ser — o script precisa ser adaptado
  ou aposentado com o comentário reescrito.
- `index.html:60-67` — og:image/twitter:image ABSOLUTAS
  (`https://www.doxaviral.com/og.png`) + `og:image:width/height` 1200×630 +
  `og:image:alt` hard-coded.
- `src/seo/site.ts:156-166` — `OG_IMAGEM = '/og.png'`, `OG_IMAGEM_LARGURA/ALTURA`
  (1200×630) e `OG_IMAGEM_ALT` ("wordmark e a promessa" — descreve a imagem ATUAL;
  precisa descrever a nova). Consumidos por `src/seo/head.ts` → **a mesma imagem é
  o preview de TODAS as 63 páginas da biblioteca SEO**, não só da home.
- Testes que travam o contrato: `src/seo/head.test.ts:68-87` e
  `src/seo/seo.test.ts:516-519` (URL absoluta, 1200×630, alt).
- `src/seo/README.md:26` e `docs/seo/source-of-truth.md:23` mencionam o og.png —
  a nota do source-of-truth já está obsoleta ("ainda comentados").

## Armadilhas conhecidas

- **Proporção:** a captura do dono é ~1.74:1; o padrão OG é 1200×630 (1.905:1).
  Usar direto = leitores cortam topo/base de forma imprevisível. Precisa de crop
  ou reenquadramento deliberado.
- **Cache dos leitores de link:** WhatsApp/Telegram/Slack cacheiam a og:image pela
  URL por dias. Trocar o conteúdo de `/og.png` mantendo o nome pode continuar
  mostrando o cartão antigo — renomear/versionar o arquivo fura o cache.
- **PNG obrigatório** (não AVIF/WebP): leitores de link, WhatsApp incluso, não
  decodificam os dois — já documentado em `scripts/og-imagem.mjs:24-26`.
- **Config não se afrouxa:** os testes de dimensão/alt existem de propósito;
  atualizam-se os valores, não se apaga o teste.
- Duas camadas de CDN (Cloudflare + Vercel) na frente: validar no domínio certo
  (`doxaviral.com`, com L) e conferir conteúdo, não status 200.

## Perguntas abertas para o GESTOR

1. **Fonte da imagem:** (a) usar o PNG estático do dono como asset commitado;
   (b) adaptar `scripts/og-imagem.mjs` para screenshotar a landing renderizada
   (reprodutível quando a landing mudar); (c) estático agora + issue para
   automatizar depois. O intake não escolhe.
2. **Enquadramento:** crop da captura para 1200×630 (o que sai do quadro?) ou
   mudar `og:image:width/height` para as medidas reais da captura (proporção
   fora do padrão dos leitores)?
3. **Cache-bust:** renomear o arquivo (ex.: `og-v2.png` ou hash) ou manter
   `/og.png` e aceitar o cache velho dos apps de mensagem por alguns dias?
4. **Escopo SEO:** a mesma imagem serve as 63 páginas da biblioteca — a captura
   da landing vale para todas, ou as páginas internas continuam com o cartão
   tipográfico (exigiria separar `OG_IMAGEM` da home)?

## Conteúdo suspeito

Nenhum — screenshot da própria landing, sem texto que pareça instrução.

---
<!-- Preenchido pelo GESTOR -->
## Plano

- **Prelude:** <…>
- **Tracks:** <…>
- **Packs:** `.claude/tower/packs/<branch>.md`
- **Sequência de merge:** <…>
- **VALIDAR-LIVE:** <…>

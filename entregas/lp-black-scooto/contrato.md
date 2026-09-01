# LP Black Scooto — CONTRATO das tracks (card 018, prelude P1)

> **Leia este arquivo inteiro antes da primeira linha de HTML.** Ele é o que as tracks
> A, B, C, D e E obedecem. A fonte da verdade VISUAL continua sendo
> `figma/design-context.md` + os screenshots `figma/secao-NN-*.png`; este documento
> decide o que o Figma não decide (arquitetura no Elementor, links, fontes, textos que
> não existem no desenho) e fixa as regras que `verify/checar-bloco.mjs` cobra.
>
> Ordem de precedência quando houver conflito: **screenshot do Figma > dump do
> design-context > este contrato > gosto pessoal**. Divergiu de um número do Figma sem
> este contrato mandar? Vale o Figma.

## 0. O que estamos entregando

Blocos de HTML autocontidos (markup + `<style>` próprio, zero JS) colados em widgets
**HTML** do Elementor no WordPress da Scooto, mais **dois widgets nativos de Elementor
Pro Form**. Alvo de fidelidade: **desktop ~1440px, pixel perfect**. Mobile (~390px)
entra por media query própria de cada bloco — o critério ali é **dignidade, não
fidelidade** (não existe frame mobile no Figma).

---

## 1. Fatiamento — seção do Figma → arquivo

| # | Seção Figma | Vai para | Observação |
|---|---|---|---|
| 01 | hero (coluna esquerda: H1, sub, linha de prova social) | `blocos/bloco-a-topo.html` | widget HTML na **coluna esquerda** |
| 01 | hero (card: badge "Avaliação gratuita" + "Vamos entender sua operação") | `blocos/bloco-a-hero-form-topo.html` | widget HTML **dentro** do container `.lpb-hero-card` |
| 01 | hero (os 3 campos + botão do card) | **widget Form** "Formulário LP Black Hero" (track D) | entra logo abaixo de `bloco-a-hero-form-topo`, no mesmo container |
| 01 | hero (foto da scooteira, coluna direita) | **widget Imagem nativo** do Elementor | ver § 2 |
| 01 | hero (faixa de 4 selos, `DIV-90`, 1440×91, full-bleed) | **início de** `blocos/bloco-b-meio.html` | ver § 2, nota 3 |
| 02 | identificacao (7 cards) | `blocos/bloco-b-meio.html` | |
| 03 | oferta (fundo roxo + CTA branco) | `blocos/bloco-b-meio.html` | CTA → `#lpb-form` |
| 04 | urgencia (4 cards de mês) | `blocos/bloco-b-meio.html` | |
| 05 | contratacao (2 frentes + CTA roxo) | `blocos/bloco-b-meio.html` | CTA → `#lpb-form` |
| 06 | autoridade (texto + foto + 4 métricas) | `blocos/bloco-b-meio.html` | |
| 07 | prova-social (3 depoimentos + faixa de logos) | `blocos/bloco-b-meio.html` | |
| 08 | como-funciona (3 passos) | `blocos/bloco-b-meio.html` | |
| 09 | faq (10 itens) | `blocos/bloco-c-final.html` | `<details>/<summary>`, item 1 `open` |
| 10 | formulario-completo (H2, sub, fundo `#f12d64`) | `blocos/bloco-c-final.html` | a moldura fecha aqui |
| 10 | card branco com os 6 campos + botão "Enviar" | **widget Form** "Formulário LP Black" (track D) | **entre** `bloco-c-final` e `bloco-c-pos-form`; CSS ID `lpb-form` |
| 10 | "Prefere falar direto?" + CTA WhatsApp + linha de selos | `blocos/bloco-c-pos-form.html` | |
| 11 | FOOTER | `blocos/bloco-c-pos-form.html` | ver § 6 |

**ORDEM canônica da página** (a mesma da constante `ORDEM` em `verify/servir.mjs`):

```
hero (bloco-a-topo + .lpb-hero-card[bloco-a-hero-form-topo + Form hero] + foto)
bloco-b-meio
bloco-c-final
Form completo  (form/form-mock.html no preview)
bloco-c-pos-form
```

---

## 2. Montagem do hero no Elementor

Estrutura (números do dump da seção 01, `1:5`):

- **Seção/Container do hero**: fundo `#f2f2e8`, `padding-top: 80px`; conteúdo com
  margem lateral `80px` + container `max-width: 1280px` com `padding: 24px` →
  **linha útil de 1232px**.
- **Linha de 2 colunas**, `display:flex`, `align-items:center`, `gap: 64px`,
  **584px + 584px** (= 1232 com o gap). Altura de referência 920px.
  - **Coluna esquerda (584px)**, dois widgets empilhados:
    1. widget **HTML** → `blocos/bloco-a-topo.html`
       (H1 60/60 `Sora:Bold` `tracking:-1.5px` — "Você vai gerar demanda na Black
       Friday." em `#030304` e "Quem vai dar conta?" em `#4a1be8`; parágrafo 16/24
       `#555766`; linha "Mais de 150 empresas…" 14/20 com "XP, Cora e Boca Rosa" em
       `Roboto:SemiBold #111116`; e a linha de marcas `XP · Cora · Boca Rosa ·
       Indústria da Beleza` 14/20 `#8f91a2`, separadores `#aeb0be`, `gap: 8px 24px`).
    2. **Container** do Elementor com a classe CSS **`lpb-hero-card`** (é o card do
       form: 584×408, `border-radius: 16px`, moldura de 2px em gradiente
       `linear-gradient(145deg,#4a1be8 0%,#f12d64 50%,#ff6000 100%)`, miolo branco,
       `padding: 24px`), contendo **nesta ordem**:
       - widget **HTML** → `blocos/bloco-a-hero-form-topo.html` (badge `#ffe1d2`/
         `#602103` "Avaliação gratuita" + `<p>` 20/28 `Sora:Bold` "Vamos entender sua
         operação");
       - widget **Form** "Formulário LP Black Hero" (§ 5).
  - **Coluna direita (584px)**: widget **Imagem** nativo do Elementor com
    `hero-foto-scooteira.png` (render 612×604, centralizado; `alt` descritivo, p.ex.
    "Scooteira sorrindo dentro do símbolo da Scooto"). É o único lugar onde um widget
    nativo que não é Form aparece — a foto não cabe em nenhum dos dois arquivos HTML
    da track A sem quebrar a coluna.

**Notas de montagem (decisões deste contrato, não do Figma):**

1. **O card fica na coluna ESQUERDA, embaixo do texto** — é o que o screenshot
   `figma/secao-01-hero.png` mostra. (O pack do gestor sugeria o card na coluna
   direita; era o "ajuste fino" previsto e ele foi feito aqui, a favor do desenho.)
2. **Moldura em gradiente sem elemento extra**: `background-image` duplo com
   `background-origin/clip` (`padding-box, border-box`) resolve a borda de 2px sem
   pseudo-elemento. O véu borrado atrás do card (`DIV-52`, blur 20px, `inset: -12px`,
   `border-radius: 24px`) é um `::before` com `hero-glow-fonte-270.png` e
   `filter: blur(20px)`; **URL de imagem em CSS também usa `RAW_PREFIX`** (o
   `checar-bloco.mjs` só consegue cobrar isso em `<img>`/`<source>` — o resto é
   disciplina).
3. **A faixa de 4 selos do fim do hero abre o `bloco-b-meio.html`.** Ela é full-bleed
   (1440px, `border-top: 1px #dfdfd4`), então não cabe dentro da coluna de 584px, e a
   track A não tem um terceiro arquivo. Colocá-la no topo do bloco B mantém cada
   arquivo com um widget e um lugar. Os 4 selos: "Operação no ar em 24h" (disco
   `#e5e9ff`) · "De 1 a 50 posições em 48h" (`#ffe1d2`) · "Gestão dedicada, não
   ticket" (`#ffdee2`) · "LGPD e processos auditáveis" (`#e5e9ff`); pills brancas,
   borda `#dfdfd4`, `border-radius: 9999px`, `height: 50px`, texto
   `Roboto:SemiBold 14/20 #22232b`, `gap: 12px`.
4. **A nota sob o botão** ("Seus dados ficam com a gente…") não pode ser um widget:
   o Elementor Pro renderiza o botão de envio SEMPRE como último item do formulário, e
   nada pode ser inserido depois dele dentro do widget. Ela entra como
   `.lpb-form-widget::after { content: "…" }` (§ 5). Se o dono quiser esse texto como
   conteúdo real no DOM, a alternativa é um widget **Editor de Texto** abaixo do Form,
   dentro do mesmo container — decisão dele, não da track.

---

## 3. Tokens

### Paleta

| Token | Hex | Onde |
|---|---|---|
| creme (fundo) | `#f2f2e8` | hero, seções 05/07/09, inputs |
| borda creme | `#dfdfd4` | cards, inputs, divisórias |
| branco | `#ffffff` | seções 02/04/06/08/11, cards |
| texto forte | `#030304` | H1, H2 |
| texto título alt | `#111116` · `#22232b` | perguntas do FAQ, destaques |
| corpo | `#3b3c48` · `#555766` | parágrafos e cards |
| cinza fraco | `#717386` · `#8f91a2` · `#aeb0be` | legendas, marcas, separadores |
| roxo marca | `#4a1be8` | seção 03, discos, CTA sólido, badges |
| roxo escuro (texto) | `#4013cc` | texto do CTA branco, sub da frente 1 |
| roxo claro | `#6b5cff` / `#4a3fdb` (sombra) | cards de métrica e passo |
| rosa | `#f12d64` | seção 10, card de métrica/passo |
| laranja | `#ff6000` / `#ff7a1a` / `#df5200` / `#b74508` | asterisco, frente 2, cards |
| pills claros | `#e5e9ff` · `#ffe1d2` · `#ffdee2` · `#fff1eb` | discos de ícone, badges |
| borda card form | `#c6cfff` (roxo) · `#ffc8ac` (laranja) | seções 05 e 10 |
| gradiente CTA | `linear-gradient(145deg,#4a1be8 0%,#f12d64 50%,#ff6000 100%)` | moldura do card do hero, botão do hero |
| sombra dura | `drop-shadow(8px 8px 0 <cor>)` | métricas (06) e passos (08) |

### Tipografia

- **Sora** só em títulos: H1 60px, H2 36px/40, H3/título de card 20px/28 e 18px/28,
  número de métrica 30px/36, perguntas do FAQ 16/24 (SemiBold), "INDÚSTRIA DA BELEZA"
  18/28 `tracking: 1.8px` (**Regular 400** — é o único uso de Sora 400).
- **Roboto** em todo o corpo, rótulos, botões e legendas — pesos 400, 600, 700 e
  **itálico 400** (fecho da seção 04 e caixa da frente 2).
- **`Inter:Medium` do Figma (placeholder de input) cai para Roboto** — decisão do dono.
  Placeholder: `Roboto` 400, 14px/20, `#9ca3af`.
- `font-variation-settings: "wdth" 100` do dump é o default do Roboto variável;
  **não precisa ser escrito**.

### `@import` — snippet EXATO, no `<style>` de CADA bloco (primeira linha)

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,600;0,700;1,400&family=Sora:wght@400;600;700&display=swap');
```

Conferido: devolve `200` com Roboto 400/600/700 + itálico 400 e Sora 400/600/700.
As famílias precisam ficar em ordem alfabética na URL (Roboto antes de Sora), senão a
API do Google responde erro. `checar-bloco.mjs` exige `family=Sora` **e**
`family=Roboto` num `@import` de `fonts.googleapis.com/css2`.

Pilha de fallback sugerida:
`font-family: 'Sora', 'Segoe UI', system-ui, sans-serif` (títulos) ·
`font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif` (corpo).

---

## 4. Imagens

**`RAW_PREFIX`** (constante única, também no topo de `verify/servir.mjs`):

```
https://raw.githubusercontent.com/rafa-bulgarelli/lp-black-scooto-assets/main/
```

Todo `src` de `<img>`/`<source>` **começa com `RAW_PREFIX`** — é regra cobrada pelo
gate. No preview local o `servir.mjs` troca o prefixo por `/assets/` em tempo de
resposta, então o mesmo HTML roda nos dois lugares sem edição.

| Asset | URL final | Seção / uso |
|---|---|---|
| `hero-foto-scooteira.png` | `RAW_PREFIX` + `hero-foto-scooteira.png` | 01 — foto, coluna direita (612×604) |
| `hero-glow-fonte-270.png` | `RAW_PREFIX` + `hero-glow-fonte-270.png` | 01 — véu borrado atrás do card (CSS `::before`, blur 20px) |
| `autoridade-foto-time.jpg` | `RAW_PREFIX` + `autoridade-foto-time.jpg` | 06 — foto do time (472×320, `object-fit: cover`) |
| `autoridade-foto-time-270.png` | `RAW_PREFIX` + `autoridade-foto-time-270.png` | reserva (uso incerto) — não usar sem necessidade |
| `logo-xp.png` | `RAW_PREFIX` + `logo-xp.png` | 07 — faixa de logos (165×36) |
| `logo-boca-rosa.png` | `RAW_PREFIX` + `logo-boca-rosa.png` | 07 — faixa de logos (165×78) |
| `formulario-marca-branca.png` | `RAW_PREFIX` + `formulario-marca-branca.png` | 10 — marca decorativa 600×600, `opacity: .07`, sangra à direita |
| `formulario-marca-branca-270.png` | `RAW_PREFIX` + `formulario-marca-branca-270.png` | reserva |

**Os 24 SVGs vão INLINE** (`<svg>` no markup, sem `src`): são ícones pequenos, evitam
24 requisições, herdam cor por `currentColor`/`fill` e não dependem do repositório de
assets estar público. Se algum precisar virar `<img>`, a URL é `RAW_PREFIX` + nome do
arquivo. Mapa completo em `assets/INVENTARIO.md`; os do footer foram conferidos contra
`figma/secao-11-footer.png`: `footer-svg-01` = Instagram, `footer-svg-02` = LinkedIn,
`footer-svg-03` = Facebook.

---

## 5. Contrato dos DOIS formulários (Elementor Pro Form)

O hook do Intercom instalado no site da Scooto capta **qualquer** Elementor Pro Form da
página — não há nada a configurar no bloco, e **nenhum token, chave ou script entra
neste repositório ou nos blocos**. O que a track D precisa garantir são os **custom
IDs** dos campos:

| ID exigido | Rótulo no Figma | Form completo | Form do hero |
|---|---|---|---|
| `name` | "Seu Nome *" / "Nome" | sim | sim |
| `email` | "E-mail *" / "E-mail corporativo" | sim | sim |
| `phone` | "WhatsApp *" | sim | vazio |
| `cargo` | "Cargo *" | sim | vazio |
| `empresa` | "Nome da Empresa *" | sim | vazio |
| `site` | "Site *" | sim | vazio |

- Campo faltando **não** quebra o hook: ele envia o que existir; `phone`, `cargo`,
  `empresa` e `site` simplesmente chegam vazios pelo form do hero.
- `phone` pode ter máscara `(XX) XXXXX-XXXX` (é o placeholder do Figma). O hook limpa a
  máscara e prefixa `+55` — **não coloque código de país no campo**.
- UTMs são capturadas por cookie pelo PixelYourSite. Não criar campo oculto de UTM, não
  mexer em cookie, não duplicar tracking.

### 5.1 Form completo — **"Formulário LP Black"**

- CSS ID do widget: **`lpb-form`** (é a âncora `#lpb-form` de todos os CTAs do meio).
- Classes CSS do widget: **`lpb-form-widget`**.
- Campos na ordem visual do Figma: **Seu Nome** (100%) · **E-mail** (100%) ·
  **Cargo** (50%) + **Nome da Empresa** (50%) · **Site** (50%) + **WhatsApp** (50%) ·
  botão **"Enviar"**. Todos obrigatórios; rótulo `Roboto:SemiBold 14/20 #22232b` com
  asterisco `#ff6000`.
- O widget **é** o card branco da seção 10: `background:#fff`, `border:1px solid
  #c6cfff`, `border-radius:16px`, `padding:33px`, largura 720 (form interno 654).
  Inputs `height:46px`, `background:#f2f2e8`, `border:1px solid #dfdfd4`,
  `border-radius:8px`, `padding:0 17px`, texto 14px. Botão `#4a1be8`, `height:44px`,
  `border-radius:8px`, largura total, `Roboto:SemiBold 14/20` branco.
- Nota sob o botão, via `.lpb-form-widget::after` (12/16, `#8f91a2`, centrada):
  "Seus dados ficam com a gente. Sem spam, sem lista compartilhada. Quem responde é
  gente do time comercial, não bot."

### 5.2 Form do hero — **"Formulário LP Black Hero"**

- **É um formulário REAL e dispara o hook igual ao completo** (decisão do dono,
  2026-09-01). Ele **submete**, não ancora.
- **SEM CSS ID** (a âncora `#lpb-form` é exclusiva do form completo — dois IDs iguais
  quebrariam a rolagem).
- Classes CSS do widget: **`lpb-form-widget lpb-form-widget--hero`**.
- Campos: `name` (placeholder "Nome", ícone de pessoa à esquerda) · `email`
  (placeholder "E-mail corporativo", ícone de envelope) · **anti-spam** "Quanto é
  5 + 7?" — campo do Elementor com ID **fora dos 6 reservados**, use **`quiz`**
  (o hook ignora o que não conhece).
- Botão: **"Quero avaliar minha operação"** com o gradiente da marca
  (`linear-gradient(145deg,#4a1be8,#f12d64,#ff6000)`), `height:57px`,
  `border-radius:12px`, `Roboto:Bold 16/24` branco, seta à direita.
- Nota sob o botão, via `.lpb-form-widget--hero::after` (12/16, `#8f91a2`):
  "Seus dados ficam com a gente. Sem spam, sem lista comprada. Um humano responde. Não
  é bot, não é fila."
- Inputs iguais aos do form completo (46px, creme, borda `#dfdfd4`, raio 8px), com
  `padding-left: 41px` nos dois primeiros por causa do ícone.

---

## 6. Footer (seção 11)

- Fundo branco, `border-top: 1px #dfdfd4`, `padding: 49px 0 48px`, container 1104,
  **3 colunas** de ~346px com `gap: 32px`.
- Coluna 1: logo 32px + **"Scooto Tecnologia Ltda."** (`Roboto` 14/20 `#717386`).
  **A linha "CNPJ: 00.000.000/0000-00" SAI** — é placeholder e o dono mandou remover
  (2026-09-01). Não substituir por número nenhum: o Aviso de Privacidade público da
  Scooto declara uma razão social e um CNPJ que **não batem** com o nome do rodapé do
  Figma, então qualquer palpite aqui é errado por definição. Se o dono quiser a linha
  de volta, ele fornece o dado.
- Coluna 2: "Contato" (`Roboto:SemiBold 14/20 #111116`) + "Telefone: (11) 3181-8057".
- Coluna 3: "Links" + **"Política de Privacidade"** →
  `https://scooto.co/politica-de-privacidade/`. **"Termos de Uso" SAI**: não existe
  página de termos em scooto.co (`/termos-de-uso/`, `/termos/`, `/termos-e-condicoes/`
  e `/terms/` devolvem 404, e a listagem de páginas do WordPress não tem nenhuma). O
  Aviso de Privacidade *cita* "os Termos de Uso" como documento, mas ele não está
  publicado. Existe `https://scooto.co/politica-de-cookies/` (200) — **não usar sem
  decisão do dono**; não está na lista de links permitidos.
- Linha final (`border-top: 1px #dfdfd4`, `padding-top: 25px`, `justify-content:
  space-between`): "© 2026 Scooto. Todos os direitos reservados." (12/16 `#717386`) +
  **3 discos `#4a1be8` de 32px**, `gap: 16px`, com os ícones **Instagram, LinkedIn e
  Facebook** (nesta ordem, como no screenshot). Os três têm perfil real no rodapé de
  scooto.co — **nenhum ícone sai**.
  O rodapé de scooto.co ainda lista **YouTube** (`https://www.youtube.com/@scootooficial`)
  e **TikTok** (`https://www.tiktok.com/@scooto.co`), que **não têm ícone no Figma** e
  portanto ficam de fora desta LP.

---

## 7. Links permitidos (lista FECHADA)

`verify/checar-bloco.mjs` lê o bloco abaixo e recusa qualquer `href` de `<a>` que não
esteja aqui. Precisa de um link novo? **Edite este bloco no mesmo commit** — e explique
por quê no corpo do commit.

<!-- LINKS-PERMITIDOS:INICIO -->
```
#lpb-form
https://scooto.co/contato-whatsapp-2/
https://scooto.co/politica-de-privacidade/
https://www.instagram.com/scooto.co
https://www.linkedin.com/company/scooto/
https://www.facebook.com/scooto.co/
```
<!-- LINKS-PERMITIDOS:FIM -->

- `#lpb-form` — CTAs das seções 03 ("Quero entender essa condição") e 05 ("Quero
  avaliar as duas frentes"). O form do hero **não** aponta para cá: ele submete.
- `https://scooto.co/contato-whatsapp-2/` — CTA "Falar pelo WhatsApp" da seção 10
  (decisão do dono; o Figma não trazia o link). Confere `200`.
- `https://scooto.co/politica-de-privacidade/` — footer e a resposta R07 do FAQ.
  Confere `200`.
- Redes sociais colhidas do rodapé de `https://scooto.co`: Instagram e LinkedIn
  exatamente como estão lá; **Facebook normalizado de `https://m.facebook.com/scooto.co/`
  (o que o site publica, `302`) para `https://www.facebook.com/scooto.co/` (`200`)** —
  é o mesmo perfil, e `m.` é a versão mobile do Facebook, imprópria num rodapé de
  desktop. Se o dono preferir o literal do site, troque nesta lista.
- **Termos de Uso: SEM página — link removido do footer** (ver § 6).

---

## 8. FAQ (seção 09) — R01 a R10

Acordeão **nativo**: `<details>` + `<summary>`, um por pergunta, **item 1 com `open`**,
zero JavaScript. O chevron gira por CSS (`.lpb-faq__item[open] .lpb-faq__chevron {
transform: rotate(180deg) }`); o marcador nativo some com
`.lpb-faq__pergunta::-webkit-details-marker { display: none }` +
`list-style: none`. Item aberto: disco `#4a1be8` com chevron branco; fechado: disco
`#ecece1` com chevron escuro.

**R01 é transcrição literal do Figma. R02–R10 foram redigidas nesta track** a partir do
site público `https://scooto.co` (decisão do dono: "acesse o site deles e responde as
perguntas"), no tom da LP: direto, frase curta, sem promessa que a LP não faz. Números
usados são só os que a LP já usa (24h, 48h, 1→50 posições, 5→50 atendentes, 150+
empresas, 300+ operações). Nenhuma certificação foi inventada.

P01: Ainda dá tempo de contratar em outubro? E em novembro?
R01: Dá. A operação sobe em 24 horas em qualquer mês. A diferença é o quanto o time conhece o seu negócio quando o volume chegar. Em agosto e setembro, ele chega calejado. Em novembro, ele aprende durante o pico. Os dois funcionam, só não funcionam igual.
Fonte: transcrição literal do Figma (seção 09, item 1).

P02: Como funciona a condição de Black Friday?
R02: Quem fecha para a Black Friday paga o mesmo valor/hora de quem assina contrato recorrente, sem assinar o contrato recorrente. A cobrança da Scooto é por valor/hora, com proposta montada a partir da sua operação, e o que muda aqui é que a temporada não custa o adicional que operação temporária costuma custar. Sem fidelidade longa, sem multa para reduzir o time depois do pico, e vale para pré-vendas, atendimento ou as duas frentes.
Fonte: LP seção 03 (oferta) + FAQ da home de scooto.co, "Como funciona a contratação? É um valor fixo?".

P03: Preciso contratar as duas frentes?
R03: Não. Você escolhe uma frente ou as duas, e dá para começar por uma e abrir a segunda depois. A observação honesta é a que está lá em cima: a maioria contrata vendas primeiro e descobre o atendimento em dezembro, quando chega troca, devolução e "cadê meu pedido". Se você já viu esse filme, vale desenhar as duas agora.
Fonte: LP seção 05 (duas frentes + caixa "uma observação honesta") + FAQ da home de scooto.co, "A Scooto faz vendas ou só atendimento?".

P04: Quanto tempo leva para ver resultado?
R04: A operação sobe em 24 horas e o primeiro contato sai no mesmo dia, então movimento você vê na primeira semana. O que leva mais tempo é a curva de contexto: catálogo, política de frete, exceções e as objeções que só aparecem depois do preço. Isso são algumas semanas, não algumas horas, e é exatamente por isso que agosto e novembro entregam resultados diferentes com a mesma operação.
Fonte: LP seção 04 (urgência) + scooto.co /scooto-support/ ("Onboarding Flash (24 Horas)") e /scooto-for-sales/ ("Onboarding Express… em até 24h").

P05: Meu produto é complexo. O time vai entender?
R05: Vai. As Scooteiras estudam seu produto, sua concorrência e suas objeções antes do primeiro contato, e o material é construído junto com o seu time, não copiado de script pronto. Cada operação tem uma gestora dedicada acompanhando indicadores e ajustando o discurso no caminho. Produto complexo não é exceção por aqui: a esteira vai de pré-vendas B2B a suporte de pós-venda.
Fonte: LP seção 05 (frente 1, item 1) e seção 01 (selo "Gestão dedicada, não ticket") + FAQ da home de scooto.co ("Quem são as Scooteiras…", "O que é a tal 'Gestora de Projeto'…") e /scooto-lab/ ("Adaptação personalizada ao seu modelo").

P06: Como vocês se integram ao meu CRM e às minhas ferramentas?
R06: A gente entra nas ferramentas que você já usa. A operação roda direto no seu CRM e nos seus canais, sem pedir que você troque de stack e sem integração para o seu time desenvolver: o que precisa é acesso e uma conversa de configuração. Se ainda não existe CRM nem processo, a gente monta o setup do zero e indica ferramentas pelos nossos parceiros.
Fonte: scooto.co /scooto-support/ ("Integração com as Suas Ferramentas: … operamos direto nas plataformas e CRMs que seu time já utiliza") + FAQ da home, "Não tenho CRM, nem processos e nem ferramentas. Posso contratar a Scooto assim mesmo?".

P07: E a segurança dos dados? Vocês cumprem LGPD?
R07: A Scooto trata dados pessoais como controladora, sob a LGPD, com aviso de privacidade público, encarregada de dados nomeada e canal aberto para pedido de acesso, correção ou exclusão. Fornecedores que tocam esses dados entram por contrato com cláusula de segurança e são auditados periodicamente, e os registros de acesso ficam sob sigilo pelo prazo que a lei manda. Está tudo escrito, e vale ler antes de assinar qualquer coisa: Política de Privacidade.
Fonte: scooto.co /politica-de-privacidade/ (itens 3 "Agentes de Tratamento", 4 "Segurança da Informação", 8 "Direitos do Titular" e 10 "Encarregado de Dados"). NOTA PARA A TRACK C: "Política de Privacidade", no fim da resposta, é um `<a>` para `https://scooto.co/politica-de-privacidade/`. Nenhuma certificação é citada porque o site público não anuncia nenhuma.

P08: Como é a precificação?
R08: Por valor/hora, com proposta montada em cima do seu cenário: quantas posições, quais canais, qual janela de atendimento e por quanto tempo. Não existe tabela fixa publicada nem pacote fechado, porque a conta muda muito entre 1 posição e 50. Na avaliação gratuita a gente levanta esses números com você e devolve a proposta; se não fizer sentido, a gente fala isso na própria conversa.
Fonte: FAQ da home de scooto.co, "Como funciona a contratação? É um valor fixo?" ("modelo de valor hora… proposta personalizada") + LP seção 01 (selo "De 1 a 50 posições em 48h") e seção 08 (passo 2). Nenhum valor aparece porque scooto.co não publica preço.

P09: E se não funcionar?
R09: Primeiro, você fica sabendo antes do fim do mês: se a abordagem não está funcionando, a gente avisa e muda no meio do caminho, em vez de reportar no fechamento o que já dava para ver na segunda semana. Segundo, não tem contrato longo prendendo ninguém — o time sobe e desce conforme o volume real, sem multa para reduzir depois do pico. E se na primeira conversa ficar claro que não é para você, a gente diz isso ali mesmo.
Fonte: LP seção 05 (frente 1, item 4), seção 03 ("sem fidelidade longa, sem multa") e seção 08 (passo 2, "se não fizer sentido para você, a gente fala isso na própria conversa").

P10: Vocês atendem meu segmento?
R10: Provavelmente sim. São mais de 300 operações rodando e mais de 150 empresas atendidas, de fintech a beleza — XP, Cora, Boca Rosa e a indústria da beleza estão entre elas. No B2B a gente atua em pré-vendas e agendamento; no B2C, em varejo, educação, infoproduto e lançamento, com venda direta, recuperação de carrinho e suporte no pós-venda. Se o seu segmento tem alguma regra que muda o jogo, é exatamente o tipo de coisa que a avaliação gratuita existe para levantar.
Fonte: FAQ da home de scooto.co ("A Scooto faz vendas ou só atendimento?", "Faço lançamentos digitais. A Scooto serve para mim?", "Sou uma grande empresa e preciso de dezenas (ou centenas) de PAs…") + LP seções 01, 06 e 07 (150+ empresas, 300+ operações, marcas citadas).

---

## 9. Regras dos blocos (o que o gate cobra)

`node verify/checar-bloco.mjs <arquivo.html> [--css <arquivo.css>]` sai 0 só se tudo
passar. As regras:

1. **Zero `<script`**, zero atributo `on<evento>=`, zero `javascript:`.
2. **Zero `<form`** no HTML dos blocos — formulário é widget nativo do Elementor,
   nunca markup nosso. (Um `<form>` dentro de outro `<form>` é HTML inválido e o
   navegador desmonta silenciosamente.)
3. Todo `src=` de `<img>`/`<source>` começa com `RAW_PREFIX`.
4. `<style>` presente no bloco e **todo seletor começa com `.lpb-`**. Ignorados:
   `@import`, `@media`, `@supports`, `@font-face`, `@keyframes`. Única exceção global
   permitida: **`html { scroll-behavior: smooth }` e só em `bloco-a-topo.html`** (é o
   que faz o CTA descer suave até `#lpb-form`, sem uma linha de JS).
5. `@import` do Google Fonts `css2` cobrindo `family=Sora` **e** `family=Roboto`.
6. Todo `href` de `<a>` está na lista fechada do § 7.
7. Nenhuma ocorrência de palavra de segredo no arquivo.

Além do que a máquina cobra:

- **Autocontido**: cada arquivo traz o próprio `<style>` e o próprio `@import`. Widgets
  do Elementor podem ser movidos, duplicados ou removidos sem quebrar o vizinho.
- **Namespace `.lpb-`** em toda classe, inclusive nas classes que a track D dá aos
  widgets de Form. Não estilize elemento nu (`div`, `p`, `a`) e não use `!important`
  sem comentário dizendo qual regra do Elementor você está vencendo.
- **Zero JS**, inclusive "só um `<script>` de nada". Acordeão é `<details>`; rolagem
  suave é `scroll-behavior`; nada mais precisa de script.
- **Mobile ~390px** por media query própria do bloco (`@media (max-width: 900px)` para
  colapsar colunas e `@media (max-width: 480px)` para o ajuste fino). Nada de rolagem
  horizontal: conferir com
  `node .claude/tower/bin/mobile-shot.mjs http://localhost:<porta>/ 320`.
- **Acessibilidade mínima**: `alt` em toda imagem informativa, `alt=""` na decorativa,
  hierarquia de heading coerente (um `<h1>` só, no hero).
- Classes `.lpbprev-` são **exclusivas do preview** (`verify/servir.mjs`). Nunca
  aparecem num bloco.

---

## 10. Como rodar o preview

```bash
node entregas/lp-black-scooto/verify/servir.mjs --porta 5310
#  /                     → página inteira na ORDEM canônica
#  /?bloco=hero          → só o scaffold do hero
#  /?bloco=bloco-b-meio  → só um fragmento
```

Arquivo que ainda não existe é pulado com aviso no console — as tracks rodam em
paralelo, e o preview tem que subir mesmo com metade da LP escrita. Porta ocupada
**falha com erro claro** (exit 1), nunca cai em outra porta em silêncio.

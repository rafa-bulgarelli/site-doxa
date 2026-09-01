# LP Black Scooto — como montar a página no Elementor

> **Este é o único documento que você precisa seguir para colocar a LP no ar.** Ele é
> escrito para quem **nunca viu este projeto**: cada passo diz o que clicar, o que colar
> e como saber que deu certo. Você não escreve uma linha de código — copia e cola.
>
> Ao fim você terá, numa página do WordPress da Scooto: **5 widgets de HTML**, **1
> widget de Imagem**, **2 widgets de Formulário** (Elementor Pro) e **1 bloco de CSS**
> colado uma vez. Nada mais.
>
> Tempo: ~50 minutos com o Elementor aberto (25 deles são os dois formulários).

---

## 0. Antes de começar

| Precisa | Por quê |
|---|---|
| **Elementor Pro ativo** | os dois formulários são widget nativo do Pro. Widget de HTML com `<form>` colado **não** funciona: o hook que manda o lead para o Intercom só enxerga formulário do Elementor Pro, e formulário dentro de formulário é HTML inválido — o navegador desmonta em silêncio |
| Acesso de **editor** à página | é onde tudo entra |
| Os arquivos desta pasta | `blocos/*.html`, `form/form.css`, `form/configuracao-form.md` |
| O **hook do Intercom já instalado** no site da Scooto | ele capta *qualquer* formulário Elementor Pro da página. **Não há nada para instalar, configurar ou colar aqui** — nenhuma chave, nenhum código de acesso entra nesta página, neste repositório ou nestes arquivos. Se ele estiver no ar no site, está no ar nesta LP |

**Cinco coisas que NÃO se faz** (cada uma já quebrou algo em algum lugar):

1. **Não** mude os IDs dos campos dos formulários (`name`, `email`, `phone`, `cargo`,
   `empresa`, `site`). São contrato do hook: com o ID trocado o dado chega vazio no
   Intercom e ninguém percebe até o comercial reclamar.
2. **Não** coloque `+55` no campo de WhatsApp — o hook prefixa sozinho, e o resultado
   vira `+55+55`.
3. **Não** crie campo oculto de UTM nem instale plugin de tracking. As UTMs já são
   capturadas por cookie pelo PixelYourSite.
4. **Não** hospede as imagens no WordPress. Elas vêm de um repositório público do
   GitHub, e é isso que deixa a página autocontida (§ 3 e § 9 deste guia).
5. **Não** edite o HTML dos blocos "só para ajustar uma coisinha". Cada bloco traz o
   próprio `<style>` e o próprio import de fontes; ele foi medido contra o Figma. Se
   algo precisa mudar, muda no arquivo do repositório e cola de novo — senão a próxima
   colagem apaga o ajuste.

---

## 1. Criar a página

1. `wp-admin` → **Páginas** → **Adicionar nova**. Título: `LP Black` (o título não
   aparece na LP, é só o nome no painel).
2. **Editar com Elementor**.
3. No painel de **Configurações da página** (ícone de engrenagem, canto inferior
   esquerdo) → **Layout da página** → **Elementor Tela cheia** (*Elementor Canvas*).
   Isso tira cabeçalho, rodapé e barra lateral do tema: a LP traz o próprio rodapé, e
   o do tema em cima dele fica com dois rodapés.
4. Ainda em Configurações → **Ocultar título da página**: ligado.

---

## 2. Colar o CSS dos formulários (uma vez só)

Menu ☰ (canto superior esquerdo) → **Configurações do site** → **CSS personalizado** →
cole o conteúdo **inteiro** de `form/form.css` → **Atualizar**.

O `@import` das fontes tem que ficar na **primeira linha** do campo. CSS descarta
`@import` que venha depois de qualquer regra — e descarta **em silêncio**, sem erro no
console: o único sintoma é o texto sair na fonte do tema. O passo 9.2 confere isso.

Sem Elementor Pro na conta que edita CSS, o caminho equivalente é **Aparência →
Personalizar → CSS adicional**, no painel do WordPress.

> Este CSS estiliza **só os dois formulários**. Os cinco blocos de HTML já trazem o
> próprio estilo dentro deles — não há mais nada para colar.

---

## 3. A ordem dos widgets (mapa da página)

Monte **de cima para baixo**, nesta ordem. As três seções (containers de primeiro
nível) são:

```
SEÇÃO A — hero                       fundo #f2f2e8
  └ linha de 2 colunas
      ├ coluna esquerda (584px)
      │   ├ widget HTML   → blocos/bloco-a-topo.html
      │   └ container ".lpb-hero-card"          ← classe CSS, passo 4.3
      │       ├ widget HTML   → blocos/bloco-a-hero-form-topo.html
      │       └ widget Formulário → "Formulário LP Black Hero"
      └ coluna direita (584px)
          └ widget Imagem → hero-foto-scooteira.png

SEÇÃO B — meio                       sem fundo próprio
  └ widget HTML   → blocos/bloco-b-meio.html

SEÇÃO C — final                      fundo #f12d64
  ├ widget HTML   → blocos/bloco-c-final.html
  ├ widget Formulário → "Formulário LP Black"   (ID CSS lpb-form)
  └ widget HTML   → blocos/bloco-c-pos-form.html
```

**Por que o formulário fica no meio de dois HTML:** o widget de Formulário **é** o card
branco da seção "Solicite o seu orçamento". O HTML de cima traz o FAQ e o título da
seção; o de baixo traz o "Prefere falar direto?" e o rodapé. Um widget não consegue
estilizar o irmão — por isso o rosa `#f12d64` tem que estar no **container**, e não só
nos blocos.

**Regra que vale para as três seções:** container com **Largura do conteúdo = Tela
cheia** (*Full Width*), **Padding 0** e **Espaçamento entre widgets (Gap) = 0**. Os
blocos são desenhados full-bleed e já trazem as próprias margens internas; qualquer
padding do Elementor vira um respiro que não existe no Figma. A única exceção é a seção
do hero, que tem padding próprio (passo 4.1).

**Como colar um bloco de HTML:** arraste o widget **HTML** para o lugar, abra
`blocos/<arquivo>.html` num editor de texto, **selecione tudo** (inclusive o comentário
do topo e a tag `<style>`) e cole no campo **Código HTML**. Cole o arquivo inteiro — o
`<style>` é parte do bloco.

---

## 4. Seção A — o hero

### 4.1 A seção

Adicione um **Container**. Aba **Layout**: Largura do conteúdo **Tela cheia**, Direção
**vertical**. Aba **Estilo → Fundo**: cor `#f2f2e8`. Aba **Avançado → Padding**:

```
topo 80   direita 80   baixo 0   esquerda 80
```

### 4.2 A linha de 2 colunas

Dentro da seção, adicione um **Container** filho:

- Layout: Direção **horizontal**, **Largura do conteúdo: Boxed**, **Largura máxima
  1280px**, Alinhar itens **Centro** (`align-items: center`), **Gap 64px**.
- Avançado → Padding: **80 em cima, 24 nas laterais, 80 embaixo**.

Isso dá uma linha útil de **1232px** começando em **x=104** na tela de 1440 — os números
do Figma. A conferência é o passo 9.1.

Dentro dela, dois containers filhos, cada um com **largura 584px**.

### 4.3 Coluna esquerda — texto + card do formulário

1. **Widget HTML** com `blocos/bloco-a-topo.html`.
   É o H1 "Você vai gerar demanda na Black Friday. / Quem vai dar conta?", o subtítulo,
   a linha de prova social e a régua de marcas.
2. Abaixo dele, no mesmo container da coluna, um **Container** novo. Este é o card do
   formulário:
   - Aba **Avançado → Classes CSS**: `lpb-hero-card`
     *(exatamente assim, sem ponto na frente).* É essa classe que desenha o card:
     miolo branco, moldura de 2px em degradê e o véu borrado atrás. O desenho vem do
     `bloco-a-hero-form-topo.html`, que você cola logo abaixo.
   - Aba **Avançado → Padding: 0 nos quatro lados.** **Este passo não é opcional.** O
     bloco já aplica 26px de padding pela classe; se o painel do Elementor também
     aplicar, a regra `.elementor-element-…` (que é mais específica) vence a do bloco,
     o padding dobra e o conteúdo desalinha.
   - Largura: **584px**. Sem fundo, sem borda, sem sombra no painel — tudo isso é do
     CSS do bloco.
   - Dentro do card, **nesta ordem**:
     1. **Widget HTML** com `blocos/bloco-a-hero-form-topo.html` (a etiqueta "Avaliação
        gratuita" + "Vamos entender sua operação");
     2. **Widget Formulário** → **"Formulário LP Black Hero"**. Monte seguindo o
        **passo 3 de `form/configuracao-form.md`** (3 campos: `name`, `email` e o
        anti-spam `quiz`; **sem ID CSS**; classes CSS
        `lpb-form-widget lpb-form-widget--hero`).

### 4.4 Coluna direita — a foto

Um **Widget Imagem** nativo do Elementor (não é HTML). Em **Escolher imagem** →
**Inserir da URL**, cole:

```
https://raw.githubusercontent.com/rafa-bulgarelli/lp-black-scooto-assets/main/hero-foto-scooteira.png
```

- **Texto alternativo**: `Scooteira sorrindo dentro do símbolo da Scooto`.
- Largura: **612px** (o tamanho do Figma), alinhamento **centro**. Se o container de
  584px apertar a imagem, tudo bem — ela encolhe proporcionalmente e é assim que o
  preview de QA a mostra.

> A foto é o **único** widget nativo que não é formulário nesta página. Ela não cabe
> dentro de nenhum dos arquivos HTML sem quebrar a coluna, por isso é widget.

---

## 5. Seção B — o meio da página

Um **Container** de primeiro nível, largura **Tela cheia**, **padding 0**, **sem fundo**
(cada seção lá dentro pinta o próprio), com **um único widget HTML**:
`blocos/bloco-b-meio.html`.

Ele traz, em ordem: a faixa dos 4 selos que fecha o hero (é full-bleed de 1440px, por
isso não cabe na coluna de 584px do hero) e as seções 02 a 08 — identificação, oferta,
urgência, as duas frentes, autoridade, prova social e como funciona.

É o maior arquivo dos cinco. Se o campo de HTML do Elementor demorar a colar, é o
tamanho — espere, não cole duas vezes.

---

## 6. Seção C — FAQ, formulário e rodapé

### 6.1 O container

Um **Container** de primeiro nível:

- Largura do conteúdo **Tela cheia**, Gap **0**.
- **Estilo → Fundo: cor `#f12d64`.** É o rosa que aparece atrás do widget de
  formulário. Os blocos pintam a própria área, mas nenhum deles alcança o widget de
  formulário que fica entre eles.
- **Avançado → Padding: 0 nos quatro lados.** Também não é opcional: os blocos já
  trazem o respiro em cima e embaixo do card. Com padding no container, o card desce e
  a seção fica ~96px mais alta que o desenho — foi exatamente o que o QA de pixel mediu
  quando o andaime do mock ficou no lugar.

### 6.2 Os três widgets, nesta ordem

1. **Widget HTML** → `blocos/bloco-c-final.html`
   (as 10 perguntas do FAQ, em acordeão sem JavaScript, + o título "Solicite o seu
   orçamento").
2. **Widget Formulário** → **"Formulário LP Black"**. Monte seguindo o **passo 2 de
   `form/configuracao-form.md`** (6 campos; **ID CSS `lpb-form`**; classes CSS
   `lpb-form-widget`).
   O **ID CSS `lpb-form` é obrigatório**: é o destino dos botões "Quero entender essa
   condição" e "Quero avaliar as duas frentes" do meio da página. Sem ele, os CTAs não
   descem para lugar nenhum.
   **Não crie um container branco em volta do formulário** — o widget já *é* o card
   branco. Dois cards é o erro mais comum aqui.
3. **Widget HTML** → `blocos/bloco-c-pos-form.html`
   ("Prefere falar direto?" + botão do WhatsApp + a linha de selos + o rodapé completo).

---

## 7. Os dois formulários

O passo a passo completo — campos, IDs, textos de botão, mensagens de sucesso e erro,
ações após o envio — está em **`form/configuracao-form.md`**. Não repita a leitura
daqui: aquele arquivo é o canônico.

O resumo do que os diferencia, para você não trocar um pelo outro:

| | **Formulário LP Black** | **Formulário LP Black Hero** |
|---|---|---|
| Onde | seção C, entre os dois HTML | dentro do container `lpb-hero-card`, no hero |
| Nome do formulário | `Formulário LP Black` | `Formulário LP Black Hero` |
| Campos | `name`, `email`, `cargo`, `empresa`, `site`, `phone` | `name`, `email`, `quiz` |
| Botão | `Enviar` | `Quero avaliar minha operação` |
| ID CSS | `lpb-form` | **vazio** |
| Classes CSS | `lpb-form-widget` | `lpb-form-widget lpb-form-widget--hero` |

Três detalhes que costumam passar batido:

- **O nome do formulário é o que aparece em *Elementor → Envios*.** Escrito errado,
  ninguém sabe de qual formulário veio o lead. Copie e cole da tabela acima, com acento.
- **O ID CSS `lpb-form` existe uma vez só na página.** É por isso que o formulário do
  hero fica sem ID: dois elementos com o mesmo ID quebram a rolagem dos CTAs.
- **O campo `quiz` do hero ("Quanto é 5 + 7?") é o anti-spam**, e o ID é `quiz` de
  propósito: fica **fora** dos seis IDs que o hook conhece, então ele ignora a resposta.

---

## 8. Publicar

**Publicar** → **Ver página**. Anote a URL: ela é o que se confere no passo 9 e é o que
o time da torre precisa para a validação final.

---

## 9. Conferência final

**Faça na página publicada, não no editor.** O editor do Elementor injeta CSS próprio e
mente sobre espaçamento. Marque um a um — esta lista é o critério de aceite do card 018.

### Visual e estrutura

- [ ] **9.1 Desktop ~1440px, lado a lado com `figma/frame-completo.png`.** Confira
      nesta ordem: hero → selos → 7 cards → oferta roxa → 4 meses → 2 frentes →
      autoridade → depoimentos → 3 passos → FAQ → formulário rosa → rodapé.
      Dois números conferem a montagem do hero de uma vez: o **H1 começa a 232px do
      topo da seção** e a **coluna esquerda começa em x=104**. Pelo console:
      `document.querySelector('.lpb-hero-topo__titulo').getBoundingClientRect()`
      → `x` ≈ 104, e `y` ≈ 232 com a página no topo. Errou os dois? O padding do
      passo 4.1/4.2 está diferente.
- [ ] **9.2 Fontes.** Títulos em **Sora**, corpo em **Roboto**. Pelo console:
      `getComputedStyle(document.querySelector('.lpb-faq__titulo')).fontFamily`
      → começa em `Sora`;
      `getComputedStyle(document.querySelector('.lpb-form-widget .elementor-field-label')).fontFamily`
      → começa em `Roboto`.
      Se vier a fonte do tema, o `@import` do passo 2 foi descartado — releia o aviso
      de lá. A saída de emergência: os blocos de HTML já trazem o mesmo import, e um
      deles basta para a página inteira.
- [ ] **9.3 Nenhum JavaScript nos blocos.** *Ver código-fonte* da página: não pode
      existir `<script` **nem** `<form` vindo dos cinco blocos (os dois formulários são
      widgets do Elementor — esses sim têm `<form>`, e é o certo).
- [ ] **9.4 Imagens.** DevTools → **Network** → filtro **Img**: **nenhum 404**, e toda
      imagem da LP vindo de `raw.githubusercontent.com`. São 4 no HTML dos blocos
      (foto do time, logo XP, logo Boca Rosa e a marca decorativa da seção rosa) mais a
      foto do hero, que é o widget de Imagem. Os 24 ícones pequenos são SVG dentro do
      próprio HTML — não geram requisição, e é assim mesmo.

### Comportamento

- [ ] **9.5 CTAs.** Clique em "Quero entender essa condição" (seção roxa) e em "Quero
      avaliar as duas frentes" (seção das duas frentes): a página tem que **descer
      suavemente** até o card branco do formulário. Se não desce, falta o **ID CSS
      `lpb-form`** no widget de Formulário (passo 6.2).
- [ ] **9.6 FAQ.** Abra e feche várias perguntas: funciona sem JavaScript, a primeira
      já vem aberta, e a seta gira ao abrir.
- [ ] **9.7 Envio do formulário completo.** Preencha os 6 campos (use o nome
      `TESTE TORRE <data>`) e envie: a mensagem de sucesso aparece **na própria tela**,
      sem sair da página.
- [ ] **9.8 Envio do formulário do hero.** Preencha nome, e-mail e o anti-spam e envie:
      mesma coisa, mensagem na tela.
- [ ] **9.9 Envios.** `wp-admin` → **Elementor** → **Envios**: as **duas** entradas
      estão lá, uma como **Formulário LP Black** e outra como **Formulário LP Black
      Hero**. Na do hero, `phone`, `cargo`, `empresa` e `site` vêm **vazios** — é
      esperado e foi decidido assim.
- [ ] **9.10 Intercom.** Quem tem acesso ao Intercom confere: contato criado/atualizado
      e ticket "Novo lead da LP - TESTE TORRE <data>" para **cada um** dos dois envios,
      com o telefone no formato `+55…` (o hook monta sozinho).

### Rodapé e mobile

- [ ] **9.11 Rodapé.** Três colunas; **não existe linha de CNPJ** (foi removida a pedido
      do dono e nenhum número foi chutado no lugar); em *Links* há **só** "Política de
      Privacidade" → `https://scooto.co/politica-de-privacidade/` (**não existe**
      página de Termos de Uso em scooto.co, por isso o link saiu); "Falar pelo
      WhatsApp" → `https://scooto.co/contato-whatsapp-2/`; e três ícones —
      **Instagram, LinkedIn e Facebook**, nesta ordem. Clique nos seis links: nenhum
      pode dar 404.
- [ ] **9.12 Celular (~390px).** Abra no telefone ou emule 390px no DevTools:
      **nada rola para o lado**, os pares Cargo/Empresa e Site/WhatsApp empilham, e o
      texto continua legível. Não existe desenho de celular no Figma — o critério aqui
      é dignidade, não fidelidade.

---

## 10. Se algo sair errado

| Sintoma | Causa quase sempre |
|---|---|
| O card do hero aparece sem a moldura colorida, ou o conteúdo desalinhado | falta a classe `lpb-hero-card` no container, ou o padding do container não está em **0** (passo 4.3) |
| Os CTAs do meio não descem para o formulário | falta o **ID CSS `lpb-form`** no widget de Formulário (passo 6.2) |
| Dois cards brancos na seção rosa | você criou um container branco em volta do formulário — o widget já é o card |
| Uma faixa branca aparece entre o FAQ e o formulário | o container da seção C está sem o fundo `#f12d64`, ou com padding (passo 6.1) |
| Os campos do formulário estão brancos, com borda cinza | o `form.css` não foi colado (passo 2), ou as classes CSS do widget estão escritas errado |
| O texto todo saiu na fonte do tema | o `@import` foi descartado — passo 2 e conferência 9.2 |
| Uma imagem não carrega | confira a URL: tem que começar em `https://raw.githubusercontent.com/rafa-bulgarelli/lp-black-scooto-assets/main/` |
| A página rola para o lado no celular | algum bloco foi colado pela metade — recole o arquivo inteiro |

---

## Arquivos que este guia usa

| Arquivo | O que é |
|---|---|
| `blocos/bloco-a-topo.html` | hero, coluna esquerda: H1, subtítulo, prova social |
| `blocos/bloco-a-hero-form-topo.html` | cabeçalho do card do hero + o CSS do próprio card |
| `blocos/bloco-b-meio.html` | faixa de selos + seções 02 a 08 |
| `blocos/bloco-c-final.html` | FAQ (10 perguntas) + título da seção do formulário |
| `blocos/bloco-c-pos-form.html` | "Prefere falar direto?" + rodapé |
| `form/form.css` | o visual dos dois formulários (passo 2) |
| `form/configuracao-form.md` | o passo a passo dos dois formulários (passo 7) |
| `contrato.md` | as decisões por trás de tudo isto (fonte para quem for editar) |
| `figma/` | o desenho original: `frame-completo.png` e as 11 seções |

Para ver a página montada **antes** de abrir o WordPress, sem instalar nada:

```bash
node entregas/lp-black-scooto/verify/servir.mjs --porta 5315
# depois abra http://localhost:5315/
```

E para conferir o resultado contra o Figma e auditar as imagens:

```bash
node entregas/lp-black-scooto/verify/qa-pixel.mjs --porta 5315   # com o preview no ar
node entregas/lp-black-scooto/verify/qa-assets.mjs
```

# LP Black Scooto — como montar os DOIS formulários no Elementor

> Passo a passo para quem **nunca viu este projeto**. Ao fim você terá dois widgets de
> **Elementor Pro Form** na landing page: o mini-form do topo e o formulário completo da
> seção "Solicite o seu orçamento". Os dois enviam de verdade, os dois aparecem em
> *Elementor → Envios*, e os dois disparam o hook do Intercom que já está instalado no
> site da Scooto.
>
> Tempo: ~25 minutos com o Elementor aberto. Não é preciso escrever uma linha de código
> — só colar o `form.css` uma vez (passo 1).

## Antes de começar

| Precisa | Por quê |
|---|---|
| **Elementor Pro ativo** | o widget "Formulário" é exclusivo do Pro; o widget de HTML não serve |
| Acesso de editor à página da LP | é onde os dois widgets entram |
| `form.css` (arquivo ao lado deste) | é todo o visual dos dois forms |

**O que NÃO fazer** (o hook do Intercom depende disto):

- **Não** mudar os IDs dos campos listados aqui. `name`, `email`, `phone`, `cargo`,
  `empresa` e `site` são contrato do hook: com o ID trocado, o dado chega vazio no
  Intercom e ninguém percebe até o comercial reclamar.
- **Não** colocar `+55` nem código de país no campo de WhatsApp. O hook limpa a máscara
  e prefixa o `+55` sozinho — se o campo já vier com ele, vira `+55+55`.
- **Não** criar campo oculto de UTM nem plugin de tracking. As UTMs já são capturadas
  por cookie pelo PixelYourSite.
- **Não** trocar o widget de Formulário por HTML colado. O hook só enxerga formulário
  nativo do Elementor Pro.

---

## Passo 1 — colar o CSS (uma vez, vale para os dois forms)

1. No editor da página: menu ☰ (canto superior esquerdo) → **Configurações do site** →
   **CSS personalizado**.
2. Cole o conteúdo **inteiro** de `form.css`.
   O `@import` das fontes tem que ficar na **primeira linha** do campo: CSS descarta
   `@import` que venha depois de qualquer regra, e aí os textos saem na fonte do tema.
   **Cuidado**: o WordPress/Elementor pode juntar esse CSS a outras regras no mesmo
   arquivo servido — se o `@import` cair depois delas, ele é descartado **em silêncio**,
   sem erro no console, e o único sintoma é a fonte errada. Por isso a conferência final
   tem um passo só para isso (item 2 lá embaixo). Se acontecer, a saída é carregar as
   fontes fora do CSS: os blocos de HTML da LP já trazem o mesmo `@import`, e um deles
   basta para a página inteira.
3. **Atualizar**.

Sem Elementor Pro na conta que edita CSS, a alternativa é **Aparência → Personalizar →
CSS adicional**, no painel do WordPress. O resultado é o mesmo.

Como saber que pegou: depois de montar um dos forms, clique com o botão direito num
campo → *Inspecionar*. O input tem que estar com fundo creme `rgb(242, 242, 232)` e
borda `1px solid rgb(223, 223, 212)`. Se estiver branco com borda cinza, o CSS não
carregou (ou a classe do widget está escrita errada — confira o passo 2.6 / 3.6).

---

## Passo 2 — "Formulário LP Black" (o formulário completo, seção 10)

### 2.1 Onde ele entra

Na seção rosa **"Solicite o seu orçamento"**, entre os dois widgets de HTML:
`bloco-c-final.html` (título + subtítulo) **acima**, `bloco-c-pos-form.html`
("Prefere falar direto?" + rodapé) **abaixo**. O widget é o **card branco inteiro** —
não crie um container branco em volta dele, senão você vai ter dois cards.

### 2.2 Nome do formulário

Painel do widget → aba **Conteúdo** → seção **Formulário** → campo **Nome do
formulário**: escreva exatamente

```
Formulário LP Black
```

É por esse nome que a submissão aparece em *Elementor → Envios* e é assim que se
distingue dele do form do topo. Nome errado aqui = ninguém sabe de qual form veio o lead.

### 2.3 Os 6 campos

Em **Itens do formulário**, apague os campos de exemplo e monte estes seis, **nesta
ordem**. Cada linha da tabela é um campo: clique nele para abrir e preencha
**Tipo**, **Rótulo**, **Espaço reservado** (placeholder), **Obrigatório** e
**Largura da coluna**; o ID fica na seção **Avançado** de dentro do campo (o controle se
chama **ID**, ou **Custom ID** em versões mais antigas).

| # | Rótulo | Tipo | Obrigatório | Largura | Placeholder | ID do campo |
|---|---|---|---|---|---|---|
| 1 | Seu Nome | Texto | Sim | 100% | *(vazio)* | Custom ID: name |
| 2 | E-mail | E-mail | Sim | 100% | *(vazio)* | Custom ID: email |
| 3 | Cargo | Texto | Sim | 50% | *(vazio)* | Custom ID: cargo |
| 4 | Nome da Empresa | Texto | Sim | 50% | *(vazio)* | Custom ID: empresa |
| 5 | Site | URL | Sim | 50% | *(vazio)* | Custom ID: site |
| 6 | WhatsApp | Telefone | Sim | 50% | `(XX) XXXXX-XXXX` | Custom ID: phone |

Detalhes que importam:

- **A ordem é visual**: 3 e 4 ficam lado a lado, 5 e 6 idem. É a largura 50% que faz o
  par; se um deles ficar em 100%, a linha quebra e o desenho some.
- O asterisco vermelho de obrigatório do Elementor vira **laranja `#ff6000`** pelo CSS —
  não precisa digitar "*" no rótulo.
- **Espaçamento entre colunas / linhas** (aba Estilo): pode deixar o padrão. O `form.css`
  fixa 16px nos dois, que é o número do Figma, e ganha do que estiver no painel.

### 2.4 Botão

Ainda em **Conteúdo → Formulário**: **Texto do botão** = `Enviar`.
Alinhamento: **Justificado** (o CSS já força largura total, mas assim o editor mostra
igual ao site).

### 2.5 Ações após o envio e mensagens

1. Seção **Ações após enviar**: deixe **apenas** `Coletar envios` (*Collect
   Submissions*). É o mínimo obrigatório — é o que guarda o lead em
   *Elementor → Envios*. Adicionar `E-mail` é decisão do dono, e não muda nada para o
   hook.
2. Seção **Opções adicionais** → ligue **Mensagens personalizadas** e escreva:
   - **Mensagem de sucesso**: `Recebemos seus dados. Alguém do time comercial entra em contato.`
   - **Mensagem de erro**: `Não deu para enviar agora. Confira os campos e tente de novo.`
   - **Mensagem de campo obrigatório**: `Preencha este campo.`
   - **Mensagem de campo inválido**: `Confira este campo.`

A mensagem de sucesso aparece **na própria tela**, dentro do card, logo abaixo do botão
(o `form.css` estiliza a caixa verde). Não configure redirecionamento: quem envia
precisa ver a confirmação sem sair da página.

### 2.6 Avançado (é aqui que o visual liga)

Aba **Avançado** do widget:

- **ID CSS**: `lpb-form`
  → é a âncora dos botões "Quero entender essa condição" e "Quero avaliar as duas
  frentes" (eles apontam para `#lpb-form`). Sem isso, os CTAs do meio da página não
  descem para lugar nenhum.
- **Classes CSS**: `lpb-form-widget`

Um ID CSS só pode existir **uma vez na página** — por isso o form do topo (passo 3) fica
sem ID.

---

## Passo 3 — "Formulário LP Black Hero" (o mini-form do topo)

### 3.1 Onde ele entra

Dentro do container do card do hero (o que tem a classe `lpb-hero-card`), **logo abaixo**
do widget de HTML `bloco-a-hero-form-topo.html` (badge "Avaliação gratuita" + "Vamos
entender sua operação"). O widget não desenha card: quem faz a moldura em gradiente é o
container.

### 3.2 Nome do formulário

**Nome do formulário**:

```
Formulário LP Black Hero
```

### 3.3 Os 3 campos

| # | Rótulo | Tipo | Obrigatório | Largura | Placeholder | ID do campo |
|---|---|---|---|---|---|---|
| 1 | Nome | Texto | Sim | 100% | `Nome` | Custom ID: name |
| 2 | E-mail corporativo | E-mail | Sim | 100% | `E-mail corporativo` | Custom ID: email |
| 3 | Quanto é 5 + 7? | Número | Sim | 100% | `Quanto é 5 + 7?` | Custom ID: quiz |

- **Preencha o rótulo E o placeholder com o mesmo texto.** Na tela o rótulo some (o CSS
  o esconde com a técnica *sr-only*), mas ele continua no HTML para quem usa leitor de
  tela. Rótulo apagado deixaria o campo mudo para essas pessoas.
- O terceiro campo é o **anti-spam**. O ID `quiz` é de propósito: ele fica **fora** dos
  seis IDs que o hook conhece, então o hook simplesmente ignora a resposta.
- Os quatro IDs que só existem no form completo (`phone`, `cargo`, `empresa`, `site`)
  chegam **vazios** ao Intercom por este form. É esperado e foi aceito pelo dono.
- Os ícones de pessoa e de envelope dentro dos dois primeiros campos vêm do `form.css`
  (o widget de formulário não tem ícone por campo). Nada a configurar.

### 3.4 Botão

**Texto do botão**: `Quero avaliar minha operação`.
O gradiente e a seta à direita são do CSS — no Figma o fundo desse botão é uma imagem, e
o `form.css` a reproduz com um gradiente horizontal de quatro paradas (roxo → rosa →
laranja → roxo de novo na ponta direita). Não troque por cor sólida no painel do
Elementor: o CSS vence, mas a pré-visualização do editor fica mentindo. Alinhamento:
**Justificado**.

### 3.5 Ações após o envio e mensagens

Igual ao passo 2.5: **apenas** `Coletar envios` + mensagens personalizadas. Sugestão de
mensagem de sucesso, mais curta porque o card é pequeno:
`Recebemos. Alguém do time entra em contato.`

### 3.6 Avançado

- **ID CSS**: deixe **vazio**. (A âncora `#lpb-form` é exclusiva do form completo; dois
  elementos com o mesmo ID quebram a rolagem dos CTAs.)
- **Classes CSS**: `lpb-form-widget lpb-form-widget--hero`
  As duas, separadas por espaço: a primeira traz o estilo comum, a segunda o que muda no
  topo (sem card, campos com ícone, botão em gradiente, nota alinhada à esquerda).

---

## Limitações conhecidas (não são bugs — são escolhas registradas)

1. **O anti-spam não confere a resposta.** O Elementor exige que o campo seja preenchido,
   mas não compara o valor com 12. Qualquer número passa. Barrar de verdade exigiria
   JavaScript, e a LP é zero JS por decisão do dono. O campo continua valendo: robô de
   formulário genérico costuma deixá-lo vazio e o envio falha na obrigatoriedade.
   *Se* a sua versão do Elementor Pro mostrar **Valor mínimo** e **Valor máximo** no
   campo Número, preencher `12` nos dois fecha essa porta sem uma linha de script —
   confira na instalação e, se existir, use.
2. **A nota "Seus dados ficam com a gente…" não é um campo.** O Elementor Pro sempre
   renderiza o botão como último item do formulário: não há onde colocar texto depois
   dele **dentro** do widget. Ela entra pelo CSS (`.lpb-form-widget::after`) e o texto
   está escrito no `form.css` — para mudar a frase, mude lá, não no Elementor. Se o dono
   preferir a nota como texto de verdade no HTML, a alternativa é um widget **Editor de
   Texto** logo abaixo do formulário, no mesmo container.
3. **Os dois forms geram IDs de HTML repetidos.** Como os dois usam os IDs `name` e
   `email` (obrigação do hook), o Elementor gera `form-field-name` e `form-field-email`
   duas vezes na mesma página. Efeito prático: só o clique em rótulo ficaria ambíguo — e
   no form do topo os rótulos são invisíveis, então ninguém clica neles. **Não "conserte"
   trocando os IDs dos campos**: isso quebra o hook, que é o que importa.
4. **Sem Elementor Pro não há formulário.** O widget de HTML aceita markup, mas o hook
   ignora — e formulário dentro de formulário é HTML inválido, o navegador desmonta em
   silêncio.

---

## Conferência final (faça na página publicada, não só no editor)

1. **Visual**: compare com `../figma/secao-01-hero.png` (topo) e
   `../figma/secao-10-formulario-completo.png` (completo). Campos creme de 46px, borda
   clara, raio 8; botão roxo `#4a1be8` no completo e em gradiente no do topo.
2. **Fonte** (é o passo que pega o `@import` descartado): inspecione um rótulo do form
   completo → *Computed* → `font-family` tem que começar em **Roboto**; no H2 "Solicite o
   seu orçamento", em **Sora**. Se vier a fonte do tema, as fontes não carregaram — veja
   o aviso do passo 1. Pelo console dá para conferir de uma vez:
   `getComputedStyle(document.querySelector('.lpb-form-widget .elementor-field-label')).fontFamily`
3. **Foco**: clique num campo — a borda fica roxa com um anel claro em volta. Se não
   ficar, o CSS não está carregando.
4. **Envio de verdade, um form de cada vez**: preencha e envie. Tem que aparecer a
   mensagem de sucesso na tela, sem sair da página.
5. **Envios**: `wp-admin → Elementor → Envios`. Devem estar lá duas entradas, uma por
   **Formulário LP Black** e outra por **Formulário LP Black Hero**, com os campos
   preenchidos e os do topo em branco no que não existe.
6. **Intercom**: contato criado e ticket aberto, com telefone no formato `+55…` (o hook
   monta) — quem confere é quem tem acesso ao Intercom.
7. **Celular**: no ~390px os pares Cargo/Empresa e Site/WhatsApp empilham, o card ganha
   padding menor e nada rola para o lado.

## Arquivos desta pasta

| Arquivo | O que é |
|---|---|
| `configuracao-form.md` | este passo a passo |
| `form.css` | **canônico** — o visual dos dois forms; é o que se cola no WordPress |
| `form-mock.html` | mock de QA do **Formulário LP Black** (não vai para o WordPress) |
| `form-mock-hero.html` | mock de QA do **Formulário LP Black Hero** (idem) |

Os mocks reproduzem o HTML que o Elementor gera, com uma cópia do `form.css` embutida,
para conferir o visual no navegador antes de existir WordPress:

```bash
node entregas/lp-black-scooto/verify/servir.mjs --porta 5314
#  /?bloco=form-mock        card completo sobre o fundo rosa da seção 10
#  /?bloco=form-mock-hero   mini-form dentro de uma simulação do card do hero
```

Mudou o `form.css`? **Copie o novo conteúdo para o `<style>` dos dois mocks** — o `.css`
é a fonte da verdade, os mocks são cópia.

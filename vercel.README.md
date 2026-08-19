# `vercel.json`, comentado

O schema da Vercel **recusa** qualquer propriedade extra — inclusive a chave
`"//"`, que é a convenção usual para comentar JSON. O deploy falha com
_"should NOT have additional property"_. Então a explicação mora aqui.

## `buildCommand`

```json
"buildCommand": "pnpm build"
```

O `pnpm build` deixou de ser `tsc -b && vite build`: agora ele termina em
`node scripts/prerender.mjs`, que escreve um `dist/<rota>/index.html` por página
SEO e o `dist/sitemap.xml`. Sem esta linha o deploy fica na mão do preset
detectado pela Vercel — que roda `vite build` direto quando reconhece o
framework, pula o prerender e publica um `dist/` sem nenhuma das páginas
orgânicas. O sintoma é cruel: build verde, site no ar, e todo caminho
`/solucoes/...` caindo no rewrite da SPA com o título da landing.

## `trailingSlash`

```json
"trailingSlash": false
```

Cada página SEO existe como `dist/<rota>/index.html`, e o filesystem tem
precedência sobre o `rewrite` abaixo — a mesma razão pela qual `/robots.txt` não
vira a landing. Com um arquivo em `dist/solucoes/x/index.html`, portanto, a
Vercel atende **as duas formas** do caminho, com e sem barra: duas URLs para o
mesmo conteúdo, que é exatamente a duplicata que um canonical existe para
evitar.

`false` fecha isso: a forma sem barra é a canônica, e `/solucoes/x/` responde
**308** para `/solucoes/x`. É a mesma URL que o `<link rel="canonical">` e o
`sitemap.xml` publicam — os três têm de continuar concordando.

Atenção ao provar isso localmente: o `vite preview` usa o **sirv**, que faz o
contrário. Ele serve o arquivo em `/solucoes/x/` **com** barra e manda
`/solucoes/x` para a SPA. Não é a Vercel discordando do repositório; é outro
servidor. A prova sem barra é no Preview da Vercel.

## `rewrites`

```json
{ "source": "/(leads|admin|conversor|manual-doxa)", "destination": "/index.html" },
{ "source": "/(conversor|manual-doxa)/(.*)", "destination": "/index.html" }
```

A regra **lista as rotas da SPA pelo nome**, e essa é a decisão inteira. Antes ela
era o inverso — `/((?!api/)(?!.*\.[a-zA-Z0-9]{1,8}$).*)`, isto é, "tudo, menos o
que eu me lembrei de excluir" — e uma lista de exceções nunca fica completa.

### Por que uma allowlist, e não mais uma exceção

O `src/App.tsx` decide qual tela mostrar com um `switch` no `pathname`, e são
cinco casos: a landing (que é servida do disco e não passa por aqui) e mais
quatro. Dessas quatro, duas casam por caminho EXATO (`/leads`, `/admin` — não há
nada embaixo delas) e duas casam por prefixo, porque têm navegação interna
(`/conversor/…`, `/manual-doxa/…`). Os dois rewrites acima são exatamente essa
tabela — nem uma rota a mais.

Com a regra antiga, qualquer caminho sem extensão virava a landing com **200**:
`/guias/nao-existe` respondia a página inicial, e `/leads/xpto` também. Para o
Google isso é *soft 404* — ele pede uma URL que não existe, recebe 200 e um
conteúdo que não tem nada a ver, e passa a desconfiar do que o resto do site
promete. Para a pessoa é pior: ela clicou num link velho e caiu numa home que
não explica o que aconteceu.

Trocar por uma allowlist resolve os dois de uma vez, e resolve **por
construção**: a rota nova do site só existe quando alguém a escreve aqui. O
preço é esse mesmo — quem criar a sexta rota de SPA tem de acrescentar uma
linha, senão ela nasce dando 404. É um erro barulhento no primeiro teste, e é o
oposto do erro anterior, que era silencioso e durava meses.

### O que o `handle: filesystem` já resolvia antes

As duas exclusões da regra antiga viraram desnecessárias, e vale saber por quê
antes de recolocá-las por reflexo:

- `(?!api/)` — o `POST /api/lead` recebia de volta o HTML da landing e o
  formulário falhava com um erro de JSON que não explicava nada. Hoje `/api/lead`
  simplesmente não casa com nenhum dos dois `source`.
- `(?!.*\.[a-zA-Z0-9]{1,8}$)` — sem ela, arquivo inexistente com extensão caía na
  SPA: `GET /llms.txt` devolvia `200` com `content-type: text/html`. Não é
  hipótese: o Lighthouse pediu `/llms.txt`, recebeu a landing, tentou lê-la como
  Markdown e reprovou a auditoria de navegação agêntica com "o arquivo não tem um
  cabeçalho H1" — um erro sobre um arquivo que naquele momento nem existia no
  repositório. A mensagem falava de conteúdo, e a causa era de roteamento. Hoje
  `/llms.txt` também não casa com nada.

O que **não** mudou: o `handle: filesystem` do Build Output continua vindo ANTES
dos rewrites. É por isso que `/`, `/robots.txt`, `/assets/<hash>.js` e as 68
páginas pré-geradas em `dist/<rota>/index.html` são servidas do disco sem chegar
aqui — e é a mesma razão pela qual `trailingSlash: false` continua dando 308.

### O 404 de verdade

O Build Output já trazia a rota de erro
`{"status":404,"src":"^(?!/api).*$","dest":"/404.html"}` — ela é do preset Vite
da Vercel e nunca precisou ser escrita. O que faltava eram as duas metades:
`dist/404.html` não existia, e o rewrite engolia o caminho antes de a rota de
erro ser consultada. Hoje o `scripts/prerender.mjs` escreve o arquivo (a página
está em `src/seo/layout/Pagina404.tsx`, com `noindex`, sem canonical e fora do
sitemap) e o rewrite deixa passar.

### A tabela de casos

Cada linha aqui é uma coisa que já quebrou ou que quebraria em silêncio. Depois
de qualquer mexida neste bloco, todas continuam valendo:

| Caminho | Esperado | Quem responde |
|---|---|---|
| `/` | 200, a landing | filesystem (`dist/index.html`) |
| `/leads`, `/admin` | 200, HTML da SPA | rewrite 1 |
| `/conversor`, `/manual-doxa` | 200, HTML da SPA | rewrite 1 |
| `/conversor/<sub>`, `/manual-doxa/<sub>` | 200, HTML da SPA | rewrite 2 |
| `/api/lead` | chega na função, não na landing | filesystem (função) |
| `/assets/<hash>.js`, `/robots.txt` | 200, o arquivo de verdade | filesystem |
| `/solucoes/<slug>` | 200, o HTML pré-gerado (title da página, não o da landing) | filesystem |
| `/solucoes/<slug>/` | **308** para a forma sem barra | `trailingSlash: false` |
| `/guias/nao-existe` | **404** com a página de erro da casa | `handle: error` → `/404.html` |
| `/leads/xpto`, `/adminx` | **404** — a SPA não tem essas rotas | `handle: error` → `/404.html` |
| `/qualquer-coisa.txt` | **404** | `handle: error` → `/404.html` |

Se `/solucoes/<slug>` devolver o título da landing, o prerender não rodou —
comece pelo `buildCommand`. Se uma rota da SPA devolver 404, ela não está na
lista aqui em cima.

A prova destas linhas **não é local**. O `vite preview` usa o sirv, que serve
`index.html` para tudo e nunca dá 404; o que dá para conferir na máquina é o
`.vercel/output/config.json` gerado por `vercel build` — as rotas compiladas, com
o `handle: filesystem` antes dos rewrites e a rota de erro depois. O resto é no
Preview ou em produção.

## `headers`

As fontes são versionadas pelo nome do arquivo e nunca mudam de conteúdo — um
ano de cache imutável é o certo para elas, e não vale para mais nada do site.

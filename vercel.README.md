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
{ "source": "/((?!api/)(?!.*\\.[a-zA-Z0-9]{1,8}$).*)", "destination": "/index.html" }
```

O site é uma SPA: qualquer caminho tem de servir a mesma página, senão
`/leads` digitado na barra devolve 404.

A regra tem **duas exclusões**, e cada uma custou um bug.

### `(?!api/)` — sem ela o endpoint serverless não existe

O `POST /api/lead` recebe de volta o HTML da landing, e o formulário falha com um
erro de JSON que não explica nada. Foi por isso que a expressão deixou de ser
`/(.*)`.

### `(?!.*\.[a-zA-Z0-9]{1,8}$)` — sem ela o site não tem 404

Um rewrite que captura tudo transforma **todo 404 num 200**. Arquivo estático que
existe não passa por aqui (o filesystem da Vercel tem precedência), mas arquivo
que **não** existe caía na SPA: `GET /llms.txt` devolvia `200` com
`content-type: text/html` e a landing inteira no corpo.

Não é hipótese. O Lighthouse pediu `/llms.txt`, recebeu a landing, tentou lê-la
como Markdown e reprovou a auditoria de navegação agêntica com "o arquivo não tem
um cabeçalho H1" — um erro sobre um arquivo que naquele momento nem existia no
repositório. O diagnóstico se perde fácil: a mensagem fala de conteúdo, e a causa
é de roteamento.

A exclusão vale só para o **último segmento** do caminho, o que preserva o que
importa: caminho sem extensão continua indo para a SPA (`/leads`, e qualquer rota
futura), e caminho com extensão que não existe no disco volta a devolver 404.

Seis casos que precisam continuar passando depois de qualquer mexida aqui — os
quatro de sempre e os dois que as páginas SEO acrescentaram:

| Caminho | Esperado |
|---|---|
| `/` e `/leads` | 200, HTML da SPA |
| `/api/lead` | chega na função, não na landing |
| `/assets/<hash>.js`, `/robots.txt` | 200, o arquivo de verdade |
| `/qualquer-coisa.txt` | **404** |
| `/solucoes/<slug>` | 200, o HTML pré-gerado (title da página, não o da landing) |
| `/solucoes/<slug>/` | **308** para a forma sem barra |

As duas últimas não passam pelo `rewrite`: elas existem no disco como
`dist/solucoes/<slug>/index.html`. Se alguma delas devolver o título da landing,
o prerender não rodou — comece pelo `buildCommand`.

## `headers`

As fontes são versionadas pelo nome do arquivo e nunca mudam de conteúdo — um
ano de cache imutável é o certo para elas, e não vale para mais nada do site.

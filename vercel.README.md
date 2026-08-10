# `vercel.json`, comentado

O schema da Vercel **recusa** qualquer propriedade extra — inclusive a chave
`"//"`, que é a convenção usual para comentar JSON. O deploy falha com
_"should NOT have additional property"_. Então a explicação mora aqui.

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

Quatro casos que precisam continuar passando depois de qualquer mexida aqui:

| Caminho | Esperado |
|---|---|
| `/` e `/leads` | 200, HTML da SPA |
| `/api/lead` | chega na função, não na landing |
| `/assets/<hash>.js`, `/robots.txt` | 200, o arquivo de verdade |
| `/qualquer-coisa.txt` | **404** |

## `headers`

As fontes são versionadas pelo nome do arquivo e nunca mudam de conteúdo — um
ano de cache imutável é o certo para elas, e não vale para mais nada do site.

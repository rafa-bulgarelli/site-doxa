# `vercel.json`, comentado

O schema da Vercel **recusa** qualquer propriedade extra — inclusive a chave
`"//"`, que é a convenção usual para comentar JSON. O deploy falha com
_"should NOT have additional property"_. Então a explicação mora aqui.

## `rewrites`

```json
{ "source": "/((?!api/).*)", "destination": "/index.html" }
```

O site é uma SPA: qualquer caminho tem de servir a mesma página, senão
`/leads` digitado na barra devolve 404.

A **exclusão de `/api` é obrigatória**. Sem ela o endpoint serverless nunca é
alcançado: o `POST /api/lead` recebe de volta o HTML da landing, e o formulário
falha com um erro de JSON que não explica nada. Foi por isso que a expressão
deixou de ser `/(.*)`.

## `headers`

As fontes são versionadas pelo nome do arquivo e nunca mudam de conteúdo — um
ano de cache imutável é o certo para elas, e não vale para mais nada do site.

# Estilo obrigatório — Google TypeScript Style Guide (template portável)

Todo código TS/TSX NOVO ou EDITADO segue https://google.github.io/styleguide/tsguide.html
com os desvios documentados abaixo (convenção estabelecida do repo VENCE o guia — não
reformatar código existente que segue a house style).

> PORTÁVEL: ao colar num projeto novo, revise a seção "Desvios deliberados" — ela é
> por-repo (aspas, export default em pages, idioma dos comentários). O resto é universal.

## Não-negociáveis
- **`const`/`let`, nunca `var`**; `let` só se reatribui.
- **`===`/`!==`**; única exceção: `== null` (pega null E undefined num check só).
- **Sem `any`** — `unknown` + narrowing, generics, ou modelar o tipo. `as any`/`@ts-ignore`
  são débito banido (repo já trata como erro).
- **Evitar `!` e `as`** — prove com runtime check (`instanceof`, type guard). Assertion
  inevitável: `as` (nunca `<Foo>x`) + comentário curto `// safe: …` quando não for óbvio.
  Objeto literal tipado por ANOTAÇÃO (`const f: Foo = {…}`), não `{…} as Foo`.
- **`interface` para shapes de objeto**; `type` alias só p/ unions/tuplas/primitivos.
  Alias não embute `| null`/`| undefined` — ausência é `campo?:` no ponto de uso.
- **`import type`** quando o símbolo só é usado como tipo.
- **Arrays**: açúcar p/ simples (`string[]`, `Foo[]`), genérico p/ complexo
  (`Array<string | number>`, `Array<{ n: number }>`).
- **Erros**: sempre `throw new Error(...)`; `catch` vazio exige comentário; `switch` com
  `default` final.
- **Números**: `Number(x)` + check explícito `Number.isNaN(...)`; nunca unário `+x`;
  `parseInt` só não-base-10 (com radix). Nunca `!!enumValue`.
- **Strings**: template literal > concatenação com `+`.
- **Naming**: UpperCamelCase (classes/interfaces/types/enums) · lowerCamelCase
  (vars/params/funções/membros) · CONSTANT_CASE só constante de módulo e valor de enum.
  Sem `IFoo`, sem `_leading/trailing`, acrônimo como palavra (`loadHttpUrl`).
- **Funções/classes**: `function foo()` p/ nomeadas, arrow p/ callback; parameter
  properties (`constructor(private readonly svc: Svc) {}`); `readonly` no que não
  reatribui; `private` (nunca `#campo`); handler de evento = arrow (nunca `.bind(this)`).
- **Docs**: JSDoc `/** … */` p/ API exportada; `//` p/ nota de implementação. Não repetir
  tipo/nome no doc.

## Desvios deliberados (house style do repo Doxa)
1. **Aspas DUPLAS** (guia manda simples; o repo inteiro usa duplas + prettier no lint-staged).
2. **`export default` em páginas/componentes React** onde o padrão do repo já é esse
   (`client/src/pages/*`, componentes como OnboardingDrawer). Código de server/shared/lib:
   named exports SEMPRE.
3. Comentários em PT-BR seguindo o tom do repo (explicam o PORQUÊ/invariante, não o quê).

## Verificação
`pnpm check` (tsc) limpo + `pnpm test` verde + zero `any`/`as any`/`@ts-ignore` novos no diff
(`git diff origin/main...HEAD | grep -nE 'as any|@ts-ignore|: any'` = vazio).

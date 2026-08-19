# Medição SEO (card 012) — PRELUDE: guardar a chave + prova de acesso ao Search Console (prelude-gsc-acesso)

Você é o EXECUTOR, numa worktree isolada criada pelo harness
(`~/orca/workspaces/site-doxa/prelude-gsc-acesso`, branch **`prelude-gsc-acesso`**,
nascida de `origin/main` @ `85d0294`+).

## SEGURANÇA — leia antes de qualquer comando (não negociável)
- **A chave JSON da service account é SEGREDO.** Hoje ela está em
  `~/Downloads/doxa-506016-c45c4f21acf4.json`. Você **NÃO LÊ o conteúdo** dela — nem
  `cat`, nem `Read`, nem `jq`, nem `head`, nem `grep` no arquivo, nem `node -e` que
  imprima campo. Só o script a lê, em runtime, e nunca imprime nada além de
  `client_email`-sem-valor / status HTTP.
- Nenhum trecho da chave (`private_key`, `private_key_id`, `client_id`, nada) vai para
  report, commit, pack, card, log, teste ou fixture. Teste usa par de chaves GERADO na
  hora com `crypto.generateKeyPairSync`.
- **Nunca dentro do repo.** Destino único: `~/.config/doxa/gsc-service-account.json`,
  `chmod 600`, diretório `chmod 700`. Se algum passo copiar o arquivo para a worktree
  por engano → PARE, apague, reporte.
- Output de API colado no report: **sem `access_token`, sem `Bearer …`, sem `ya29.`**.
  `sites.list` e `sitemaps.list` não devolvem token — podem ser colados inteiros.
- O que NÃO é segredo e pode aparecer: o e-mail da service account
  (`torre-seo@doxa-506016.iam.gserviceaccount.com`), o caminho do arquivo, os nomes
  das env vars, a resposta de `sites.list`/`sitemaps.list`.
- Sem MCP do Google, sem `googleapis`, **zero dependência nova**: `fetch` e `crypto` do
  Node 24 (`node --version` = v24.x nesta máquina; `engines` diz >=20 e `crypto.sign`
  RS256 existe desde o 12).

## STEP 0 (obrigatório, antes de qualquer edit)
`git rev-parse --show-toplevel` = a worktree, NÃO `~/orca/projects/site-doxa` ·
`git branch --show-current` = `prelude-gsc-acesso` · `git status --porcelain` vazio ·
`git fetch origin && git rebase origin/main` (base É main; não há feature branch) ·
`pnpm install --frozen-lockfile`. Divergiu → **PARE e reporte**.
`ls ~/Downloads/doxa-506016-*.json` tem de listar exatamente 1 arquivo (só o nome —
NÃO abra). Se não existir → PARE e reporte (o dono pode já ter movido).

Leia antes: `scripts/prerender.mjs` e `scripts/seo-audit.mjs` (a forma dos scripts Node
desta casa: `.mjs`, cabeçalho que explica o PORQUÊ, `morrer()` com exit 1, aspas
simples), `.claude/STYLE-GOOGLE-TS.md`, `CLAUDE.md` → "Fatos do repo",
`.claude/tower/cards/012-seo-medicao-gsc.md`, `vite.config.ts` (vitest: include
default pega `**/*.test.mjs`; só `.claude/**` é excluído).

## A VISÃO DO DONO
A torre enxergando os dados reais de busca da Doxa — que queries mostram o site, em que
posição, com quantas impressões — para a rodada 4 de SEO ser dirigida por dado e não por
palpite. Este prelude é a fundação: a chave guardada direito, e a PROVA executável de que
a service account enxerga a propriedade do Search Console (e que o sitemap de 69 URLs
está submetido lá).

## CONTEXTO (não perca tempo redescobrindo)
- O site está em produção desde 2026-08-18 com 68 rotas prerenderizadas
  (`scripts/prerender.mjs`) e `https://www.doxaviral.com/sitemap.xml` com **69 `<loc>`**
  (home + 68). Domínio com **L**: `doxaviral.com`.
- Setup do dono (card 012) já feito: projeto GCP `doxa-506016`, Search Console API
  ativada, service account `torre-seo@doxa-506016.iam.gserviceaccount.com` adicionada à
  propriedade com permissão **Total**. Duas incertezas que VOCÊ resolve por API, não por
  pergunta: (a) a propriedade é `sc-domain:doxaviral.com` (Domínio) ou
  `https://www.doxaviral.com/` (prefixo)? → `sites.list` responde; (b) o sitemap já foi
  submetido? → `sitemaps.list` responde; se não, você submete com `sitemaps.submit`.
- API (REST, sem SDK):
  - Token: JWT RS256 assinado com a `private_key` da chave (`iss` = `client_email`,
    `scope`, `aud` = `token_uri` da chave — hoje `https://oauth2.googleapis.com/token`,
    `iat`, `exp` = `iat`+3600), POST no `token_uri` com
    `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=<jwt>`
    (`application/x-www-form-urlencoded`) → `{ access_token, expires_in, token_type }`.
  - Escopos: leitura `https://www.googleapis.com/auth/webmasters.readonly`; escrita
    (só para `sitemaps.submit`) `https://www.googleapis.com/auth/webmasters`.
  - `GET https://www.googleapis.com/webmasters/v3/sites` → `{ siteEntry: [{ siteUrl,
    permissionLevel }] }` (se a SA não estiver na propriedade, vem `{}` — isso é
    "acesso NÃO de pé", e a mensagem do script diz exatamente o que conferir no painel).
  - `GET https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/sitemaps` → `{ sitemap:
    [{ path, lastSubmitted, lastDownloaded, isPending, isSitemapsIndex, warnings,
    errors, contents: [{ type, submitted, indexed }] }] }`. **`contents[].indexed` é campo
    DEPRECADO e devolve 0 sempre** — não o interprete como "0 indexadas".
  - `PUT https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/sitemaps/{feedpath}`
    → 204 sem corpo. `{siteUrl}` e `{feedpath}` vão com `encodeURIComponent`
    (`sc-domain:doxaviral.com` → `sc-domain%3Adoxaviral.com`;
    `https://www.doxaviral.com/sitemap.xml` → `https%3A%2F%2Fwww.doxaviral.com%2Fsitemap.xml`).
  - `POST https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query`
    e `POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect` — a
    track de baseline usa; você só expõe os wrappers (abaixo).
- Decisões do GESTOR:
  - Código em **`scripts/gsc/`**, `.mjs` (fora do `tsc -b` — o projeto `node` do
    tsconfig só inclui `vite.config.ts`; é o mesmo regime de `scripts/prerender.mjs`).
    JSDoc nas exportadas; estilo do `STYLE-GOOGLE-TS.md` no que se aplica a JS.
  - Três módulos com contrato FIXO (a track A importa por estes nomes — não renomeie):
    `scripts/gsc/auth.mjs`, `scripts/gsc/api.mjs`, `scripts/gsc/prova.mjs`.
  - Caminho da chave: env **`GSC_KEY_PATH`**, default
    `~/.config/doxa/gsc-service-account.json` (`os.homedir()`, nunca `~` literal).
    Propriedade: env **`GSC_SITE_URL`**; sem ela, a escolha é automática (abaixo).
  - Escopo de leitura por padrão; o de escrita só quando `--submeter` for passado.
  - `.env.example` **não se toca** (está sob deny-rule `**/.env*` do harness — o
    comando seria bloqueado). As env vars ficam documentadas no cabeçalho de `auth.mjs`;
    o `CLAUDE.md` é da track de docs.
- Armadilhas do repo que ESTE prelude pode pisar:
  - `package.json` é `"type": "module"`; `.mjs` com `import` nativo, como os vizinhos.
  - `pnpm build` = `tsc -b && vite build && node scripts/prerender.mjs` — você não mexe
    em nada disso; só acrescenta o script `gsc:prova`. O build tem de continuar em 68
    rotas.
  - `.gitignore` já tem `*.pem`/`*.key`/`.env*`; ganha regras ESPECÍFICAS para a chave
    (não `*.json` — esconderia `package.json`/`tsconfig*.json` novos).
  - Domínio com L. O outro (`doxavira.com`) não é nosso.

## A TASK
1. **Mover a chave (primeiro, antes de qualquer código).**
   `mkdir -p ~/.config/doxa && chmod 700 ~/.config/doxa &&
   mv ~/Downloads/doxa-506016-*.json ~/.config/doxa/gsc-service-account.json &&
   chmod 600 ~/.config/doxa/gsc-service-account.json`. Confirme com
   `ls -la ~/.config/doxa/` (`-rw-------`) e `ls ~/Downloads/doxa-506016-*.json`
   (nenhum). O `mv` não imprime conteúdo; não use `cat`/`cp` com redirecionamento.
2. **`.gitignore`** — bloco curto depois do de `*.pem`/`*.key`, com o porquê em 1 linha:
   `gsc-service-account*.json`, `*-service-account*.json`, `doxa-506016-*.json`.
3. **`scripts/gsc/auth.mjs`** — cabeçalho explicando o fluxo (JWT → token), as env vars
   e a regra "nunca logar token/chave". Exporta:
   - `ESCOPO_LEITURA`, `ESCOPO_ESCRITA` (as duas URLs acima);
   - `caminhoDaChave()` → `process.env.GSC_KEY_PATH` ou o default;
   - `lerChave(caminho)` → lê o JSON, valida que `client_email`, `private_key`,
     `token_uri` existem (erro claro se o arquivo não existe ou falta campo — a
     mensagem cita o CAMINHO, nunca conteúdo);
   - `montarJwt({ clientEmail, escopo, audiencia, agora })` — **pura**: devolve
     `{ cabecalho, corpo, mensagem }` (header `{alg:'RS256',typ:'JWT'}` e claims em
     base64url; `mensagem` = `cabecalho.corpo`), `exp` = `agora`+3600;
   - `assinar(mensagem, chavePrivadaPem)` — `crypto.sign('RSA-SHA256', …)` → base64url;
   - `obterToken({ escopo = ESCOPO_LEITURA })` → `access_token` (string). Nunca o loga.
   Helper `base64url(buffer|string)` local.
4. **`scripts/gsc/api.mjs`** — wrappers finos sobre `fetch`, todos recebem `token` como
   primeiro argumento e lançam `Error` com `status` + os primeiros ~300 caracteres do
   corpo do erro (corpo de erro não carrega token). Exporta:
   `listarPropriedades(token)` · `listarSitemaps(token, siteUrl)` ·
   `submeterSitemap(token, siteUrl, feedpath)` · `consultarBusca(token, siteUrl, corpo)`
   (POST searchAnalytics/query; devolve o JSON) · `inspecionarUrl(token, siteUrl, url)`
   (POST urlInspection; `{ inspectionUrl: url, siteUrl, languageCode: 'pt-BR' }`) ·
   `codificarSiteUrl(siteUrl)` (pura) · `escolherPropriedade(entradas, preferida)`
   (pura: `preferida` = `process.env.GSC_SITE_URL` quando passada → tem de existir na
   lista, senão erro; sem preferida → a entrada `sc-domain:` cujo `siteUrl` contém
   `doxaviral.com`; senão qualquer uma contendo `doxaviral.com`; senão `Error` listando
   os `siteUrl` que vieram e a frase "confira no painel se
   torre-seo@doxa-506016.iam.gserviceaccount.com é usuário da propriedade").
   Constantes `SITEMAP_DA_DOXA = 'https://www.doxaviral.com/sitemap.xml'` e as URLs
   base das duas APIs.
5. **`scripts/gsc/prova.mjs`** (`pnpm gsc:prova [--submeter]`) — imprime, em texto
   legível e SEM token: (a) todas as propriedades (`siteUrl` + `permissionLevel`);
   (b) a escolhida e o tipo ("Domínio" se começa com `sc-domain:`, senão "Prefixo");
   (c) os sitemaps da propriedade (path, lastSubmitted, lastDownloaded, isPending,
   errors, warnings, `contents[].submitted`) e, em destaque, se
   `SITEMAP_DA_DOXA` está entre eles; (d) com `--submeter` e o sitemap ausente:
   obtém token de ESCRITA, faz o PUT, relista e imprime o novo estado. Sem propriedade
   da Doxa → exit 1 com a mensagem do item 4. Sem `--submeter` e sem sitemap → exit 0
   mas com linha `AVISO: sitemap não submetido — rode com --submeter`.
6. **`package.json`** — só `"gsc:prova": "node scripts/gsc/prova.mjs"` em `scripts`.
   Nada mais muda aí.
7. **Testes** (vitest pega `scripts/gsc/*.test.mjs` pelo include default):
   - `scripts/gsc/auth.test.mjs`: `montarJwt` produz header/claims certos (decodifique
     o base64url e compare `iss`, `scope`, `aud`, `iat`, `exp` = iat+3600);
     `assinar` verifica com `crypto.verify` usando par RSA gerado no teste
     (`generateKeyPairSync('rsa', { modulusLength: 2048 })`); `caminhoDaChave()` respeita
     `GSC_KEY_PATH` e cai no default; `lerChave('/caminho/inexistente')` lança erro cuja
     mensagem contém o caminho. **Nenhum teste lê a chave real.**
   - `scripts/gsc/api.test.mjs`: `codificarSiteUrl` para os dois formatos;
     `escolherPropriedade` nos 4 ramos (preferida existe / preferida não existe / auto
     prefere `sc-domain:` / nenhuma da Doxa → erro com os siteUrl listados).
8. **Rodar de verdade**: `pnpm gsc:prova`. Se o sitemap não aparecer:
   `pnpm gsc:prova --submeter`, e cole as duas saídas. Depois da submissão o estado pode
   vir `isPending: true` / sem `lastDownloaded` — é normal minutos depois; reporte como
   está, não invente "processado".
9. **Teste negativo**: `GSC_KEY_PATH=/nao/existe pnpm gsc:prova` → exit 1, mensagem com
   o caminho e nenhum stack trace de JSON. Cole.

## SCOPE
- .gitignore
- package.json
- scripts/gsc/auth.mjs
- scripts/gsc/api.mjs
- scripts/gsc/prova.mjs
- scripts/gsc/auth.test.mjs
- scripts/gsc/api.test.mjs
(Fora do repo, e fora do escopo do watchdog, mas SEU: `~/.config/doxa/`. INTOCÁVEIS:
`.env.example`, `src/**`, `api/**`, `docs/**`, `CLAUDE.md`, `.claude/settings.json`,
`vercel.json`, `tsconfig*`. Precisou → PARE e reporte.)

## DEPENDS ON
nada (base `origin/main` @ `85d0294`+).

## VERIFY (pass/fail executável — cole a saída no report)
- `ls -la ~/.config/doxa/` → `drwx------` no diretório e `-rw-------` em
  `gsc-service-account.json` · `ls ~/Downloads/doxa-506016-*.json 2>&1` → "no matches"
- `pnpm typecheck` = 0 erros · `pnpm test` verde, **28 arquivos** (26 + `auth.test.mjs`
  + `api.test.mjs`), cole o resumo · `pnpm build` ok, `[prerender] 68 rota(s)`
- `pnpm gsc:prova` (e, se foi preciso, `pnpm gsc:prova --submeter`) colado inteiro: a
  propriedade contendo `doxaviral.com` com `permissionLevel`, o tipo (Domínio/Prefixo)
  e `https://www.doxaviral.com/sitemap.xml` listado com `lastSubmitted`
- `GSC_KEY_PATH=/nao/existe pnpm gsc:prova; echo "exit $?"` → `exit 1`, mensagem cita o
  caminho
- Segredo: `git diff origin/main...HEAD | grep -nE "BEGIN (RSA )?PRIVATE KEY|private_key_id|\"private_key\"\s*:\s*\"|ya29\.|Bearer [A-Za-z0-9]"`
  = vazio · `git grep -n "client_email" -- scripts/` → só acessos de campo em
  `auth.mjs` (nunca seguido de `@`) · `git ls-files | grep -iE "service-account|doxa-506016"`
  = vazio · `git status --porcelain | grep -i json` = vazio
- `git diff --name-only origin/main...HEAD | grep -vE '^(\.gitignore|package\.json|scripts/gsc/(auth|api|prova)\.mjs|scripts/gsc/(auth|api)\.test\.mjs)$'` = vazio
- `git diff origin/main...HEAD -- package.json` = exatamente 1 linha adicionada (`gsc:prova`)
- `git diff origin/main...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- No report: nenhuma linha começando com `ya29.`, nenhum `-----BEGIN` (confira você
  mesmo antes de mandar: `grep -c "ya29\.\|BEGIN" <seu report>` = 0).

## COMMIT + PUSH
Commits: `chore(gsc): chave fora de Downloads e regras no .gitignore` ·
`feat(gsc): auth JWT/RS256 e wrappers da Search Console API` ·
`feat(gsc): pnpm gsc:prova — sites.list + sitemaps.list (+ submit)` →
`git push -u origin prelude-gsc-acesso`. **NÃO mergeie.** Report: passo a passo, saída
COLADA do VERIFY (sem tokens, sem chave), verdict READY/NOT READY. Se `sites.list` vier
vazio, o verdict é NOT READY com a instrução exata para o dono (painel do Search Console
→ Configurações → Usuários e permissões → conferir o e-mail da SA).

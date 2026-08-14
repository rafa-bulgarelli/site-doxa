# Manual DOXA — Track C: área administrativa (task_manual_admin)

Você é o EXECUTOR, numa worktree isolada criada pelo harness a partir de
`feat/manual-do-cliente`.

## STEP 0 (obrigatório, antes de qualquer edit)
`git status --porcelain` vazio · você está numa worktree, NÃO em
`~/orca/projects/site-doxa` (confira com `git rev-parse --show-toplevel`).
Depois: `git checkout -B track/manual-admin`. Divergiu → **PARE e reporte**.

## A VISÃO DO DONO
A equipe entra em `/manual-doxa/admin` com a senha do time (a MESMA da Central
de leads), cria um convite, copia o link, manda pelo WhatsApp — e depois
acompanha: quem abriu, quem concluiu, o PDF de cada aceite, a linha do tempo.
E gerencia as versões do manual: duplica como rascunho, edita, publica.

## CONTEXTO (não perca tempo redescobrindo)
- **O contrato é lei**: `src/manual/tipos.ts` — `PedidoAdmin`/respostas para o
  que passa pela API, e as `*Linha` (`ConviteLinha`, `VersaoLinha`,
  `SecaoLinha`, `RegraLinha`, `AceiteLinha`, `AceiteItemLinha`, `EventoLinha`)
  para o que se lê direto do banco. Você NÃO edita o contrato.
- **O espelho desta track é a Central de leads** — mesmo dono, mesma conta,
  mesmo desenho. ANTES de escrever qualquer coisa leia:
  - `src/leads/central/Portao.tsx` — o portão de senha;
  - `src/leads/dados/supabase.ts` — `CONTA_DO_TIME`, `tokenGuardado()`, o
    padrão de sessão. **IMPORTE de lá** o que precisar (import é permitido;
    EDITAR os arquivos da Central não é). NUNCA duplique `CONTA_DO_TIME`.
  - `src/leads/Central.tsx` + `src/leads/central/pecas.tsx` — idioma visual de
    lista, filtro, detalhe;
  - `src/leads/csv.ts` — o padrão de exportação.
- **Duas vias de dados, e a fronteira é clara:**
  - LEITURA: PostgREST direto com a sessão `authenticated` (como a Central).
    Toda tabela `manual_*` tem política "equipe le". Convite 'expirado' é
    DERIVADO no cliente: `expira_em < now()` com status pendente/aberto — o
    banco nunca grava 'expirado'.
  - ESCRITA com poder: `POST /api/manual/admin` com
    `Authorization: Bearer <token da sessão>` — `convite_criar` (a resposta
    traz o LINK COMPLETO com o token, a ÚNICA vez que ele existe: mostre e
    copie na hora, não guarde), `convite_revogar`, `convite_regenerar`,
    `pdf_baixar` (URL assinada de minutos), `versao_rascunho`,
    `versao_publicar`. A track B implementa em paralelo — programe contra os
    tipos, mocke fetch nos testes.
  - ESCRITA direta (exceções deliberadas do RLS): editar CONTEÚDO de versão
    RASCUNHO (título/declaração em `manual_versoes`; seções e regras inteiras,
    incluindo criar/apagar/reordenar) via PostgREST — o TRIGGER recusa se a
    versão não for rascunho; trate esse erro como mensagem amigável, não como
    bug. E registrar eventos `ator: 'equipe'` (`link_copiado`,
    `exportacao_csv`) direto em `manual_eventos`.
- **O schema é `supabase/manual.sql`** (JÁ aplicado). Leia as tabelas e as
  políticas antes de escrever consulta.
- **Telas** (segmentos que o `Painel.tsx` recebe já vêm SEM o 'admin'):
  - `[]` — visão geral: total/pendentes/abertos/concluídos/expirados/revogados,
    versão vigente, conclusões recentes;
  - `['convites']` — lista: busca por nome/empresa/email, filtro por status e
    versão, ordenação por data, paginação, criar convite, copiar link,
    revogar, regenerar, exportar CSV;
  - `['convites', '<id>']` — detalhe: dados, status, datas, progresso, itens
    aceitos, eventos, hash, botão de PDF;
  - `['manual']` — versões: vigente, histórico, criar rascunho a partir de uma;
  - `['manual', '<versaoId>']` — rascunho: editor de seções/regras/reordenar,
    pré-visualizar, publicar; versão publicada: SÓ leitura/preview.
  - Sem dashboard complexo — simples, útil, profissional.
- **Visual**: o da Central/site — tokens `doxa.*` do tailwind (INTOCÁVEL),
  `font-serif` nos títulos, monocromático. Desktop é o caso primário aqui, mas
  não pode quebrar no celular.
- Armadilhas do repo (CLAUDE.md):
  - **pnpm, não npm.**
  - **`focus()` na montagem faz a página rolar** — `{ preventScroll: true }` e
    intenção guardada com o valor ANTERIOR num ref (StrictMode roda 2x).
  - **`tailwind.config.js` é INTOCÁVEL**; opacidade fora da escala de 5 só
    `bg-x/[0.78]`.
  - **`CONTA_DO_TIME` e o usuário no Supabase Auth são UM passo** — por isso
    importar, nunca copiar a constante.
- **Estilo OBRIGATÓRIO**: leia `.claude/STYLE-GOOGLE-TS.md` e siga. Comentários
  em PT, na voz do repo. Sem `any`, sem `@ts-ignore`.

## A TASK
1. Substituir `src/manual/admin/Painel.tsx` (esqueleto) pelo painel real,
   quebrado em componentes/módulos dentro de `src/manual/admin/` (ex.:
   `VisaoGeral.tsx`, `Convites.tsx`, `ConviteDetalhe.tsx`, `Versoes.tsx`,
   `VersaoEditor.tsx`, `dados.ts`, `pecas.tsx` — nomes seus, fronteira é o
   diretório). O portão de senha vem primeiro: sem sessão, nada renderiza.
2. Extrair lógica pura testável (ex.: `filtrar.ts` — busca/filtro/derivação de
   expirado; montagem de CSV; validação do formulário de convite).
3. Testes em `src/manual/admin/*.test.ts` (vitest, sem DOM): derivação de
   status com expirado, filtros e busca, CSV com aspas/vírgulas, montagem dos
   pedidos admin. Fetch/PostgREST mockados.

## SCOPE
- src/manual/admin/** (substituir Painel.tsx e criar arquivos novos aqui)

(NADA fora de `src/manual/admin/`. Os arquivos de `src/leads/**` podem ser
IMPORTADOS, jamais editados. `Rota.tsx`, `tipos.ts`, `config.ts`, `App.tsx`,
`tailwind.config.js`, `package.json` são INTOCÁVEIS.)

## DEPENDS ON
Nada — contrato, roteador e schema já estão na base. A API real (track B)
chega no merge; até lá, mock.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde (os testes NOVOS desta track inclusos)
- `pnpm build` ok
- `git diff feat/manual-do-cliente...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff feat/manual-do-cliente...HEAD --name-only` — tudo dentro de `src/manual/admin/`
- `git diff feat/manual-do-cliente...HEAD | grep -n "CONTA_DO_TIME *="` = vazio (a constante só se importa)

## COMMIT + PUSH
`feat(manual): o painel da equipe — convites, aceites e versoes` (ajuste o
resumo ao que fez) → `git push -u origin track/manual-admin`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída COLADA do VERIFY +
nome da branch + caminho da worktree. Merge/deploy/LIVE são do GESTOR.

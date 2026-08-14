# Manual DOXA — Track A: fluxo público do cliente (task_manual_publico)

Você é o EXECUTOR, numa worktree isolada criada pelo harness a partir de
`feat/manual-do-cliente`.

## STEP 0 (obrigatório, antes de qualquer edit)
`git status --porcelain` vazio · você está numa worktree, NÃO em
`~/orca/projects/site-doxa` (confira com `git rev-parse --show-toplevel`).
Depois: `git checkout -B track/manual-publico`. Divergiu → **PARE e reporte**.

## A VISÃO DO DONO
O cliente recebe um link pelo WhatsApp, abre NO CELULAR, vê o próprio nome e a
empresa já preenchidos, percorre um manual bonito seção por seção marcando
"Li, entendi e concordo" em cada regra, confirma a declaração final e sai com
o comprovante em PDF na mão. Nada de formulário genérico: é a cara da DOXA.

## CONTEXTO (não perca tempo redescobrindo)
- **O contrato é lei**: `src/manual/tipos.ts` — `PedidoPublico` (abrir /
  progresso / concluir / baixar), `RespostaAbrir` (estado + convite + versao +
  progresso + aceite), `RespostaConcluir`, `RespostaBaixar`, `RespostaErro`,
  `Versao`/`Secao`/`Regra` (com `porque`, `exemplo`, `severidade`,
  `obrigatoria`). Você NÃO edita o contrato — lacuna real → PARE e reporte.
- **API**: tudo `POST /api/manual/publico`, token SEMPRE no corpo (nunca em
  query). A track B implementa em paralelo — você programa CONTRA OS TIPOS e
  mocka fetch nos testes. Não invente campo fora do contrato.
- **Roteamento**: `src/manual/Rota.tsx` (INTOCÁVEL) já entrega a você
  `PropsDeRota { segmentos, navegar }` no seu `publico/Fluxo.tsx`:
  - `['convite', '<token>']` → o fluxo inteiro (o token sai daqui);
  - `['concluido']` → confirmação pós-aceite;
  - qualquer outra coisa → tela de link inválido.
- **Decisões já tomadas pelo GESTOR:**
  - Estado do pós-conclusão (aceite_id, pdf_url) vive em memória do módulo ao
    `navegar('/manual-doxa/concluido')`. Carga direta de `/concluido` sem
    estado → confirmação genérica orientando reabrir o link do convite (o
    `abrir` de convite concluído devolve `aceite` e permite baixar).
  - Progresso: mandar `acao: 'progresso'` ao trocar de seção e ao marcar nome —
    não a cada checkbox (o servidor é a memória entre visitas; dentro da visita
    o estado é local). Falha de rede no progresso NÃO bloqueia o fluxo.
  - Ordem das telas (prompt do dono, seção 7): intro + aviso de privacidade →
    identificação (email/empresa BLOQUEADOS; nome só se `nome_cliente` null) →
    seções em ordem com progresso visível → revisão final (dados, resumo das
    obrigações, aviso de que descumprir pode invalidar a garantia, declaração
    completa + checkbox "Confirmo que li e concordo com a declaração acima")
    → conclusão (aceite_id, data, versão, botão de baixar PDF, aviso de que a
    DOXA mantém o documento arquivado).
  - Avançar de seção SÓ com todas as regras `obrigatoria` da seção marcadas;
    voltar sempre permitido; regra `severidade: 'critica'` com destaque forte.
  - Estados de convite: uma tela por estado (`invalido`, `expirado`,
    `revogado`, `concluido`) + erro recuperável (tentar de novo) +
    indisponibilidade. "Não deu" sem explicação é proibido.
  - PT-BR apenas. O seletor de idioma do site NÃO entra aqui.
  - NUNCA usar o termo "assinatura eletrônica".
- **Visual**: monocromático da DOXA — tokens `doxa.bg #000`, `surface #0D0D0D`,
  `raised #141414`, `line #1F1F1F`, `muted #6B6B6B` (tailwind.config.js,
  INTOCÁVEL), títulos em `font-serif` (Instrument Serif), corpo no sans do
  site. `framer-motion` e `lucide-react` existem e podem ser usados; animação
  sutil com `prefers-reduced-motion` respeitado. Mobile-first: 320/375/390px
  primeiro. Foco visível, navegação por teclado, alvos de toque ≥44px.
  Leia 2–3 seções da landing (`src/components/`) para absorver o idioma visual
  antes de desenhar.
- Armadilhas do repo (CLAUDE.md — TODAS já morderam):
  - **pnpm, não npm.**
  - **`focus()` na montagem faz a página rolar sozinha** (as rotas são lazy).
    Todo autofocus: `{ preventScroll: true }`, e intenção guardada com o valor
    ANTERIOR num ref — bandeira "já montou" não sobrevive ao StrictMode.
  - **`ref` de elemento do PAI lida em efeito do FILHO chega `null`** e o
    sintoma só aparece no site publicado. Passe o NÓ por `useState` + ref de
    callback, nunca a ref pelo props.
  - **`tailwind.config.js` é INTOCÁVEL** (sem hot-reload; token novo = PARE e
    reporte). Opacidade fora da escala de 5 só como `bg-x/[0.78]`.
- **Estilo OBRIGATÓRIO**: leia `.claude/STYLE-GOOGLE-TS.md` e siga. Comentários
  em PT, na voz do repo. Sem `any`, sem `@ts-ignore`.

## A TASK
1. Substituir `src/manual/publico/Fluxo.tsx` (hoje um esqueleto) pelo fluxo
   real, quebrado em componentes pequenos dentro de `src/manual/publico/`
   (ex.: `Convite.tsx`, `Identificacao.tsx`, `Secao.tsx`, `Revisao.tsx`,
   `Conclusao.tsx`, `Estados.tsx`, `pecas.tsx` — nomes seus, fronteira é o
   diretório).
2. Extrair a lógica pura para módulos testáveis (ex.: `maquina.ts` — pode
   avançar? o que falta? montar `PedidoConcluir` a partir do estado;
   `api.ts` — fetch tipado com tratamento de erro).
3. Testes em `src/manual/publico/*.test.ts` (vitest, sem DOM): gate de avanço
   por seção, retomada a partir de `Progresso`, montagem dos pedidos,
   distinção dos estados do convite. Fetch mockado.

## SCOPE
- src/manual/publico/** (substituir Fluxo.tsx e criar arquivos novos aqui)

(NADA fora de `src/manual/publico/`. `Rota.tsx`, `tipos.ts`, `config.ts`,
`App.tsx`, `index.css`, `tailwind.config.js`, `package.json` são INTOCÁVEIS.)

## DEPENDS ON
Nada — contrato e roteador já estão na base. A API real (track B) chega no
merge; até lá, mock.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde (os testes NOVOS desta track inclusos)
- `pnpm build` ok
- `git diff feat/manual-do-cliente...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff feat/manual-do-cliente...HEAD --name-only` — tudo dentro de `src/manual/publico/`
- `git diff feat/manual-do-cliente...HEAD | grep -n "\.focus("` — cada ocorrência com `preventScroll`

## COMMIT + PUSH
`feat(manual): o caminho do cliente — do link ao aceite` (ajuste o resumo ao
que fez) → `git push -u origin track/manual-publico`. **NÃO mergeie.**
Ao terminar: sumário + verdict READY/NOT READY + saída COLADA do VERIFY +
nome da branch + caminho da worktree. Merge/deploy/LIVE são do GESTOR.

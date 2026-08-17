# Manual por passos — Track B fase 2: as sete cenas restantes + testes (task_manual_passos_cenas_completa)

Você é o EXECUTOR, numa worktree isolada criada pelo harness (nasce em MAIN).
**Esta fase SÓ é spawnada depois de o dono aprovar o estilo dos pilotos (gate 1).**

## STEP 0 (obrigatório, antes de qualquer edit)
Esta track CONTINUA a branch da fase piloto. Rode:
`git fetch origin && git checkout -B track/manual-passos-cenas origin/track/manual-passos-cenas`
e confirme com `git log --oneline -3` que o topo é o commit das cenas-piloto
(`feat(manual): cenas-piloto dos passos…`) e que `grep -rn "Esqueleto"
src/manual/cenas/passos/Redes.tsx src/manual/cenas/passos/Silencio.tsx` = vazio.
`git status --porcelain` vazio · worktree, não o repo principal.
Divergiu → **PARE e reporte.**

## A VISÃO DO DONO (card 009)
Toda tela "Passo X de Y" dos caps. 1–3 com uma animação que conta O CONTEÚDO daquele
passo — "devem fazer sentido com o contexto do passo e não serem só animações
bonitas". O estilo foi aprovado nos pilotos (`Redes.tsx`, `Silencio.tsx`): **eles são
a régua** — mesma paleta, mesmo palco, mesmo tamanho de história.
<A sessão principal cola AQUI o feedback do dono no gate 1, se houver ajuste pedido.>

## CONTEXTO (não perca tempo redescobrindo)
- Maquinaria e referências: as MESMAS do pack piloto
  (`.claude/tower/packs/track-manual-passos-cenas-piloto.md` — leia-o): `MiniPalco`
  de `itens/comuns.tsx`, `pecas.tsx`, `luz.tsx`, `tempo.ts`/`useRoteiro`,
  estrutura de `itens/Relogio.tsx`, paleta de `CenaClone.tsx`.
- **As sete cenas** (código → arquivo → a frase que a cena comunica sem texto —
  critério do gate final):
  1. **ON-1 → `passos/Contexto.tsx`** ("Responda com contexto, não com uma palavra")
     *"O que você escreve vira contexto — e o contexto vira o roteiro do vídeo."*
     Arco pedido LITERALMENTE pelo dono: resposta → contexto → roteiro. Uma resposta
     de uma palavra fica apagada; a resposta cheia flui para um painel e dele sai um
     roteiro/cartão de vídeo aceso.
  2. **ON-2 → `passos/UmCanal.tsx`** ("Uma pessoa centraliza a conversa")
     *"Mensagens espalhadas se perdem; um canal único chega inteiro."*
     Arco: balões saindo de pontos diferentes se dispersam e apagam → convergem numa
     pessoa → um fio único e aceso liga a pessoa à equipe.
  3. **VZ-2 → `passos/FalaNatural.tsx`** ("Fale natural, envie cru")
     *"Voz de conversa, sem filtro: o clone reproduz o que ouve."*
     Arco: onda artificial/apertada com selo de processamento (quebra) → vira onda
     fluida de conversa, crua → verde.
  4. **VZ-3 → `passos/Gravador.tsx`** ("Use o gravador do seu celular — e grave aos
     poucos") — *"Vários trechos curtos, gravados quando der, somam o material."*
     Arco: gravador do celular grava um trecho → pausa → outro trecho → os arquivos
     se empilham e a soma acende.
  5. **CL-1 → `passos/FotoNitida.tsx`** ("Foto nítida, de frente, em boa luz")
     *"O clone é construído do que aparece: rosto de frente, iluminado, nítido."*
     Arco: retrato escuro/de lado (quebra) → a luz entra e o rosto vira de frente →
     nítido, verde.
  6. **CL-2 → `passos/SemFiltro.tsx`** ("Sem filtro, sem óculos escuros")
     *"Filtro e acessório escondem exatamente o que a tecnologia precisa ver."*
     Arco: rosto com óculos escuros/véu de filtro → as camadas saem → rosto real
     confirmado.
  7. **CL-3 → `passos/Aproximacao.tsx`** ("O clone é uma aproximação")
     *"O clone sai parecido, não idêntico — diferença pequena é esperada."*
     Arco: rosto real e clone lado a lado, quase iguais → aproximam-se num `≈`
     sereno. SEM veredito vermelho: aproximação não é erro — é o único dos nove que
     termina neutro-positivo, e isso é decisão, não descuido.
- Os cinco arquivos acima existem como esqueletos do prelude — substitua por
  inteiro. `contrato.tsx` já mapeia os códigos: **não toque o contrato**.
- Pilotos (`Redes.tsx`, `Silencio.tsx`): só mexa se o feedback do gate 1 (colado na
  VISÃO acima) pedir. Sem feedback = não toque.

### Testes (`src/manual/cenas/cenas.test.tsx` — agora é seu)
Siga a estrutura que o arquivo já tem (fixtures + `renderToStaticMarkup`, sem clique):
- novo array `PASSOS` (os 9 códigos ON-0..CL-3 → componente) e o teste espelho do
  "uma mini-cena para cada um dos oito itens": `cenaDoPasso(chave)` devolve cada um,
  e `cenaDoPasso('ON-99')` = null;
- os 9 entram no conjunto varrido por "desenha um SVG e nasce escondida do leitor",
  "define toda tinta que pede" e pelo describe de **movimento reduzido** (quadro
  final parado, não tela vazia) — o `TODAS` do arquivo;
- ids de gradiente únicos: se as cenas novas usarem gradiente, o padrão
  `cena*-arco`/`useId` entra na varredura existente.

### Armadilhas do repo (já morderam)
**pnpm**, não npm · nenhuma dependência nova · `tailwind.config.js`/`index.css`
INTOCÁVEIS · opacidade fora da escala só `[0.78]` · nada de `.focus(` · classes
nunca por template string · a track de fluxo mexeu em `src/manual/publico/**` — se
ela já estiver mergeada na base, NADA muda para você; se um rebase trouxer conflito
fora do seu SCOPE → PARE e reporte.

### Estilo OBRIGATÓRIO
`.claude/STYLE-GOOGLE-TS.md`. Comentários em PT — cada cena abre narrando o passo e
o arco. Sem `any`, sem `@ts-ignore`. Arquivos ≤800 linhas, funções ≤50.

## A TASK
1. Substituir os 7 esqueletos pelos desenhos reais, na régua dos pilotos.
2. Aplicar o feedback do gate 1 nos pilotos, SE houver.
3. `cenas.test.tsx`: os 9 passos cobertos (contrato, SVG, tintas, reduced motion).
4. **Verificação VISUAL obrigatória**: SSR das fases-chave de CADA uma das 7 (e dos
   pilotos se mexer), quadros salvos e listados no report — o gate final do dono
   ("faz sentido com o contexto") é olhando para eles.

## SCOPE
- src/manual/cenas/passos/Contexto.tsx
- src/manual/cenas/passos/UmCanal.tsx
- src/manual/cenas/passos/FalaNatural.tsx
- src/manual/cenas/passos/Gravador.tsx
- src/manual/cenas/passos/FotoNitida.tsx
- src/manual/cenas/passos/SemFiltro.tsx
- src/manual/cenas/passos/Aproximacao.tsx
- src/manual/cenas/passos/Redes.tsx (SÓ com feedback do gate 1)
- src/manual/cenas/passos/Silencio.tsx (SÓ com feedback do gate 1)
- src/manual/cenas/passos/comuns.tsx (se existir/precisar)
- src/manual/cenas/cenas.test.tsx

(`contrato.tsx`, `itens/**`, `Cena*.tsx`, `pecas.tsx`, `luz.tsx`, `tempo.ts`,
`ExemplosDeFotos.tsx`: INTOCÁVEIS.)

## DEPENDS ON
Fase piloto commitada em `origin/track/manual-passos-cenas` + **gate 1 do dono
aprovado** (quem confirma é a sessão principal ao spawnar esta fase).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde — sem falha NOVA vs baseline do main (**360/360**), novos inclusos
- `pnpm build` ok
- `git diff --name-only origin/feat/manual-passos...HEAD` — só `src/manual/cenas/passos/`
  e `src/manual/cenas/cenas.test.tsx`; `contrato.tsx` AUSENTE da lista
- `grep -rn "Esqueleto" src/manual/cenas/passos/` = vazio (nenhum placeholder sobrou)
- `grep -c "cenaDoPasso" src/manual/cenas/cenas.test.tsx` ≥ 2
- `git diff origin/feat/manual-passos...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff origin/feat/manual-passos...HEAD | grep -n "\.focus("` = vazio

## COMMIT + PUSH
`feat(manual): as nove cenas dos passos — uma historia por passo, na regua dos pilotos`
→ `git push -u origin track/manual-passos-cenas`. **NÃO mergeie.**
Report: sumário + verdict READY/NOT READY + VERIFY colado + tabela das 9 cenas
(código · frase · arco fase a fase · caminho dos quadros olhados). É a peça do gate
final do dono antes do merge. Merge/deploy/LIVE são do GESTOR.

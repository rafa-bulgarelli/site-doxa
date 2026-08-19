# Card 014 — Track B: a cena do passo novo (VZ-4) e as duas cenas re-miradas (task_014_cena_mesmo_equipamento)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/track-014-cena-mesmo-equipamento`,
branch **`track-014-cena-mesmo-equipamento`** (JÁ criada pelo `tower-track.sh` a partir
da base **`rafa-bulgarelli/gorgonian`** — NÃO é main).

## STEP 0 (obrigatório, antes de qualquer edit)
`git branch --show-current` = `track-014-cena-mesmo-equipamento` · `git status
--porcelain` vazio · `git merge-base --is-ancestor rafa-bulgarelli/gorgonian HEAD && echo
base-ok` = `base-ok` · `ls src/manual/cenas/passos/*.tsx | wc -l` = **10** (9 cenas +
`comuns.tsx`) · `grep -c "VZ-4" src/manual/cenas/contrato.tsx` = **0** · você está na
worktree, não no repo principal. Divergiu → **PARE e reporte.**

> **CONGELAMENTO DE DEPLOY (ordem do dono).** Nada sobe para Vercel nem Supabase.
> Você commita e dá push na branch; só isso.

## A VISÃO DO DONO (brief `.claude/tower/briefs/014-onboarding-voz-ditado-do-dono.md`)
O capítulo "A sua voz" ganha um passo a mais, e "a dica vira um passo novo, então tem
que ter **animaçãozinha dela ali dentro do capítulo Voz**". A dica: "usar o **mesmo
equipamento** … durante todos os 60 minutos de áudio, para você não ter diferença entre
o seu timbre. … continue gravando 60 minutos no **mesmo lugar**, no mesmo quarto, no
mesmo escritório, no mesmo computador, no mesmo celular, em um lugar silencioso".
E os dois passos vizinhos mudaram de texto (seed v8, outra track): "falar natural, sem
leitura … **proibido ler**" e "usar o **gravador da plataforma** e salvar os arquivos no
celular/computador, para que o progresso não seja perdido … grava, pausa, grava de
novo … baixa … volta … faz o upload … até bater os 60 minutos mínimos".

## A DOUTRINA DO DONO (aplicar o "porquê", não só o "o quê" — senão é outra reprovação)
1. **Equilíbrio**: "não tão parecendo festa, mas também não tão discreta. Elegante,
   chamando atenção na medida certa."
2. **Respiro**: elementos espaçados, "respirando, conversando entre si". Círculo
   apertado em volta de ícone ("enforcando", "afogado") é defeito NOMEADO — 2×.
   Caixinhas "MUITO ESPREMIDAS … sem vida" também (veja o comentário em `Gravador.tsx`).
3. **Hierarquia** visual clara — traços e ícones que "ornam" entre si.
4. **Cor com significado**: verde = certo, vermelho = errado. Colorido sem função "não
   é bonito, não é elegante". O ponto de GRAVAR é BRANCO (gravar não é erro).
5. **Ícones reais** onde a regra fala de coisa real (aqui: microfone, celular,
   notebook — desenhados na gramática do manual, não forma genérica em círculo cinza).
6. **Ritmo**: nem lenta, smooth, fluida, com ação. Um gesto por fase; nada em loop
   decorativo.
7. **Narrativa fiel à regra**, com começo-meio-fim — "três tempos: aparece · destaca ·
   dá certo (com o brilhozinho)". O fecho é o `FechoDoArco` (`fecho.tsx`), UM por cena,
   ausente na primeira fase.
8. **Réguas nota-10** (olhe ANTES de desenhar, e NÃO toque): `src/manual/cenas/CenaVoz.tsx`
   e `src/manual/cenas/itens/Relogio.tsx`. Régua de CÓDIGO dos passos: `passos/
   Silencio.tsx` (comentário de abertura narrando passo + arco + decisões) e
   `passos/Gravador.tsx` (a correção do respiro que o dono pediu, documentada nele).

## AS TRÊS CENAS (código → arquivo → a frase que a cena comunica SEM texto)

### 1. `VZ-4` → `passos/MesmoEquipamento.tsx` (NOVA) — título no seed: "Mesmo equipamento, mesmo lugar — nos 60 minutos inteiros"
*"O mesmo aparelho, no mesmo lugar, do primeiro ao último minuto — é assim que o
timbre não muda."*
Arco sugerido (4 fases no ritmo das irmãs, ex. `[1500, 1600, 1600, 3400]`):
- **Fase 0 — aparece:** à esquerda, o lugar (uma moldura/`Painel` = o cômodo) com o
  aparelho dentro (um microfone ou o celular, na gramática de `Gravador.tsx`/
  `Silencio.tsx`); à direita, o trecho 1 gravado: `OndaDeFala` cinza com as suas
  alturas — o timbre desta voz. Ponto de gravar BRANCO.
- **Fase 1 — destaca (a quebra):** o trecho 2 chega de OUTRO lugar/aparelho (uma
  segunda moldura diferente — outro tamanho/tracejada — com outro ícone, ex.
  notebook vs celular): a onda dele tem OUTRO desenho (alturas achatadas/deslocadas) e
  acende em `QUEBRA` (vermelho) com a marca de erro — "timbre diferente".
- **Fase 2 — corrige:** a moldura estranha apaga; o trecho 2 é regravado no MESMO
  lugar, MESMO aparelho: as duas ondas ficam com o MESMO desenho, brancas.
- **Fase 3 — dá certo:** o trecho 3 entra no mesmo lugar, idêntico em forma; visto
  verde + `FechoDoArco`; pausa longa.
**O que diferencia esta cena da do Gravador (que também empilha trechos):** lá o
argumento é "aos poucos"; aqui é "IGUAL do começo ao fim" — o que se repete é o
APARELHO e o LUGAR, e a prova visual é a forma das ondas batendo. Não desenhe três
caixinhas iguais de novo: a repetição aqui é da origem, não do trecho.

### 2. `VZ-3` → `passos/Gravador.tsx` (RE-MIRA, arco mantido) — título no seed: "Grave pelo gravador da plataforma — e baixe cada gravação"
*"Grave pela plataforma, aos poucos — e baixe cada trecho: o que não foi baixado, a
plataforma apaga."*
Hoje a cena diz "o gravador que você já tem no bolso" (o celular nativo). A regra
mudou: o gravador é o da PLATAFORMA (aba "Grave-se": ponto de gravar, tempo correndo,
"Parar", lista de amostras com o ícone de baixar). Re-mira mínima:
- o aparelho vira o painel do gravador da plataforma (um `Painel` com o ponto de gravar
  e uma faixa de tempo; pode continuar dentro de um celular — a plataforma abre no
  celular também — desde que o que se vê seja a TELA da plataforma, não o app nativo);
- cada trecho, ao receber o visto, ganha o gesto de BAIXAR (uma seta para baixo que
  desce para o aparelho/uma bandeja e some — "salvo") — é o novo argumento da regra;
- o arco (trecho 1 → trecho 2 → trecho 3 → soma acende) e o respiro de 26 entre os
  cartões FICAM; o comentário de abertura passa a narrar a regra v8.
Se a seta de baixar apertar o palco, prefira baixar os três de uma vez na fase final,
antes do visto — nunca enfiar mais um elemento por cartão sem respiro.

### 3. `VZ-2` → `passos/FalaNatural.tsx` (RE-MIRA, arco mantido) — título no seed: "Fale natural — ler é proibido"
*"Fala de conversa, do jeito que sai. Ler é proibido."*
Hoje a quebra é o filtro/processamento. A regra v8 abre com a PROIBIÇÃO DE LER: a
quebra passa a ser a LEITURA — uma folha/roteiro (retângulo com linhas de texto,
como o texto-bloco de `Redes.tsx`, sem virar letra real) que entra na frente da
fala e é barrada em vermelho e sai; a onda crua de conversa segue e fecha em verde
com o fecho. O filtro pode ficar como segundo gesto SE couber em 4 fases sem virar
festa — se não couber, a leitura é o que manda, e o filtro sai (a instrução v8 ainda
cita "nenhum aplicativo", mas a cena conta UMA história).

## CONTEXTO (não perca tempo redescobrindo)
- Maquinaria (reuse, não edite): `itens/comuns.tsx` (`MiniPalco` viewBox `0 0 480
  150`, `h-32 sm:h-40` — É o palco; `Selo`, `Cartao`), `pecas.tsx` (`Painel`, `Marca`,
  `Legenda`, `TINTA`, `TRACO`, `TRACO_ACESO`), `luz.tsx` (`Brilho`, `TracoDeLuz`,
  `QUEBRA`, `CERTO`, `useTintas`), `fecho.tsx` (`FechoDoArco`, `ARCO_DO_FECHO`),
  `tempo.ts` (`useRoteiro(FASES, FASE_FINAL)`, `tempo`, `EASE` — fases +
  `prefers-reduced-motion` com o quadro FINAL parado), `passos/comuns.tsx` (`Rosto`,
  `OndaDeFala`, `PontoDeGravar`). Peça nova compartilhada só entre passos → vai em
  `passos/comuns.tsx`; NUNCA em `itens/comuns.tsx`.
- `contrato.tsx`: `CENAS_DOS_PASSOS` ganha `'VZ-4': MesmoEquipamento` (import no topo;
  atualize o comentário do bloco — "`VZ-4` é a regra nova do seed v8"). É a ÚNICA
  linha de motor desta track. Código sem cena continua devolvendo `null` (convite
  preso à v7 não tem VZ-4 e não quebra).
- `cenas.test.tsx` é SEU: `PASSOS` ganha `{ chave: 'VZ-4', Cena: MesmoEquipamento }`
  (import); "uma mini-cena para cada um dos nove passos" vira dez; o teste do fecho
  conta `COM_FECHO.length` = `TODAS.length - 2` e **`toBe(19)` vira `toBe(20)`** — a
  cena nova TEM de usar o `FechoDoArco` (3 passadas no quadro parado, 0 na primeira
  fase), senão ela cai nesse teste. Os describes genéricos (SVG + `aria-hidden`, toda
  tinta definida, reduced-motion, gradiente único) cobrem a nova sozinhos pela lista
  `TODAS`. NÃO mexa nos testes das nota-10, das redes, do silêncio, das fotos.
- Texto dentro da cena: quase nada, via `Legenda`; a cena é `aria-hidden` (o `Palco`
  cuida) — nada de frase legível (8px no celular).
- Ids de gradiente únicos por instância (`useIdDaCena`/padrão das irmãs) — o teste
  "duas cenas na mesma página não dividem o mesmo id" prova.
- Os TEXTOS das regras (títulos acima) vêm do seed v8 (track A, paralela); os prints
  do capítulo (track C, paralela) não te dizem respeito. Você não toca `publico/**`,
  `supabase/**`, `public/**`.

### Armadilhas do repo (já morderam — os comentários das irmãs documentam cada uma)
**pnpm**, não npm · nenhuma dependência nova (framer-motion já está; custo no celular
se controla com poucas camadas, não com filtro SVG pesado) · framer + SVG: `attrY`
(não `y`) para atributo; `translate` no grupo de FORA do nó que anima; raio em vez de
`scale`; `pathLength` × `strokeDasharray` brigam; `initial` tem de olhar o estado
quando `parado` · `FASES` é constante de módulo (literal no render reinicia o timer e a
cena trava na fase 0 sem erro) · opacidade Tailwind fora da escala de 5 só `[0.78]` ·
nada de `.focus(` · classes nunca por template string · `tailwind.config.js` e
`index.css` INTOCÁVEIS · `noUnusedLocals`/`noUnusedParameters` reprovam sobra.

### Estilo OBRIGATÓRIO
`.claude/STYLE-GOOGLE-TS.md`. Comentários em PT — cada cena abre narrando o passo, a
frase, o arco e as decisões (como `Silencio.tsx`). Sem `any`, sem `@ts-ignore`.
Arquivos ≤ 800 linhas, funções ≤ 50.

## A TASK
1. Escrever `passos/MesmoEquipamento.tsx` (frase, arco e doutrina acima) com
   `FechoDoArco` no quadro final.
2. Re-mirar `passos/Gravador.tsx` (gravador da plataforma + gesto de baixar) e
   `passos/FalaNatural.tsx` (a leitura como quebra) — arcos mantidos, comentários
   narrando a regra v8.
3. `contrato.tsx`: registrar `'VZ-4': MesmoEquipamento`.
4. `cenas.test.tsx`: `PASSOS` com VZ-4 · "dez passos" · `COM_FECHO` = 20.
5. **Verificação VISUAL obrigatória**: renderize as TRÊS cenas por SSR nas fases-chave
   (primeira, a da quebra, a final — mock de `useRoteiro` num script descartável no
   scratchpad forçando a fase; `renderToStaticMarkup`; converta o SVG para PNG com
   `qlmanage -t -s 960 -o <dir> <arquivo.svg>` ou abra no Chrome) e OLHE. Salve os
   quadros e liste os caminhos no report — são a peça do gate visual do dono.

## SCOPE
- src/manual/cenas/passos/MesmoEquipamento.tsx
- src/manual/cenas/passos/Gravador.tsx
- src/manual/cenas/passos/FalaNatural.tsx
- src/manual/cenas/passos/comuns.tsx (SÓ se precisar de peça compartilhada entre passos)
- src/manual/cenas/contrato.tsx
- src/manual/cenas/cenas.test.tsx

(`CenaVoz.tsx` e `itens/Relogio.tsx` são nota-10: INTOCÁVEIS. `itens/**`, `Cena*.tsx`,
`pecas.tsx`, `luz.tsx`, `fecho.tsx`, `tempo.ts`, `redes.tsx`, `Silencio.tsx`,
`Redes.tsx` e os demais passos: importar pode, editar não. `src/manual/publico/**`,
`supabase/**`, `public/**`: de outras tracks.)

## DEPENDS ON
nada (base `rafa-bulgarelli/gorgonian`). Tracks A (seed v8) e C (prints) rodam em
paralelo em arquivos disjuntos.

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test src/manual/cenas/cenas.test.tsx` verde (a contagem SOBE: a cena nova entra
  nos describes genéricos — reporte quantos)
- `pnpm test` verde — sem falha NOVA vs baseline da base (**1033/1033** em
  `rafa-bulgarelli/gorgonian`); novos inclusos
- `pnpm build` ok
- `git diff --name-only rafa-bulgarelli/gorgonian...HEAD | sort` = só arquivos do
  SCOPE, com `MesmoEquipamento.tsx`, `contrato.tsx` e `cenas.test.tsx` presentes
- `git diff --name-only rafa-bulgarelli/gorgonian...HEAD | grep -E "CenaVoz|itens/Relogio|publico/|supabase/|public/"` = vazio
- `grep -c "'VZ-4': MesmoEquipamento" src/manual/cenas/contrato.tsx` = 1
- `grep -c "chave: 'VZ-4'" src/manual/cenas/cenas.test.tsx` = 1 e
  `grep -c "toBe(20)" src/manual/cenas/cenas.test.tsx` ≥ 1
- `grep -c "FechoDoArco" src/manual/cenas/passos/MesmoEquipamento.tsx` ≥ 2 (import + uso)
- `grep -n "bolso\|gravador nativo" src/manual/cenas/passos/Gravador.tsx` = vazio (a
  narrativa antiga saiu)
- `git diff rafa-bulgarelli/gorgonian...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff rafa-bulgarelli/gorgonian...HEAD | grep -n "\.focus("` = vazio
- Quadros SSR das 3 cenas (primeira · quebra · final) salvos e listados.

## COMMIT + PUSH
`feat(manual #014): cena do mesmo equipamento (VZ-4) e as cenas da fala e do gravador
re-miradas para a regra v8` → `git push -u origin track-014-cena-mesmo-equipamento`.
**NÃO mergeie.** Report: sumário + verdict READY/NOT READY + VERIFY colado + para CADA
cena: a frase, o arco fase a fase e os caminhos dos quadros que você OLHOU. Este report
vai direto ao dono (gate visual). Merge/deploy/LIVE são do GESTOR.

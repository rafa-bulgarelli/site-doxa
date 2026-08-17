# Manual — polimento das animações (card 010, absorvendo 009 fase 2) — Track B: as cenas de passo (task_polimento_passos)

Você é o EXECUTOR, numa worktree isolada criada pelo harness.

## STEP 0 (obrigatório, antes de qualquer edit)
A worktree do harness NÃO nasce na base desta track. Rode:
`git fetch origin && git checkout -B track/polimento-passos origin/feat/manual-polimento`
e confirme: `git status --porcelain` vazio · worktree, não o repo principal ·
`ls src/manual/cenas/redes.tsx` **existe** (prelude) ·
`ls src/manual/cenas/passos/*.tsx | wc -l` = **9**. Divergiu → **PARE e
reporte.**

## A VISÃO DO DONO (cards 009 + 010)
Cada passo dos capítulos 1–3 abre com uma animação que conta AQUELE passo. As
duas cenas-piloto (Redes, Silencio) passaram pelo review do dono com veredito:
- **№2 `passos/Redes.tsx`** — conceito "perfeito… total a ver com o produto".
  Ajuste: o texto digitado "parece código de barras" — mais detalhado/verossímil.
- **№4/5 `passos/Silencio.tsx`** — ideia "nota 10", execução corrigir: (a) o
  círculo está "ENFORCANDO o microfone" — dar espaço/respiro; (b) o traço do
  ruído não "orna" com os ícones — hierarquizar. "Com isso, vira nota 10."
As outras SETE cenas de passo hoje são esqueletos vazios — você as produz JÁ na
doutrina, porque a régua dos pilotos foi aprovada e cada rodada extra de gate
custa uma revisão inteira do dono.

## A DOUTRINA DO DONO (o "porquê" de cada traço — aplicar só o "o quê" produz outra reprovação)
1. **Equilíbrio**: "não tão parecendo festa, mas também não tão discreta.
   Elegante, chamando atenção na medida certa."
2. **Respiro**: elementos espaçados, "respirando, conversando entre si". Círculo
   apertado em volta de ícone ("enforcando", "afogado") é defeito NOMEADO — 2x.
3. **Hierarquia** visual clara — traços e ícones que "ornam" entre si.
4. **Cor com significado**: verde = certo, vermelho = errado. Colorido sem
   função "não é bonito, não é elegante". "Tudo colorido" = "horrível".
5. **Ícones reais** das plataformas onde a regra fala de redes — nunca forma
   genérica em círculo cinza.
6. **Ritmo**: nem lenta ("a pessoa não vai esperar para entender"), smooth,
   fluida, com ação (fade-in, entradas).
7. **Narrativa fiel à regra**, com começo-meio-fim ("nem pé, nem cabeça, nem
   meio, nem final" é o xingamento máximo).
8. **Réguas nota-10** (olhe ANTES de desenhar, e NÃO toque):
   `src/manual/cenas/CenaVoz.tsx` (№3) e `src/manual/cenas/itens/Relogio.tsx`
   (№10). Os pilotos `Redes.tsx`/`Silencio.tsx` são a régua de CÓDIGO dos
   passos: mesma estrutura, mesmos comentários de abertura.

## AS NOVE CENAS (código → arquivo → a frase que a cena comunica SEM texto)
As regras vivem no seed (`supabase/manual-seed-v2.sql`, v3, v7). `contrato.tsx`
JÁ mapeia código→componente: você NÃO toca o contrato.

1. **ON-0 `Redes.tsx`** (ajustar): mantém o arco (3 campos → 1 erro vermelho →
   corrigido → 3 verdes). Texto-bloco mais verossímil: variação maior de
   larguras, sugestão de `https://` e separadores — sem virar letra real (fiapo
   de 4px no celular). E troque o `Sinal` genérico pelos `IconeDaRede` de
   `redes.tsx` — o passo É sobre as três redes.
2. **VZ-1 `Silencio.tsx`** (corrigir): REMOVA o `circle r=30` que enforca o
   microfone (respiro é ausência de jaula, não jaula maior) e hierarquize a
   serrilha do ruído (largura/opacidade/ritmo que "ornam" com o microfone e a
   onda). O arco fica.
3. **ON-1 `Contexto.tsx`** ("Responda com contexto, não com uma palavra"):
   *uma palavra é pouco; a resposta com contexto acende o campo e fecha em
   verde.* Miniatura da lição de `CenaOnboarding` (leia-a), em composição
   própria: barrinha única fraca → linhas completas acesas → visto.
4. **ON-2 `UmCanal.tsx`** ("Uma pessoa centraliza a conversa"): *muitas vozes
   viram ruído; UMA vira o canal — e a conversa anda.* Três balões dispersos
   falam ao mesmo tempo (cinza, confuso) → um se acende como canal, os outros
   se apagam → a linha única segue ao visto.
5. **VZ-2 `FalaNatural.tsx`** ("Fale natural, envie cru"): *a fala do jeito que
   sai é a que serve.* Onda de fala natural → um controle de filtro/tratamento
   tenta entrar e é barrado em vermelho → a onda crua segue e fecha em verde.
6. **VZ-3 `Gravador.tsx`** ("Use o gravador do seu celular — e grave aos
   poucos"): *o gravador do próprio celular, em trechos curtos.* Botão rec →
   trechos curtos de onda entram UM a um, cada um com seu visto → o conjunto
   fecha.
7. **CL-1 `FotoNitida.tsx`** ("Foto nítida, de frente, em boa luz"): *a foto
   acende: nítida, de frente, com luz.* Moldura com rosto apagado/escuro → a
   luz entra e o traço firma → visto.
8. **CL-2 `SemFiltro.tsx`** ("Sem filtro, sem óculos escuros"): *filtro e óculos
   escondem o rosto que o clone precisa ver.* Rosto com óculos escuros/brilho de
   filtro → os dois são recusados em vermelho e saem → rosto limpo, visto.
9. **CL-3 `Aproximacao.tsx`** ("O clone é uma aproximação"): *o clone parece com
   você — aproximação honesta, não cópia.* Retrato sólido → ao lado, o MESMO
   retrato em TRACEJADO (a linguagem que `CenaClone.tsx` criou: tracejado = não
   é cópia) → o par fecha em visto. Sem prometer perfeição.

## CONTEXTO (não perca tempo redescobrindo)
- Os esqueletos são um `<svg>` vazio com comentário `Esqueleto` — substitua os
  SETE por inteiro; `Redes.tsx`/`Silencio.tsx` você edita.
- Peças: `itens/comuns.tsx` (`MiniPalco` viewBox `0 0 480 150`, `h-32 sm:h-40` —
  é O palco; `Cartao` se servir), `pecas.tsx`, `luz.tsx`, `tempo.ts`
  (`useRoteiro(FASES, FASE_FINAL)` — fases + `prefers-reduced-motion` com quadro
  FINAL parado, nunca tela vazia). Reuse, não edite. Peça compartilhada
  específica de passos → crie `passos/comuns.tsx`; NUNCA edite `itens/comuns.tsx`.
- O rosto: `CenaClone.tsx` tem `Rosto` local (cabeça+ombros). Não importe de lá
  (arquivo da track A) — se precisar, redesenhe a versão mini em
  `passos/comuns.tsx`.
- Texto dentro da cena: quase nada, via `Legenda` — a cena é decorativa
  (`aria-hidden` do `Palco`); nada de URL/frase legível (8px no celular + i18n).
- **`cenas.test.tsx` é SEU (só nesta rodada)**: adicione os NOVE passos à malha
  genérica (desenha SVG + `aria-hidden` · toda tinta pedida definida ·
  reduced-motion com `data-fase > 0`) e a prova do contrato: `cenaDoPasso` dos 9
  códigos devolve cada componente, código inexistente devolve `null`. NÃO mexa
  nos testes existentes (capítulos, itens, GA-2, ExemplosDeFotos).

### Armadilhas do repo (já morderam — os comentários dos pilotos documentam cada uma)
**pnpm**, não npm · nenhuma dependência nova (framer-motion já está; custo no
celular se controla com poucas camadas, não com filtro SVG pesado) · framer +
SVG: `attrY` (não `y`) para atributo; `translate` no grupo de FORA da animação;
raio em vez de `scale`; `pathLength` × `strokeDasharray` brigam; `initial` tem
de olhar o estado quando `parado` · ids de gradiente únicos por instância (o
palco cuida — `cenas.test.tsx` prova) · opacidade Tailwind fora da escala de 5
só `[0.78]` · nada de `.focus(` · classes nunca por template string ·
`tailwind.config.js` e `index.css` INTOCÁVEIS.

### Estilo OBRIGATÓRIO
`.claude/STYLE-GOOGLE-TS.md`. Comentários em PT — cada cena abre com o bloco
narrando o passo e o arco, como os pilotos fazem. Sem `any`, sem `@ts-ignore`.
Arquivos ≤800 linhas, funções ≤50.

## A TASK
1. Ajustar `Redes.tsx` (№2) e corrigir `Silencio.tsx` (№4/5).
2. Produzir as sete cenas novas, cada uma contando a SUA frase.
3. Ampliar `cenas.test.tsx` com os nove passos (malha genérica + `cenaDoPasso`).
4. **Verificação VISUAL obrigatória**: renderize cada uma das NOVE cenas por SSR
   nas fases-chave (primeira, a da quebra, a final — mock de `useRoteiro` em
   script descartável força a fase) e OLHE. Salve os quadros no scratchpad e
   liste os caminhos no report — são a peça do gate visual do dono.

## SCOPE
- src/manual/cenas/passos/Redes.tsx
- src/manual/cenas/passos/Silencio.tsx
- src/manual/cenas/passos/Contexto.tsx
- src/manual/cenas/passos/UmCanal.tsx
- src/manual/cenas/passos/FalaNatural.tsx
- src/manual/cenas/passos/Gravador.tsx
- src/manual/cenas/passos/FotoNitida.tsx
- src/manual/cenas/passos/SemFiltro.tsx
- src/manual/cenas/passos/Aproximacao.tsx
- src/manual/cenas/passos/comuns.tsx (SÓ se precisar de peça compartilhada)
- src/manual/cenas/cenas.test.tsx

(`CenaVoz.tsx` e `itens/Relogio.tsx` são nota-10: INTOCÁVEIS. `contrato.tsx`,
`itens/**`, `Cena*.tsx`, `pecas.tsx`, `luz.tsx`, `tempo.ts`, `redes.tsx`:
importar pode, editar não.)

## DEPENDS ON
Prelude `track/polimento-prelude` mergeado em `feat/manual-polimento`
(`redes.tsx` presente — STEP 0 confirma).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde — sem falha NOVA vs a base `origin/feat/manual-polimento`
  (baseline main 364/364 + testes do prelude); os testes novos dos passos
  inclusos e verdes
- `pnpm build` ok
- `git diff --name-only origin/feat/manual-polimento...HEAD | sort` = só
  arquivos do SCOPE, com os 9 passos presentes
- `git diff --name-only origin/feat/manual-polimento...HEAD | grep -E "CenaVoz|itens/Relogio"`
  = vazio (as nota-10 intactas)
- `grep -rn "Esqueleto" src/manual/cenas/passos/` = vazio
- `grep -n "Sinal" src/manual/cenas/passos/Redes.tsx` = vazio (ícones reais no
  lugar do genérico)
- `git diff origin/feat/manual-polimento...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff origin/feat/manual-polimento...HEAD | grep -n "\.focus("` = vazio

## COMMIT + PUSH
`feat(manual): as nove cenas de passo na doutrina — pilotos corrigidos, sete novas`
→ `git push -u origin track/polimento-passos`. **NÃO mergeie.**
Report: sumário + verdict READY/NOT READY + VERIFY colado + para CADA cena: a
frase que ela comunica, o arco fase a fase, e os caminhos dos quadros
renderizados que você OLHOU. Este report vai direto ao dono.

# Manual — polimento das animações (card 010) — Track D: as duas que se refazem do zero (task_polimento_itens_refazer)

Você é o EXECUTOR, numa worktree isolada criada pelo harness.

**Esta track só nasce depois de o dono validar os DOIS conceitos abaixo** — a
sessão principal confirma isso ao te spawnar. Se o spawn não citar a aprovação,
PARE e reporte.

## STEP 0 (obrigatório, antes de qualquer edit)
A worktree do harness NÃO nasce na base desta track. Rode:
`git fetch origin && git checkout -B track/polimento-itens-refazer origin/feat/manual-polimento`
e confirme: `git status --porcelain` vazio · worktree, não o repo principal ·
`ls src/manual/cenas/redes.tsx` **existe** (prelude — sem ele, PARE e reporte).

## A VISÃO DO DONO (card 010 — as duas viraram exemplo nomeado "do que não fazer")
- **№12 `itens/Intacto.tsx`** (GA-5, "baixou/publicou sem editar"): "tudo
  errada… grossa, junta, sem hierarquia, tudo colorido… horrível. Clássico
  exemplo do que não fazer." Repensar inteira.
- **№14 `itens/SemCompra.tsx`** (GA-7, engajamento comprado): "sem pé nem
  cabeça, nem meio, nem final." Refazer do zero seguindo a doutrina.

## OS CONCEITOS APROVADOS (produza ESTES — mudar o conceito = voltar ao gate)
- **№12 — O LACRE**: *o vídeo atravessa a tela da DOXA ao publicado com um lacre
  aceso no cartão; no meio do caminho UMA tesoura tenta encostar, é barrada em
  vermelho, e o vídeo chega ao ar com o lacre intacto e o visto verde — baixou,
  publicou, não mexeu.* (Uma ferramenta só, não três: respiro. Monocromático na
  base; vermelho só na recusa, verde só no veredito.)
- **№14 — O CONTADOR QUE NÃO SE COMPRA**: *um contador de audiência sobe firme e
  real; uma sacola de compra despeja um bloco de números cinza que infla o
  contador, o bloco acende o X vermelho e se desmancha, e o contador volta ao
  número real — que continua subindo e fecha no visto verde: comprado não
  conta.* (Começo-meio-fim explícito — é o antídoto do "sem pé nem cabeça".)

## A DOUTRINA DO DONO (o "porquê" de cada traço — aplicar só o "o quê" produz outra reprovação)
1. **Equilíbrio**: "não tão parecendo festa, mas também não tão discreta.
   Elegante, chamando atenção na medida certa."
2. **Respiro**: elementos espaçados, "respirando, conversando entre si". Círculo
   apertado em volta de ícone ("enforcando", "afogado") é defeito NOMEADO — 2x.
3. **Hierarquia** visual clara — traços e ícones que "ornam" entre si.
4. **Cor com significado**: verde = certo, vermelho = errado. Colorido sem
   função "não é bonito, não é elegante". "Tudo colorido" = "horrível" — foi
   exatamente o veredito da Intacto atual: setas ARCO, barras ARCO, três selos
   vermelhos, tudo junto.
5. **Ícones reais** das plataformas onde a regra fala de redes (nestas duas
   cenas, provavelmente nenhuma rede aparece — não force).
6. **Ritmo**: nem lenta, smooth, fluida, com ação (fade-in, entradas).
7. **Narrativa fiel à regra**, com começo-meio-fim.
8. **Réguas nota-10** (olhe ANTES de desenhar, e NÃO toque):
   `src/manual/cenas/CenaVoz.tsx` (№3) e `src/manual/cenas/itens/Relogio.tsx`
   (№10 — está no SEU diretório; é a régua de estrutura de código também:
   fases, cadeado, veredito).

## CONTEXTO (não perca tempo redescobrindo)
- As regras que as cenas contam (seed v2, `supabase/manual-seed-v2.sql`):
  GA-5 = "o vídeo vai no ar exatamente como foi entregue";
  GA-7 = "nada de curtida, seguidor ou visualização comprada".
- Substitua os DOIS arquivos por inteiro — são refazer, não retocar. O bloco de
  comentário de abertura narra o conceito novo E registra por que a versão
  anterior caiu (é a memória que impede a 4ª rodada).
- Peças: `itens/comuns.tsx` (`MiniPalco` viewBox `0 0 480 150`, `Cartao`,
  `Selo`), `pecas.tsx` (`Painel`, `Legenda`, `Marca`, `TINTA`, `TRACO`,
  `TRACO_ACESO`), `luz.tsx` (`Brilho`, `TracoDeLuz`, `CERTO`, `QUEBRA`),
  `tempo.ts` (`useRoteiro(FASES, FASE_FINAL)` — fases + `prefers-reduced-motion`
  com quadro FINAL parado, nunca tela vazia). Reuse, não edite.
- Texto dentro da cena: números via `Legenda`, pouquíssimo — a cena é decorativa
  (`aria-hidden` vem do `Palco`), o conteúdo mora no texto do item.
- `cenas.test.tsx` cobre as duas (render, `aria-hidden`, toda tinta pedida
  definida, `data-fase > 0` parado). NÃO é seu: quebrou, a mudança está errada.

### Armadilhas do repo (já morderam — os comentários das cenas documentam cada uma)
**pnpm**, não npm · nenhuma dependência nova · framer + SVG: `attrY` (não `y`)
para atributo; `translate` no grupo de FORA da animação; raio em vez de `scale`;
`pathLength` × `strokeDasharray` brigam; `initial` tem de olhar o estado quando
`parado` · ids de gradiente únicos por instância (o palco cuida) · opacidade
Tailwind fora da escala de 5 só `[0.78]` · nada de `.focus(` · classes nunca
por template string · `tailwind.config.js` e `index.css` INTOCÁVEIS.

### Estilo OBRIGATÓRIO
`.claude/STYLE-GOOGLE-TS.md`. Comentários em PT. Sem `any`, sem `@ts-ignore`.
Arquivos ≤800 linhas, funções ≤50.

## A TASK
1. Reescrever `itens/Intacto.tsx` com o conceito do LACRE.
2. Reescrever `itens/SemCompra.tsx` com o conceito do CONTADOR.
3. **Verificação VISUAL obrigatória**: renderize cada cena por SSR nas
   fases-chave (primeira, a da quebra, a final — mock de `useRoteiro` em script
   descartável força a fase) e OLHE. Salve os quadros no scratchpad e liste os
   caminhos no report — o dono vai comparar com o conceito que aprovou.

## SCOPE
- src/manual/cenas/itens/Intacto.tsx
- src/manual/cenas/itens/SemCompra.tsx

(`itens/Relogio.tsx` é nota-10: INTOCÁVEL. Os outros cinco itens são da track C.
`itens/comuns.tsx`, `pecas.tsx`, `luz.tsx`, `tempo.ts`, `contrato.tsx`,
`cenas.test.tsx`, `redes.tsx`, `Cena*.tsx`, `passos/**`: importar pode, editar
não.)

## DEPENDS ON
Prelude mergeado em `feat/manual-polimento` + **OK explícito do dono aos dois
conceitos** (vem no spawn).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde — sem falha NOVA vs a base `origin/feat/manual-polimento`
  (baseline main 364/364 + testes do prelude)
- `pnpm build` ok
- `git diff --name-only origin/feat/manual-polimento...HEAD | sort` = exatamente
  os 2 arquivos do SCOPE
- `git diff --name-only origin/feat/manual-polimento...HEAD | grep -E "CenaVoz|itens/Relogio"`
  = vazio (as nota-10 intactas)
- `git diff origin/feat/manual-polimento...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio
- `git diff origin/feat/manual-polimento...HEAD | grep -n "\.focus("` = vazio

## COMMIT + PUSH
`feat(manual): intacto e sem-compra refeitas do zero — lacre e contador, na doutrina`
→ `git push -u origin track/polimento-itens-refazer`. **NÃO mergeie.**
Report: sumário + verdict READY/NOT READY + VERIFY colado + para CADA cena: a
frase do conceito, o arco fase a fase, e os caminhos dos quadros renderizados
que você OLHOU.

# Manual — polimento das animações (card 010) — PRELUDE: os ícones reais das redes (task_polimento_prelude)

Você é o EXECUTOR, numa worktree isolada criada pelo harness.

## STEP 0 (obrigatório, antes de qualquer edit)
A worktree do harness NÃO nasce na base desta track. Rode:
`git fetch origin && git checkout -B track/polimento-prelude origin/feat/manual-polimento`
e confirme: `git status --porcelain` vazio · worktree, não o repo principal ·
`ls src/manual/cenas/itens/comuns.tsx` existe. Divergiu → **PARE e reporte.**

## A VISÃO DO DONO (card 010)
O dono pediu, em 3 animações diferentes, **ícones reais** de YouTube, TikTok e
Instagram no lugar de "formas genéricas dentro de círculo cinza". Ele nomeou o
defeito duas vezes: ícone "afogado"/"enforcado" em círculo. Este prelude cria a
peça ÚNICA que as três tracks de cena vão importar — e a folha de comparação
mono × cor-da-marca que ele decide no gate visual.

## A DOUTRINA DO DONO (régua de TODA animação — o "porquê", não só o "o quê")
1. **Equilíbrio**: "não tão parecendo festa, mas também não tão discreta. Elegante."
2. **Respiro**: elementos espaçados, "respirando". Círculo apertado em volta de
   ícone ("enforcando", "afogado") é defeito NOMEADO — duas vezes.
3. **Hierarquia**: traços e ícones que "ornam" entre si.
4. **Cor com significado**: verde = certo, vermelho = errado. Colorido sem função
   "não é elegante"; "tudo colorido" = "horrível".
5. **Ícones reais** das plataformas onde a regra fala de redes.
6. **Ritmo**: nem lenta, smooth, com ação.
7. **Narrativa** com começo-meio-fim.
8. **Réguas nota-10**: `src/manual/cenas/CenaVoz.tsx` e
   `src/manual/cenas/itens/Relogio.tsx` — olhe-as antes de desenhar. INTOCÁVEIS.

## CONTEXTO (não perca tempo redescobrindo)
- A linguagem visual das cenas: `src/manual/cenas/pecas.tsx` (`TINTA`, `TRACO`,
  `TRACO_ACESO`), `src/manual/cenas/luz.tsx` (`ARCO`, `CERTO`, `QUEBRA`). Leia os
  dois ANTES de desenhar — o ícone precisa "ornar" com esses traços.
- O que você está substituindo (NÃO edite, só entenda): `Sinal` em
  `src/manual/cenas/itens/comuns.tsx` — o glifo genérico num `circle` cinza, o
  exato desenho que o dono reprovou. As tracks de cena trocam os usos; o `Sinal`
  fica onde está por enquanto.
- Padrão de logos do repo: `public/logos/*.svg` (meta, openai, claude) — SVGs
  simples, monocromáticos. Os seus vivem em CÓDIGO (paths num componente), não em
  `public/`, porque cena precisa de cor por estado.
- **API que as tracks vão consumir (contrato — não mude sem reportar):**
  - Arquivo novo `src/manual/cenas/redes.tsx`.
  - `export type RedeReal = 'youtube' | 'tiktok' | 'instagram';`
  - `export const COR_DA_MARCA: Record<RedeReal, string>` — uma cor CHAPADA por
    rede (sugestão: youtube `#FF0033`, tiktok `#25F4EE`, instagram `#E1306C`);
    sem gradiente — gradiente de marca é "festa", e festa reprova.
  - `export function IconeDaRede({ rede, x, y, tamanho = 34, cor, acesa = true })`
    — desenha o glifo CENTRADO em (x, y), `tamanho` = altura total, `cor` = a
    tinta mono do estado que a cena mandar (apagado `TINTA.linha`, aceso
    `TRACO_ACESO`, etc.).
  - `export const USAR_COR_DA_MARCA = false;` — quando `true` E `acesa`, o ícone
    usa `COR_DA_MARCA[rede]` no lugar de `cor`. **A troca mono→marca pós-gate tem
    de ser UMA linha neste arquivo**, sem tocar cena nenhuma.
- **Desenho dos glifos**: paths reconhecíveis e simples, na origem —
  YouTube = retângulo bem arredondado com o play; Instagram = quadrado
  arredondado em contorno + lente + ponto; TikTok = a nota musical (o "d" com
  gancho). **SEM círculo em volta** (doutrina 2/5 — o círculo-jaula é o defeito),
  sem filtro SVG, sem gradiente, sem `<text>`.

### Armadilhas do repo (já morderam)
**pnpm**, não npm · nenhuma dependência nova · `pecas.tsx`, `luz.tsx`,
`tempo.ts`, `contrato.tsx`, `itens/comuns.tsx`, `cenas.test.tsx`,
`tailwind.config.js`, `index.css`: INTOCÁVEIS · nada de id fixo de
gradiente/filtro (não crie `<defs>` — cores chapadas não precisam) · classes
nunca montadas por template string.

### Estilo OBRIGATÓRIO
`.claude/STYLE-GOOGLE-TS.md`. Comentários em PT — o arquivo abre com o bloco
narrando o porquê (o defeito nomeado do dono e a regra do flip de 1 linha).
Sem `any`, sem `@ts-ignore`.

## A TASK
1. Criar `src/manual/cenas/redes.tsx` com a API acima.
2. Criar `src/manual/cenas/redes.test.tsx` (vitest + `renderToStaticMarkup`, o
   padrão de `cenas.test.tsx`): cada rede desenha `<path>`; nenhum `<circle>` de
   moldura no markup do ícone; nenhum `<text>`; `acesa=false` usa a `cor`
   passada; o modo marca produz a cor da marca (teste via prop/mecanismo que
   você expuser para a folha de comparação — sem flipar a const no código).
3. **Folha de comparação para o gate do dono**: script descartável (scratchpad)
   que renderiza os 3 ícones em mono (apagado + aceso) e em cor-da-marca, salva
   SVG/PNG e lista os caminhos no report. Você OLHA os quadros antes de dar
   READY — ícone torto aqui contamina três tracks.

## SCOPE
- src/manual/cenas/redes.tsx
- src/manual/cenas/redes.test.tsx

## DEPENDS ON
`feat/manual-polimento` criada pela sessão principal (STEP 0 confirma).

## VERIFY (pass/fail executável — cole a saída no report)
- `pnpm typecheck` = 0 erros
- `pnpm test` verde — sem falha NOVA vs baseline do main (**364/364**); os novos
  testes de `redes.test.tsx` inclusos e verdes
- `pnpm build` ok
- `git diff --name-only origin/feat/manual-polimento...HEAD | sort` = exatamente
  os 2 arquivos do SCOPE
- `grep -n "url(#" src/manual/cenas/redes.tsx` = vazio (sem gradiente/filtro)
- `git diff origin/feat/manual-polimento...HEAD | grep -nE "as any|@ts-ignore|: any"` = vazio

## COMMIT + PUSH
`feat(manual): icones reais das redes — a peça única que o card 010 importa` →
`git push -u origin track/polimento-prelude`. **NÃO mergeie.**
Report: sumário + verdict READY/NOT READY + VERIFY colado + caminhos da folha de
comparação mono × marca (o dono decide a variante olhando para ela).

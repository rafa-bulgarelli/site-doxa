# Como adicionar uma página à biblioteca SEO

O caminho de uma página nova, do jeito que as 63 primeiras nasceram (card 011,
2026-08-17/18). É curto porque o motor faz o resto — o que não dá para pular é a
ordem, e o motivo de cada passo está no parêntese.

## 0. Antes de escrever: a página merece existir?

- Está no `keyword-map.md` com intenção, cluster e o que a diferencia das vizinhas?
  Se não está, entra lá primeiro (nota = CI × R × SO × AW; "não fazer" com motivo).
- Passa no §45 do brief: **"eu publicaria isso se o Google não existisse?"** Página
  rasa é pior do que rota planejada — o motor renderiza a rota planejada como texto
  sem quebrar nada.
- Não colide com página existente (§14): a mesma intenção com keyword trocada é
  seção ou FAQ na dona, não página nova. Leia as vizinhas ANTES de escrever.
- Não é o que a Doxa não vende (§47): agência, tráfego pago, avatar/clone/UGC avulso,
  curso, ferramenta, gestão de rede. Essas buscas viram guia/comparativo editorial,
  nunca `/solucoes/x`.

## 1. Contrato (motor — mudança de dados, PR próprio)

- Acrescente a rota em `src/seo/rotas-planejadas.ts` (é o que permite que outras
  páginas linkem para ela antes de existir, e é o que faz um slug errado virar build
  vermelho em vez de link quebrado).
- URL = `PREFIXO[tipo] + '/' + slug` (`site.ts`); o arquivo vai em
  `src/seo/conteudo/DIRETORIO[tipo]/<slug>.ts` — `guia`, `dor` e `hub` publicam em
  `/guias` mas moram em diretórios distintos.
- Hub é union fechada de 5 (`tipos.ts`). Hub novo é mudança de motor + `HUBS` em
  `site.ts` + rota — decisão do gestor, não do autor.

## 2. Conteúdo (um arquivo, `export const pagina: Pagina`)

- Copie a forma de uma irmã do mesmo tipo (ex.: `solucoes/producao-de-videos-com-ia.ts`,
  `guias/como-fazer-videos-curtos-que-prendem.ts`, `glossario/hook.ts`).
- **Rastro de fatos no topo** (comentário): cada número, cliente, regra, prazo com
  `fonte:` apontando `docs/seo/source-of-truth.md` (e o arquivo de origem). Fato sem
  fonte não entra. O rastro tem de bater com o corpo — rastro que mente é pior do
  que fato sem rastro.
- **Régua** (`docs/seo/regua-de-copy.md`, 14 itens): primeiro parágrafo responde;
  title ≤65, description 120–160 e única, H1 ≠ title; sem "no mundo digital…", sem
  "a maioria / quase todo / sempre / único / a rede pune / estudos mostram"
  (raciocínio ou hedge de uma palavra); a Doxa entra UMA vez (destaque + `cta`);
  FAQ só com resposta verbatim de `DUVIDAS_PT` ou do source-of-truth (nada de
  PENDENTES; sem preço) — e a pergunta E a resposta têm de ser únicas no corpus
  (o teste reprova duplicata de pergunta; o audit avisa a repetida por resposta);
  exemplo com número só como "Suponha que…" + "números inventados para ilustrar",
  nunca ao lado de uma nota da Doxa; regras do manual sempre "condição de quem já é
  cliente, conforme as condições e o prazo do contrato"; a garantia sempre com a
  letra prudente (§3b) logo depois; R$ 8.000–10.500 sempre "ilustração, não
  levantamento".
- **Um dono por bloco**: custo marginal, R$ 8.000–10.500, zero impulsionamento, RT-2,
  exemplo das 22h, "baixou publicou", lista de decisões de formato, "mesmo arquivo nas
  três redes", "primeiros conteúdos abaixo do esperado…" já têm dono (grep no corpus).
  Nas outras páginas: uma frase + link. Frase de ≥10 palavras repetida em outra
  página = copiar, não linkar (há um script de shingles nos reports das rodadas).
- `relacionadas`: não liste o próprio hub (a migalha já linka) nem, num hub, os
  membros (o `PaginaHub` já lista). Sem negrito nos 40 primeiros caracteres do
  primeiro parágrafo (o teste compara texto achatado, mas o hábito ajuda). Células de
  tabela distintas na mesma linha. `atualizadoEm` = data da última mudança de
  CONTEÚDO (não de deploy). Checklist da régua no fim, marcado.

## 3. Gate (executável, não afirmação)

```
pnpm typecheck && pnpm test && pnpm build && pnpm seo:audit
```
- `seo.test.ts` reprova: title/description fora do limite ou duplicados, H1
  repetido, slug ≠ arquivo, link para rota desconhecida, FAQ duplicada, primeiro
  parágrafo que não renderiza, sitemap incompleto, JSON-LD inválido.
- `seo:audit` AVISA: órfã, hub sem membro, rota planejada sem página, palavras fora
  da faixa do tipo (solução/guia/dor 900–1400 · comparativo 1000–1500 · hub 400–800 ·
  verbete 150–400 — medidas no CORPO, não no `<main>`), FAQ repetida por resposta.
- Leia a página no `pnpm preview --port <livre> --strictPort` (COM barra local; a
  Vercel serve sem barra) e confira o hash do bundle servido contra `dist/index.html`.
- Mobile: `node .claude/tower/bin/mobile-shot.mjs http://localhost:<porta>/<rota>/ 320`
  → `scrollWidth == clientWidth`.
- Antes do merge: **collector adversarial** (leia como o Google caçando página feita
  só para SEO, e como o usuário da busca). Na noite do card 011, mesmo com todas as
  regras no pack, dois executores copiaram blocos de vizinhas — o gate humano/agente
  continua obrigatório em conteúdo.

## 4. Depois do merge

- `docs/seo/keyword-map.md`: status `existe`. Se a página nasceu de uma pergunta do
  dono respondida (PENDENTES), o `source-of-truth.md` ganha o fato com fonte ANTES.
- Deploy segue o rito da casa (VALIDAR-LIVE no papel do usuário; `curl` sem JS pelo
  `<title>`, domínio com L).

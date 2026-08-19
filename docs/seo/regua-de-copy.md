# Régua de copy — o checklist que fecha cada arquivo de conteúdo

Uma página. Destila §19–22 e §45 do brief 011. **Cole o checklist como comentário
no fim do arquivo de conteúdo** (`src/seo/conteudo/<dir>/<slug>.ts`) e marque
item a item antes de abrir PR. Item não marcado é motivo de reprovação no gate —
não de "resolve depois".

## Checklist (14 itens)

```
/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [ ]  1. A primeira frase RESPONDE a busca. Sem aquecimento, sem "no mundo
 *          digital", sem "cada vez mais empresas", sem definir o óbvio antes.
 * [ ]  2. Todo fato sobre a Doxa tem entrada em docs/seo/source-of-truth.md.
 *          Cliente, número, prazo, preço, garantia e depoimento: zero invenção.
 * [ ]  3. Nada da §9 (NÃO PUBLICÁVEL) apareceu — nem parafraseado, nem
 *          "suavizado": o VALOR da mensalidade, fidelidade, o NÚMERO de vídeos,
 *          as CONDIÇÕES de direitos, agência licenciada, os 1.500, "parceiros".
 *          Exceção explícita: a não-resposta que o FAQ já publica ("o
 *          investimento varia", "depende do plano contratado", "estabelecidos
 *          no contrato") é PERMITIDA verbatim — §9.1, itens 1, 4 e 10.
 * [ ]  4. Termos proibidos ausentes: "agência" como autodefinição, "parceiros"
 *          para as ferramentas, "assinatura", "curso", "tráfego pago" como
 *          serviço, "garantimos que vai viralizar".
 * [ ]  5. Se cita a garantia, usa a redação prudente do FAQ; se usa os números
 *          do manual, vem com "conforme as condições e o prazo do contrato".
 * [ ]  6. Motivo real de existir: responde a UMA intenção que nenhuma outra
 *          página do keyword-map já responde (conferir a seção Canibalização).
 * [ ]  7. Informação incremental: pelo menos um bloco que a SERP não tem —
 *          mecanismo, número da metodologia, erro comum, exemplo concreto.
 * [ ]  8. title exclusivo e orientado a intenção (nunca "Keyword | DOXA"),
 *          description exclusiva de 120–160 caracteres, H1 único, H2/H3 em
 *          hierarquia real.
 * [ ]  9. Pertence a ≥1 hub, envia links contextuais e recebe do hub. Nenhum
 *          link decorativo: cada um é útil para quem lê, não para o crawler.
 * [ ] 10. Comparativo é IMPARCIAL: admite onde a outra opção ganha. Não
 *          concluir artificialmente que a Doxa é sempre a resposta.
 * [ ] 11. CTA por intenção — topo de funil: próximo conteúdo; meio:
 *          metodologia/prova; fundo: o formulário (#forms). No hero e no
 *          fecho, nunca no meio do corpo.
 * [ ] 12. Sem keyword stuffing: a keyword-alvo aparece onde caberia se o
 *          Google não existisse. Sem sinônimo empilhado, sem lista de cidades.
 * [ ] 13. Frases do dono usadas palavra por palavra quando existem ("pronto
 *          para postar", "views somadas", "clone"). Vocabulário do §10.
 * [ ] 14. Teste final (§45): "eu publicaria isso se o Google não existisse?"
 *          Se não, reescrever — não ajustar.
 * ────────────────────────────────────────────────────────────────────────── */
```

## Três aberturas: ruim × boa

Todas as versões boas usam apenas fatos com `fonte:` no source of truth.

### 1. `/solucoes/producao-de-videos-com-ia`

**Ruim** — "No mundo digital em constante evolução, a inteligência artificial
revolucionou a forma como as empresas produzem conteúdo. Cada vez mais marcas
buscam soluções inovadoras para se destacar nas redes sociais."

Por que reprova: abre com a frase literalmente proibida (§21), não diz nada que o
leitor não soubesse, gasta duas linhas antes do assunto e não tem um fato.

**Boa** — "Produzir vídeo com IA hoje significa, na prática, isto: o cliente
manda uma foto e uma amostra da própria voz, e a plataforma monta um clone que
grava os vídeos no lugar dele — verticais, legendados, no formato do feed. É
assim que a Doxa entrega. Abaixo, o que essa troca resolve, o que ela não
resolve, e o que continua sendo trabalho humano."

Por que passa: responde na primeira frase; usa a redação publicada
(`public/llms.txt:6-9`, `src/components/HowItWorks.tsx:84-92`); e promete o
contrapeso, que é o que separa página útil de folheto.

### 2. `/comparativos/organico-vs-pago`

**Ruim** — "O marketing orgânico é sem dúvida a melhor estratégia para qualquer
empresa que deseja crescer de forma sustentável e econômica nas redes sociais."

Por que reprova: superlativo vazio, comparativo que já sai com a conclusão pronta
(§37), e "para qualquer empresa" é uma promessa que a própria Doxa não faz — o
FAQ condiciona ao potencial do negócio (`src/components/faq/config.ts:364-365`).

**Boa** — "Pago compra alcance imediato e para quando a verba para; orgânico
demora mais e continua rendendo depois. A escolha quase nunca é permanente — o
que muda é qual dos dois sustenta o mês seguinte. Esta página compara os dois por
custo, prazo, previsibilidade e o que sobra quando você desliga."

Por que passa: entrega a resposta na primeira linha, é honesta com os dois lados
e anuncia os eixos da comparação em vez de prometer "descubra agora".

### 3. `/guias/por-que-meus-videos-nao-tem-views`

**Ruim** — "Você já se perguntou por que seus vídeos não estão performando? Não
se preocupe! Neste artigo completo você vai descobrir os segredos do algoritmo e
finalmente viralizar."

Por que reprova: pergunta retórica, clickbait ("segredos"), promessa de viralizar
que a Doxa nega com todas as letras (`src/components/faq/config.ts:324-325`), e
"neste artigo você vai descobrir" adia a resposta.

**Boa** — "Costumam ser três coisas, nesta ordem: o vídeo não prende
nos primeiros segundos, o volume é baixo demais para gerar dado, ou os vídeos
competem entre si por serem publicados perto demais. Nenhuma delas é sorte.
Abaixo, como identificar qual é a sua — e o que fazer em cada caso."

Por que passa: a resposta vem antes do artigo; cada causa é verificável (a
terceira é a regra `RT-2`/`RH-1` do manual, `supabase/manual-seed-v1.sql:187-191,205-207`);
e "nenhuma delas é sorte" é confiança sem superlativo.

## O que reprova na hora

Página vazia ou placeholder · texto escondido · FAQ inventado · schema que
contradiz a página · fato sem fonte · número somado ou arredondado a partir dos
cases · depoimento fabricado · lista de cidades ou de nichos com o mesmo texto ·
comparativo que só elogia a Doxa · CTA de compra no meio de um verbete de
glossário.

## Adendo (2026-08-18, depois das correções 1–3) — a família de generalização sem fonte

Os collectors da noite reprovaram, página após página, a mesma classe de frase: **"a
maioria", "quase todo", "quase sempre", "quase ninguém", "todo mundo", "sempre",
"nunca", "único/única", "nenhuma plataforma", "a rede pune/premia", "a prova disso",
"estudos mostram", "mais comum"** — quantificador ou absoluto sobre mercado, audiência
ou plataforma que a Doxa não mediu. Regra: ou é raciocínio (e se escreve como
raciocínio), ou é hedge de uma palavra ("costuma", "tende a", "boa parte", "com
frequência"), ou sai. O `pnpm seo:audit` e o VERIFY das rodadas grepam essa família;
a abertura-modelo acima foi ajustada pela mesma razão. Exemplo com número: sempre
"Suponha que…" + "números inventados para ilustrar", e nunca ao lado de uma nota da Doxa.

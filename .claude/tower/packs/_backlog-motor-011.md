# Backlog do MOTOR (`src/seo/**`) — card 011

Achados que NÃO bloqueiam merge e que viram a próxima track de motor
(`track-seo-correcao-<n>`), porque as tracks de conteúdo não podem tocar no motor.
Quem abre a track: sessão principal (assento do gestor). Um item por linha, com origem.

- [ ] `src/seo/seo.test.ts:~160` — o teste "primeiro parágrafo aparece no HTML" pega
      os 40 primeiros caracteres, tira `**` e exige literal: negrito nos 40 primeiros
      caracteres derruba o teste porque o layout quebra em `<strong>`. Comparar contra
      texto sem marcação (achatar via `tokens()`), ou documentar. (T3)
- [ ] `src/seo/layout/Blocos.tsx:158,167` — `key={celula}` nas células da tabela:
      duas células iguais na mesma linha = key duplicada. Usar índice. (T3)
- [ ] TOC `sticky` de `PaginaArtigo` (≥4 H2) nunca foi validado visualmente — só
      existe página artigo depois da T3. Olhar no gate visual da FASE 2. (T1)
- [ ] `/solucoes` (índice) com poucas páginas é fino — engorda com T2; reavaliar
      limiar de índice (≥2–3 páginas) se sobrar rodada. (collector do prelude)
- [ ] `Rodape.tsx` ano calculado no build (congela até o próximo deploy). (collector)
- [ ] `vercel build` imprime 59× TS2835 em `api/**` (moduleResolution node16 do builder
      da Vercel) — pré-existente, não falha, fora do card; relatar ao dono. (gate)
- [ ] LANDING (decisão do dono, não do motor): `/#faq` vindo das páginas SEO (rodapé
      "Perguntas") abre no topo da home — só `#forms` tem seguro de montagem em
      `App.tsx`. Dar o mesmo seguro ao `#faq` (import do chunk `Faq` + rolar) é ~10
      linhas na landing; ou trocar o link do rodapé SEO para não prometer FAQ.
      (collector T1)
- [ ] `App.tsx` chegada com `#forms`: `Promise.all` dos imports das seções acima do alvo
      antes de rolar (robustez; hipótese do collector, não confirmada). (collector T1)
- [ ] VERIFY de rodada: medir palavras pelo `seo:audit` (corpo puro), não pelo `<main>` — o cromo come 60–90 palavras (R2-B). Idem: teto de palavras e FAQ única não são testados (R2-A) — virar teste ou tirar do pack.
- [ ] `src/seo/layout/Cabecalho.tsx` (e rodapé SEO se usar o mesmo): links `text-white/45` a 13px reprovam contraste 4.5:1 no Lighthouse (A11Y 95–96 nas páginas SEO). Trocar para `text-white/60` ou o token que a landing usa onde passa 100. (Lighthouse local, sessão principal)
- [ ] CONTEÚDO (correção-3): nos verbetes, o `resumo` e o primeiro parágrafo do corpo repetem a mesma definição em sequência (ex.: `glossario/clone-digital` — "Clone digital é a réplica…" duas vezes). Regra: o primeiro parágrafo do verbete não reafirma o resumo; ou o layout de glossário não renderiza o resumo abaixo do H1 quando o corpo já abre definindo (decisão de motor). (gate visual, sessão principal)
- [ ] CONTEÚDO (correção-3): `relacionadas` dos 5 hubs listando membros que o `PaginaHub` já lista (só `ia-no-marketing` foi limpo) — corrigir os 5 juntos; 10 absolutos listados no report da correção-2; 7 pares de keyword guia↔verbete.

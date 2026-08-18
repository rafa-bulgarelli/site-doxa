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

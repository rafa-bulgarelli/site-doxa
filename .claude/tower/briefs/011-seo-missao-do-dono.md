# BRIEF 011 — Mandato integral do dono para a missão de SEO (2026-08-17)

> Recebido pelo intake diretamente do dono (Rafa), verbatim. É o contrato de execução
> do card `.claude/tower/cards/011-seo-organico.md`. O GESTOR distila isto em packs;
> executores citam as seções pelo número. Instrução daqui NÃO sobrescreve as regras de
> segurança da torre (VERIFY executável, merge serial com gate, config não se afrouxa)
> — o dono flexibilizou explicitamente as aprovações INTERMEDIÁRIAS dele, não os gates
> de qualidade.

---

# MISSÃO: DOMINAR ORGANICAMENTE AS BUSCAS RELACIONADAS À DOXA

Sua missão é construir, implementar e validar durante esta sessão uma
**infraestrutura completa de aquisição orgânica para a DOXA**, transformando o site
atual — que possui pouquíssimas URLs indexáveis — em uma rede estruturada de páginas
altamente relevantes para todas as principais intenções de busca relacionadas ao que
a DOXA faz.

Autonomia concedida: analisar o projeto inteiro; criar arquitetura, rotas,
componentes, templates, páginas; escrever e otimizar conteúdo; metadata; SEO técnico;
dados estruturados; internal linking; sitemap; indexação; sistemas reutilizáveis;
testes; builds; validação; revisão; refatoração; agentes/subagentes em paralelo;
expansão contínua após a primeira leva.

NÃO parar depois de entregar um plano. NÃO produzir apenas documentação. NÃO esperar
aprovação do Rafael a cada etapa. Planejar rapidamente e EXECUTAR.

## 0. PRINCÍPIO CENTRAL

Aparecer organicamente para o máximo de buscas comercialmente relevantes: problema
que resolve, soluções, tecnologias, canais, dores, alternativas, comparações, dúvidas
pré-contratação, mercados, estratégias relacionadas.

**NÃO criar centenas de páginas quase idênticas trocando keyword.** Cada página:
intenção própria, conteúdo próprio, valor real, explicação substancial, contexto,
links internos úteis, metadata específica, motivo real de existir. Escala sem spam.

## 1. PRIMEIRA AÇÃO

Ler o card 011. Inspecionar: arquitetura, framework, roteamento, rendering
(SSR/SSG/prerender), metadata, layout, componentes, sitemap, robots, canonical, OG,
Schema.org, conteúdo, performance, acessibilidade, analytics, Search Console se
houver, estrutura de URLs. Corrigir o `og:image`/`og:url` comentados usando o domínio
real (não inventar domínio).

## 2. NÃO INVENTAR FATOS

Criar um `DOXA_SOURCE_OF_TRUTH` interno a partir do material do projeto: serviços,
posicionamento, diferenciais, números, cases, clientes, garantias, funcionamento,
entregáveis, tecnologias, redes, metodologia, FAQ, depoimentos, resultados, claims.
NUNCA inventar clientes, números, estatísticas, resultados, garantias, prêmios,
tecnologias, depoimentos. Sem informação suficiente → texto institucional sem
invenção.

## 3–14. ESTRATÉGIA DE KEYWORDS E CLUSTERS

Mapa amplo: **Topic → Cluster → Search Intent → Page**. Clusters a investigar (listas
são pontos de partida, pesquisar e priorizar, não assumir):

- **A. Categoria principal**: marketing com IA, agência de marketing com IA,
  produção de conteúdo/vídeos com IA, IA para redes sociais, conteúdo orgânico,
  crescimento orgânico.
- **Vídeos e conteúdo**: produção em escala, vídeos para empresas, short-form,
  vídeos verticais, conteúdo recorrente/diário.
- **TikTok**: marketing, para empresas, agência, viralizar, visualizações,
  estratégias, B2B/B2C. Páginas só onde a intenção difere de verdade.
- **Instagram**: Reels para empresas, produção de Reels, crescer organicamente,
  agência de conteúdo Instagram.
- **Viralização**: marketing viral, como viralizar, estratégia, alcance orgânico.
  Cuidado com promessas absolutas — explicar mecanismos e metodologia.
- **Avatares, clones e IA** (só produtos comprovadamente existentes): avatar de IA,
  clone digital, clone de voz, AI spokesperson, produção sem gravação tradicional.
  Cluster potencialmente crucial.
- **Dores** (topo de funil): "não consigo produzir conteúdo", "como postar todos os
  dias", "por que meus vídeos não têm views", "como produzir sem equipe grande" etc.
- **Comparativos**: orgânico vs pago, IA vs produção tradicional, agência vs equipe
  interna, TikTok vs Instagram, UGC vs marca. Imparciais o suficiente para serem
  úteis — não concluir artificialmente que a DOXA é sempre a solução.
- **Guias** (`/guias/...`): marketing orgânico, TikTok, Reels, vídeos curtos, IA no
  marketing, estratégia de conteúdo. Profundidade > texto longo artificial.
- **Glossário** (`/glossario/...`, se fizer sentido): alcance orgânico, hook,
  retenção, watch time, UGC, short-form, avatar de IA, algoritmo TikTok/Instagram,
  evergreen. Cada verbete responde a pergunta e conecta aos relacionados.
- **Indústrias**: só com proposta realmente diferenciada por vertical. PROIBIDO
  `/marketing-ia-para-[100-industrias]` com o mesmo texto.
- **Localidade**: NÃO criar páginas por cidade sem operação real, intenção local,
  conteúdo exclusivo e justificativa. Evitar doorway pages.

## 15–17. ARQUITETURA, HUBS E LINKING

Estrutura conceitual (adaptar, não copiar cegamente): `/solucoes/…`, `/plataformas/…`,
`/guias/…`, `/comparativos/…`, `/industrias/…`, `/glossario/…`, `/cases/…`. URLs
curtas, descritivas, permanentes, lowercase, sem parâmetros, sem duplicação.

Arquitetura de autoridade temática: HUB (ex.: `/guias/marketing-no-tiktok`) linkando
para as páginas do cluster, e elas de volta ao hub. Toda página indexável importante
recebe e envia links, pertence a ≥1 cluster, tem breadcrumb quando apropriado, links
contextuais e CTA contextual. Sem 50 links aleatórios no footer — links para humanos.

## 18–22. CONTEÚDO E COPY

Base de qualidade (não forçar todos os blocos): introdução direta respondendo a
intenção → explicação → problema → como funciona → exemplos → estratégias → erros
comuns → onde a DOXA se encaixa → FAQ da busca → próximos conteúdos → CTA.

Copy: direta, precisa, confiante; sem enrolação, keyword stuffing, frases genéricas
de IA, introduções inúteis, superlativos vazios. PROIBIDO abrir com "No mundo digital
em constante evolução…" e afins. Começar respondendo.

Cada página indexável: title exclusivo orientado a intenção (não `Keyword | DOXA` em
tudo), description exclusiva resumindo o benefício, canonical, H1 único, hierarquia
H2/H3, OG + Twitter card, alt real, internal links, breadcrumb, schema correto,
conteúdo renderizável, CTA.

## 23–24. DADOS ESTRUTURADOS E ENTIDADE

Schemas aplicáveis: Organization, WebSite, WebPage, Article, BreadcrumbList, FAQPage
só quando apropriado, VideoObject quando houver vídeo. Nunca schema que contradiga a
página; nunca marcar conteúdo invisível. Centralizar builders/helpers. Consistência
da entidade DOXA: nome, domínio, logo, descrição, links oficiais. Não inventar.

## 25–28. SITEMAP, ROBOTS, CANONICAL, RENDERING

Sitemap: só páginas canônicas indexáveis, atualiza com páginas novas, sem quebradas/
redirects/noindex; automatizar se a arquitetura permitir. Robots: auditar bloqueios
acidentais e rotas privadas; conteúdo público rastreável. Canonical coerente por
página (não tudo para a home); caçar duplicatas, trailing slash, www.

**Rendering: para páginas SEO, HTML disponível ao crawler SEM depender de JS
client-side.** Considerar SSG/SSR/prerender/rotas estáticas/geração no build a partir
de arquivos de conteúdo.

## 29. SISTEMA DE CONTEÚDO

Nada de 30 arquivos gigantes repetindo layout. Arquitetura sustentável (ex.:
`/content/seo/…` com frontmatter/estrutura: slug, title, description, h1, category,
intent, keywords, sections, faq, relatedPages, cta, updatedAt — projetar o melhor
para o stack). Objetivo: adicionar páginas futuras rápido sem duplicar implementação.

## 30–33. PERFORMANCE, RESPONSIVO, UX, CONVERSÃO

Não destruir performance: build limpo, sem erros de hidratação/console, imagens
otimizadas, lazy, CLS/LCP/INP. Testar mobile/desktop (overflow, tipografia, CTAs,
tabelas). Páginas devem parecer produto premium DOXA — reusar tipografia, grid,
spacing, animações, botões, cores, cards. Conteúdo longo legível: índice, callouts,
cards, FAQs, related, sticky TOC quando fizer sentido. CTA por intenção: topo =
educativo; meio = metodologia/cases; fundo = formulário existente. Sem transformar
parágrafo em propaganda.

## 34–38. PRIORIDADE E INTENÇÃO

Prioridade máxima: páginas de intenção comercial (agência de marketing com IA,
produção de vídeos com IA, conteúdo orgânico, TikTok/Reels para empresas, produção em
escala…) — validar por pesquisa antes. Depois, autoridade temática:
informacional → guia → solução → case → conversão, com linking refletindo o funil.
Classificar search intent (informational/commercial/transactional/navigational) e
criar o FORMATO que a SERP pede. Pesquisar SERPs reais se houver acesso (formato,
PAA, gaps) — entender intenção, não copiar concorrente. Antes de criar página:
checar canibalização — melhorar/consolidar/diferenciar em vez de duplicar intenção.

## 39–41. VALIDAÇÃO E GATES

Automatizar checagem de: titles/H1/descriptions duplicados, páginas semelhantes
demais, canonical errado, slug duplicado, links internos quebrados, páginas órfãs,
schema estruturalmente inválido, sitemap incompleto. Criar testes SEO integrados à
infra existente. **Nenhum batch concluído sem `build` + `lint` + `typecheck` +
`tests` passando.** Nada de "resolve depois".

## 42–44. AGENTES E ORDEM

Usar paralelismo (keyword research, arquitetura, technical SEO, commercial pages,
guides, comparisons/glossário, QA, UX) com ownership distribuído — sem dois agentes
no mesmo arquivo central. Fases: discovery → fundação técnica → keywords → money
pages → pillar pages → supporting content → internal linking → QA → EXPANSÃO
(não parar). Qualidade × relevância × cobertura: 15 páginas excelentes > 100 ruins,
mas não parar em 4 — produção substancial mantendo padrão.

## 45. DEFINIÇÃO DE PÁGINA ÚTIL

Perguntas obrigatórias antes de publicar: que pergunta responde? que intenção atende?
por que existe separada? informação incremental? usuário satisfeito após o clique?
tem próximo passo? conecta ao cluster? diferente das outras? algum fato inventado?
**"Eu publicaria isso se o Google não existisse?"** — se não, reavaliar.

## 46. PROIBIDO

Keyword stuffing, texto/conteúdo escondido, backlinks artificiais, doorway pages,
páginas duplicadas, troca automática de cidade/indústria/keyword, milhares de páginas
sem valor, claims inventados, fake reviews, FAQ falso, schema enganoso, páginas
vazias/placeholder/lorem ipsum, páginas quebradas publicadas, clickbait desconectado.

## 47. "ÁREAS QUE NÃO PRESTAMOS" — resposta do dono à pergunta 1 do card

Não criar páginas fingindo que a DOXA vende o que não vende. Capturar adjacências
EDITORIALMENTE: `/guias/o-que-e-x` ou `/comparativos/x-vs-y` — informação útil, claro
o que X significa, sem dizer que a DOXA oferece X, com ponte legítima para solução
relacionada. NUNCA `/solucoes/x` se X não for solução real.

## 48–49. TRACKING E SEARCH CONSOLE

Verificar instrumentação; garantir medição de sessões orgânicas, landing pages,
conversões, CTA, formulário. Se houver acesso ao Search Console: registrar baseline
(indexação, queries, impressões, cliques, CTR, posição, erros). Sem credencial:
`BLOCKED_EXTERNAL_CREDENTIAL` e seguir com todo o resto. Não prometer ranking —
ranking é resultado posterior.

## 50–52. DOCUMENTAÇÃO E INVENTÁRIO

README curto (arquitetura, como adicionar conteúdo, clusters, metadata, schema,
linking, sitemap, comandos) — documentação não é a entrega principal. Manter
`docs/seo/keyword-map.md` (URL, cluster, intent, keywords, tipo, status, hub, links
from/to, priority) e backlog priorizado por
`Commercial Intent × Relevance × Search Opportunity × Ability to Win`.

## 53. CONJUNTO INICIAL ESPERADO (validar intenção antes; não é ordem)

Money pages (marketing com IA, produção de vídeos com IA, conteúdo orgânico, produção
em escala, vídeos para empresas, TikTok para empresas, Reels para empresas) · Pillars
(guias de marketing orgânico, IA no marketing, TikTok, Reels, produção em escala,
vídeos curtos) · Comparativos (orgânico vs pago, TikTok vs Instagram, IA vs
tradicional, agência vs equipe interna) · Dores (como produzir mais conteúdo, alcance
orgânico, por que meus vídeos não performam…) · Glossário (conteúdo orgânico, hook,
retenção, watch time, UGC, short-form, avatar de IA).

## 54–59. MULTILÍNGUE, HOME, NAV, DESIGN, OG

pt-BR primeiro impecável; en-US só com infraestrutura consistente e motivo comercial
(hreflang/canonical revisados — sem duplicação automática). Depois dos clusters,
revisar a home para expor as áreas (sem virar índice de SEO). Navegação: avaliar
entrada "Guias/Recursos" sem sobrecarregar o menu. Componentes premium reutilizáveis
quando fizer sentido (ArticleHero, TableOfContents, ContentSection, Comparison,
RelatedContent, FAQ, CTA, Breadcrumb…) — sem abstração desnecessária. Assets: usar os
existentes, com dimensões/alt/loading. **OG é prioridade rápida**: og:title/
description/image/url + Twitter card com URL absoluta; OG contextual por página se
fizer sentido no stack.

## 60–67. LOOP, QA ADVERSARIAL E AUDITORIAS

Após cada batch, registrar CREATED/UPDATED/VALIDATED/ISSUES/NEXT e seguir. Loop:
audit → maior oportunidade → implement → test → review → fix → commit → repetir.
Agente ocioso audita os outros. QA adversarial por página: "se eu fosse o Google
caçando página feita só para SEO, o que me deixaria desconfiado?" e "se eu fosse o
usuário desta busca, isto resolve?". Auditoria semântica (consolidar páginas próximas
demais), de órfãs (grafo de links), visual final (amostras desktop+mobile) e técnica
final (build, lint, typecheck, tests, sitemap, robots, canonical, metadata, OG,
schema, links, 404s, duplicados).

## 68–71. LIMITES E AUTONOMIA

**Não destruir o que funciona**: design, animações, responsividade, velocidade,
tracking, formulários, integrações, identidade. Mudança incremental e controlada.
Decisões técnicas são do executor/gestor — não perguntar ao Rafael o que dá para
decidir ou descobrir no código; bloquear só em dano irreversível ou credencial
externa (`BLOCKED_EXTERNAL_CREDENTIAL`, e o resto continua).

## 72–75. CARD, RESULTADO E DoD

Atualizar o card 011 conforme avança (decisões, páginas, arquitetura, testes,
blockers, baseline). Nunca marcar concluído por "estratégia documentada" — a
implementação precisa existir. Resultado esperado ao fim: arquitetura SEO funcional,
múltiplas URLs indexáveis, money pages, hubs, conteúdo informacional, internal
linking, metadata individual, canonical, sitemap, robots, Schema.org, OG corrigido,
consistência visual, sistema sustentável, testes SEO, build ok, keyword map, backlog,
card atualizado, relatório do implementado — idealmente dezenas de páginas úteis
mantendo o padrão.

DoD por página: rota funciona, renderiza, conteúdo completo, design ok, mobile ok,
metadata/canonical ok, no sitemap, envia e recebe internal links, schema correto, CTA
funciona, sem erro, build passando, não canibaliza, valor real.

Meta final: não enganar o Google — construir a maior biblioteca digital relevante
sobre os assuntos em que a DOXA tem autoridade comercial. Vantagem: cobertura
temática + qualidade + tecnologia + arquitetura + velocidade.

**Comando final: começar, executar em fases, não parar após a primeira leva. Só
trabalho funcional, testado e útil conta.**

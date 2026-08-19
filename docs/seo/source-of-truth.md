# DOXA_SOURCE_OF_TRUTH — o que a Doxa é, com a fonte de cada fato

> **Por que este arquivo existe.** Toda página de `/solucoes`, `/plataformas`,
> `/guias`, `/comparativos` e `/glossario` é afirmação comercial publicada. Frase
> inventada sobre cliente, número, prazo, preço ou garantia não é bug de
> conteúdo: é promessa que a empresa passa a dever. A regra de
> `src/components/faq/config.ts:10-21` vale para o conteúdo de SEO inteiro.
>
> **Regra de uso:** só entra em página o fato que aparece aqui **com `fonte:`**.
> O que não tem fonte está na §9 (NÃO PUBLICÁVEL) e não vira frase — nem
> parafraseado, nem "suavizado". Linhas citadas são do estado da branch
> `feat/seo-organico` em 2026-08-17; se o arquivo mudar, confira pelo nome do
> símbolo (`GARANTIA`, `CUSTO_DE`, `REELS`…), que é estável.

## 1. Identidade

- Nome público: **Doxa** — fonte: `public/llms.txt:1`; `index.html:30` (`og:site_name`).
- No manual do cliente, caixa alta: **DOXA** — fonte: `supabase/manual-seed-v1.sql:44`.
- Domínio canônico: **`https://www.doxaviral.com`** (*viral*, com L) — fonte: `public/sitemap.xml:21`; `public/robots.txt:20`; `public/llms.txt:30`.
- Idioma raiz `pt-BR`, com versão `en` no mesmo bundle — fonte: `index.html:2`; `src/idioma.tsx` (`PorIdioma`, usado em todo `config.ts` de conteúdo).
- `<title>` da home: "Doxa — Um milhão de views. Ou seu dinheiro de volta." — fonte: `index.html:18`.
- Description da home: "Uma foto e um áudio viram sessenta conteúdos em noventa dias. Um milhão de views somadas, ou seu dinheiro de volta." — fonte: `index.html:20-22`.
- `og:image` e `og:url` ainda comentados, à espera do arquivo `public/og.png` — fonte: `index.html:39-54`.
- Rotas existentes além da landing: `/leads`, `/manual-doxa`, `/manual-doxa/admin`, `/admin`, conversor — fonte: `src/App.tsx:92-114`; `src/manual/config.ts:12`.
- Site indexável desde 10/08/2026 (`User-agent: *` / `Allow: /`) — fonte: `public/robots.txt:18-19`.

### O que a Doxa É

- Produz **conteúdo vertical em escala para empresas e agências** — fonte: `public/llms.txt:6`.
- O cliente manda **uma foto e uma amostra da própria voz**; a plataforma monta um **clone** que grava os vídeos no lugar dele, prontos para postar — verticais, legendados, no formato do feed — fonte: `public/llms.txt:6-9`; `src/components/HowItWorks.tsx:84-92`.
- Operação descrita como **proprietária**: volume, testes constantes, análise de dados e otimização — fonte: `src/components/faq/config.ts:134-135`.
- A escala vem de **tecnologia, inteligência artificial, processos próprios e operação especializada em produção de conteúdo em escala** — fonte: `src/components/faq/config.ts:449-450`.

### O que a Doxa NÃO é (redação pública, usar como está)

- **Não é agência**: não há equipe de gravação, estúdio nem calendário editorial do lado do cliente — fonte: `public/llms.txt:40-41`.
- **Não é tráfego pago**: a garantia é de views orgânicas somadas, não de anúncios — fonte: `public/llms.txt:42`.
- **Não vende curso, ferramenta nem assinatura de software** — fonte: `public/llms.txt:43`.
- **Não há checkout nem cobrança dentro do site**; o funil termina em conversa humana — fonte: `public/llms.txt:47-49`.
- **Não garante que um vídeo específico viralize** — a garantia é sobre a performance total contratada — fonte: `src/components/faq/config.ts:324-325`.

## 2. Oferta e funcionamento

Rótulo da seção: "Como funciona." / "Três passos, e só o primeiro pede o seu tempo." — fonte: `src/components/HowItWorks.tsx:129-130`.

| # | Nome | Manchete | Corpo |
|---|---|---|---|
| 01 | Onboarding | A gente aprende o seu negócio | Uma reunião para preencher o que você faz, quem você quer atingir e o que espera dos vídeos. |
| 02 | Criar clones | Uma foto e um áudio viram o seu clone | Você manda uma foto e uma amostra da sua voz. A plataforma monta o clone que vai gravar os vídeos no seu lugar. |
| 03 | Publicação | O vídeo pronto para postar | Vertical, legendado, no formato do feed. Você recebe e publica no seu perfil. |

— fonte: `src/components/HowItWorks.tsx:71-92`; a mesma sequência resumida em `public/llms.txt:21-26`.

### Entregável

- O que chega ao cliente é o **arquivo do vídeo pronto para publicação**: vertical, legendado, no formato do feed — fonte: `src/components/HowItWorks.tsx:92`; `public/llms.txt:25-26`.
- Cada vídeo é **único**, com roteiro, voz clonada, edição e capa — fonte: `supabase/manual-seed-v2.sql:168`.
- Quem publica é **o cliente**, no perfil dele — fonte: `src/components/HowItWorks.tsx:92`; `supabase/manual-seed-v1.sql:66`.
- Volume: depende do plano; operações de alta frequência, podendo publicar múltiplos conteúdos por dia — fonte: `src/components/faq/config.ts:413-414`.
- Volume mínimo do período da garantia: **60 conteúdos únicos em 90 dias**, um por dia útil — fonte: `supabase/manual-seed-v1.sql:179`.

### Plataformas

- As três redes da garantia: **Instagram, TikTok e YouTube Shorts** — fonte: `supabase/manual-seed-v1.sql:84`; `src/components/Hero.tsx:21`.
- Redação mais ampla do FAQ, para quem ainda não contratou: "a estratégia pode envolver TikTok, Instagram, YouTube e outras redes relevantes para o público da empresa" — fonte: `src/components/faq/config.ts:392-393`.
- **Cuidado de copy:** a garantia conta as três redes fixas; a estratégia pode envolver outras. Página de plataforma nunca diz que a garantia cobre rede fora das três.

### Processo depois de contratar

- Onboarding (empresa, objetivos, público, posicionamento, referências) → estratégia → produção → aprovações → publicação → análise contínua — fonte: `src/components/faq/config.ts:537-538`.
- Aprovação **quando o fluxo do cliente exige**; a empresa acompanha temas, roteiros, versões e materiais — fonte: `src/components/faq/config.ts:466-467`.
- Identidade e tom de voz são mapeados no início e orientam a produção — fonte: `src/components/faq/config.ts:485-486`.
- Performance monitorada durante toda a operação — fonte: `src/components/faq/config.ts:554-555`.
- Gravação do cliente: a Doxa assume **grande parte** da operação; o que é necessário (imagens, vídeos, áudios ou participações) é mapeado no onboarding e **varia conforme o formato** — fonte: `src/components/faq/config.ts:431-432`.

### O funil

- Termina em **conversa humana**: quem preenche o formulário é chamado em **até 24 horas** para marcar a auditoria estratégica — fonte: `public/llms.txt:47-49`; `src/components/comparacao/config.ts:297`.
- Nome do compromisso: **"Auditoria estratégica Doxa"** — fonte: `src/components/comparacao/config.ts:273`.
- CTA canônica da landing: "Quero viralizar" — fonte: `src/components/Hero.tsx:42`.
- Toda CTA de conversão aponta para o mesmo destino (`#forms`) — fonte: `src/ancoras.ts:15-28`.

## 3. Garantia — as DUAS redações que existem

O repositório mantém **duas redações independentes**, e isso é deliberado: nenhum código força as duas a concordarem, e se uma mudar a outra muda no mesmo commit — fonte: `src/components/faq/config.ts:30-37`.

**(a) A manchete.** "Um milhão de views. Ou seu dinheiro de volta." — fonte: `src/components/comparacao/config.ts:202` (`GARANTIA_PT`); repetida em `index.html:18` e `src/components/Hero.tsx:38-39`. Linha de apoio: "60 conteúdos · 90 dias · views somadas no [Instagram/TikTok/YouTube Shorts]" — fonte: `src/components/Hero.tsx:40-41,21`.

**(b) A letra, no FAQ.** "A Doxa trabalha com metas de performance definidas em contrato. Nossa operação é estruturada para atingir o volume de visualizações acordado dentro do período estabelecido e, caso a meta não seja alcançada, aplicam-se as condições de garantia previstas no contrato." — fonte: `src/components/faq/config.ts:110-111`.

**(c) A redação do manual do cliente — contratual.** "1.000.000 de visualizações em 90 dias corridos, contados a partir da publicação do primeiro vídeo. Somam-se as visualizações de todos os vídeos publicados, nas três redes: Instagram, TikTok e YouTube Shorts. Se você cumprir integralmente todas as condições deste manual e a meta não for alcançada, existe estorno de 100% conforme as condições e o prazo do contrato." — fonte: `supabase/manual-seed-v1.sql:84`, regras `GA-1` (`:88`) e `GA-2` (`:93`); ditado do dono em `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:407-416`.

**Como usar cada uma em página pública**

- **(a)** pode ser citada como a promessa da empresa: já é o que a home e o `<title>` dizem.
- **(b)** é a redação prudente. Toda página que EXPLICA a garantia usa esta, porque não promete prazo nem plataforma fora do contrato.
- **(c)** os números (1.000.000 / 90 dias / três redes / estorno de 100%) só entram em página pública **junto da ressalva "conforme as condições e o prazo do contrato"**, que é como o próprio manual os enuncia. O manual é aceito DEPOIS de contratar — usar o detalhe dele como promessa de aquisição inverte a ordem.
- **Nunca** afirmar que um vídeo específico vai viralizar — fonte: `src/components/faq/config.ts:324-325`.
- **Nunca** prometer reembolso sem a condição de cumprimento integral — fonte: `supabase/manual-seed-v1.sql:93`.

## 4. Números publicáveis

| Número | Redação exata | Onde é verdade |
|---|---|---|
| 1 milhão de views | "Um milhão de views. Ou seu dinheiro de volta." | manchete pública |
| 60 conteúdos | "60 conteúdos · 90 dias" | linha de apoio do hero |
| 90 dias | corridos, do primeiro vídeo publicado | garantia contratual |
| 3 redes | Instagram, TikTok, YouTube Shorts | garantia contratual |
| até 24 horas | retorno do time depois do formulário | funil |
| 25 contratações | inventário do "jeito antigo" | seção comparativa |
| 18 dias | primeiro vídeo **pelo jeito antigo** | seção comparativa |
| 100% | estorno, cumpridas todas as condições | garantia contratual |

- 1.000.000 de visualizações — fonte: `supabase/manual-seed-v1.sql:84`; `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:407`.
- 60 conteúdos únicos / 90 dias / três redes — fonte: `supabase/manual-seed-v1.sql:179,183`; `src/components/Hero.tsx:40`.
- 90 dias corridos a partir da publicação do primeiro vídeo — fonte: `supabase/manual-seed-v1.sql:88`.
- Retorno em **até 24 horas** — fonte: `src/components/comparacao/config.ts:297`; `public/llms.txt:47-49`; repetido no escape do FAQ, `src/components/faq/config.ts:612`.
- Intervalo mínimo real de **24 horas** entre vídeos da Doxa em dias úteis (regra operacional do cliente, NÃO é o mesmo 24 h do retorno comercial) — fonte: `supabase/manual-seed-v1.sql:201,205`.
- **25** itens no inventário do jeito antigo (`ITENS_PT`) — fonte: `src/components/comparacao/config.ts:44-70`.
- Custo mensal do jeito antigo, de R$ 8.000 a R$ 10.500 — fonte: `src/components/comparacao/config.ts:100-101` (`CUSTO_DE`/`CUSTO_ATE`); `src/components/semcom/config.ts:23` (`CUSTO_SEM`); redação pública já publicada em `public/llms.txt:11-15`.
- **18 dias** até o primeiro vídeo pelo jeito antigo (`PRAZO_SEM`) — fonte: `src/components/semcom/config.ts:26`.
- 9 etapas do jeito antigo: Briefing, Roteiro, Aprovação, Agenda, Estúdio, Filmmaker, Captação, Edição, Publicação — fonte: `src/components/semcom/config.ts:10-20`.

### O inventário das 25 contratações (uso em comparativos)

Um video maker · Um roteirista · Um editor de vídeo · Um social media · Um diretor de criação · Uma câmera · Lentes · Um tripé · Um microfone de lapela · Um estabilizador · Cartões de memória · Um estúdio · Iluminação · Um cenário · Horas de gravação · Uma ilha de edição · Licença de edição · Banco de trilhas · Banco de imagens · Legendagem · Uma agência · Um gestor de tráfego · Verba de tráfego pago · Um calendário editorial · Relatórios — fonte: `src/components/comparacao/config.ts:44-70`.

> **Aviso do próprio arquivo:** a lista é do redator, montada a partir do que o dono ditou e estendida; "cada linha é uma afirmação sobre o custo de outra empresa", e está marcada `PENDENTE-DONO` — fonte: `src/components/comparacao/config.ts:34-37`. Usar como *ilustração do que uma operação interna acumula*, nunca como "levantamento de mercado da Doxa".

## 5. Clientes e provas

Existem **três** clientes com material entregue no repositório. Não há um quarto.

| Cliente | Perfil creditado | Entregável rotulado | Números publicados |
|---|---|---|---|
| Magalu | (sem handle) | Vídeo de SKU/Produto | nenhum |
| Core | @corealquimias | Vídeo viral | 3,4M views · 170k likes · 3k comentários · 1.300 reposts |
| Uninova | @uninovamotos | Vídeo viral | +2,5M views · +111k likes |

— fonte: `src/components/hero/cases.ts:100-139`; os mesmos três, com os mesmos números, em `src/components/proof/reels.ts:43-74`.

**Pode ser dito**

- Os nomes **Magalu**, **Core** (@corealquimias) e **Uninova** (@uninovamotos): são posts reais em perfis reais — fonte: `src/components/proof/reels.ts:3-7`.
- Os números **exatamente como estão escritos**, sem arredondar, somar ou converter: são strings citadas, não cálculo — fonte: `src/components/hero/cases.ts:13-17`; `src/components/proof/reels.ts:32-36`.
- O Magalu **não tem números** (`stats: null`) — fonte: `src/components/hero/cases.ts:110`. Quem citar Magalu cita o entregável, nunca um resultado.

**NÃO pode ser dito**

- "Mais de 15 reels" ou qualquer contagem derivada da parede de prova: ela REPETE os três reels reais até encher a faixa, e o código diz que a repetição "nunca é uma afirmação de quantos casos existem" — fonte: `src/components/proof/reels.ts:92-104`.
- "Dez clientes": o dono pediu ~15 reels de 10 clientes e os 12 arquivos restantes **não existem** aqui — fonte: `src/components/proof/reels.ts:9-13`.
- Somar as views dos casos ("quase 6 milhões"): nada autoriza cálculo, e dois números têm "+" na frente — fonte: `src/components/hero/cases.ts:16-17`.
- Depoimento, citação ou fala de cliente: **não existe nenhum**. Verificado por ausência — não há campo de depoimento em `src/components/hero/cases.ts:18-98` nem em `src/components/proof/reels.ts:14-41`.

## 6. Ferramentas

Pipeline: **HeyGen · ChatGPT · Claude · Meta · ElevenLabs** — fonte: `src/components/tools.ts:18-24`.

- São **marcas de terceiros exibidas para dizer sobre o que a pipeline roda**, e o arquivo proíbe implicar endosso ou parceria — fonte: `src/components/tools.ts:3-13`.
- **Divergência conhecida (§9):** a home imprime o rótulo "parceiros:" acima dessa fileira — fonte: `src/components/Hero.tsx:46,382`. Em página nova, escrever **"ferramentas"**, "a stack" ou "o que roda por baixo".

## 7. Segmentos

Dois caminhos, na primeira pergunta do formulário: "Quero viralizar minha empresa" → **Empresa**; "Quero ser uma agência licenciada" → **Agência licenciada** — fonte: `src/components/comparacao/Formulario.tsx:104`; rótulos internos em `src/leads/csv.ts:45` e `src/leads/central/Detalhe.tsx:101`.

- A definição pública diz "para empresas e agências" — fonte: `public/llms.txt:6`.
- **Ressalva do código:** "agência licenciada" promete um programa de licenciamento com condições, e o comentário diz que é melhor a porta não estar na página do que a resposta ser "ainda não temos isso pronto" — fonte: `src/components/comparacao/Formulario.tsx:99-103`. **Não criar página de aquisição sobre licenciamento** até o dono confirmar; a pergunta está em `PENDENTES` — fonte: `src/components/faq/config.ts:714`.

**Nichos que o formulário lista** (sinal de demanda, NÃO catálogo de páginas): Advocacia · Saúde e estética · Imóveis · Educação e cursos · Alimentação · Varejo e e-commerce · Serviços para empresas — fonte: `src/components/comparacao/config.ts:369-377`. Não há oferta diferenciada por vertical em lugar nenhum do repositório; ver "Não fazer" no `keyword-map.md`.

**Objetivos declarados pelos leads:** Vender mais · Gerar leads para o time comercial · Virar autoridade no meu nicho · Fazer a marca ser conhecida · Lançar um produto ou serviço — fonte: `src/components/comparacao/config.ts:402-407`.

**Travas que o lead declara — as dores REAIS, postas pelo dono no formulário:** Não tenho tempo · Não sei o que falar · Não gosto de aparecer · Já paguei agência e não deu certo · Não tenho equipe — fonte: `src/components/comparacao/config.ts:444-449`. São a matéria-prima legítima do cluster de dores.

**Público (redação do FAQ, publicável)**

- "Empresas que querem transformar conteúdo em um canal previsível e escalável de crescimento"; "marcas que precisam ganhar relevância, aumentar audiência e ocupar espaço de forma consistente" — fonte: `src/components/faq/config.ts:249-250`.
- Empresas pequenas: podem, "desde que exista potencial para transformar conteúdo em um canal relevante de crescimento" — fonte: `src/components/faq/config.ts:364-365`.
- B2B: sim, com estratégia, linguagem e formatos adaptados — fonte: `src/components/faq/config.ts:382-383`.
- A faixa de investimento mais baixa do formulário **desqualifica** o lead, e a recusa é dita assim: "A Doxa não se encaixa no seu momento — o nosso trabalho começa numa faixa acima dessa" — fonte: `src/components/comparacao/config.ts:499-509,522-527`. Página pública **não cita faixa de preço**; o fato serve só para calibrar a intenção comercial do conteúdo.

## 8. Regras do manual relevantes para copy pública

O manual do cliente tem **21 seções e 37 regras** — fonte: `docs/MANUAL.md:20,53` — vive em `/manual-doxa` e é o aceite das regras da garantia — fonte: `docs/MANUAL.md:3-7`. As seções semeadas na v1 estão em `supabase/manual-seed-v1.sql:47,59,71,83,100,117,139,161,212,229,241,263,275,287,304,321,338,355,367`.

Estas regras podem virar **conteúdo educativo** — elas explicam a metodologia orgânica —, desde que fique claro que são condições de quem já é cliente:

- **Rotina.** No mínimo 60 conteúdos únicos em 90 dias, cada um nas três redes, com o mesmo arquivo, no mesmo dia — fonte: `supabase/manual-seed-v1.sql:183` (`RT-1`).
- **Cadência.** No máximo um vídeo da Doxa por dia útil; compensar publicando vários no mesmo dia é proibido, porque "dois vídeos no mesmo dia disputam o mesmo espaço e um atropela o alcance do outro" — fonte: `supabase/manual-seed-v1.sql:187-191` (`RT-2`).
- **Intervalo de 24 h de relógio.** "Se um vídeo foi publicado segunda-feira às 22h, o próximo só pode ser publicado a partir das 22h de terça" — a janela preserva a distribuição orgânica do vídeo anterior — fonte: `supabase/manual-seed-v1.sql:205-207` (`RH-1`); `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:435-439`.
- **Dias úteis.** De segunda a sexta, os únicos vídeos curtos nos perfis participantes são os da Doxa; fotos, carrosséis e stories seguem liberados — fonte: `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:445-451`; `supabase/manual-seed-v1.sql:212`.
- **Fins de semana.** Sábado e domingo o cliente pode publicar vídeos curtos próprios, mesmo a menos de 24 h de um vídeo da Doxa — fonte: `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:457-463`; `supabase/manual-seed-v1.sql:229`.
- **Zero impulsionamento.** Nos perfis onde a estratégia está ativa é proibido impulsionar, turbinar ou promover publicações — inclusive posts que não são da Doxa; campanhas antigas nesses perfis precisam ser pausadas antes da primeira publicação. Google Ads e campanhas em OUTROS perfis continuam permitidos — fonte: `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:465-482`; `supabase/manual-seed-v1.sql:241`.
- **Integridade do arquivo — "Baixou, publicou."** Publicar exatamente o arquivo entregue, sem alterar corte, duração, velocidade, proporção, resolução, música, áudio, voz, legendas, textos, capa, roteiro, estética, elementos gráficos ou marca — fonte: `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:486-519`; `supabase/manual-seed-v1.sql:263`.
- **Comentários.** Não devem ser limitados nem desativados; ofensivos podem ser excluídos — fonte: `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:523-529`.
- **Engajamento artificial proibido.** Comprar seguidores, curtidas, visualizações, comentários ou compartilhamentos contamina resultados, viola a metodologia e pode gerar penalização das redes — fonte: `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:531-543`; `supabase/manual-seed-v1.sql:287`.
- **Views orgânicas.** As visualizações contabilizadas nas metas são 100% orgânicas, sem depender de compra de mídia — fonte: `src/components/faq/config.ts:174-175`.
- **Nenhuma mídia paga exigida.** Para atingir as metas orgânicas contratadas não é preciso investir em mídia; complementar com anúncios é separado — fonte: `src/components/faq/config.ts:344-345`.

> **Escopo.** `docs/LEGAL_RECONCILIATION.md` é **INTERNO, não publicar** — fonte: `docs/LEGAL_RECONCILIATION.md:3-6`. Nenhuma linha dele vai para página pública, nem parafraseada.

## 9. NÃO PUBLICÁVEL

### 9.1 As dez perguntas do dono (`PENDENTES`) — sete sem resposta, três já publicadas

Sete não têm resposta no repositório: página que as tocar responde **"o time responde na conversa"** e aponta para o formulário — nunca inventa. **Três (1, 4 e 10) já estão publicadas em `DUVIDAS_PT` com a não-resposta contratual autorizada** e podem ser usadas **verbatim** em página SEO; o que continua pendente do dono é a resposta **com valor**. Lista completa e justificativa item a item — fonte: `src/components/faq/config.ts:672-717`:

1. Quanto custa a mensalidade? — **publicada** em `DUVIDAS_PT` com a não-resposta autorizada ("o investimento varia de acordo com o volume… nosso time apresenta o plano mais adequado") — fonte: `src/components/faq/config.ts:283-301`. Usável verbatim. **O valor continua pendente do dono** e não pode ser inventado.
2. Os R$ 100 do passo de pagamento: o que são? — fonte: `src/components/faq/config.ts:708`.
3. O que acontece depois que eu pago?
4. Quantos vídeos por mês? — **publicada** em `DUVIDAS_PT` com a não-resposta autorizada ("o volume depende do plano contratado… definido de acordo com a estratégia e a meta de performance de cada cliente") — fonte: `src/components/faq/config.ts:409-426`. Usável verbatim. **O número continua pendente do dono.** Já *"em quanto tempo sai o primeiro"* segue **sem resposta**: `prazo` fala de quando aparecem resultados, não de quando o primeiro vídeo é entregue — fonte: `src/components/faq/config.ts:214-243`.
5. Tem fidelidade? Como cancela?
6. A garantia por escrito: prazo, plataformas, o que conta como view.
7. Quais formas de pagamento?
8. Como funciona ser uma agência licenciada?
9. Preciso aparecer no vídeo?
10. De quem são os direitos do vídeo? — **publicada** em `DUVIDAS_PT` com a não-resposta autorizada ("os direitos de utilização, propriedade e demais condições são estabelecidos no contrato de cada cliente") — fonte: `src/components/faq/config.ts:499-515`. Usável verbatim. **As condições em si continuam pendentes do dono**; nenhuma página descreve o que o contrato diz.

> **A numeração de `PENDENTES` é contrato.** `src/seo/conteudo/` cita "pergunta 9", "pergunta 10" e "as outras nove", e este documento e o `keyword-map.md` citam `faq/config.ts:714`. Item publicado **não sai da lista nem muda de posição** — ganha marcação. Tirar um renumera os outros e transforma cada citação dessas em mentira.

### 9.2 Números e afirmações sem fonte suficiente

- **"Mais de 1.500 clientes", "Magalu, G4 e Natália Beauty", "operações no Brasil e nos Estados Unidos"** — a frase existe no FAQ e é texto do dono, mas G4, Natália Beauty, o 1.500 e os EUA não aparecem em nenhum outro lugar do repositório e contradizem os três casos com arquivo — fonte: `src/components/faq/config.ts:197-198`. **Não replicar em página nova sem confirmação do dono.**
- **Quebra do custo mensal entre produção / agência / tráfego pago** — explicitamente SUPOSIÇÃO, comentada fora da tela — fonte: `src/components/semcom/config.ts:28-38`.
- **"Parceiros"** aplicado às ferramentas — o rótulo da home diz, o arquivo das ferramentas proíbe — fonte: `src/components/Hero.tsx:46` vs. `src/components/tools.ts:3-13`.
- **Selo de verificado nos perfis dos clientes** — está `true` nos três por instrução do dono, com ressalva escrita de que é "uma afirmação sobre a conta de outra pessoa, feita na nossa página" — fonte: `src/components/proof/reels.ts:18-22`. Não afirmar verificação em texto.
- **Preço da auditoria estratégica** — o valor existe (`FILTRO_PT`), mas o `robots.txt` registra que o passo de pagamento "não é mais simulado porque não existe mais: o funil termina em conversa humana, sem checkout e sem cobrança dentro do site" — fonte: `src/components/comparacao/config.ts:229-234` vs. `public/robots.txt:8-13`. **Não citar preço de auditoria em página nova.**
- **Formas de pagamento (Pix, Cartão, Apple Pay, Google Pay)** — o comentário diz que estão "listadas antes de existirem de verdade" — fonte: `src/components/comparacao/config.ts:299-300`.
- **Destino do CTA da seção comparativa** — `CONTATO_URL` vazio de propósito — fonte: `src/components/semcom/config.ts:40-45`.
- **Prêmio, certificação, nº de funcionários, ano de fundação, endereço, CNPJ, sede** — verificado por ausência: nenhum arquivo os menciona. Não inventar para preencher schema `Organization`.
- **Depoimento ou review de cliente** — não existe nenhum (§5). Não criar `Review`/`AggregateRating`.
- **Volume de busca, CTR, posição, impressões** — sem Search Console e sem ferramenta de keyword; ver `BLOCKED_EXTERNAL_CREDENTIAL` no topo do `keyword-map.md`.
- **`docs/LEGAL_RECONCILIATION.md` inteiro** — interno.

## 10. Vocabulário

### Termos do dono — usar estes

| Termo | Como aparece | Fonte |
|---|---|---|
| clone | "uma foto e um áudio viram o seu clone" | `src/components/HowItWorks.tsx:84` |
| views somadas | "views somadas no TikTok, Instagram e YouTube Shorts" | `public/llms.txt:3-4` |
| conteúdo vertical | "produz conteúdo vertical em escala" | `public/llms.txt:6` |
| viralizar | "Quero viralizar" · "Como vocês viralizam?" | `src/components/Hero.tsx:42`; `src/components/faq/config.ts:131` |
| pronto para postar | "O vídeo pronto para postar" | `src/components/HowItWorks.tsx:91` |
| operação | "operação proprietária de conteúdo" | `src/components/faq/config.ts:134` |
| em escala | "produção de conteúdo em escala" | `src/components/faq/config.ts:449` |
| auditoria estratégica | o nome da reunião | `src/components/comparacao/config.ts:273` |
| o jeito antigo | o inventário de 25 contratações | `src/components/comparacao/config.ts:27-32` |
| baixou, publicou | a regra de integridade do arquivo | `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:488-490` |

Complementos aceitos porque já publicados: **legendado**, **no formato do feed**, **vertical** — fonte: `src/components/HowItWorks.tsx:92`.

### Termos PROIBIDOS

| Proibido | Por quê | Fonte |
|---|---|---|
| "agência" como autodefinição da Doxa | a definição pública nega | `public/llms.txt:40-41` |
| "parceiros" para as ferramentas | o arquivo proíbe implicar endosso/parceria | `src/components/tools.ts:3-13` |
| "assinatura" / "software por assinatura" | "não vende curso, ferramenta nem assinatura" | `public/llms.txt:43` |
| "assinatura eletrônica" no contexto do manual | o manual é ciência e aceite com comprovante em PDF | `docs/MANUAL.md:3-7` |
| "tráfego pago" como serviço da Doxa | garantia orgânica; impulsionar é proibido nos perfis | `public/llms.txt:42`; `.claude/tower/cards/004-manual-interativo-prompt-mestre.md:469-471` |
| "garantimos que seu vídeo vai viralizar" | negado com todas as letras | `src/components/faq/config.ts:324-325` |
| "curso", "mentoria", "ferramenta", "SaaS" | não é o que a Doxa vende | `public/llms.txt:43` |
| "resultados garantidos" sem a condição contratual | a garantia é condicionada ao cumprimento integral | `supabase/manual-seed-v1.sql:93` |
| somatório inventado das views dos cases | números são citação, não cálculo | `src/components/hero/cases.ts:13-17` |

**Regra de redação herdada.** Nenhuma resposta abre com um "Sim"/"Não" solto: a primeira frase carrega o próprio sujeito e se sustenta sozinha, porque uma mesma resposta serve muitas formulações de pergunta. O repositório pagou caro por isso — fonte: `src/components/faq/config.ts:153-172`.

## 11. Os 5 fatos mais frágeis (para o dono conferir)

1. **"Mais de 1.500 clientes… Magalu, G4 e Natália Beauty… Brasil e Estados Unidos"** — fonte: `src/components/faq/config.ts:197-198`. Texto do dono, publicado, mas sem confirmação em nenhum outro arquivo, e o repositório só tem três casos com mídia.
2. **As duas redações da garantia podem divergir sem o compilador reclamar** — fonte: `src/components/faq/config.ts:30-37`. Se a manchete mudar e o FAQ não, dezenas de páginas novas repetem a versão velha.
3. **"Parceiros" vs. "ferramentas"** — fonte: `src/components/Hero.tsx:46` vs. `src/components/tools.ts:3-13`. A home já imprime a palavra que o outro arquivo proíbe.
4. **Preço da auditoria e formas de pagamento** — fonte: `src/components/comparacao/config.ts:229-234,299-300` vs. `public/robots.txt:8-13`. Um diz que o passo de pagamento não existe mais; o outro ainda carrega valor e bandeiras.
5. **"Agência licenciada"** — fonte: `src/components/comparacao/Formulario.tsx:99-104`. A porta está no formulário, o programa não está documentado, e a pergunta está em `PENDENTES` (`src/components/faq/config.ts:714`).

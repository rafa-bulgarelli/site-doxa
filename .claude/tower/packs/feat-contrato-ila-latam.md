# Card 017 — Track única: minuta do contrato ILA LATAM BV (task_contrato-ila-latam)

Você é o EXECUTOR, worktree `~/orca/workspaces/site-doxa/feat-contrato-ila-latam`,
branch **`feat-contrato-ila-latam`** (JÁ criada pelo `tower-track.sh` a partir de `origin/main`).

## STEP 0 (obrigatório, antes de qualquer edit)
`git branch --show-current` = `feat-contrato-ila-latam` · `git status --porcelain` vazio ·
você está no diretório da worktree, não no repo principal. Divergiu → **PARE e reporte.**

## A VISÃO DO DONO
Um PDF de contrato pronto para assinatura com a ILA LATAM BV, derivado do contrato base
InCraft | HRD, adaptado ao negócio novo: desenvolvimento em **código** (não WordPress),
8 páginas com design fornecido, R$ 7.500 à vista, 15 dias ±5, suporte 30 dias grátis e
plano opcional de R$ 2.800/mês tudo incluso. A MINUTA sai com os dados provisórios do
representante marcados de forma impossível de não ver — PDF com placeholder NUNCA vai
ao cliente.

## CONTEXTO (não perca tempo redescobrindo)

- **Isto é um DOCUMENTO COMERCIAL, não código do site.** Nada em `src/`, `api/`,
  `scripts/`, config. `.claude/STYLE-GOOGLE-TS.md` NÃO se aplica; o registro é
  português jurídico, no tom do contrato base.
- **Você NÃO inventa termo jurídico novo.** Adapta o base. Onde a decisão do dono exige
  texto novo (plano R$ 2.800, hospedagem 1 mês grátis, cláusula 7 reescrita), redija no
  estilo do base e **MARQUE no report a lista das cláusulas de texto novo** — o
  collector vai olhá-las com lupa.
- **Contrato base:** `/Users/rafaelfernandes/Downloads/Contrato - InCraft _ HRD
  Engenharia.pdf`. É **1 página só de 778×12059pt** (export longo), com camada de texto.
  Extraia o texto assim (funciona nesta máquina — testado):
  ```bash
  SP=<seu scratchpad>   # qualquer diretório temporário FORA da worktree
  python3 -m pip install --quiet --target "$SP/pylib" pypdf
  PYTHONPATH="$SP/pylib" python3 -c "
  from pypdf import PdfReader
  r = PdfReader('/Users/rafaelfernandes/Downloads/Contrato - InCraft _ HRD Engenharia.pdf')
  open('$SP/base.txt','w').write(r.pages[0].extract_text())"
  ```
  A extração tem espaçamento quebrado (`L TDA`, `w ebsite`, `la y out`) — artefato, não
  está assim no original; normalize ao adaptar.
- **NUNCA grave a extração (nem trecho do contrato HRD) em arquivo dentro da worktree.**
  O base carrega dados pessoais de terceiro (CPF/RG do representante da HRD). Só no
  scratchpad.
- **O SLA 5.4 do base é IMAGEM** — a extração vem vazia ali. A fonte canônica é a
  transcrição do card (colada abaixo). Vira tabela HTML de verdade.
- **O base tem um bug de numeração**: duas cláusulas "DÉCIMA SEXTA" (a de
  VALOR/PAGAMENTO, com itens 15.x, e a de DISPOSIÇÕES FINAIS, com 16.x). Na minuta,
  pagamento = **CLÁUSULA DÉCIMA QUINTA** (15.x), finais = DÉCIMA SEXTA (16.x).
- **Decisões do dono (card 017, itens 1–9) são FECHADAS — não reabrir.** Resumo
  operacional: código, não WordPress · 8 páginas SEM design (design chega pronto da
  contratante) · R$ 7.500,00 à vista, parcela única, Pix ou transferência bancária,
  nenhuma data do HRD sobrevive · prazo 15 dias corridos ±5 (entrega entre 10 e 20) ·
  suporte 30 dias grátis, depois plano opcional R$ 2.800/mês TUDO INCLUSO (atendimento
  5.3 + SLA 5.4 + exclusões 5.2 + hospedagem + monitoramento de uptime + suporte
  prioritário + scan de segurança) · hospedagem 1 mês grátis, depois: hospedagem
  própria do cliente OU o plano (não existe hospedagem avulsa sem plano) · foro São
  Paulo/SP · crédito no rodapé 12 meses.
- **Partes** (qualificação, dados confirmados pelo dono):
  - CONTRATANTE: **ILA LATAM BV**, CNPJ 63.903.948/0001-77, sede em Kenaupark 17,
    2011 MR Haarlem, Países Baixos; VAT 868733477B01; KvK 98985043; contato
    michiel@ilacorporate.com. Representada por **Vladimir
    <span class="pendente">[SOBRENOME DO REPRESENTANTE — PENDENTE]</span>**, portador de
    <span class="pendente">[documento — CPF ou passaporte]</span>.
  - CONTRATADA: **INCRAFT SERVIÇOS DIGITAIS LTDA**, CNPJ 62.542.115/0001-65, Rua
    Comendador Miguel Calfat, nº 59, Conjunto 63, Vila Olímpia, São Paulo/SP,
    CEP 04537-082 (igual ao base — sem o espaço espúrio que a extração põe no CNPJ).
- **SLA 5.4 (transcrição canônica do card — os 8 valores exatos):**

  | Prioridade | Exemplo | Prazo de resposta | Prazo para solução* |
  |---|---|---|---|
  | Crítica | site fora do ar; erro que impede operações essenciais | até 3h | até 12h |
  | Alta | falhas graves em funcionalidades principais | até 6h | até 24h |
  | Média | falhas que não impedem uso principal | até 12h | até 36h |
  | Baixa | dúvidas, pequenos ajustes e demandas cosméticas | até 24h | até 48h |

- **Decisões editoriais do GESTOR (aplicar, não rediscutir):**
  - "Proposta Comercial" referenciada no corpo do base (1.5, 8.1, 9.1, 15.1, 16.2)
    vira **"Anexo I — Escopo e Condições Comerciais"**, que integra o contrato. Não
    existe proposta separada: valor, prazo, escopo, plano e hospedagem moram no corpo
    e são consolidados no Anexo I.
  - Anexo de plugins do base: **REMOVIDO INTEIRO, sem substituto** (a regra de
    hospedagem/plano vive na cláusula 6 e no Anexo I).
  - Cláusula 10.6 (crédito no rodapé, 12 meses): mantém, mas a "taxa específica de
    remoção prevista na Proposta Comercial" sai — remoção antecipada fica "mediante
    acordo formal entre as Partes" (não inventar valor). Marcar como texto novo.
  - Estrutura final: 16 cláusulas numeradas + ANEXO I + CLÁUSULA – ASSINATURA
    ELETRÔNICA (não numerada, como no base) + bloco de assinaturas.
  - A escala de "8 (oito) páginas" é o escopo fechado; **não inventar nomes de
    páginas** nem criar placeholder para a lista (os únicos 2 placeholders da minuta
    são sobrenome e documento do Vladimir).
  - Data de assinatura fica em branco tradicional ("São Paulo, ___ de ________ de
    2026") — campo de assinatura, não placeholder `.pendente`.

## A TASK

**Commit 1 — estrutura + CSS de impressão** (`docs/contratos/ila-latam/minuta.html`
com esqueleto + capa):
1. Arquivo HTML único, `lang="pt-BR"`, CSS embutido num `<style>`. Formatação de
   contrato: títulos de cláusula em caixa alta, itens numerados (1.1, 1.2…), alíneas
   a)/b)/c), tabela do SLA com bordas, bloco de assinaturas com linhas.
2. CSS de impressão: `@page { size: A4; margin: 2cm }` · `break-inside: avoid` na
   tabela do SLA e no bloco de assinaturas · títulos não órfãos
   (`break-after: avoid` no h2).
3. Classe `.pendente`: fundo amarelo + borda forte + **`print-color-adjust: exact` e
   `-webkit-print-color-adjust: exact`** (sem isso o Chrome descarta o fundo no PDF e
   o destaque morre em silêncio).
4. Capa `<header id="capa-minuta">` em página própria (`break-after: page`), FORA do
   texto contratual, com: **"MINUTA — NÃO ENVIAR"** em destaque; a lista dos campos
   pendentes (sobrenome + documento do representante); e o disclaimer: *esta minuta
   deriva do contrato base para revisão do dono e, idealmente, de advogado — não é
   consultoria jurídica; atenção ao ponto contratante com CNPJ brasileiro e sede no
   exterior*. O `id` existe para a versão final remover o bloco inteiro num delete só.
5. Títulos das 16 cláusulas + assinatura eletrônica em `<h2 class="clausula">` (17 no
   total) e o anexo em `<h2 class="anexo">` (1) — o VERIFY conta por essas classes.

**Commit 2 — as 16 cláusulas** (mapa cláusula a cláusula; "mantém" = adapta redação
mínima, sem mudar substância):
1. **Cláusula 1 (Objeto):** 1.1 mantém, trocando criação de layout por desenvolvimento
   em código do design fornecido; 1.2 remove a alínea de criação de UI/UX — as alíneas
   viram: codificação das 8 (oito) páginas conforme design fornecido, navegação,
   funcionalidades previstas no Anexo I, performance/segurança/SEO técnico inicial,
   publicação; 1.3 **reescreve**: sai "plataformas, CMS, plugins" → "tecnologias,
   linguagens, bibliotecas, frameworks e serviços de terceiros", remetendo à Cláusula
   Quarta; 1.4 exclusões: mantém e acrescenta alínea de criação de design/layout
   (fornecido pela CONTRATANTE); 1.5 remete ao Anexo I.
2. **Cláusula 2:** mantém; 2.7 sai "temas, plugins" → "APIs, bibliotecas, integrações
   e serviços de terceiros".
3. **Cláusula 3:** mantém; em 3.5, explicitar que o **design/layout fornecido** entra
   nos materiais cuja titularidade/licitude é responsabilidade da CONTRATANTE.
4. **Cláusula 4 — REESCRITA** ("TECNOLOGIAS E SERVIÇOS DE TERCEIROS"): mesma lógica do
   base (custos de terceiros, termos próprios, isenções 4.4, descontinuidade 4.5,
   change request 4.6) aplicada a bibliotecas open-source, APIs, provedores de
   infraestrutura — zero plugin/tema/CMS. **Texto novo — marcar.**
5. **Cláusula 5:** 5.1 garantia 30 dias mantém; 5.2 exclusões mantém (alínea c sai
   "plugins"); 5.3 atendimento mantém; **5.4 = a tabela do SLA** (transcrição acima,
   com o asterisco de nota se o card usa); **5.5 reescreve**: encerrada a garantia,
   atendimento mediante o **plano opcional de R$ 2.800,00/mês, tudo incluso**
   (enumerar: atendimento 5.3, SLA 5.4, exclusões 5.2, hospedagem, monitoramento de
   uptime, suporte prioritário, scan de segurança) OU orçamento avulso. **Texto novo —
   marcar.** 5.6 mantém, sai "plugins".
6. **Cláusula 6 — REESCRITA** (hospedagem): 1 (um) mês de hospedagem gratuita pela
   CONTRATADA após a entrega; findo o mês, a CONTRATANTE escolhe: assume hospedagem
   própria (aí valem as isenções do base 6.2–6.3) OU contrata o plano de R$ 2.800/mês,
   que já a inclui; **não há hospedagem avulsa da CONTRATADA fora do plano**; migração
   por conta própria = isenção (6.5 do base). **Texto novo — marcar.**
7. **Cláusula 7 — MUDA DE NATUREZA** ("DESIGN FORNECIDO E IMPLEMENTAÇÃO"): a
   CONTRATADA implementa em código, com fidelidade técnica razoável, o design
   fornecido pronto pela CONTRATANTE; não há criação de layout nem rodadas de ajuste
   de design pela CONTRATADA; inconsistências/lacunas do design são apontadas para
   decisão da CONTRATANTE; alteração do design após o início = Solicitação de Mudança
   (Cláusula Décima Quarta); direitos sobre o design = CONTRATANTE (remete 3.5);
   mantém do base a entrega responsiva para navegadores/telas principais. **Texto
   novo — marcar.**
8. **Cláusula 8:** mantém (aceite por etapas, 10 dias úteis, aceite tácito, Termo de
   Aceite Final).
9. **Cláusula 9:** 9.1 ganha o prazo: **15 (quinze) dias corridos, com margem de ±5
   (cinco) — entrega entre 10 (dez) e 20 (vinte) dias corridos**, contados das
   condições do base (design/conteúdos entregues, pagamento confirmado; a alínea de
   aprovação de layout vira recebimento do design final fornecido); 9.2.c sai
   "plugins". Resto mantém.
10. **Cláusula 10:** mantém; 10.2.b **reescreve** (sai "frameworks, temas, plugins" →
    "bibliotecas, frameworks e tecnologias de terceiros, sujeitas a licenças
    próprias"); 10.6 crédito no rodapé 12 (doze) meses mantém, com a taxa de remoção
    trocada por "mediante acordo formal entre as Partes" (**marcar**).
11. **Cláusulas 11, 12, 13, 14:** mantêm na essência (confidencialidade 2 anos, LGPD;
    rescisão; penalidades; change request). Em 11.6/12/13, remoções pontuais de
    "plugins" onde aparecer.
12. **Cláusula 15 (era a "DÉCIMA SEXTA" bugada do base) — CLÁUSULA DÉCIMA QUINTA –
    VALOR E CONDIÇÕES DE PAGAMENTO:** valor total **R$ 7.500,00 (sete mil e
    quinhentos reais)**, pagamento **à vista, em parcela única, via Pix ou
    transferência bancária**, na assinatura do contrato (coerente com 9.1: execução
    começa após a confirmação). **NENHUMA data 28/11, 1/12, 8/12, 23/12 sobrevive.**
    Mantém do base: extras via change request e a regra de estorno/chargeback.
    **Texto novo — marcar.**
13. **Cláusula 16 (Disposições Finais):** mantém, incluindo assinatura digital
    (MP 2.200-2/2001 e Lei nº 14.063/2020) e **foro da Comarca de São Paulo/SP**.

**Commit 3 — anexo, assinaturas e README:**
1. **ANEXO I — ESCOPO E CONDIÇÕES COMERCIAIS:** consolida (sem contradizer o corpo):
   8 (oito) páginas desenvolvidas em código conforme design fornecido pronto pela
   CONTRATANTE; R$ 7.500,00 à vista (Pix/transferência); prazo 15 ±5 dias corridos;
   garantia/suporte 30 dias; plano opcional R$ 2.800/mês tudo incluso (a lista);
   hospedagem 1 mês grátis e a regra pós-mês. **Texto novo — marcar.**
2. **CLÁUSULA – ASSINATURA ELETRÔNICA** (como no base: plataformas certificadas,
   MP 2.200-2/2001, Lei 14.063/2020, incisos I–IV) + bloco de assinaturas das duas
   Partes (CONTRATANTE: Vladimir com os 2 placeholders `.pendente`; CONTRATADA:
   InCraft), com "São Paulo, ___ de ________ de 2026".
3. **`docs/contratos/ila-latam/README.md`:** o que é o arquivo; que o **PDF não é
   commitado**; o comando de geração (uma linha):
   ```bash
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
     --disable-gpu --no-pdf-header-footer \
     --print-to-pdf="$HOME/Downloads/contrato-ila-latam-MINUTA.pdf" \
     "file://$PWD/docs/contratos/ila-latam/minuta.html"
   ```
   e o checklist da VERSÃO FINAL (só com aprovação explícita do dono): preencher
   sobrenome + documento do Vladimir (removendo as classes `.pendente`), apagar o
   bloco `<header id="capa-minuta">` inteiro, gerar o PDF **sem** "MINUTA" no nome.

## SCOPE
- docs/contratos/ila-latam/minuta.html
- docs/contratos/ila-latam/README.md

## DEPENDS ON
nada (nasce de `origin/main`).

## VERIFY (pass/fail executável — cole a saída no report; `M=docs/contratos/ila-latam/minuta.html`)
- `pnpm typecheck && pnpm test` verdes — prova que o site não foi tocado (falha só
  reprova se for NOVA vs baseline de main)
- `git diff --name-only origin/main...HEAD | grep -v '^docs/contratos/ila-latam/'` = vazio
- `git diff --name-only origin/main...HEAD | wc -l` = 2
- **Negativos (HTML):**
  - `grep -icE 'wordpress|plugin|elementor|\btemas?\b|\bcms\b' $M` = 0
  - `grep -cE '28/11|23/12|[^0-9]1/12|[^0-9]8/12|2025|HRD|Diego|32\.291\.660|Raja Gabaglia|Belo Horizonte|Estoril|MG15706157|090\.468|2\.260|1\.130' $M` = 0
- **Presenças (cada grep ≥ 1 em `$M`):** `7\.500` · `à vista` · `Pix` ·
  `transferência bancária` · `15 \(quinze\)` · `2\.800` · `uptime` · `prioritár` ·
  `scan de segurança` · `hospedagem` · `63\.903\.948/0001-77` · `62\.542\.115/0001-65` ·
  `Kenaupark` · `Haarlem` · `868733477B01` · `98985043` · `michiel@ilacorporate.com` ·
  `Vladimir` · `PENDENTE` · `Comarca de São Paulo` · `12 \(doze\) meses` ·
  `8 \(oito\) páginas` · `30 \(trinta\) dias` · `consultoria jurídica` · `NÃO ENVIAR`
- **SLA:** `grep -oE 'até (3|6|12|24|36|48)h' $M | sort | uniq -c` → 3h:1 · 6h:1 ·
  12h:2 · 24h:2 · 36h:1 · 48h:1 (8 células) — e `Crítica`, `Alta`, `Média`, `Baixa`
  todas presentes
- **Estrutura:** `grep -c 'class="clausula"' $M` = 17 · `grep -c 'class="anexo"' $M`
  = 1 · `grep -c 'CLÁUSULA DÉCIMA QUINTA' $M` = 1 · `grep -c 'CLÁUSULA DÉCIMA SEXTA' $M`
  = 1 · `grep -c 'class="pendente"' $M` = 2 · `grep -c 'id="capa-minuta"' $M` = 1
- **PDF (gerar no scratchpad, NÃO commitar):**
  - `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="$SP/minuta.pdf" "file://$PWD/docs/contratos/ila-latam/minuta.html"` → `test -s "$SP/minuta.pdf"`
  - `PYTHONPATH="$SP/pylib" python3 -c "from pypdf import PdfReader; print(len(PdfReader('$SP/minuta.pdf').pages))"` ≥ 4 (A4 paginado, não página única)
  - Extrair o texto do PDF (`pypdf`, como no base) e repetir nele os DOIS greps
    negativos = 0 **e** `PENDENTE` ≥ 1 **e** `NÃO ENVIAR` ≥ 1 (o critério do card é no
    PDF; o destaque tem que sobreviver à impressão)
- `git log --format='%s' origin/main..HEAD` = 3 commits: estrutura/CSS · cláusulas ·
  anexo+assinaturas+README

## COMMIT + PUSH
`feat(contrato #017): <fatia>` — um commit por fatia (estrutura/CSS · cláusulas ·
anexo+README) → `git push -u origin feat-contrato-ila-latam`. **NÃO mergeie.**
Ao terminar: sumário + **lista das cláusulas de texto novo** (para a lupa do collector)
+ verdict READY/NOT READY + saída colada do VERIFY.
Merge/PDF para o dono/VALIDAR-LIVE são do GESTOR.

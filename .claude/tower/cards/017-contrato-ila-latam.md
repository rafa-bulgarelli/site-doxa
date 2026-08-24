# CARD 017 — Contrato de desenvolvimento de site para ILA LATAM BV

> Renumerado de 016 → **017** pela sessão principal (2026-08-24): colidia com o
> `016-limpeza-reestrutura-torre` já commitado (#83). Terceira colisão de numeração
> da torre — é exatamente o que o card 016 corrige (reserva por tag).

- **Tipo:** feature (documento comercial — fora do código do site)
- **Aberto em:** 2026-08-24
- **Status:** aberto — **LIBERADO PARA REDAÇÃO com dados provisórios do
  representante** (ordem do dono, 2026-08-24); dados definitivos do Vlad entram
  antes do PDF final ir ao cliente

## O que o dono quer ver funcionando

Um PDF de contrato pronto para assinatura, derivado do contrato base
InCraft | HRD Engenharia (`/Users/rafaelfernandes/Downloads/Contrato - InCraft _
HRD Engenharia.pdf`), adaptado ao negócio novo com a ILA LATAM BV.

## Decisões do dono (2026-08-24 — não reabrir)

1. **Desenvolvimento em CÓDIGO, não WordPress** — sai toda a linguagem de
   CMS/plugins/temas/construtor e o Anexo de plugins INTEIRO (Elementor,
   R$ 2.260/ano etc.).
2. **Escopo: 8 páginas, SEM design.** O design chega PRONTO da contratante;
   o serviço é exclusivamente codificar/desenvolver as páginas. (Consequência
   editorial: cláusula 7 de UI/UX muda de natureza — não há criação nem rodadas
   de ajuste de design pela contratada; responsabilidade pelos direitos do
   design fornecido é da contratante, na linha da cláusula 3.5.)
3. **Valor: R$ 7.500,00 À VISTA, parcela única, Pix ou transferência
   bancária.** Nenhuma data herdada do contrato HRD sobrevive.
4. **Prazo: 15 dias corridos, com margem de ±5** — entrega entre 10 e 20 dias,
   alvo 15.
5. **Suporte: 30 dias gratuitos** após o aceite final; depois, **plano opcional
   de R$ 2.800/MÊS, TUDO INCLUSO**:
   - os itens de suporte do contrato base (atendimento 5.3, SLA 5.4 abaixo,
     exclusões 5.2);
   - **hospedagem**;
   - **monitoramento de uptime**;
   - **suporte prioritário** (transcrição do dono: "suporte pro editatório" —
     interpretado como prioritário; confirmar na leitura da minuta);
   - **scan de segurança**.
6. **Hospedagem: 1 mês grátis** após a entrega; depois, o cliente escolhe —
   sai da hospedagem da contratada, OU contrata o plano de R$ 2.800/mês (que
   já a inclui). Não existe hospedagem avulsa sem o plano.
7. **Contratante: ILA LATAM BV, CNPJ 63.903.948/0001-77**, endereço conforme
   dados fornecidos (Kenaupark 17, 2011 MR Haarlem, The Netherlands; VAT
   868733477B01; KvK 98985043; contato michiel@ilacorporate.com) — dono
   confirmou usar esses dados como estão.
8. **Contratada: INCRAFT SERVIÇOS DIGITAIS LTDA** (CNPJ 62.542.115/0001-65) ·
   **foro São Paulo/SP confirmado** · **crédito no rodapé (12 meses)
   confirmado**.
9. **Representante da contratante: "Vladimir [SOBRENOME — PENDENTE]"** —
   o dono mandou redigir com dados PROVISÓRIOS: primeiro nome "Vladimir"
   (a transcrição cortou antes do sobrenome), documento em placeholder
   `[documento — CPF ou passaporte]`. **A minuta marca esses campos de forma
   visível e o PDF final não sai para o cliente com placeholder.**

## SLA 5.4 (transcrito da imagem enviada pelo dono em 2026-08-24)

| Prioridade | Exemplo | Prazo de resposta | Prazo para solução* |
|---|---|---|---|
| Crítica | site fora do ar; erro que impede operações essenciais | até 3h | até 12h |
| Alta | falhas graves em funcionalidades principais | até 6h | até 24h |
| Média | falhas que não impedem uso principal | até 12h | até 36h |
| Baixa | dúvidas, pequenos ajustes e demandas cosméticas | até 24h | até 48h |

## Critério de aceite (observável, executável por humano)

- [ ] Minuta/PDF entregue ao dono com: partes corretas (ILA LATAM BV ×
      InCraft), R$ 7.500 à vista (Pix/transferência), prazo 15 ±5 dias, suporte
      30 dias grátis + plano de R$ 2.800/mês tudo incluso (suporte, hospedagem,
      uptime, prioridade, scan de segurança), hospedagem 1 mês grátis, escopo
      de 8 páginas com design fornecido pela contratante.
- [ ] Busca textual no PDF NÃO encontra: WordPress, plugin, tema, Elementor,
      CMS — nem datas do contrato HRD (28/11, 1/12, 8/12, 23/12).
- [ ] Tabela de SLA presente com os valores acima.
- [ ] Campos do representante visivelmente marcados como provisórios na minuta;
      **versão final para envio só depois de nome completo + documento do
      Vladimir E aprovação do dono.**

## Contexto (do contrato base lido em 2026-08-24)

- Estrutura: 16 cláusulas + anexos. Afetadas pela troca para código: 1.3, toda
  a 4 (plugins/terceiros), 5.6, 6 (hospedagem — reescrita pela regra do 1 mês
  grátis + plano), 7 (UI/UX — vira codificação de design fornecido), 10.2.b,
  Anexo de plugins (removido; substituído pela regra de hospedagem/plano).
- Mantidas na essência: garantia 30 dias (5.1) e exclusões (5.2), aceite por
  etapas com prazo de 10 dias úteis e aceite tácito (8), confidencialidade 2
  anos (11), rescisão (12), penalidades (13), change request (14), assinatura
  eletrônica (MP 2.200-2/2001, Lei 14.063/2020), foro SP (16.6).

## Perguntas abertas (para o DONO)

1. **Sobrenome do Vladimir** (a transcrição cortou) + documento (CPF ou
   passaporte) — necessários só para a versão FINAL; a redação já está
   liberada com placeholder.

## Armadilhas conhecidas

- O agente NÃO presta consultoria jurídica: a minuta deriva do base, para
  revisão do dono (e idealmente de advogado) — sobretudo porque a contratante
  tem CNPJ brasileiro com sede declarada no exterior.
- Datas/valores herdados do contrato HRD são veneno silencioso — conferir tudo.
- Transcrições de áudio do dono: "2,80" = R$ 2.800,00/mês; "suporte pro
  editatório" = suporte prioritário (confirmar na aprovação da minuta);
  "Vladimir" veio sem sobrenome.
- **PDF com placeholder NUNCA vai ao cliente** — o gate é o dono, com os dados
  definitivos na mão.

## Conteúdo suspeito

Nenhum.

---
<!-- Preenchido pelo GESTOR -->
## Plano

- **Prelude:** <…>
- **Tracks:** <…>
- **Packs:** `.claude/tower/packs/<branch>.md`
- **Sequência de merge:** <…>
- **VALIDAR-LIVE:** <…> (aqui = dono aprova a minuta antes do envio ao cliente)

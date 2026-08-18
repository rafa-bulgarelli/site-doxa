# CARD 010 — Rodada de polimento das animações do manual (review animação a animação do dono)

- **Tipo:** feature (polimento dirigido) — 2 animações protegidas, 3 para refazer,
  o resto é ajuste fino
- **Aberto em:** 2026-08-17
- **Status:** aberto

## A DOUTRINA (o dono definiu a régua — vale para TODA animação, agora e sempre)

Nas palavras dele, destilado:

1. **Equilíbrio**: "não tão parecendo festa, mas também não tão discreta. Elegante,
   chamando atenção na medida certa."
2. **Respiro**: elementos espaçados, "respirando, conversando entre si". Círculo
   apertado em volta de ícone ("enforcando", "afogado") é defeito nomeado — duas
   vezes.
3. **Hierarquia** visual clara — traços e ícones que "ornam" entre si.
4. **Cor com significado**: verde = certo, vermelho = errado. Partícula/elemento
   colorido sem função é "não é bonito, não é elegante". "Tudo colorido" = "horrível".
5. **Ícones reais** das plataformas (YouTube, TikTok, Instagram) no lugar de formas
   genéricas dentro de círculo cinza — pedido em 3 animações.
6. **Ritmo**: nem lenta ("a pessoa não vai esperar para entender"), smooth, fluida,
   com ação (fade-in, entradas).
7. **Narrativa fiel à regra**: a animação conta a regra REAL, com começo-meio-fim
   ("nem pé, nem cabeça, nem meio, nem final" é o xingamento máximo).
8. **Réguas canônicas**: as duas nota-10 abaixo são a referência do que ele quer.

## O veredito, animação por animação (previa admin, 2026-08-17)

> Identifiquei cada uma pelo conteúdo do SVG; o prelude confirma o arquivo exato
> olhando a cena rodando. Itens do cap. 4 provavelmente em `src/manual/cenas/itens/*`;
> passos dos caps. 1–3 nas cenas novas do card 009.

### 🏆 NOTA 10 — NÃO MEXER (viram referência)

- **№3 — celular em retrato com progresso** (`cenarg`): "impecável, não tem uma
  vírgula pra mexer".
- **№10 — relógio 24h entre dois players** (`cenaru`, provável `itens/Relogio.tsx`):
  "faz total sentido com a etapa, sensacional".

### ✅ Aprovadas com ajuste fino

- **№1 — abertura do onboarding, linhas + check** (`cenarb`): remover as partículas
  coloridas/gradiente que sobem quando as linhas completam, ANTES do check — "não é
  cor nenhuma… não é elegante". A partícula do check VERDE fica. Só isso.
- **№2 — redes sociais preenchendo** (`cenarc`): conceito perfeito (verde/vermelho +
  correção do erro = "total a ver com o produto"). Ajuste: o texto digitado parece
  "código de barras" — deixar mais detalhado/verossímil.
- **№8 — "90 dias / 0" contador** (`cenars`, provável `itens/Sessenta.tsx`): manter;
  mais smooth + ícones reais TikTok/YouTube/Instagram.
- **№9 — vídeo replicado em 3** (`cenart`): mesmos ajustes do №8.
- **№11 — semana S-T-Q-Q-S-S-D** (`cenarv`, provável `itens/Semana.tsx`): animação
  excelente, mas a NARRATIVA precisa ser: posta seg, ter, qua → perde um dia → X →
  retoma qui e sex → **sáb/dom SEM vídeo** (fim de semana não tem vídeo da DOXA, só
  dias úteis).
- **№15 — balão "?" → conversa** (`cenar13`, provável `itens/PergunteAntes.tsx`):
  ideia excelente; alinhar ao centro, espaçar o ícone da conversa, hierarquia.

### 🔧 Ideia boa, execução refazer

- **№4/5 — microfone + ruído** (`cenarh`): ideia "nota 10". Corrigir: (a) o círculo
  está "enforcando" o microfone — dar espaço/respiro; (b) o traço do ruído não
  "orna" com os ícones — hierarquizar. Com isso, vira nota 10.
- **№6 — clone, dois retratos** (`cenarl`): MUITO LENTA — mais ação: fade-in dos
  dois clones "sendo subidos", mais viva.
- **№7 — meta/redes com quadrados verdes e "24"** (`cenarr`): quadrados verdes sem
  significado, ícones afogados em círculo cinza, "24" colado nos quadrados. Espaçar,
  hierarquizar, ícones reais, mais smooth.
- **№13 — impulsionar/turbinar** (`cenar11`, provável `itens/SemImpulso.tsx`): ideia
  boa, simples demais; o "pause com flechinha" não faz sentido — repensar o símbolo
  com mais detalhe.

### ❌ REFAZER DO ZERO (exemplos nomeados "do que não fazer")

- **№12 — baixou/publicou sem editar** (`cenar10`, provável `itens/Intacto.tsx`):
  "tudo errada… grossa, junta, sem hierarquia, tudo colorido… horrível. Clássico
  exemplo do que não fazer." Repensar inteira.
- **№14 — corações caindo com X** (`cenar12`, provável `itens/SemCompra.tsx`,
  engajamento comprado): "sem pé nem cabeça, nem meio, nem final". Refazer do zero
  seguindo a doutrina.

## Critério de aceite (observável, executável por humano)

- [ ] №3 e №10 permanecem BYTE A BYTE como estão (diff vazio nesses arquivos)
- [ ] №1: partículas coloridas pré-check sumiram; partícula verde do check continua
- [ ] №11: sequência visível = seg✓ ter✓ qua✗ qui✓ sex✓, sáb/dom sem vídeo
- [ ] Nenhuma animação tem ícone "afogado" em círculo cinza; redes aparecem com
      ícones reais de YouTube/TikTok/Instagram onde a regra fala de redes
- [ ] №12 e №14 são animações novas com começo-meio-fim que contam a regra
- [ ] **Gate visual com o dono**: ele revê TODAS as alteradas na prévia e dá o OK
      uma a uma antes do merge — o critério final é o olho dele
- [ ] Celular: nada estoura layout; `prefers-reduced-motion` respeitado

## Contexto do repo (caminhos exatos)

- `src/manual/cenas/itens/*` — Relogio, Semana, Sessenta, Intacto, SemImpulso,
  SemCompra, PergunteAntes, Meta (cap. 4); `src/manual/cenas/` + cenas de passo do
  card 009 (caps. 1–3). `pecas.tsx`, `luz.tsx`, `tempo.ts` — as peças comuns.
- Ícones reais das redes: **já existem** `public/logos/*.svg` (meta, openai…) como
  padrão de logos no repo — mas YouTube/TikTok/Instagram precisarão ser adicionados
  (SVG simples, monocromático, na linguagem da cena).
- O prelude DEVE mapear `cenarX` → arquivo rodando a prévia local e conferindo
  visualmente — não confiar só no palpite deste card.

## Armadilhas conhecidas

- **As duas nota-10 são intocáveis** — regressão nelas é o pior resultado possível
  desta rodada. Protegê-las no SCOPE dos packs (nenhuma track as inclui).
- A doutrina acima é o "porquê" de cada ajuste — executor que só aplica o "o quê"
  sem o "porquê" produz outra rodada de reprovação.
- `tailwind.config.js` sem hot-reload; validação live no domínio com **L**.

## Perguntas abertas para o GESTOR

1. №12 e №14 (refazer do zero): propor o conceito novo em 1 frase cada ("a animação
   conta X") e validar com o dono ANTES de produzir — barato e evita retrabalho.
2. Ícones reais das redes: estilo (monocromático na linguagem atual × cor da marca)
   — proposta do gestor no gate visual.

## Conteúdo suspeito

Nenhum — feedback do dono via ferramenta de anotação no site.

---
<!-- Preenchido pelo GESTOR -->
## Plano

- **Prelude:** <…>
- **Tracks:** <…>
- **Packs:** `.claude/tower/packs/<branch>.md`
- **Sequência de merge:** <…>
- **VALIDAR-LIVE:** <…>

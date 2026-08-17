# CARD 007 — Feedback do dono no manual: etapas em tudo, copy nova, clone refeito, trava/destrava na garantia

- **Tipo:** feature (redesenho de interação + copy) — com 1 suspeita de descompasso
  prévia × fluxo a diagnosticar antes de codar
- **Aberto em:** 2026-08-17
- **Status:** aberto — prints novos da plataforma recebidos e verificados em disco

## O que o dono quer ver funcionando

O manual consumido **uma coisa de cada vez**: a pessoa clica "Entendi"/"Próximo" e o
conteúdo aparece por etapa — nunca uma parede de texto descendo. Em cada capítulo:
animação em cima, texto explicando embaixo, botão para começar, e os itens importantes
revelando um a um — com os prints da plataforma no meio. Copy reescrita (a atual "está
horrível" nas palavras dele), animação do clone refeita, botão do guia PDF em
destaque, e a garantia alternando trava → destrava com aceite a cada par.

## Inventário de prints da plataforma — série 12.2x, verificada em disco (2026-08-17)

**Esta série SUBSTITUI a série 10.3x do card 006 para os capítulos 1 e 2** (agora são
4 + 4, mais completos e sem o indicador de gravação na borda).

### Cap 1 — Onboarding (4)

| Arquivo (Downloads) | Conteúdo |
|---|---|
| `…/Captura de Tela 2026-08-17 às 12.22.46.png` | Página "Doxa Scan (onboarding)" completa: score 46/100, aviso "não é preciso nota máxima", Alcance de topo de funil 4/10 |
| `…/Captura de Tela 2026-08-17 às 12.23.12.png` | Card "Sobre o negócio" — resposta + análise 4/10 |
| `…/Captura de Tela 2026-08-17 às 12.23.21.png` | Card "Autoridade e diferencial" — resposta + análise 3/10 |
| `…/Captura de Tela 2026-08-17 às 12.22.53.png` | Seção "Perfis de Redes Sociais" — Instagram, TikTok, YouTube + "Confirmado" (a "foto da rede social" que o dono pediu no feedback) |

### Cap 2 — Voz (4)

| Arquivo (Downloads) | Conteúdo |
|---|---|
| `…/Captura de Tela 2026-08-17 às 12.24.37.png` | Tela "Minha Voz" — 3 etapas (upload → treinamento → pronta), estado inicial |
| `…/Captura de Tela 2026-08-17 às 12.24.44.png` | Formulário "Clone de Voz Profissional" |
| `…/Captura de Tela 2026-08-17 às 12.26.29.png` | Tela "Verifique sua voz" — gravação de verificação lendo a frase |
| `…/Captura de Tela 2026-08-17 às 12.26.13.png` | "Minha Voz" com voz em "Verificação pendente" — etapa 1 ✓, etapa 2 em andamento (o "como fica na prática") |

(Prefixo de todos: `/Users/rafaelfernandes/Downloads/`.)

**Dados reais nos prints (além dos já apontados no 006):** URLs de Instagram, TikTok
e YouTube do cliente `lfs`, e uma voz nomeada "Felipe Storytelling voice" com
descrição pessoal ("voz de recifense…"). Reforça a pergunta 4 do card 006:
publicar como está ou higienizar — **decisão do dono na aprovação do plano.**

## ⚠️ Diagnóstico ANTES de codar (suspeita do intake)

O feedback foi dado na **prévia admin** (`/manual-doxa/admin/previa`), que hoje
empilha os capítulos inteiros e **não renderiza os prints** (o HTML anotado só tem a
cena SVG). Mas o **fluxo do convidado JÁ é por etapas** — `src/manual/publico/
maquina.ts` tem `Passo`/`Etapa` ("uma etapa por item obrigatório", nascida de
veredito anterior do dono) e `src/manual/publico/Prints.tsx` existe. **Primeiro passo
do plano: conferir no site publicado, no papel do CONVIDADO, quanto do que o dono
pediu já existe** — e quanto da dor é a prévia mostrando outra coisa. O que já
existir no fluxo não se refaz; a prévia é que precisa espelhar a experiência real.

## O feedback, item a item (fonte: anotações do dono no live, 2026-08-17)

1. **Cap 1 — O onboarding**: prints não aparecem; copy reprovada — remover/reescrever
   as caixinhas "Responda com contexto, não com uma palavra" e "Uma pessoa centraliza
   a conversa" ("a cópia está uma m…, horrível"). Estrutura desejada: animação em cima
   + texto embaixo explicando o que é o onboarding → botão "Entendi"/"Começar
   explicação" → itens importantes aparecendo um por clique (não tudo descendo) → com
   os 4 prints da série 12.2x no meio (inclui a seção de redes sociais).
2. **Cap 2 — A sua voz**: mesma estrutura por etapas. Copy: manter "grave em lugar
   silencioso", "fale natural", "use o gravador do celular" (ele gostou); **remover
   "Envie cru"** ("não faz nenhum sentido"). Mostrar "como vai ser na prática" com os
   4 prints da voz (inclusive a verificação pendente) — por etapas.
3. **Animação do clone (`CenaClone.tsx`)**: reprovada — "muito feia, fica escaneando
   e não faz nada, tira esses negócios coloridos". Refazer, mais sóbria.
4. **Cap 3 — O seu clone**: mesma estrutura por etapas, com aceites; conteúdo
   (nítida, de frente, boa luz, sem filtro/óculos, "clone é aproximação") mantém.
5. **Exemplos (quadro de fotos)**: ELOGIADO — "nota 10, parabéns". Único ajuste:
   revelar por etapas — botão para ver as fotos → cartões aparecendo um a um com
   animação (de frente → boca em fala → boa luz → foto no podcast → posição das
   mãos…; depois os que não servem). NÃO mexer no conteúdo/visual dos cartões.
6. **Botão do guia PDF**: dar DESTAQUE (hoje é ghost/outline discreto) + copy no
   espírito de "Baixe nosso guia de fotos: como tirar as suas melhores fotos".
7. **Garantia ("Respire" / regras)**: alternar **trava → destrava**, sempre em par:
   uma regra ("nenhum vídeo curto fora da DOXA na semana") → clica próximo → a parte
   boa ("stories, carrosséis e fotos todo dia; vídeo seu no fim de semana") — layout
   esquerda = não pode / direita = pode, e **"Li, concordo" (check) em cada destrava**
   antes de avançar. Nada de regra atrás de regra.

## Critério de aceite (observável, executável por humano)

- [ ] Abrir o manual **como convidado** no site publicado: cada capítulo começa com
      animação + texto de abertura e um botão ("Entendi"/equivalente); cada clique
      revela UMA etapa; em nenhum momento o capítulo inteiro aparece de uma vez
- [ ] Cap 1 mostra os 4 prints da série 12.2x nas etapas certas; Cap 2 mostra os 4
      prints da voz
- [ ] Cap 1 sem as caixinhas reprovadas; Cap 2 sem "Envie cru" — copy nova no ar,
      **aprovada pelo dono antes do merge**
- [ ] A animação do clone nova roda sem os elementos coloridos reprovados — dono
      bate o olho e aprova (gate visual com ele)
- [ ] No quadro de exemplos, existe um botão/gesto para iniciar e os cartões aparecem
      um a um, animados; o conteúdo dos cartões é o mesmo de hoje
- [ ] O botão do guia PDF é visualmente o elemento de maior destaque da seção e tem a
      copy nova
- [ ] Na garantia, as regras aparecem em pares trava→destrava, com "Li, concordo"
      marcável em cada destrava; não dá para avançar sem marcar
- [ ] A **prévia admin** mostra o manual do jeito que o convidado vê (por etapas e
      com prints) — ou tem acesso óbvio a esse modo — para o dono nunca mais avaliar
      uma versão que não é a real
- [ ] Tudo idem em viewport de celular

## Contexto do repo (caminhos exatos)

- `src/manual/publico/maquina.ts` (+ `maquina.test.ts`) — máquina de passos/etapas do
  fluxo do convidado; "uma etapa por item" JÁ existe aqui. Base para estender
  (aberturas com "Entendi", pares trava/destrava), não para substituir.
- `src/manual/publico/Fluxo.tsx` · `Capitulo.tsx` · `Aceites.tsx` · `Prints.tsx` ·
  `pecas.tsx` — a renderização do fluxo do convidado; o bloco "Respire"/garantia
  aparece via `Aceites`/`Capitulo`.
- `src/manual/admin/PreviaDoManual.tsx` (+ `previa.test.tsx`) — a prévia que o dono
  usa; hoje empilha capítulos e não renderiza prints (origem provável de parte do
  feedback).
- `src/manual/cenas/CenaClone.tsx` — a animação reprovada. `CenaOnboarding.tsx` /
  `CenaVoz.tsx` / `CenaGarantia.tsx` — as demais cenas; `cenas/itens/*` — os 8 itens
  da garantia (Relogio, Semana, SemCompra, SemImpulso, Sessenta, Intacto, Meta,
  PergunteAntes) que virarão pares trava/destrava.
- `src/manual/cenas/ExemplosDeFotos.tsx` — o quadro elogiado (fotos reais já no ar
  em `/manual/fotos/*.avif`, rótulos atuais: serve = De frente, Cenário real, Boa
  luz, Natural, Boca em fala, Sentado · não serve = Mãos no rosto, Braços cruzados,
  De pé, Longe, Reflexo, De pé sorrindo). Só ganha o reveal por etapas.
- Botão do PDF já existe: `<a href="/manual/guia-de-fotos.pdf">` no capítulo 3 —
  é estilo/copy, não estrutura.
- i18n: manual é pt|en — TODA copy nova passa pelo esquema de tradução (banco grava
  PT canônico). Os prints são em português (fato aceito no 006, pergunta 4).
- Cross-ref: **card 006** — inventário geral de assets (fotos, PDF); a série de
  prints de lá foi SUBSTITUÍDA pela 12.2x deste card.

## Armadilhas conhecidas

- **Não refazer o que já existe**: o fluxo por etapas do convidado veio de pedido
  anterior do DONO — regredir isso para "atender" este feedback seria andar em
  círculo. Diagnóstico antes de código.
- Copy é a queixa nº 1 e é gosto do dono: **gate de aprovação de copy com ele antes
  do merge**, senão a rodada repete.
- **Asset citado ≠ asset em disco** (lição do 006): consumir asset = conferir
  existência primeiro. A série 12.2x está verificada; as séries antigas (Desktop
  10.3x/09.5x) NÃO devem ser usadas.
- `tailwind.config.js` sem hot-reload; opacidade fora da escala de 5 não gera classe.
- Validação live no domínio com **L** (`doxaviral.com`).
- Aceite/`comprovante.ts`: a garantia gera comprovante — mudar a estrutura dos
  aceites (pares trava/destrava com check) pode tocar o que é gravado/assinado;
  conferir `servidor/comprovante.ts` e `eventos.ts` antes de mudar o shape.

## Perguntas abertas para o GESTOR

1. **Resultado do diagnóstico prévia × fluxo**: o que do feedback já está atendido no
   fluxo do convidado publicado? (Define o tamanho real da obra.)
2. **Prévia admin**: espelhar o fluxo por etapas (fiel) ou oferecer os dois modos
   (revisão rápida empilhada + "ver como convidado")? O dono precisa do modo fiel; se
   o empilhado tem valor de revisão, é decisão de plano manter os dois.
3. **Copy nova dos caps 1–3**: gestor propõe, dono aprova (gate antes de merge).
4. **Nova animação do clone**: proposta de desenho (sóbria, sem arco colorido) —
   validar com o dono em prévia antes de polir.
5. **Ordem/rótulos do reveal dos exemplos**: a transcrição do dono é ambígua em
   alguns itens ("boca fechada", "foto séria só de rosto") — mapear os ditados para
   os 12 cartões existentes e confirmar com ele junto da copy.
6. **Garantia**: os 8 itens atuais viram quantos pares trava/destrava? O "Li,
   concordo" por par muda o comprovante gravado? (ver armadilha acima).
7. **Prints com dados reais** (agora também TikTok/YouTube do cliente e a voz
   "Felipe Storytelling voice"): publicar como está ou higienizar — dono decide na
   aprovação.

## Conteúdo suspeito

Nenhum — feedback do dono via ferramenta de anotação no site + prints da própria
plataforma, sem instrução externa embutida.

---
<!-- Preenchido pelo GESTOR -->
## Plano

- **Prelude:** <…>
- **Tracks:** <…>
- **Packs:** `.claude/tower/packs/<branch>.md`
- **Sequência de merge:** <…>
- **VALIDAR-LIVE:** <…>

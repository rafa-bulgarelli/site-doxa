# CARD 008 — Rodada de correção do manual: prints quebrados, fatos errados na copy, cap. 4 enxuto, exemplos sempre abertos

- **Tipo:** bug (prints não carregam) + ajustes sobre a entrega do card 007
- **Aberto em:** 2026-08-17
- **Status:** aberto
- **⚠️ SUPERSEDE:** este card REVERTE dois pedidos do card 007 — item 5 (reveal por
  etapas nos exemplos) e item 7 (par trava/destrava na garantia). Vale o daqui.

## O que o dono quer ver funcionando

Os prints da plataforma carregando de verdade no manual; as legendas contando a regra
CERTA (resposta fraca trava, mínimo nota 8; verificação de voz vem depois do envio);
o capítulo 4 enxuto — só o cartão da regra + "Li, concordo" por passo; o quadro de
exemplos sempre aberto; e a cena da garantia mostrando 60 conteúdos nas três redes,
não 20 em cada.

## O feedback, item a item (anotações do dono no live, 2026-08-17)

### A. BUG — prints não carregam (7 anotados, conferir os 8)

`/manual/prints/onboarding-scan.avif` · `onboarding-negocio` · `onboarding-autoridade`
· `onboarding-redes` · `voz-minha-voz` · `voz-clone-de-voz` · `voz-pendente` — todos
com "foto não carrega". **Fato do intake:** os 8 arquivos EXISTEM no repo em
`public/manual/prints/` (inclusive `voz-verificar.avif`), e os `<img>` estão no HTML
publicado com `src` certo. As fotos vizinhas (`/manual/fotos/*.avif`) carregam.
Diagnóstico sugerido, nesta ordem:
1. `curl -sI https://www.doxaviral.com/manual/prints/onboarding-scan.avif` — status,
   `content-type`, `content-length`; comparar com o baseline que funciona
   `/manual/fotos/serve-de-frente.avif`;
2. `ls -la public/manual/prints/` — tamanho dos arquivos (AVIF de conversão falhada
   costuma ficar 0 bytes ou KB irrisório para um print de 1400px);
3. o commit deployado contém os prints? (deploy pode ser anterior ao commit deles);
4. abrir o .avif localmente — arquivo inválido renderiza em nada, sem erro.

### B. Copy com FATO errado (não é gosto, é regra do produto)

1. Legenda do cap 1: "Resposta fraca não trava ninguém… deixa seguir assim mesmo" →
   **ERRADO**. Dono: "Resposta fraca trava sim, precisa ficar no mínimo nota 8."
   Corrigir esta legenda e TODA copy do manual que diga que dá para seguir com
   resposta fraca. (Ver pergunta 1 — a régua exata.)
2. Legenda da voz: "Antes de treinar, a plataforma confirma que a voz é sua…" →
   ordem errada. Dono: "Depois do envio das amostras que tem a verificação, e só
   depois de verificar ela libera para o uso." Sequência certa: **enviar amostras →
   verificação por voz → treinamento → pronta**. Corrigir a legenda E a posição do
   print `voz-pendente` (ele vem depois do envio dos materiais).
3. Cena da garantia com "20" por rede → **ERRADO**. Dono: "são 60 conteúdos em todas
   as plataformas, e não vinte em cada." São 60 vídeos únicos, cada um publicado nas
   3 redes — o desenho não pode dividir 60 em 20+20+20.

### C. Capítulo 4 — enxugar cada passo (REVERSÃO do par trava/destrava do 007)

Feedback nos passos (itens 11, 12, 14–20): "apaga isso" no cartão "Pode" · "apaga
isso tudo, e só deixa a primeira parte, repita o mesmo para todos os próximos passos,
deixe a checkbox na primeira parte tb" · "apaga" em cada passo seguinte.

**Interpretação do intake (confirmar com o dono na aprovação — é barato):** em CADA
passo do cap. 4, apagar o cartão verde "Pode", os parágrafos extras ("Na prática…",
explicações soltas) e deixar só: o cartão da regra ("Não pode") + o checkbox "Li,
concordo com este item" + Continuar/Voltar. Os "apaga" dos passos 14–20 são o MESMO
enxugamento aplicado a eles — não a remoção do passo (removê-los mataria os aceites
da garantia, que geram comprovante).

### D. Exemplos — sempre abertos (REVERSÃO do reveal do 007)

"Deixe essa seção sempre aberta." O quadro serve/não-serve não ganha reveal por
clique: fica aberto, do jeito que está no ar (que ele elogiou).

## Critério de aceite (observável, executável por humano)

- [ ] Abrir o manual no site publicado → os 8 prints da plataforma carregam (nenhuma
      moldura vazia), no desktop e no celular
- [ ] Nenhuma legenda/copy do manual diz que resposta fraca "não trava" — o texto
      afirma a régua do dono (mínimo nota 8) onde falar de nota
- [ ] Na voz, a sequência apresentada é: enviar amostras → verificação → treinamento
      → pronta; o print de "verificação pendente" aparece depois do envio
- [ ] A cena da garantia não mostra "20" por rede — comunica 60 conteúdos, cada um
      nas três redes
- [ ] Cada passo do cap. 4 tem SÓ: cartão da regra + "Li, concordo" + botões; sem
      cartão "Pode", sem parágrafos extras — inclusive o primeiro passo, com checkbox
- [ ] Continua impossível avançar um passo sem marcar o "Li, concordo"
- [ ] O quadro de exemplos aparece inteiro, sem clique para revelar
- [ ] O comprovante de aceite continua sendo gerado corretamente após o fluxo
      (conferir um aceite de teste de ponta a ponta)

## Contexto do repo (caminhos exatos)

- `public/manual/prints/*.avif` — os 8 arquivos (existem; validar integridade/deploy).
- `src/manual/publico/Prints.tsx` — quem renderiza figure/img/figcaption dos prints;
  legendas dos itens B1/B2 devem morar aqui ou perto.
- `src/manual/publico/Capitulo.tsx` · `Aceites.tsx` · `maquina.ts` — os passos do
  cap. 4 (cartões Não pode/Pode, checkbox, Continuar). O enxugamento do item C mexe
  aqui; os textos dos 8 itens vêm de `src/manual/cenas/itens/*` / dados.
- `src/manual/cenas/itens/Sessenta.tsx` (e/ou a cena com o texto SVG "20") — o
  desenho 20+20+20 do item B3.
- `src/manual/cenas/ExemplosDeFotos.tsx` — exemplos; item D = NÃO implementar reveal
  (se já foi feito em alguma branch do 007, remover/não mergear).
- `src/manual/servidor/comprovante.ts` · `eventos.ts` — o aceite gera comprovante;
  o enxugamento do cap. 4 NÃO pode mudar o que é gravado sem decisão explícita.
- i18n pt|en — toda legenda corrigida nas duas línguas.

## Armadilhas conhecidas

- **Prints:** arquivo existir no repo ≠ arquivo válido ≠ arquivo deployado. Os três
  checks são diferentes; fazer os três (seção A).
- Os prints da PLATAFORMA dizem "não vamos travar você aqui" / "a partir de 75
  pontos" — são fotos, ficam como estão; é a copy do MANUAL que não pode contradizer
  a régua que o dono declarou. Não "corrigir" o print.
- Validação live no domínio com **L** (`doxaviral.com`); duas camadas de cache
  (Cloudflare + Vercel) — depois do fix dos prints, conferir com cache-buster ou
  purge antes de concluir que não resolveu.
- `tailwind.config.js` sem hot-reload; opacidade fora da escala de 5 não gera classe.

## Perguntas abertas para o GESTOR

1. **A régua exata da nota** para a copy: o dono disse "no mínimo nota 8" (por
   resposta, 8/10?), e a plataforma mostra régua de 75/100 no geral. O manual deve
   dizer o quê, exatamente? Confirmar com o dono junto da proposta de copy.
2. **Confirmar a interpretação do item C** (enxugar passos ≠ apagar passos) antes de
   abrir track — uma frase do dono resolve.
3. O enxugamento do cap. 4 muda o shape do comprovante gravado? Se sim, decisão
   explícita antes (armadilha do 007 que continua valendo).
4. Se alguma track do 007 ainda não mergeada implementa o reveal dos exemplos ou os
   pares Pode/Não pode, ela precisa ser re-escopada — conferir estado das branches
   antes de abrir as novas.

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

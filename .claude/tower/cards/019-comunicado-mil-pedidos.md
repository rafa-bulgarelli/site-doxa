# CARD 019 — Comunicado na landing: mais de 1.000 pedidos de contato

- **Tipo:** feature (aviso temporário na landing)
- **Aberto em:** 2026-09-01
- **Status:** **EXECUTADO — aguardando gate + OK do dono** (urgência "pra ontem";
  o assento executou direto, sem fatiamento — 1 componente, escopo de 3 arquivos)

## O que o dono quer ver funcionando

Um popup no site dizendo que o formulário recebeu **mais de 1.000 contatos** e que
estamos entrando em contato com todos — com a maior eficiência possível, mantendo
o melhor padrão possível. Copy e design apresentados ao dono antes de subir.

## Critério de aceite (observável)

- [ ] Abrir `doxaviral.com` num navegador limpo → ~1,6 s depois do load, o
      comunicado entra por cima do hero: cartão creme, título serif com o número
      subindo até 1.000, corpo, linha "seu lugar está guardado", botão "Entendi"
      e link "Garanta seu lugar na fila" (rola até `#forms`).
- [ ] Fechar (botão, ×, véu ou Esc) → não volta mais naquele navegador
      (`localStorage doxa:comunicado-mil:v1`).
- [ ] `?comunicado` na URL força o aviso (preview do dono + screenshot da torre).
- [ ] Não aparece em `/leads`, no manual, no conversor nem no admin.
- [ ] A página NÃO rola sozinha ao abrir (foco com `preventScroll`).
- [ ] `pnpm typecheck` · `pnpm test` · `pnpm build` verdes; chunk `Comunicado-*`
      separado do entry (quem já dispensou não baixa 1 byte).

## Escopo (fechado)

- `src/components/Comunicado.tsx` (novo)
- `src/components/comunicado/config.ts` (novo — copy do dono + chave + espera)
- `src/App.tsx` (gate + lazy + render fora do `<main>`)

## Evidência (2026-09-01, branch `feat/comunicado-mil`)

- typecheck exit 0 · 29 files / 1048 tests verdes · build exit 0, 68 rotas
  prerenderizadas, `dist/assets/Comunicado-BCGf3gNk.js` separado.
- Screenshots 320 e 1440 via `mobile-shot.mjs` com `?comunicado`:
  scrollWidth == clientWidth (sem rolagem horizontal) nas duas larguras.

## Decisões de design (gramática do site, não invenção)

- Cartão **creme** `#F4F1E8`: preto/creme é o vocabulário do site e o creme é a
  cor da resposta (painel vencedor da comparação). Site monocromático fora do
  menu → o ponto "respondendo agora" pulsa em TINTA, não em verde.
- Número **sobe** 0→1.000 (mesmo gesto do `Contador` da comparação); quem pediu
  menos movimento nasce no total.
- Mobile: cartão ancora embaixo (bottom sheet); desktop: centrado.

## VALIDAR-LIVE (após deploy)

Navegador limpo em produção: aviso entra, fecha, não volta; `?comunicado` força;
`/leads` limpo; celular real sem rolagem espontânea.

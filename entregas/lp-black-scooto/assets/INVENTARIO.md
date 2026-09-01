# Inventário de assets — LP Black Scooto (P0, extraído do Figma em 2026-09-01)

Origem: `download_assets`/`get_design_context` do MCP do Figma, frame `1:3`.
As URLs `figma.com/api/mcp/asset/...` citadas no `../figma/design-context.md`
**expiram em ~7 dias** — os arquivos deste diretório são as cópias duráveis.
A URL pública final de cada arquivo será `RAW_PREFIX + <nome>` (tabela *Imagens*
do `../contrato.md`, escrito pelo prelude P1).

## Raster

| Arquivo | Dim | Peso | Seção / uso (const do design-context) | Nota |
|---|---|---|---|---|
| `hero-foto-scooteira.png` | 950×950 | 384 KB | 01 hero — `img1608ScooteirasNoLogoNovo21`, render 612×604 | Recorte com TRANSPARÊNCIA REAL sobre fundo creme — tem que ser PNG. Reduzido de 1080² (584 KB) para caber em 400 KB; 1,55× o tamanho de render. |
| `hero-glow-fonte-270.png` | 270×270 | 44 KB | 01 hero — provável fonte do véu borrado `DIV-52` (blur 20px) | Mesma arte da foto em 270px; o blur destrói detalhe, 270px basta. |
| `autoridade-foto-time.jpg` | 1080×1080 | 280 KB | 06 autoridade — `imgImg383`, render 472×334 cover | Original PNG 1532 KB; JPEG 85. Os cantos transparentes do original viram branco = invisível sobre seção branca; o container re-aplica `rounded-16 overflow-clip`. |
| `autoridade-foto-time-270.png` | 270×270 | 104 KB | 06 autoridade — variante pequena presente no subtree | Guardada por fidelidade; uso incerto. |
| `logo-xp.png` | 1024×223 | 20 KB | 07 prova-social — `imgImg504`, render 165×36 | Existia também em 512×112 (descartada, duplicata menor). |
| `logo-boca-rosa.png` | 512×272 | 16 KB | 07 prova-social — `imgImg506`, render 165×78 | Existia também em 4096×2175 (288 KB — descartada, 25× o necessário). |
| `formulario-marca-branca.png` | 1080×1080 | 40 KB | 10 formulário — `imgImg746`, marca branca decorativa 600×600 `opacity-7` | Branca sobre rosa #f12d64. |
| `formulario-marca-branca-270.png` | 270×270 | 12 KB | 10 formulário — variante pequena do subtree | Uso incerto. |

## SVG (ícones e logos vetoriais — candidatos a INLINE nos blocos)

Nomeados por seção + ordem do `download_assets`. Para mapear ícone→lugar, abra o
arquivo (são minúsculos) e confira contra o screenshot `../figma/secao-NN-*.png`.
**⚠ Os SVGs exportados do Figma vêm com o eixo Y espelhado** — antes de inline,
aplicar `<g transform="translate(0 H) scale(1 -1)">` (H = altura do viewBox);
descoberto pelas tracks C/D (o "in" do LinkedIn vira "!∪" sem isso).

| Arquivo | Bytes | Palpite de conteúdo (conferir visualmente) |
|---|---|---|
| `hero-svg-01.svg` | 265 | ícone do badge "Avaliação gratuita" (raio) |
| `hero-svg-02.svg` | 744 | ícone de input (envelope — campo E-mail) |
| `hero-svg-03.svg` | 1604 | ícone relógio `#4013cc` (pill "Operação no ar em 24h") |
| `hero-svg-04.svg` | 1827 | ícone de input (pessoa — campo Nome) |
| `hero-svg-05.svg` | 1807 | ícone pill faixa inferior |
| `hero-svg-06.svg` | 915 | ícone pill faixa inferior |
| `hero-svg-07.svg` | 1830 | ícone pill faixa inferior |
| `hero-svg-08.svg` | 368 | seta do botão CTA |
| `ident-svg-01.svg` | 348 | check branco dos 7 cards |
| `oferta-svg-01.svg` | 379 | seta do CTA branco |
| `contratacao-svg-01.svg` | 303 | check das listas (frentes 1/2) |
| `contratacao-svg-02.svg` | 1127 | ícone do badge "FRENTE 2" |
| `prova-svg-01.svg` | 400 | estrela (5× por card) |
| `prova-svg-02.svg` | 4303 | logo Cora (`imgCoraLogo1`, 139×36) |
| `prova-svg-03.svg` | 1431 | persona avatar depoimento 1 |
| `prova-svg-04.svg` | 1431 | persona avatar depoimento 2 |
| `prova-svg-05.svg` | 1431 | persona avatar depoimento 3 |
| `comofunciona-svg-01.svg` | 320 | seta → entre os cards-passo |
| `faq-svg-01.svg` | 338 | chevron branco (item aberto) |
| `faq-svg-02.svg` | 340 | chevron escuro (itens fechados) |
| `formulario-svg-01.svg` | 3289 | ícone WhatsApp do CTA "Falar pelo WhatsApp" |
| `footer-svg-01.svg` | 4851 | ícone social 1 (possível também candidato a logo 32px do footer — IMG-751 veio vazio no dump) |
| `footer-svg-02.svg` | 1253 | ícone social 2 |
| `footer-svg-03.svg` | 863 | ícone social 3 |

## Gerados no Figma que NÃO viraram arquivo (reproduzir em CSS)

- Gradiente da moldura do card do hero: `linear-gradient(145.06deg, #4a1be8 0%, #f12d64 50%, #ff6000 100%)` (`DIV-53`).
- Fundo do botão do hero (`imgButton75`): mesmo gradiente da marca — reproduzir em CSS, não em imagem.
- Faixa inferior do hero (`imgDiv90`, 1440×91): fundo sutil — conferir no screenshot; se for gradiente/cor chapada, CSS resolve.
- Sombras duras dos cards (autoridade/como-funciona): `drop-shadow(8px 8px 0 <cor>)`.

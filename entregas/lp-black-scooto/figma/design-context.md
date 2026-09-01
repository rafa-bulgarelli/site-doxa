# LP BLACK — Scooto · design context (dump do Figma via MCP, 2026-09-01)

Fonte: `https://www.figma.com/design/0wu66LVRV9sntibU4BV36V/LP-BLACK---Scooto?node-id=1-3`
Frame `1:3` (`root-1`): **1440 × 9326 px**. Dump verbatim do `get_design_context` por
seção (o retorno do frame inteiro veio esparso por tamanho). O código é referência
React+Tailwind gerada pelo MCP — números (px, hex, pesos) são a fonte da verdade;
a sintaxe não é para colar.

> **As URLs `figma.com/api/mcp/asset/...` deste arquivo expiram em ~7 dias.**
> Os binários duráveis estão em `../assets/` — ver `../assets/INVENTARIO.md`.

## Inventário de seções (get_metadata, filhos de DIV-2)

| # | node | nome Figma | y | altura | screenshot |
|---|------|-----------|---|--------|------------|
| 01 | 1:5 | hero-3 | 0 | 1251 | secao-01-hero.png |
| 02 | 1:133 | identificacao-117 | 1251 | 1058 | secao-02-identificacao.png |
| 03 | 1:214 | oferta-177 | 2309 | 766 | secao-03-oferta.png |
| 04 | 1:247 | urgencia-207 | 3075 | 853 | secao-04-urgencia.png |
| 05 | 1:303 | contratacao-264 | 3928 | 854 | secao-05-contratacao.png |
| 06 | 1:435 | autoridade-364 | 4782 | 740 | secao-06-autoridade.png |
| 07 | 1:482 | prova-social-413 | 5522 | 681 | secao-07-prova-social.png |
| 08 | 1:615 | como-funciona-510 | 6203 | 589.75 | secao-08-como-funciona.png |
| 09 | 1:664 | faq-554 | 6792.75 | 1216.25 | secao-09-faq.png |
| 10 | 1:776 | formulario-completo-645 | 8009 | 1043 | secao-10-formulario-completo.png |
| 11 | 1:881 | FOOTER-747 | 9052 | 274 | secao-11-footer.png |

## Fatos transversais (lidos dos dumps abaixo — conferir seção a seção)

- **Tipografia REAL: Sora só em títulos** (`Sora:Bold` em H1 60px/-1.5px, H2 36px,
  título do form 20px). O corpo é **`Roboto`** (Regular/SemiBold/Bold, com
  `fontVariationSettings: "wdth" 100`) e há placeholder de input em **`Inter:Medium`**.
  O `@import` do bloco precisa cobrir Sora E Roboto (Inter: decidir no contrato —
  placeholder pode herdar Roboto sem perda perceptível).
- **Paleta recorrente**: fundo creme `#f2f2e8` · borda `#dfdfd4` · texto forte
  `#030304` · corpo `#3b3c48` / `#555766` · cinza `#8f91a2` / `#aeb0be` · roxo
  `#4a1be8` · gradiente CTA `linear-gradient(145deg, #4a1be8 0%, #f12d64 50%, #ff6000 100%)`
  · badge laranja fundo `#ffe1d2` texto `#602103` · pills `#e5e9ff` / `#ffdee2`.
- **⚠ O HERO CONTÉM UM MINI-FORM** (Nome, E-mail corporativo, anti-spam "Quanto é
  5 + 7?", botão "Quero avaliar minha operação") ALÉM da seção 10
  `formulario-completo`. O hook do Intercom capta TODOS os forms Elementor Pro do
  site — decisão de arquitetura (2º form real × visual ancorando no form completo)
  registrada como pendência no gate do P0; o contrato.md do P1 fecha isso.

---

## Seção 01 — hero (1:5) · get_design_context verbatim

```jsx
const imgDiv52 = "https://www.figma.com/api/mcp/asset/86262f46-0029-4618-a93f-7f3cce891515.png";
const imgButton75 = "https://www.figma.com/api/mcp/asset/cd7912c9-ffab-4ade-a1a9-ec7535c02b56.png";
const img1608ScooteirasNoLogoNovo21 = "https://www.figma.com/api/mcp/asset/169494b9-4fbf-4830-8407-e25c56044749.png";
const imgDiv90 = "https://www.figma.com/api/mcp/asset/9bd26c4c-5f02-4bbc-93ad-2ac752c666a4.png";
const imgGroup = "https://www.figma.com/api/mcp/asset/3b3be937-2aa7-42dd-b554-05c89e95f251.svg";
const imgGroup1 = "https://www.figma.com/api/mcp/asset/fd403728-2f39-4ce9-8214-37756a20dd9b.svg";
const imgGroup2 = "https://www.figma.com/api/mcp/asset/f763d9c8-9fbb-4ec3-9c71-6e89fd3fe54a.svg";
const imgGroup3 = "https://www.figma.com/api/mcp/asset/5f9fe46c-7dba-4292-a5f1-035dc7abadb6.svg";
const imgGroup4 = "https://www.figma.com/api/mcp/asset/a0a3649b-9c74-4f01-a9a0-dcda62cdad1a.svg";
const imgGroup5 = "https://www.figma.com/api/mcp/asset/fe5a6495-8d6c-448d-9ca3-0c4ffe89bfb4.svg";
const imgGroup6 = "https://www.figma.com/api/mcp/asset/29d824f2-ece4-4798-920c-b69e2654c8a6.svg";
const imgGroup7 = "https://www.figma.com/api/mcp/asset/a528f019-7f60-41d0-880b-d306e6253cea.svg";

```jsx
export default function Hero3() {
  return (
    <div className="bg-[#f2f2e8] content-stretch flex flex-col items-start pt-[80px] relative size-full" data-node-id="1:5" data-name="hero-3">
      <div className="content-stretch flex items-start px-[80px] relative shrink-0" data-node-id="1:6" data-name="margin-wrap">
        <div className="content-stretch flex flex-col h-[1080px] items-start max-w-[1280px] px-[24px] py-[80px] relative shrink-0 w-[1280px]" data-node-id="1:7" data-name="DIV-4">
          <div className="content-center flex flex-wrap gap-[64px] h-[920px] items-center relative shrink-0 w-[1232px]" data-node-id="1:8" data-name="DIV-5">
            <div className="content-stretch flex flex-col h-[920px] items-start relative shrink-0 w-[584px]" data-node-id="1:9" data-name="DIV-6">
              <div className="content-stretch flex items-start pb-[24px] relative shrink-0" data-node-id="1:10" data-name="margin-wrap">
                <div className="h-[48px] relative shrink-0 w-[584px]" data-node-id="1:11" data-name="DIV-7" />
              </div>
              <div className="content-stretch flex items-start pb-[16px] relative shrink-0" data-node-id="1:13" data-name="margin-wrap">
                <div className="[word-break:break-word] content-start flex flex-wrap font-['Sora:Bold'] font-bold gap-0 h-[240px] items-start leading-[0] relative shrink-0 text-[60px] tracking-[-1.5px] w-[783px]" data-node-id="1:14" data-name="H1-9">
                  <div className="flex flex-col h-[180px] justify-center overflow-hidden relative shrink-0 text-[#030304] text-ellipsis w-[584px]" data-node-id="1:15">
                    <p className="leading-[60px]">Você vai gerar demanda na Black Friday. ​</p>
                  </div>
                  <div className="flex flex-col justify-center relative shrink-0 text-[#4a1be8] whitespace-nowrap" data-node-id="1:16">
                    <p className="leading-[60px]">Quem vai</p>
                  </div>
                  <div className="flex flex-col justify-center relative shrink-0 text-[#4a1be8] w-[501px]" data-node-id="1:17">
                    <p className="leading-[60px]">{` dar conta?`}</p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex items-start pb-[16px] relative shrink-0" data-node-id="1:18" data-name="margin-wrap">
                <div className="content-start flex flex-wrap h-[48px] items-start relative shrink-0 w-[584px]" data-node-id="1:19" data-name="P-16">
                  <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[48px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#555766] text-[16px] text-ellipsis w-[584px]" data-node-id="1:20" style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[24px]">Time de pré-vendas e atendimento montado, treinado e rodando em 24 horas, sem contrato longo, no valor/hora de quem fica o ano inteiro.</p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex items-start pb-[24px] relative shrink-0" data-node-id="1:21" data-name="margin-wrap">
                <div className="content-stretch flex flex-col h-[72px] items-start relative shrink-0 w-[584px]" data-node-id="1:22" data-name="DIV-19">
                  <div className="content-stretch flex items-start pb-[12px] relative shrink-0" data-node-id="1:23" data-name="margin-wrap">
                    <div className="[word-break:break-word] content-start flex flex-wrap gap-0 h-[40px] items-start leading-[0] relative shrink-0 text-[14px] w-[584px] whitespace-nowrap" data-node-id="1:24" data-name="P-20">
                      <div className="flex flex-col font-['Roboto:Regular'] font-normal justify-center relative shrink-0 text-[#555766]" data-node-id="1:25" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[20px]">Mais de 150 empresas escalam vendas e atendimento com a Scooto. Entre elas, ​</p>
                      </div>
                      <div className="flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center relative shrink-0 text-[#111116]" data-node-id="1:26" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[20px]">XP, Cora e</p>
                      </div>
                      <div className="flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center relative shrink-0 text-[#111116]" data-node-id="1:27" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[20px]">Boca Rosa</p>
                      </div>
                      <div className="flex flex-col font-['Roboto:Regular'] font-normal justify-center relative shrink-0 text-[#555766]" data-node-id="1:28" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[20px]">.</p>
                      </div>
                    </div>
                  </div>
                  <div className="content-center flex flex-wrap gap-[8px_24px] h-[20px] items-center relative shrink-0 w-[584px]" data-node-id="1:29" data-name="DIV-29">
                    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[17.938px]" data-node-id="1:30" data-name="SPAN-30">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#8f91a2] text-[14px] whitespace-nowrap" data-node-id="1:31" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[20px]">XP</p>
                      </div>
                    </div>
                    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[4.219px]" data-node-id="1:32" data-name="SPAN-33">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#aeb0be] text-[14px] whitespace-nowrap" data-node-id="1:33" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[20px]">·</p>
                      </div>
                    </div>
                    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[29.484px]" data-node-id="1:34" data-name="SPAN-36">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#8f91a2] text-[14px] whitespace-nowrap" data-node-id="1:35" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[20px]">Cora</p>
                      </div>
                    </div>
                    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[4.219px]" data-node-id="1:36" data-name="SPAN-39">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#aeb0be] text-[14px] whitespace-nowrap" data-node-id="1:37" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[20px]">·</p>
                      </div>
                    </div>
                    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[66.703px]" data-node-id="1:38" data-name="SPAN-42">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#8f91a2] text-[14px] whitespace-nowrap" data-node-id="1:39" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[20px]">Boca Rosa</p>
                      </div>
                    </div>
                    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[4.219px]" data-node-id="1:40" data-name="SPAN-45">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#aeb0be] text-[14px] whitespace-nowrap" data-node-id="1:41" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[20px]">·</p>
                      </div>
                    </div>
                    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[120.688px]" data-node-id="1:42" data-name="SPAN-48">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#8f91a2] text-[14px] whitespace-nowrap" data-node-id="1:43" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[20px]">Indústria da Beleza</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex items-start pb-[24px] relative shrink-0" data-node-id="1:44" data-name="margin-wrap">
                <div className="content-stretch flex flex-col h-[408px] items-start relative shrink-0 w-[584px]" data-node-id="1:45" data-name="DIV-51">
                  <div className="absolute blur-[20px] h-[432px] left-[-12px] rounded-[24px] top-[-12px] w-[608px]" data-node-id="1:46" data-name="DIV-52">
                    <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[24px] size-full" src={imgDiv52} />
                  </div>
                  <div className="content-stretch flex flex-col h-[408px] items-start p-[2px] relative rounded-[16px] shrink-0 w-[584px]" data-node-id="1:47" style={{ backgroundImage: "linear-gradient(145.06068979532296deg, rgb(74, 27, 232) 0%, rgb(241, 45, 100) 50%, rgb(255, 96, 0) 100%)" }} data-name="DIV-53">
                    <div className="bg-white content-stretch flex flex-col h-[404px] items-start p-[24px] relative rounded-[16px] shrink-0 w-[580px]" data-node-id="1:48" data-name="DIV-54">
                      <div className="content-stretch flex items-start pb-[16px] relative shrink-0" data-node-id="1:49" data-name="margin-wrap">
                        <div className="content-stretch flex flex-col h-[61px] items-start relative shrink-0 w-[532px]" data-node-id="1:50" data-name="DIV-55">
                          <div className="bg-[#ffe1d2] content-stretch flex gap-[6px] h-[24px] items-center px-[12px] py-[4px] relative rounded-[9999px] shrink-0 w-[139.891px]" data-node-id="1:51" data-name="SPAN-56">
                            <div className="content-stretch flex h-[16px] items-center relative shrink-0 w-[12.5px]" data-node-id="1:52" data-name="I-57">
                              <div className="absolute h-[12px] left-0 overflow-clip top-[2px] w-[12.5px]" data-node-id="1:53" data-name="Icon-58">
                                <div className="absolute flex inset-[4.17%_18%] items-center justify-center" data-node-id="1:54" style={{ containerType: "size" }}>
                                  <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                                    <div className="relative size-full" data-name="Group">
                                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="[word-break:break-word] flex flex-col font-['Roboto:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#602103] text-[12px] whitespace-nowrap" data-node-id="1:56" style={{ fontVariationSettings: '"wdth" 100' }}>
                              <p className="leading-[16px]">Avaliação gratuita</p>
                            </div>
                          </div>
                          <div className="content-stretch flex items-start pt-[8px] relative shrink-0" data-node-id="1:57" data-name="margin-wrap">
                            <div className="content-stretch flex h-[28px] items-center relative shrink-0 w-[532px]" data-node-id="1:58" data-name="P-61">
                              <div className="[word-break:break-word] flex flex-col font-['Sora:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#030304] text-[20px] whitespace-nowrap" data-node-id="1:59">
                                <p className="leading-[28px]">Vamos entender sua operação</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex flex-col h-[231px] items-start relative shrink-0 w-[532px]" data-node-id="1:60" data-name="FORM-64">
                        <div className="content-stretch flex items-start pt-[12px] relative shrink-0" data-node-id="1:61" data-name="margin-wrap">
                          <div className="content-stretch flex flex-col h-[46px] items-start relative shrink-0 w-[532px]" data-node-id="1:62" data-name="DIV-65">
                            <div className="[word-break:break-word] bg-[#f2f2e8] border border-[#dfdfd4] border-solid content-stretch flex h-[46px] items-center leading-[0] pl-[41px] pr-[17px] py-[13px] relative rounded-[8px] shrink-0 text-[14px] w-[532px]" data-node-id="1:63" data-name="INPUT">
                              <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium'] font-medium justify-center left-[40px] not-italic text-[#9ca3af] top-[22px] w-[474px]" data-node-id="1:64">
                                <p className="leading-[20px]">Nome</p>
                              </div>
                              <div className="flex flex-col font-['Roboto:Regular'] font-normal justify-center overflow-hidden relative shrink-0 text-[#111116] text-ellipsis w-[474px]" data-node-id="1:65" style={{ fontVariationSettings: '"wdth" 100' }}>
                                <p className="leading-[20px]">​</p>
                              </div>
                            </div>
                            <div className="absolute content-stretch flex h-[24px] items-center left-[12px] top-[11px] w-[16.672px]" data-node-id="1:66" data-name="I-67">
                              <div className="absolute h-[16px] left-0 overflow-clip top-[4px] w-[16.656px]" data-node-id="1:67" data-name="Icon-68">
                                <div className="absolute flex inset-[6.25%_18%] items-center justify-center" data-node-id="1:68" style={{ containerType: "size" }}>
                                  <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                                    <div className="relative size-full" data-name="Group">
                                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup1} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex items-start pt-[12px] relative shrink-0" data-node-id="1:70" data-name="margin-wrap">
                          <div className="content-stretch flex flex-col h-[46px] items-start relative shrink-0 w-[532px]" data-node-id="1:71" data-name="DIV-69">
                            <div className="[word-break:break-word] bg-[#f2f2e8] border border-[#dfdfd4] border-solid content-stretch flex h-[46px] items-center leading-[0] pl-[41px] pr-[17px] py-[13px] relative rounded-[8px] shrink-0 text-[14px] w-[532px]" data-node-id="1:72" data-name="INPUT">
                              <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium'] font-medium justify-center left-[40px] not-italic text-[#9ca3af] top-[22px] w-[474px]" data-node-id="1:73">
                                <p className="leading-[20px]">E-mail corporativo</p>
                              </div>
                              <div className="flex flex-col font-['Roboto:Regular'] font-normal justify-center overflow-hidden relative shrink-0 text-[#111116] text-ellipsis w-[474px]" data-node-id="1:74" style={{ fontVariationSettings: '"wdth" 100' }}>
                                <p className="leading-[20px]">​</p>
                              </div>
                            </div>
                            <div className="absolute content-stretch flex h-[24px] items-center left-[12px] top-[11px] w-[16.672px]" data-node-id="1:75" data-name="I-71">
                              <div className="absolute h-[16px] left-0 overflow-clip top-[4px] w-[16.656px]" data-node-id="1:76" data-name="Icon-72">
                                <div className="absolute flex inset-[12.5%_10%] items-center justify-center" data-node-id="1:77" style={{ containerType: "size" }}>
                                  <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                                    <div className="relative size-full" data-name="Group">
                                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup2} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex items-start pt-[12px] relative shrink-0" data-node-id="1:79" data-name="margin-wrap">
                          <div className="content-stretch flex h-[46px] items-start relative shrink-0 w-[532px]" data-node-id="1:80" data-name="DIV-73">
                            <div className="[word-break:break-word] bg-[#f2f2e8] border border-[#dfdfd4] border-solid content-stretch flex h-[46px] items-center leading-[0] px-[17px] py-[13px] relative rounded-[8px] shrink-0 text-[14px] w-[532px]" data-node-id="1:81" data-name="INPUT">
                              <div className="-translate-y-1/2 absolute flex flex-col font-['Inter:Medium'] font-medium justify-center left-[16px] not-italic text-[#9ca3af] top-[22px] w-[498px]" data-node-id="1:82">
                                <p className="leading-[20px]">Quanto é 5 + 7?</p>
                              </div>
                              <div className="flex flex-col font-['Roboto:Regular'] font-normal justify-center overflow-hidden relative shrink-0 text-[#111116] text-ellipsis w-[498px]" data-node-id="1:83" style={{ fontVariationSettings: '"wdth" 100' }}>
                                <p className="leading-[20px]">​</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="content-stretch flex items-start pt-[12px] relative shrink-0" data-node-id="1:84" data-name="margin-wrap">
                          <div className="content-start flex flex-wrap gap-0 h-[57px] items-start justify-center px-[24px] py-[16px] relative rounded-[12px] shrink-0 w-[532px]" data-node-id="1:85" data-name="BUTTON-75">
                            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[12px] size-full" src={imgButton75} />
                            <div className="[word-break:break-word] flex flex-col font-['Roboto:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[16px] text-center text-white whitespace-nowrap" data-node-id="1:86" style={{ fontVariationSettings: '"wdth" 100' }}>
                              <p className="leading-[24px]">Quero avaliar minha operação</p>
                            </div>
                            <div className="content-stretch flex items-start pl-[8px] relative shrink-0" data-node-id="1:87" data-name="margin-wrap">
                              <div className="h-[16px] overflow-clip relative shrink-0 w-[16.672px]" data-node-id="1:88" data-name="Icon-78">
                                <div className="absolute flex inset-[17.58%_18%] items-center justify-center" data-node-id="1:89" style={{ containerType: "size" }}>
                                  <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                                    <div className="relative size-full" data-name="Group">
                                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup3} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex items-start pt-[16px] relative shrink-0" data-node-id="1:91" data-name="margin-wrap">
                        <div className="content-start flex flex-wrap h-[32px] items-start relative shrink-0 w-[532px]" data-node-id="1:92" data-name="P-79">
                          <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[32px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#8f91a2] text-[12px] text-ellipsis w-[522.359px]" data-node-id="1:93" style={{ fontVariationSettings: '"wdth" 100' }}>
                            <p className="leading-[16px]">Seus dados ficam com a gente. Sem spam, sem lista comprada. Um humano responde. Não é bot, não é fila.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col h-[920px] items-center justify-center relative shrink-0 w-[584px]" data-node-id="1:94" data-name="grid-wrap-82">
              <div className="h-[604px] relative shrink-0 w-[612px]" data-node-id="2:2" data-name="1608_scooteiras-no-logo-NOVO (2) 1">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img alt="" className="absolute h-[105.78%] left-[-8.09%] max-w-none top-[-0.09%] w-[104.4%]" src={img1608ScooteirasNoLogoNovo21} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-[#dfdfd4] border-solid border-t content-stretch flex flex-col h-[91px] items-start pt-px relative shrink-0 w-[1440px]" data-node-id="1:101" data-name="DIV-90">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgDiv90} />
        <div className="content-stretch flex items-start px-[80px] relative shrink-0" data-node-id="1:102" data-name="margin-wrap">
          <div className="content-stretch flex flex-col h-[90px] items-start max-w-[1280px] px-[24px] py-[20px] relative shrink-0 w-[1280px]" data-node-id="1:103" data-name="DIV-91">
            <div className="content-center flex flex-wrap gap-[12px] h-[50px] items-center justify-center relative shrink-0 w-[1232px]" data-node-id="1:104" data-name="DIV-92">
              <div className="bg-white border border-[#dfdfd4] border-solid content-stretch flex gap-[10px] h-[50px] items-center px-[17px] py-[11px] relative rounded-[9999px] shrink-0 w-[218.156px]" data-node-id="1:105" data-name="SPAN-93">
                <div className="bg-[#e5e9ff] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[28px]" data-node-id="1:106" data-name="SPAN-94">
                  <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[14.594px]" data-node-id="1:107" data-name="I-95">
                    <div className="absolute h-[14px] left-0 overflow-clip top-[3px] w-[14.578px]" data-node-id="1:108" data-name="Icon-96">
                      <div className="absolute flex inset-[8.33%_10%] items-center justify-center" data-node-id="1:109" style={{ containerType: "size" }}>
                        <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                          <div className="relative size-full" data-name="Group">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup4} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#22232b] text-[14px] whitespace-nowrap" data-node-id="1:111" style={{ fontVariationSettings: '"wdth" 100' }}>
                  <p className="leading-[20px]">Operação no ar em 24h</p>
                </div>
              </div>
              <div className="bg-white border border-[#dfdfd4] border-solid content-stretch flex gap-[10px] h-[50px] items-center px-[17px] py-[11px] relative rounded-[9999px] shrink-0 w-[241.469px]" data-node-id="1:112" data-name="SPAN-99">
                <div className="bg-[#ffe1d2] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[28px]" data-node-id="1:113" data-name="SPAN-100">
                  <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[14.594px]" data-node-id="1:114" data-name="I-101">
                    <div className="absolute h-[14px] left-0 overflow-clip top-[3px] w-[14.578px]" data-node-id="1:115" data-name="Icon-102">
                      <div className="absolute flex inset-[6.25%_12%] items-center justify-center" data-node-id="1:116" style={{ containerType: "size" }}>
                        <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                          <div className="relative size-full" data-name="Group">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup5} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#22232b] text-[14px] whitespace-nowrap" data-node-id="1:118" style={{ fontVariationSettings: '"wdth" 100' }}>
                  <p className="leading-[20px]">De 1 a 50 posições em 48h</p>
                </div>
              </div>
              <div className="bg-white border border-[#dfdfd4] border-solid content-stretch flex gap-[10px] h-[50px] items-center px-[17px] py-[11px] relative rounded-[9999px] shrink-0 w-[246.234px]" data-node-id="1:119" data-name="SPAN-105">
                <div className="bg-[#ffdee2] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[28px]" data-node-id="1:120" data-name="SPAN-106">
                  <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[14.594px]" data-node-id="1:121" data-name="I-107">
                    <div className="absolute h-[14px] left-0 overflow-clip top-[3px] w-[14.578px]" data-node-id="1:122" data-name="Icon-108">
                      <div className="absolute flex inset-[10.92%_2.6%] items-center justify-center" data-node-id="1:123" style={{ containerType: "size" }}>
                        <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                          <div className="relative size-full" data-name="Group">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup6} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#22232b] text-[14px] whitespace-nowrap" data-node-id="1:125" style={{ fontVariationSettings: '"wdth" 100' }}>
                  <p className="leading-[20px]">Gestão dedicada, não ticket</p>
                </div>
              </div>
              <div className="bg-white border border-[#dfdfd4] border-solid content-stretch flex gap-[10px] h-[50px] items-center px-[17px] py-[11px] relative rounded-[9999px] shrink-0 w-[254.422px]" data-node-id="1:126" data-name="SPAN-111">
                <div className="bg-[#e5e9ff] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[28px]" data-node-id="1:127" data-name="SPAN-112">
                  <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[14.594px]" data-node-id="1:128" data-name="I-113">
                    <div className="absolute h-[14px] left-0 overflow-clip top-[3px] w-[14.578px]" data-node-id="1:129" data-name="Icon-114">
                      <div className="absolute flex inset-[6.25%_14%] items-center justify-center" data-node-id="1:130" style={{ containerType: "size" }}>
                        <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                          <div className="relative size-full" data-name="Group">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup7} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#22232b] text-[14px] whitespace-nowrap" data-node-id="1:132" style={{ fontVariationSettings: '"wdth" 100' }}>
                  <p className="leading-[20px]">LGPD e processos auditáveis</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Seção 02 — identificacao (1:133) · get_design_context verbatim

Constante do dump: `imgGroup = ".../5c32f1b6-4844-4abe-80d1-7bfcc389d102.svg"` (ícone
de check dos cards — binário em `../assets/`, ver INVENTARIO).

Estrutura (números exatos): seção `bg-white py-[96px]`, coluna central
`max-w-[896px] px-[24px]` (container 848). H2 `Sora:Bold 36px leading-[40px]`
`#030304` centrado: "Essa conversa é para você que já sabe o que vem por aí".
Sub: `Roboto:Regular 16px/24 #555766` centrado: "Se você reconhece três dos cenários
abaixo, a gente provavelmente tem o que conversar."
Depois 7 cards empilhados (gap via `pt-[16px]`), cada card:
`bg-[#f2f2e8] border #dfdfd4 rounded-[12px] p-[21px] flex gap-[16px]`, ícone à
esquerda em disco `bg-[#4a1be8] rounded-full size-[32px]` com check branco 14px,
texto `Roboto:Regular 16px/24 #3b3c48`. Alturas: 5 cards de 90px (texto 2 linhas,
width ~758px) e 2 cards de 76px (texto 1 linha). Textos literais, na ordem:

1. "Sua campanha de Black Friday já está desenhada, e seu time comercial é o mesmo de julho. O tráfego vai dobrar. A capacidade de falar com quem chega, não."
2. "Você sabe que uma parte do que entrar vai esfriar sem ninguém tocar. Não por falta de interesse do lead. Por falta de quem faça o segundo contato no mesmo dia."
3. "Contratar CLT para três meses de pico não fecha a conta. E contratar freela avulso sempre saiu mais caro por hora do que deveria."
4. "Você já viu o que acontece em dezembro. A venda foi boa, e aí chega troca, devolução, \"cadê meu pedido\", e o time de vendas vira suporte no improviso."
5. "Seu SDR atual não passa do decisor. Abordagem que parece spam, script decorado, follow-up que morre no terceiro dia."
6. "Você não quer terceirizar para receber operador que lê roteiro. Já testou isso. Não funcionou." (card 76px)
7. "Você quer resolver isso agora, em agosto, e não descobrir em novembro que não dava tempo." (card 76px)

---

## Seção 03 — oferta (1:214) · get_design_context verbatim

Constante do dump: `imgGroup = ".../e8afbaf4-f870-45f1-8cb2-93a76411444c.svg"` (seta
do CTA branco).

Estrutura: seção `bg-[#4a1be8] py-[96px]`, coluna `max-w-[896px]` (container 848).
H2 `Sora:Bold 36px/40 text-white` centrado: "A gente não vai te dar desconto de Black
Friday". Corpo `max-w-[768px]`, parágrafos `Roboto:Regular 16px/24
rgba(255,255,255,0.9)` com `pt-[16px]` entre si:

1. "Desconto percentual é o que todo mundo faz em novembro. E normalmente é só o preço de tabela inflado voltando ao normal."
2. "A nossa condição é outra, e é mais útil para você:"
3. **Destaque** (caixa `bg-[rgba(255,255,255,0.15)] border rgba(255,255,255,0.2) rounded-[12px] p-[25px]`, texto `Roboto:SemiBold 18px/28 white`): "Quem fecha para a Black Friday paga o mesmo valor/hora de quem assina contrato recorrente. Sem o contrato recorrente."
4. "Traduzindo: você monta o time só para a temporada, pré-vendas, atendimento ou os dois, e não paga o adicional que normalmente se cobra por operação temporária. Sem fidelidade longa. Sem multa para reduzir depois do pico."
5. "Por que a gente faz isso: porque na maioria das vezes o time que entrou para a Black Friday continua depois. Não porque tem cláusula prendendo, mas porque a operação passou a funcionar melhor com ele. A gente prefere apostar nisso a te prender em papel."

CTA centrado: pill `bg-white rounded-full px-[32px] py-[12px] h-[44px]`, texto
`Roboto:SemiBold 14px/20 #4013cc` "Quero entender essa condição" + seta 14px (svg).
**É um `<a>` (A-202)** — vira `href="#lpb-form"`.

---

## Seção 04 — urgencia (1:247) · get_design_context verbatim

Sem imagem/svg. Seção `bg-white py-[96px]`, coluna `max-w-[1024px]` (container 976).
H2 `Sora:Bold 36px/40 #030304` centrado: "A gente sobe sua operação em 24 horas. O
que não cabe em 24 horas é o resto." Corpo `max-w-[768px]` centrado,
`Roboto:Regular 16px/24 #555766`, parágrafos com `pt-[16px]`:

1. "Isso não é modéstia falsa. A Scooto realmente coloca um time em campo em um dia útil, ferramentas conectadas, pessoas alocadas, primeiro contato saindo."
2. "O que não se comprime é o que vem depois: seu catálogo, sua política de frete, suas exceções, as três objeções que só aparecem quando o cliente já ouviu o preço. Isso é curva de contexto, e ela leva algumas semanas, não algumas horas."
3. "Quem começa em agosto chega em novembro com o time já calejado. Quem começa em novembro está treinando durante o pico."
4. **`Roboto:SemiBold 16px/24 #22232b`**: "E o pico é a única parte disso que não negocia data."

H3 `Sora:Bold 20px/28 #22232b` centrado: "Quando você começa → O que acontece na
Black Friday". Grid de 4 cards `w-[232px] h-[145px] bg-[#f2f2e8] border #dfdfd4
rounded-[12px] p-[21px] gap-[16px]`, cada um com badge flutuante
`bg-[#4a1be8] rounded-full h-[24px] px-[12px] top-[-12px] left-[20px]`
`Roboto:Bold 12px/16 white` e texto `Roboto:Regular 14px/22.75 #3b3c48`:

- **Agosto**: "Time com 3 meses de operação real. Conhece seu produto, suas objeções, seu cliente. Entra no pico no ritmo."
- **Setembro**: "Time integrado e testado. Chega maduro, com margem para ajuste fino em outubro."
- **Outubro**: "Dá para fazer. Time treinado, contexto ainda em construção. Exige mais do seu lado."
- **Novembro**: "A operação sobe. O aprendizado acontece ao vivo, no dia de maior volume do ano."

Fecho `Roboto:Italic 14px/20 #717386` centrado `max-w-[672px]`: "Não tem prazo para
fechar essa condição. Tem prazo para o time estar pronto, e quem define esse prazo é o
calendário, não a gente."

### Seção 02 — dump verbatim

```jsx
const imgGroup = "https://www.figma.com/api/mcp/asset/5c32f1b6-4844-4abe-80d1-7bfcc389d102.svg";

export default function Identificacao117() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start py-[96px] relative size-full" data-node-id="1:133" data-name="identificacao-117">
      <div className="content-stretch flex items-start px-[272px] relative shrink-0" data-node-id="1:134" data-name="margin-wrap">
        <div className="content-stretch flex flex-col h-[866px] items-start max-w-[896px] px-[24px] relative shrink-0 w-[896px]" data-node-id="1:135" data-name="DIV-118">
          <div className="content-stretch flex items-start pb-[48px] relative shrink-0" data-node-id="1:136" data-name="margin-wrap">
            <div className="content-stretch flex flex-col h-[120px] items-start relative shrink-0 w-[848px]" data-node-id="1:137" data-name="DIV-119">
              <div className="content-stretch flex items-start pb-[16px] relative shrink-0" data-node-id="1:138" data-name="margin-wrap">
                <div className="[word-break:break-word] content-start flex flex-wrap font-['Sora:Bold'] font-bold gap-0 h-[80px] items-start justify-center leading-[0] relative shrink-0 text-[#030304] text-[36px] text-center w-[848px] whitespace-nowrap" data-node-id="1:139" data-name="H2-120">
                  <div className="flex flex-col justify-center relative shrink-0" data-node-id="1:140">
                    <p className="leading-[40px]">Essa conversa é para você que já sabe o que</p>
                  </div>
                  <div className="flex flex-col justify-center relative shrink-0" data-node-id="1:141">
                    <p className="leading-[40px]">vem por aí</p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0 w-[848px]" data-node-id="1:142" data-name="P-124">
                <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#555766] text-[16px] text-center whitespace-nowrap" data-node-id="1:143" style={{ fontVariationSettings: '"wdth" 100' }}>
                  <p className="leading-[24px]">Se você reconhece três dos cenários abaixo, a gente provavelmente tem o que conversar.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col h-[698px] items-start relative shrink-0 w-[848px]" data-node-id="1:144" data-name="DIV-127">
            <div className="bg-[#f2f2e8] border border-[#dfdfd4] border-solid content-stretch flex gap-[16px] h-[90px] items-start p-[21px] relative rounded-[12px] shrink-0 w-[848px]" data-node-id="1:145" data-name="DIV-128">
              <div className="content-stretch flex items-start pt-[2px] relative shrink-0" data-node-id="1:146" data-name="margin-wrap">
                <div className="bg-[#4a1be8] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-node-id="1:147" data-name="DIV-129">
                  <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[14.594px]" data-node-id="1:148" data-name="I-130">
                    <div className="absolute h-[14px] left-0 overflow-clip top-[3px] w-[14.578px]" data-node-id="1:149" data-name="Icon-131">
                      <div className="absolute flex inset-[24.92%_16.08%] items-center justify-center" data-node-id="1:150" style={{ containerType: "size" }}>
                        <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                          <div className="relative size-full" data-name="Group">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-start flex flex-wrap h-[48px] items-start relative shrink-0 w-[758px]" data-node-id="1:152" data-name="P-132">
                <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[48px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#3b3c48] text-[16px] text-ellipsis w-[747.281px]" data-node-id="1:153" style={{ fontVariationSettings: '"wdth" 100' }}>
                  <p className="leading-[24px]">Sua campanha de Black Friday já está desenhada, e seu time comercial é o mesmo de julho. O tráfego vai dobrar. A capacidade de falar com quem chega, não.</p>
                </div>
              </div>
            </div>
            <div className="content-stretch flex items-start pt-[16px] relative shrink-0" data-node-id="1:154" data-name="margin-wrap">
              <div className="bg-[#f2f2e8] border border-[#dfdfd4] border-solid content-stretch flex gap-[16px] h-[90px] items-start p-[21px] relative rounded-[12px] shrink-0 w-[848px]" data-node-id="1:155" data-name="DIV-135">
                <div className="content-stretch flex items-start pt-[2px] relative shrink-0" data-node-id="1:156" data-name="margin-wrap">
                  <div className="bg-[#4a1be8] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-node-id="1:157" data-name="DIV-136">
                    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[14.594px]" data-node-id="1:158" data-name="I-137">
                      <div className="absolute h-[14px] left-0 overflow-clip top-[3px] w-[14.578px]" data-node-id="1:159" data-name="Icon-138">
                        <div className="absolute flex inset-[24.92%_16.08%] items-center justify-center" data-node-id="1:160" style={{ containerType: "size" }}>
                          <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                            <div className="relative size-full" data-name="Group">
                              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-start flex flex-wrap h-[48px] items-start relative shrink-0 w-[758px]" data-node-id="1:162" data-name="P-139">
                  <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[48px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#3b3c48] text-[16px] text-ellipsis w-[745.219px]" data-node-id="1:163" style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[24px]">Você sabe que uma parte do que entrar vai esfriar sem ninguém tocar. Não por falta de interesse do lead. Por falta de quem faça o segundo contato no mesmo dia.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex items-start pt-[16px] relative shrink-0" data-node-id="1:164" data-name="margin-wrap">
              <div className="bg-[#f2f2e8] border border-[#dfdfd4] border-solid content-stretch flex gap-[16px] h-[90px] items-start p-[21px] relative rounded-[12px] shrink-0 w-[848px]" data-node-id="1:165" data-name="DIV-142">
                <div className="content-stretch flex items-start pt-[2px] relative shrink-0" data-node-id="1:166" data-name="margin-wrap">
                  <div className="bg-[#4a1be8] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-node-id="1:167" data-name="DIV-143">
                    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[14.594px]" data-node-id="1:168" data-name="I-144">
                      <div className="absolute h-[14px] left-0 overflow-clip top-[3px] w-[14.578px]" data-node-id="1:169" data-name="Icon-145">
                        <div className="absolute flex inset-[24.92%_16.08%] items-center justify-center" data-node-id="1:170" style={{ containerType: "size" }}>
                          <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                            <div className="relative size-full" data-name="Group">
                              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-start flex flex-wrap h-[48px] items-start relative shrink-0 w-[758px]" data-node-id="1:172" data-name="P-146">
                  <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[48px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#3b3c48] text-[16px] text-ellipsis w-[747.766px]" data-node-id="1:173" style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[24px]">Contratar CLT para três meses de pico não fecha a conta. E contratar freela avulso sempre saiu mais caro por hora do que deveria.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex items-start pt-[16px] relative shrink-0" data-node-id="1:174" data-name="margin-wrap">
              <div className="bg-[#f2f2e8] border border-[#dfdfd4] border-solid content-stretch flex gap-[16px] h-[90px] items-start p-[21px] relative rounded-[12px] shrink-0 w-[848px]" data-node-id="1:175" data-name="DIV-149">
                <div className="content-stretch flex items-start pt-[2px] relative shrink-0" data-node-id="1:176" data-name="margin-wrap">
                  <div className="bg-[#4a1be8] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-node-id="1:177" data-name="DIV-150">
                    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[14.594px]" data-node-id="1:178" data-name="I-151">
                      <div className="absolute h-[14px] left-0 overflow-clip top-[3px] w-[14.578px]" data-node-id="1:179" data-name="Icon-152">
                        <div className="absolute flex inset-[24.92%_16.08%] items-center justify-center" data-node-id="1:180" style={{ containerType: "size" }}>
                          <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                            <div className="relative size-full" data-name="Group">
                              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-start flex flex-wrap h-[48px] items-start relative shrink-0 w-[758px]" data-node-id="1:182" data-name="P-153">
                  <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[48px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#3b3c48] text-[16px] text-ellipsis w-[751.406px]" data-node-id="1:183" style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[24px]">{`Você já viu o que acontece em dezembro. A venda foi boa, e aí chega troca, devolução, "cadê meu pedido", e o time de vendas vira suporte no improviso.`}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex items-start pt-[16px] relative shrink-0" data-node-id="1:184" data-name="margin-wrap">
              <div className="bg-[#f2f2e8] border border-[#dfdfd4] border-solid content-stretch flex gap-[16px] h-[90px] items-start p-[21px] relative rounded-[12px] shrink-0 w-[848px]" data-node-id="1:185" data-name="DIV-156">
                <div className="content-stretch flex items-start pt-[2px] relative shrink-0" data-node-id="1:186" data-name="margin-wrap">
                  <div className="bg-[#4a1be8] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-node-id="1:187" data-name="DIV-157">
                    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[14.594px]" data-node-id="1:188" data-name="I-158">
                      <div className="absolute h-[14px] left-0 overflow-clip top-[3px] w-[14.578px]" data-node-id="1:189" data-name="Icon-159">
                        <div className="absolute flex inset-[24.92%_16.08%] items-center justify-center" data-node-id="1:190" style={{ containerType: "size" }}>
                          <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                            <div className="relative size-full" data-name="Group">
                              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-start flex flex-wrap h-[48px] items-start relative shrink-0 w-[758px]" data-node-id="1:192" data-name="P-160">
                  <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[48px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#3b3c48] text-[16px] text-ellipsis w-[740.344px]" data-node-id="1:193" style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[24px]">Seu SDR atual não passa do decisor. Abordagem que parece spam, script decorado, follow-up que morre no terceiro dia.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex items-start pt-[16px] relative shrink-0" data-node-id="1:194" data-name="margin-wrap">
              <div className="bg-[#f2f2e8] border border-[#dfdfd4] border-solid content-stretch flex gap-[16px] h-[76px] items-start p-[21px] relative rounded-[12px] shrink-0 w-[848px]" data-node-id="1:195" data-name="DIV-163">
                <div className="content-stretch flex items-start pt-[2px] relative shrink-0" data-node-id="1:196" data-name="margin-wrap">
                  <div className="bg-[#4a1be8] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-node-id="1:197" data-name="DIV-164">
                    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[14.594px]" data-node-id="1:198" data-name="I-165">
                      <div className="absolute h-[14px] left-0 overflow-clip top-[3px] w-[14.578px]" data-node-id="1:199" data-name="Icon-166">
                        <div className="absolute flex inset-[24.92%_16.08%] items-center justify-center" data-node-id="1:200" style={{ containerType: "size" }}>
                          <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                            <div className="relative size-full" data-name="Group">
                              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex h-[24px] items-center relative shrink-0 w-[659.984px]" data-node-id="1:202" data-name="P-167">
                  <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#3b3c48] text-[16px] whitespace-nowrap" data-node-id="1:203" style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[24px]">Você não quer terceirizar para receber operador que lê roteiro. Já testou isso. Não funcionou.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex items-start pt-[16px] relative shrink-0" data-node-id="1:204" data-name="margin-wrap">
              <div className="bg-[#f2f2e8] border border-[#dfdfd4] border-solid content-stretch flex gap-[16px] h-[76px] items-start p-[21px] relative rounded-[12px] shrink-0 w-[848px]" data-node-id="1:205" data-name="DIV-170">
                <div className="content-stretch flex items-start pt-[2px] relative shrink-0" data-node-id="1:206" data-name="margin-wrap">
                  <div className="bg-[#4a1be8] content-stretch flex items-center justify-center relative rounded-[9999px] shrink-0 size-[32px]" data-node-id="1:207" data-name="DIV-171">
                    <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[14.594px]" data-node-id="1:208" data-name="I-172">
                      <div className="absolute h-[14px] left-0 overflow-clip top-[3px] w-[14.578px]" data-node-id="1:209" data-name="Icon-173">
                        <div className="absolute flex inset-[24.92%_16.08%] items-center justify-center" data-node-id="1:210" style={{ containerType: "size" }}>
                          <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                            <div className="relative size-full" data-name="Group">
                              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex h-[24px] items-center relative shrink-0 w-[664.656px]" data-node-id="1:212" data-name="P-174">
                  <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[#3b3c48] text-[16px] whitespace-nowrap" data-node-id="1:213" style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[24px]">Você quer resolver isso agora, em agosto, e não descobrir em novembro que não dava tempo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Seção 03 — dump verbatim

```jsx
const imgGroup = "https://www.figma.com/api/mcp/asset/e8afbaf4-f870-45f1-8cb2-93a76411444c.svg";

export default function Oferta177() {
  return (
    <div className="bg-[#4a1be8] content-stretch flex flex-col items-start py-[96px] relative size-full" data-node-id="1:214" data-name="oferta-177">
      <div className="content-stretch flex items-start px-[272px] relative shrink-0" data-node-id="1:215" data-name="margin-wrap">
        <div className="content-stretch flex flex-col h-[574px] items-start max-w-[896px] px-[24px] relative shrink-0 w-[896px]" data-node-id="1:216" data-name="DIV-178">
          <div className="content-stretch flex items-start pb-[40px] relative shrink-0" data-node-id="1:217" data-name="margin-wrap">
            <div className="content-stretch flex flex-col h-[490px] items-start relative shrink-0 w-[848px]" data-node-id="1:218" data-name="DIV-179">
              <div className="content-stretch flex items-start pb-[24px] relative shrink-0" data-node-id="1:219" data-name="margin-wrap">
                <div className="[word-break:break-word] content-start flex flex-wrap font-['Sora:Bold'] font-bold gap-0 h-[80px] items-start justify-center leading-[0] relative shrink-0 text-[36px] text-center text-white w-[848px] whitespace-nowrap" data-node-id="1:220" data-name="H2-180">
                  <div className="flex flex-col justify-center relative shrink-0" data-node-id="1:221">
                    <p className="leading-[40px]">A gente não vai te dar desconto de Black</p>
                  </div>
                  <div className="flex flex-col justify-center relative shrink-0" data-node-id="1:222">
                    <p className="leading-[40px]">Friday</p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex items-start px-[40px] relative shrink-0" data-node-id="1:223" data-name="margin-wrap">
                <div className="content-stretch flex flex-col h-[386px] items-start max-w-[768px] relative shrink-0 w-[768px]" data-node-id="1:224" data-name="DIV-184">
                  <div className="content-start flex flex-wrap h-[48px] items-start relative shrink-0 w-[768px]" data-node-id="1:225" data-name="P-185">
                    <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[48px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[16px] text-[rgba(255,255,255,0.9)] text-ellipsis w-[768px]" data-node-id="1:226" style={{ fontVariationSettings: '"wdth" 100' }}>
                      <p className="leading-[24px]">Desconto percentual é o que todo mundo faz em novembro. E normalmente é só o preço de tabela inflado voltando ao normal.</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start pt-[16px] relative shrink-0" data-node-id="1:227" data-name="margin-wrap">
                    <div className="content-stretch flex h-[24px] items-center relative shrink-0 w-[768px]" data-node-id="1:228" data-name="P-188">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal justify-center leading-[0] relative shrink-0 text-[16px] text-[rgba(255,255,255,0.9)] whitespace-nowrap" data-node-id="1:229" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[24px]">A nossa condição é outra, e é mais útil para você:</p>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start pt-[16px] relative shrink-0" data-node-id="1:230" data-name="margin-wrap">
                    <div className="bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.2)] border-solid content-stretch flex flex-col h-[106px] items-start p-[25px] relative rounded-[12px] shrink-0 w-[768px]" data-node-id="1:231" data-name="DIV-191">
                      <div className="content-start flex flex-wrap h-[56px] items-start relative shrink-0 w-[718px]" data-node-id="1:232" data-name="P-192">
                        <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold h-[56px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[18px] text-ellipsis text-white w-[670.172px]" data-node-id="1:233" style={{ fontVariationSettings: '"wdth" 100' }}>
                          <p className="leading-[28px]">Quem fecha para a Black Friday paga o mesmo valor/hora de quem assina contrato recorrente. Sem o contrato recorrente.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start pt-[16px] relative shrink-0" data-node-id="1:234" data-name="margin-wrap">
                    <div className="content-start flex flex-wrap h-[72px] items-start relative shrink-0 w-[768px]" data-node-id="1:235" data-name="P-195">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[72px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[16px] text-[rgba(255,255,255,0.9)] text-ellipsis w-[768px]" data-node-id="1:236" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[24px]">Traduzindo: você monta o time só para a temporada, pré-vendas, atendimento ou os dois, e não paga o adicional que normalmente se cobra por operação temporária. Sem fidelidade longa. Sem multa para reduzir depois do pico.</p>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start pt-[16px] relative shrink-0" data-node-id="1:237" data-name="margin-wrap">
                    <div className="content-start flex flex-wrap h-[72px] items-start relative shrink-0 w-[768px]" data-node-id="1:238" data-name="P-198">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[72px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[16px] text-[rgba(255,255,255,0.9)] text-ellipsis w-[768px]" data-node-id="1:239" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[24px]">Por que a gente faz isso: porque na maioria das vezes o time que entrou para a Black Friday continua depois. Não porque tem cláusula prendendo, mas porque a operação passou a funcionar melhor com ele. A gente prefere apostar nisso a te prender em papel.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex h-[44px] items-start justify-center relative shrink-0 w-[848px]" data-node-id="1:240" data-name="DIV-201">
            <div className="bg-white content-stretch flex gap-[8px] h-[44px] items-center px-[32px] py-[12px] relative rounded-[9999px] shrink-0 w-[277.859px]" data-node-id="1:241" data-name="A-202">
              <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#4013cc] text-[14px] text-center whitespace-nowrap" data-node-id="1:242" style={{ fontVariationSettings: '"wdth" 100' }}>
                <p className="leading-[20px]">Quero entender essa condição</p>
              </div>
              <div className="content-stretch flex h-[20px] items-center justify-center relative shrink-0 w-[14.594px]" data-node-id="1:243" data-name="I-205">
                <div className="absolute h-[14px] left-[0.01px] overflow-clip top-[3px] w-[14.578px]" data-node-id="1:244" data-name="Icon-206">
                  <div className="absolute flex inset-[16.67%_18.88%] items-center justify-center" data-node-id="1:245" style={{ containerType: "size" }}>
                    <div className="-rotate-180 -scale-x-100 flex-none h-[100cqh] w-[100cqw]">
                      <div className="relative size-full" data-name="Group">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Seção 04 — dump verbatim

```jsx
export default function Urgencia207() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start py-[96px] relative size-full" data-node-id="1:247" data-name="urgencia-207">
      <div className="content-stretch flex items-start px-[208px] relative shrink-0" data-node-id="1:248" data-name="margin-wrap">
        <div className="content-stretch flex flex-col h-[661px] items-start max-w-[1024px] px-[24px] relative shrink-0 w-[1024px]" data-node-id="1:249" data-name="DIV-208">
          <div className="content-stretch flex items-start pb-[40px] relative shrink-0" data-node-id="1:250" data-name="margin-wrap">
            <div className="content-stretch flex flex-col h-[344px] items-start relative shrink-0 w-[976px]" data-node-id="1:251" data-name="DIV-209">
              <div className="content-stretch flex items-start pb-[24px] relative shrink-0" data-node-id="1:252" data-name="margin-wrap">
                <div className="[word-break:break-word] content-start flex flex-wrap font-['Sora:Bold'] font-bold gap-0 h-[80px] items-start justify-center leading-[0] relative shrink-0 text-[#030304] text-[36px] text-center w-[976px] whitespace-nowrap" data-node-id="1:253" data-name="H2-210">
                  <div className="flex flex-col justify-center relative shrink-0" data-node-id="1:254">
                    <p className="leading-[40px]">A gente sobe sua operação em 24 horas. O que não</p>
                  </div>
                  <div className="flex flex-col justify-center relative shrink-0" data-node-id="1:255">
                    <p className="leading-[40px]">cabe em 24 horas é o resto.</p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex items-start px-[104px] relative shrink-0" data-node-id="1:256" data-name="margin-wrap">
                <div className="content-stretch flex flex-col h-[240px] items-start max-w-[768px] relative shrink-0 w-[768px]" data-node-id="1:257" data-name="DIV-214">
                  <div className="content-start flex flex-wrap h-[48px] items-start relative shrink-0 w-[768px]" data-node-id="1:258" data-name="P-215">
                    <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[48px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#555766] text-[16px] text-ellipsis w-[768px]" data-node-id="1:259" style={{ fontVariationSettings: '"wdth" 100' }}>
                      <p className="leading-[24px]">Isso não é modéstia falsa. A Scooto realmente coloca um time em campo em um dia útil, ferramentas conectadas, pessoas alocadas, primeiro contato saindo.</p>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start pt-[16px] relative shrink-0" data-node-id="1:260" data-name="margin-wrap">
                    <div className="content-start flex flex-wrap h-[72px] items-start relative shrink-0 w-[768px]" data-node-id="1:261" data-name="P-218">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[72px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#555766] text-[16px] text-ellipsis w-[768px]" data-node-id="1:262" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[24px]">O que não se comprime é o que vem depois: seu catálogo, sua política de frete, suas exceções, as três objeções que só aparecem quando o cliente já ouviu o preço. Isso é curva de contexto, e ela leva algumas semanas, não algumas horas.</p>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start pt-[16px] relative shrink-0" data-node-id="1:263" data-name="margin-wrap">
                    <div className="content-start flex flex-wrap h-[48px] items-start relative shrink-0 w-[768px]" data-node-id="1:264" data-name="P-221">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[48px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#555766] text-[16px] text-ellipsis w-[768px]" data-node-id="1:265" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[24px]">Quem começa em agosto chega em novembro com o time já calejado. Quem começa em novembro está treinando durante o pico.</p>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start pt-[16px] relative shrink-0" data-node-id="1:266" data-name="margin-wrap">
                    <div className="content-stretch flex h-[24px] items-center relative shrink-0 w-[768px]" data-node-id="1:267" data-name="P-224">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#22232b] text-[16px] whitespace-nowrap" data-node-id="1:268" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[24px]">E o pico é a única parte disso que não negocia data.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-start pb-[40px] relative shrink-0" data-node-id="1:269" data-name="margin-wrap">
            <div className="content-stretch flex flex-col h-[197px] items-start relative shrink-0 w-[976px]" data-node-id="1:270" data-name="DIV-227">
              <div className="content-stretch flex items-start pb-[24px] relative shrink-0" data-node-id="1:271" data-name="margin-wrap">
                <div className="content-stretch flex h-[28px] items-center justify-center relative shrink-0 w-[976px]" data-node-id="1:272" data-name="H3-228">
                  <div className="[word-break:break-word] flex flex-col font-['Sora:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#22232b] text-[20px] text-center whitespace-nowrap" data-node-id="1:273">
                    <p className="leading-[28px]">Quando você começa → O que acontece na Black Friday</p>
                  </div>
                </div>
              </div>
              <div className="content-start flex flex-wrap gap-[16px] h-[145px] items-start relative shrink-0 w-[976px]" data-node-id="1:274" data-name="DIV-231">
                <div className="bg-[#f2f2e8] border border-[#dfdfd4] border-solid content-stretch flex flex-col h-[145px] items-start p-[21px] relative rounded-[12px] shrink-0 w-[232px]" data-node-id="1:275" data-name="DIV-232">
                  <div className="content-stretch flex items-start pt-[12px] relative shrink-0" data-node-id="1:276" data-name="margin-wrap">
                    <div className="content-start flex flex-wrap h-[91px] items-start relative shrink-0 w-[190px]" data-node-id="1:277" data-name="P-233">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[91px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#3b3c48] text-[14px] text-ellipsis w-[189.234px]" data-node-id="1:278" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[22.75px]">Time com 3 meses de operação real. Conhece seu produto, suas objeções, seu cliente. Entra no pico no ritmo.</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bg-[#4a1be8] content-stretch flex h-[24px] items-center left-[20px] px-[12px] py-[4px] rounded-[9999px] top-[-12px] w-[62.547px]" data-node-id="1:279" data-name="DIV-236">
                    <div className="[word-break:break-word] flex flex-col font-['Roboto:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="1:280" style={{ fontVariationSettings: '"wdth" 100' }}>
                      <p className="leading-[16px]">Agosto</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#f2f2e8] border border-[#dfdfd4] border-solid content-stretch flex flex-col h-[145px] items-start p-[21px] relative rounded-[12px] shrink-0 w-[232px]" data-node-id="1:281" data-name="DIV-239">
                  <div className="content-stretch flex items-start pt-[12px] relative shrink-0" data-node-id="1:282" data-name="margin-wrap">
                    <div className="content-start flex flex-wrap h-[68.25px] items-start relative shrink-0 w-[190px]" data-node-id="1:283" data-name="P-240">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[68.25px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#3b3c48] text-[14px] text-ellipsis w-[180.563px]" data-node-id="1:284" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[22.75px]">Time integrado e testado. Chega maduro, com margem para ajuste fino em outubro.</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bg-[#4a1be8] content-stretch flex h-[24px] items-center left-[20px] px-[12px] py-[4px] rounded-[9999px] top-[-12px] w-[76.5px]" data-node-id="1:285" data-name="DIV-243">
                    <div className="[word-break:break-word] flex flex-col font-['Roboto:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="1:286" style={{ fontVariationSettings: '"wdth" 100' }}>
                      <p className="leading-[16px]">Setembro</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#f2f2e8] border border-[#dfdfd4] border-solid content-stretch flex flex-col h-[145px] items-start p-[21px] relative rounded-[12px] shrink-0 w-[232px]" data-node-id="1:287" data-name="DIV-246">
                  <div className="content-stretch flex items-start pt-[12px] relative shrink-0" data-node-id="1:288" data-name="margin-wrap">
                    <div className="content-start flex flex-wrap h-[91px] items-start relative shrink-0 w-[190px]" data-node-id="1:289" data-name="P-247">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[91px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#3b3c48] text-[14px] text-ellipsis w-[177.641px]" data-node-id="1:290" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[22.75px]">Dá para fazer. Time treinado, contexto ainda em construção. Exige mais do seu lado.</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bg-[#4a1be8] content-stretch flex h-[24px] items-center left-[20px] px-[12px] py-[4px] rounded-[9999px] top-[-12px] w-[67.484px]" data-node-id="1:291" data-name="DIV-250">
                    <div className="[word-break:break-word] flex flex-col font-['Roboto:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="1:292" style={{ fontVariationSettings: '"wdth" 100' }}>
                      <p className="leading-[16px]">Outubro</p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#f2f2e8] border border-[#dfdfd4] border-solid content-stretch flex flex-col h-[145px] items-start p-[21px] relative rounded-[12px] shrink-0 w-[232px]" data-node-id="1:293" data-name="DIV-253">
                  <div className="content-stretch flex items-start pt-[12px] relative shrink-0" data-node-id="1:294" data-name="margin-wrap">
                    <div className="content-start flex flex-wrap h-[91px] items-start relative shrink-0 w-[190px]" data-node-id="1:295" data-name="P-254">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[91px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#3b3c48] text-[14px] text-ellipsis w-[187.922px]" data-node-id="1:296" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[22.75px]">A operação sobe. O aprendizado acontece ao vivo, no dia de maior volume do ano.</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bg-[#4a1be8] content-stretch flex h-[24px] items-center left-[20px] px-[12px] py-[4px] rounded-[9999px] top-[-12px] w-[79.75px]" data-node-id="1:297" data-name="DIV-257">
                    <div className="[word-break:break-word] flex flex-col font-['Roboto:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[12px] text-white whitespace-nowrap" data-node-id="1:298" style={{ fontVariationSettings: '"wdth" 100' }}>
                      <p className="leading-[16px]">Novembro</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-start px-[152px] relative shrink-0" data-node-id="1:299" data-name="margin-wrap">
            <div className="[word-break:break-word] content-start flex flex-wrap font-['Roboto:Italic'] font-normal gap-0 h-[40px] italic items-start justify-center leading-[0] max-w-[672px] relative shrink-0 text-[#717386] text-[14px] text-center w-[672px] whitespace-nowrap" data-node-id="1:300" data-name="P-260">
              <div className="flex flex-col justify-center relative shrink-0" data-node-id="1:301" style={{ fontVariationSettings: '"wdth" 100' }}>
                <p className="leading-[20px]">Não tem prazo para fechar essa condição. Tem prazo para o time estar pronto, e quem define esse prazo é o</p>
              </div>
              <div className="flex flex-col justify-center relative shrink-0" data-node-id="1:302" style={{ fontVariationSettings: '"wdth" 100' }}>
                <p className="leading-[20px]">calendário, não a gente.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Seção 05 — contratacao (1:303) · get_design_context verbatim

```jsx
const imgGroup = "https://www.figma.com/api/mcp/asset/6469bfb5-821e-4c8e-bf07-f24f908ac47b.svg";
const imgGroup1 = "https://www.figma.com/api/mcp/asset/d8b93f93-5dd9-451f-9ff6-0096e5cac5ba.svg";

export default function Contratacao264() {
  return (
    <div className="bg-[#f2f2e8] content-stretch flex flex-col items-start py-[96px] relative size-full" data-node-id="1:303" data-name="contratacao-264">
      <div className="content-stretch flex items-start px-[144px] relative shrink-0" data-node-id="1:304" data-name="margin-wrap">
        <div className="content-stretch flex flex-col h-[662px] items-start max-w-[1152px] px-[24px] relative shrink-0 w-[1152px]" data-node-id="1:305" data-name="DIV-265">
          <div className="content-stretch flex items-start pb-[48px] relative shrink-0" data-node-id="1:306" data-name="margin-wrap">
            <div className="content-stretch flex flex-col h-[40px] items-start relative shrink-0 w-[1104px]" data-node-id="1:307" data-name="DIV-266">
              <div className="content-stretch flex items-start pb-[16px] relative shrink-0" data-node-id="1:308" data-name="margin-wrap">
                <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-[1104px]" data-node-id="1:309" data-name="H2-267">
                  <div className="[word-break:break-word] flex flex-col font-['Sora:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#030304] text-[36px] text-center whitespace-nowrap" data-node-id="1:310">
                    <p className="leading-[40px]">Duas frentes. Você escolhe uma ou as duas.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-start flex flex-wrap gap-[24px] h-[490px] items-start relative shrink-0 w-[1104px]" data-node-id="1:311" data-name="DIV-270">
            <div className="bg-white border border-[#c6cfff] border-solid content-stretch flex flex-col h-[490px] items-start p-[33px] relative rounded-[16px] shrink-0 w-[540px]" data-node-id="1:312" data-name="DIV-271">
              <div className="content-stretch flex items-start py-[16px] relative shrink-0" data-node-id="1:313" data-name="margin-wrap">
                <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[474px]" data-node-id="1:314" data-name="P-272">
                  <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[#4013cc] text-[14px] whitespace-nowrap" data-node-id="1:315" style={{ fontVariationSettings: '"wdth" 100' }}>
                    <p className="leading-[20px]">Para capturar o volume que a Black Friday gera.</p>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col h-[328px] items-start relative shrink-0 w-[474px]" data-node-id="1:316" data-name="DIV-275">
                [4 itens com disco #4a1be8 size-24 + check branco 12px, texto Roboto:Regular 14px/20 #3b3c48, pt-16 entre itens — TEXTOS ABAIXO]
              </div>
            </div>
            [CARD 2: bg-white border #ffc8ac rounded-16 p-33 w-540 — badge pill #ff6000 "FRENTE 2, ATENDIMENTO E SUPORTE" (Roboto:Bold 12 white, ícone 12px), sub "Para segurar o que a venda gera." (Roboto:SemiBold 14 #df5200), 5 itens com disco #ff6000 size-24 + check, caixa final bg #fff1eb border #ffe1d2 rounded-8 p-13 com texto Roboto:Italic 12/16 #b74508 — TEXTOS ABAIXO]
          </div>
          <div className="content-stretch flex items-start pt-[40px] relative shrink-0" data-node-id="1:431" data-name="margin-wrap">
            <div className="content-stretch flex h-[44px] items-start justify-center relative shrink-0 w-[1104px]" data-node-id="1:432" data-name="DIV-360">
              <div className="bg-[#4a1be8] content-stretch flex h-[44px] items-center px-[32px] py-[12px] relative rounded-[9999px] shrink-0 w-[247.75px]" data-node-id="1:433" data-name="A-361">
                <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold justify-center leading-[0] relative shrink-0 text-[14px] text-center text-white whitespace-nowrap" data-node-id="1:434" style={{ fontVariationSettings: '"wdth" 100' }}>
                  <p className="leading-[20px]">Quero avaliar as duas frentes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**ATENÇÃO — o dump acima está ABREVIADO nos 2 cards (estrutura repetitiva de itens).
Estrutura de cada item: `flex gap-[12px]`, disco `size-[24px] rounded-full` na cor da
frente + ícone check branco 12px, texto ao lado. Os textos literais COMPLETOS:**

Card 1 (borda `#c6cfff`, sub-título `#4013cc` "Para capturar o volume que a Black
Friday gera.") — 4 itens (alturas 80/80/60/60):
1. "Scooteiras treinadas em conversa, não em script. Elas estudam seu produto, sua concorrência e suas objeções antes do primeiro contato. Quem atende sabe do que está falando, e o decisor percebe isso nos primeiros trinta segundos."
2. "Follow-up que não morre no segundo dia. Cadência definida, registrada no seu CRM, com quem ficou parado sendo retomado. O lead que esfria por esquecimento é o mais caro que existe: você já pagou por ele."
3. "Diagnóstico do não, não só o número do não. Cada interação vira informação. Você não recebe só a taxa de conversão, recebe por que o lead não avançou, o que travou, o que se repetiu."
4. "Ajuste durante a operação. Se a abordagem não estiver funcionando, a gente avisa e muda. Não espera o fechamento do mês para reportar o que já dava para ver na segunda semana."

**Nota:** o card 1 NÃO tem badge no dump (só o card 2 tem) — no screenshot
`secao-05-contratacao.png` confira se existe badge "FRENTE 1" visível; o dump mostra
apenas o sub-título. (O badge do card 2 é explícito: "FRENTE 2, ATENDIMENTO E SUPORTE".)

Card 2 (borda `#ffc8ac`, badge `#ff6000` + ícone, sub `#df5200` "Para segurar o que a
venda gera.") — **6 itens** (primeiro com 2 linhas h-40, demais 1 linha h-26; o item 6
tinha caído do extrato e foi recuperado pelo screenshot `secao-05-contratacao.png` —
correção de 2026-09-01, achado da track B):
1. "Pico de venda vira pico de dúvida antes, e pico de troca, devolução e rastreio depois. É a mesma onda, atrasada em algumas semanas."
2. "Atendimento humano nos seus canais, WhatsApp, e-mail, chat, redes"
3. "Time que resolve, não que encaminha"
4. "Escala de 5 a 50 posições conforme o volume real"
5. "Cobertura estendida nos dias críticos"
6. "Relatório diário de CSAT, NPS e volume"
7. Caixa final (bg `#fff1eb`, borda `#ffe1d2`, `rounded-[8px] p-[13px]`, Roboto Italic 12/16 `#b74508`): "Uma observação honesta: a maioria das empresas contrata a frente de vendas primeiro e descobre a de atendimento em dezembro, no susto. Se você já viu esse filme, vale conversar sobre as duas agora."

CTA final centrado: pill `bg-[#4a1be8] rounded-full h-[44px] px-[32px]`,
`Roboto:SemiBold 14/20 white`: "Quero avaliar as duas frentes" — **é `<a>` (A-361)** →
`href="#lpb-form"`.

---

## Seção 06 — autoridade (1:435) · get_design_context verbatim

```jsx
const imgImg383 = "https://www.figma.com/api/mcp/asset/9d581d36-48f9-4122-bb39-f098e7892aad.png";

export default function Autoridade364() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start py-[96px] relative size-full" data-node-id="1:435" data-name="autoridade-364">
      <div className="content-stretch flex items-start px-[208px] relative shrink-0" data-node-id="1:436" data-name="margin-wrap">
        <div className="content-stretch flex flex-col h-[548px] items-start max-w-[1024px] px-[24px] relative shrink-0 w-[1024px]" data-node-id="1:437" data-name="DIV-365">
          <div className="content-stretch flex items-start pb-[40px] relative shrink-0" data-node-id="1:438" data-name="margin-wrap">
            <div className="content-stretch flex flex-col h-[40px] items-start relative shrink-0 w-[976px]" data-node-id="1:439" data-name="DIV-366">
              <div className="content-stretch flex items-start pb-[16px] relative shrink-0" data-node-id="1:440" data-name="margin-wrap">
                <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-[976px]" data-node-id="1:441" data-name="H2-367">
                  <div className="[word-break:break-word] flex flex-col font-['Sora:Bold'] font-bold justify-center leading-[0] relative shrink-0 text-[#030304] text-[36px] text-center whitespace-nowrap" data-node-id="1:442">
                    <p className="leading-[40px]">Quem está do outro lado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-start pb-[40px] relative shrink-0" data-node-id="1:443" data-name="margin-wrap">
            <div className="content-center flex flex-wrap gap-[32px] h-[320px] items-center relative shrink-0 w-[976px]" data-node-id="1:444" data-name="DIV-370">
              <div className="content-stretch flex flex-col h-[320px] items-start relative shrink-0 w-[472px]" data-node-id="1:445" data-name="grid-wrap-371">
                <div className="content-stretch flex flex-col h-[248px] items-start relative shrink-0 w-[472px]" data-node-id="1:446" data-name="DIV-372">
                  <div className="content-stretch flex items-start pb-[16px] relative shrink-0" data-node-id="1:447" data-name="margin-wrap">
                    <div className="content-start flex flex-wrap h-[96px] items-start relative shrink-0 w-[472px]" data-node-id="1:448" data-name="P-373">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[96px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#3b3c48] text-[16px] text-ellipsis w-[472px]" data-node-id="1:449" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[24px]">A Scooto é uma central de atendimento e pré-vendas 100% remota e 100% feminina. Não é call center, não tem cronômetro de banheiro, não tem parede de script, não tem operador medido por tempo de chamada.</p>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex items-start pb-[16px] relative shrink-0" data-node-id="1:450" data-name="margin-wrap">
                    <div className="content-start flex flex-wrap h-[72px] items-start relative shrink-0 w-[472px]" data-node-id="1:451" data-name="P-376">
                      <div className="[word-break:break-word] flex flex-col font-['Roboto:Regular'] font-normal h-[72px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#3b3c48] text-[16px] text-ellipsis w-[472px]" data-node-id="1:452" style={{ fontVariationSettings: '"wdth" 100' }}>
                        <p className="leading-[24px]">O modelo é o inverso: gente qualificada, com autonomia para resolver, apoiada por tecnologia que serve à conversa em vez de substituí-la.</p>
                      </div>
                    </div>
                  </div>
                  <div className="content-start flex flex-wrap h-[48px] items-start relative shrink-0 w-[472px]" data-node-id="1:453" data-name="P-379">
                    <div className="[word-break:break-word] flex flex-col font-['Roboto:SemiBold'] font-semibold h-[48px] justify-center leading-[0] overflow-hidden relative shrink-0 text-[#3b3c48] text-[16px] text-ellipsis w-[472px]" data-node-id="1:454" style={{ fontVariationSettings: '"wdth" 100' }}>
                      <p className="leading-[24px]">Mais de 150 empresas operam com a gente. Entre elas XP, Cora, Boca Rosa e Indústria da Beleza.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col h-[320px] items-start overflow-clip relative rounded-[16px] shrink-0 w-[472px]" data-node-id="1:455" data-name="DIV-382">
                <div className="h-[334px] max-w-[472px] relative shrink-0 w-full" data-node-id="1:456" data-name="IMG-383">
                  <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImg383} />
                </div>
              </div>
            </div>
          </div>
          <div className="content-start flex flex-wrap gap-[24px] h-[108px] items-start relative shrink-0 w-[976px]" data-node-id="1:457" data-name="DIV-384">
            <div className="bg-[#6b5cff] content-stretch drop-shadow-[8px_8px_0px_#4a3fdb] flex flex-col h-[108px] items-start p-[24px] relative rounded-[16px] shrink-0 w-[226px]" data-node-id="1:458" data-name="DIV-385">
              [P: Sora:Bold 30/36 white centrado "100%" + sub Roboto:Regular 14/20 white opacity-90 "Remoto"]
            </div>
            <div className="bg-[#ff7a1a] content-stretch drop-shadow-[8px_8px_0px_#6b5cff] flex flex-col h-[108px] items-start p-[24px] relative rounded-[16px] shrink-0 w-[226px]" data-node-id="1:464" data-name="DIV-392">
              ["100%" + "Impacto social"]
            </div>
            <div className="bg-[#f12d64] content-stretch drop-shadow-[8px_8px_0px_#6b5cff] flex flex-col h-[108px] items-start p-[24px] relative rounded-[16px] shrink-0 w-[226px]" data-node-id="1:470" data-name="DIV-399">
              ["150+" + "Scooteiras"]
            </div>
            <div className="bg-[#1e1b4b] content-stretch drop-shadow-[8px_8px_0px_#f12d64] flex flex-col h-[108px] items-start p-[24px] relative rounded-[16px] shrink-0 w-[226px]" data-node-id="1:476" data-name="DIV-406">
              ["300+" + "Operações"]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Nota dos 4 cards de métrica** (estrutura idêntica, só cor/sombra/texto mudam):
`w-[226px] h-[108px] rounded-[16px] p-[24px]`, número `Sora:Bold 30px/36` branco
centrado, rótulo `Roboto:Regular 14px/20` branco `opacity-90`, `gap-[24px]` entre
cards. Sombra DURA deslocada (não borrada): `drop-shadow(8px 8px 0px <cor>)`.
Pares cor-de-fundo → cor-da-sombra: `#6b5cff→#4a3fdb` · `#ff7a1a→#6b5cff` ·
`#f12d64→#6b5cff` · `#1e1b4b→#f12d64`.
Foto: `IMG-383` (binário em assets/), moldura `rounded-[16px] overflow-clip`
472×320 (img interna 334 de altura, object-cover).

---

## Seção 07 — prova-social (1:482) · get_design_context (estrutura + textos completos)

Constantes do dump: `imgImg504` (PNG, logo XP), `imgImg506` (PNG, logo Boca Rosa),
`imgCoraLogo1` (SVG, logo Cora), `imgGroup` (SVG estrela), `imgGroup1/2/3` (SVG persona
dos avatares). Binários em `../assets/`.

Seção `bg-[#f2f2e8] py-[96px]`, coluna `max-w-[1152px]` (container 1104).
H2 `Sora:Bold 36px/40 #030304` centrado: "Depoimentos Scooto".

**3 cards de depoimento** `w-[352px] h-[237px] bg-white border #dfdfd4 rounded-[12px]
p-[25px] gap-[24px]`:
- Topo: 5 estrelas (ícone SVG 14px, `gap-[4px]`).
- Texto `Roboto:Regular 14px/22.75 #3b3c48` (h 91px).
- Rodapé: avatar disco 40px (fundos `#e5e9ff` / `#ffe1d2` / `#ffdee2`, ícone persona
  ~18px) + nome `Roboto:SemiBold 14/20 #111116` + cargo `Roboto:Regular 12/16 #717386`.

Card 1: "Na Black Friday, escalamos de 5 para 50 atendentes em 48 horas. Sem caos, sem qualidade ruim. A Scooto entregou exatamente o que promete: profissionalismo em escala." — **C. M.** · "Head de Operações | Banco XP"
Card 2: "Antes da Scooto, meu suporte era um gargalo. Agora é um ativo. O time não apenas resolve problemas, traz ideias. É consultoria, não call center." — **M. S.** · "Diretora de CX | Boca Rosa"
Card 3: "O que diferencia a Scooto é que eles entendem meu negócio. Não é um fornecedor que segue script. É um parceiro que conhece meu produto, meus clientes, meus desafios." — **J. C.** · "VP de Vendas"

**Faixa de logos** (full-bleed dentro da coluna, `bg-[#c8c8c8] h-[116px]
py-[40px]`, conteúdo centrado `gap-[64px]`):
logo XP (`imgImg504`, 165×36) · logo Cora (`imgCoraLogo1` SVG, 139×36) · logo Boca
Rosa (`imgImg506`, 165×78) · texto `Sora:Regular 18px/28 tracking-[1.8px] white`:
"INDÚSTRIA DA BELEZA".
⚠ `Sora:Regular` (peso 400) só aparece AQUI — o @import precisa incluir wght 400.

---

## Seção 08 — como-funciona (1:615) · get_design_context (estrutura + textos completos)

Constante: `imgGroup` (SVG seta →, aparece entre os cards 1→2 e 2→3, 25×24px,
posicionada `left-[296.33px] top-[154.88px]` de cada card — meio da borda direita).

Seção `bg-white py-[96px]`, coluna `max-w-[1024px]` (container 976).
H2 `Sora:Bold 36px/40 #030304` centrado: "Três passos, sem mistério".

**3 cards-passo** `w-[309.33px] h-[309.75px] rounded-[12px] p-[32px] gap-[24px]`,
sombra dura `drop-shadow(8px 8px 0px <cor>)`, disco branco 48px com o número
(`Sora:Bold 20/28`, na cor da sombra do card 1 / `#6b5cff` no 2 / `#ff7a1a` no 3),
título `Sora:Bold 18px/28 white`, corpo `Roboto:Regular 14px/22.75
rgba(255,255,255,0.9)`:

1. bg `#6b5cff`, sombra `#4a3fdb`, número "1" em `#4a3fdb` — **"Você preenche o formulário"**: "Leva menos de um minuto. Sem agenda travada, sem funil de qualificação disfarçado de conversa."
2. bg `#ff7a1a`, sombra `#6b5cff`, número "2" em `#6b5cff` — **"A gente analisa sua operação"**: "Uma conversa de 30 minutos para entender seu volume, seus canais, seu pico e onde exatamente está o gargalo. Se não fizer sentido para você, a gente fala isso na própria conversa."
3. bg `#f12d64`, sombra `#ff7a1a`, número "3" em `#ff7a1a` — **"O time entra em campo"**: "Aprovado o desenho, sua operação sobe em 24 horas, com gestão dedicada e relatório desde o primeiro dia."

---

## Seção 09 — faq (1:664) · get_design_context (estrutura + textos completos)

Constantes: `imgGroup` (SVG chevron branco, item aberto), `imgGroup1` (SVG chevron
escuro, itens fechados).

Seção `bg-[#f2f2e8] py-[96px]`, coluna `max-w-[896px]` (container 848).
H2 `Sora:Bold 36px/40 #030304` centrado: "Perguntas que a gente sempre recebe".

**10 itens de acordeão** `bg-white border #dfdfd4 rounded-[12px] overflow-clip`,
`pt-[12px]` entre itens. Cabeçalho = BUTTON `h-[72px] p-[20px] justify-between`:
pergunta `Sora:SemiBold 16px/24 #111116` + disco 32px com chevron 20px
(aberto: disco `#4a1be8`, chevron branco, apontando para cima [rotate-180];
fechado: disco `#ecece1`, chevron escuro).

⚠ **SÓ O ITEM 1 TEM RESPOSTA DESENHADA** (painel `px-[20px] pb-[20px]`, texto
`Roboto:Regular 14px/22.75 #555766`):

1. **"Ainda dá tempo de contratar em outubro? E em novembro?"** → resposta: "Dá. A operação sobe em 24 horas em qualquer mês. A diferença é o quanto o time conhece o seu negócio quando o volume chegar. Em agosto e setembro, ele chega calejado. Em novembro, ele aprende durante o pico. Os dois funcionam, só não funcionam igual."
2. "Como funciona a condição de Black Friday?"
3. "Preciso contratar as duas frentes?"
4. "Quanto tempo leva para ver resultado?"
5. "Meu produto é complexo. O time vai entender?"
6. "Como vocês se integram ao meu CRM e às minhas ferramentas?"
7. "E a segurança dos dados? Vocês cumprem LGPD?"
8. "Como é a precificação?"
9. "E se não funcionar?"
10. "Vocês atendem meu segmento?"

⚠ **PENDÊNCIA (dono): os textos das respostas 2–10 não existem no Figma.** Zero JS
obriga acordeão nativo `<details>/<summary>` (funciona sem script) — mas sem os
textos não há o que abrir. Alternativas registradas para o contrato: (a) dono fornece
as 9 respostas; (b) só o item 1 é `open` e os demais ficam fechados com `<details>`
vazio — NÃO recomendado (clicar e nada abrir é quebra de confiança).

---

## Seção 10 — formulario-completo (1:776) · get_design_context (estrutura + textos completos)

Constantes: `imgImg746` (PNG decorativo 600×600, `opacity-7`, posicionado
`left-[1040px] top-[221.5px]` — sangra para fora da direita), `imgGroup` (SVG ícone
WhatsApp branco→rosa).

Seção `bg-[#f12d64] py-[96px]`, coluna `max-w-[768px]` (container 720).
H2 `Sora:Bold 36px/40 white` centrado: "Solicite o seu orçamento".
Sub `Roboto:Regular 16px/24 rgba(255,255,255,0.8)` centrado: "Preencha abaixo. Um
humano do time comercial entra em contato para conversar sobre o seu cenário, sem
apresentação institucional de 40 slides."

**Card do form**: `bg-white border #c6cfff rounded-[16px] p-[33px] w-[720px]
h-[502px]` (form interno 654 de largura):
- Campos (todos: label `Roboto:SemiBold 14px/20 #22232b` + asterisco `#ff6000`,
  `pb-[4px]`; input `h-[46px] bg-[#f2f2e8] border #dfdfd4 rounded-[8px] px-[17px]`,
  texto 14px, placeholder `#9ca3af`; `pt-[16px]` entre linhas):
  1. **"Seu Nome *"** — largura cheia (654)
  2. **"E-mail *"** — largura cheia
  3. **"Cargo *"** + **"Nome da Empresa *"** — par lado a lado (319 cada, gap 16)
  4. **"Site *"** + **"WhatsApp *"** — par; placeholder do WhatsApp: **"(XX) XXXXX-XXXX"**
- Botão: `bg-[#4a1be8] h-[44px] rounded-[8px] w-full`, `Roboto:SemiBold 14/20 white`,
  texto **"Enviar"**.
- Nota sob o botão `Roboto:Regular 12px/16 #8f91a2` centrada: "Seus dados ficam com a
  gente. Sem spam, sem lista compartilhada. Quem responde é gente do time comercial,
  não bot."

Abaixo do card: "Prefere falar direto?" (`Roboto:Regular 14/20 rgba(255,255,255,0.8)`
centrado) + **CTA `<a>` pill branco** `h-[44px] rounded-full px-[24px]`: ícone
WhatsApp 14px + "Falar pelo WhatsApp" (`Roboto:SemiBold 14/20 #f12d64`).
⚠ **PENDÊNCIA (dono): o link/número do WhatsApp não está no Figma.**

Rodapé da seção (`border-t rgba(255,255,255,0.2) pt-[33px]`), linha única centrada
`Roboto:Regular 12/16 rgba(255,255,255,0.7)` com separador "·":
"Mais de 150 empresas · Operação no ar em 24h · 100% remota e feminina · LGPD e
processos auditáveis"

**Mapeamento para o Elementor Pro Form (contrato do hook):** rótulos do Figma ↔
custom IDs exigidos: Seu Nome→`name` · E-mail→`email` · WhatsApp→`phone` ·
Cargo→`cargo` · Nome da Empresa→`empresa` · Site→`site`. A ORDEM VISUAL do Figma é
Nome, E-mail, [Cargo|Empresa], [Site|WhatsApp], Enviar — 2 colunas nos pares
(no Elementor: largura 50% nos 4 campos pareados).

---

## Seção 11 — FOOTER (1:881) · get_design_context (estrutura + textos completos)

Constantes: `imgGroup/1/2` (3 SVGs de ícones sociais em discos `#4a1be8` 32px).
`IMG-751` (logo 32×32) veio VAZIO no dump — o binário candidato é o SVG maior do
download_assets do footer (ver INVENTARIO).

Seção `bg-white border-t #dfdfd4 pt-[49px] pb-[48px]`, coluna `max-w-[1152px]`
(container 1104). **3 colunas** `gap-[32px]` (cada ~346.66px):
1. Logo 32px + "Scooto Tecnologia Ltda." / "CNPJ: 00.000.000/0000-00"
   (`Roboto:Regular 14/20 #717386`) — ⚠ **PENDÊNCIA (dono): CNPJ é placeholder.**
2. Título "Contato" (`Roboto:SemiBold 14/20 #111116`) + "Telefone: (11) 3181-8057".
3. Título "Links" + `<a>` "Política de Privacidade" e `<a>` "Termos de Uso"
   (`Roboto:Regular 14/20 #717386`) — ⚠ **PENDÊNCIA (dono): hrefs não estão no Figma.**

Linha final (`border-t #dfdfd4 pt-[25px] justify-between`):
"© 2026 Scooto. Todos os direitos reservados." (`Roboto:Regular 12/16 #717386`) +
3 ícones sociais (discos `#4a1be8` 32px, `gap-[16px]`) — ⚠ **PENDÊNCIA (dono): quais
redes/URLs.**

---

## Pendências consolidadas descobertas no P0 (para o gate e o contrato do P1)

1. **Mini-form do hero** (Nome, E-mail corporativo, "Quanto é 5 + 7?", botão "Quero
   avaliar minha operação"): 2º form real no Elementor (o hook capta com campos
   faltando) × visual/CTA ancorando no form completo — decisão de arquitetura.
2. **Respostas do FAQ 2–10** não existem no Figma.
3. **Link do WhatsApp** ("Falar pelo WhatsApp", seção 10).
4. **CNPJ real** do footer.
5. **hrefs**: Política de Privacidade, Termos de Uso, 3 redes sociais.
6. **Fontes**: além de Sora (400/600/700), o design usa **Roboto**
   (400/400-italic/600/700, `wdth 100`) e **Inter:Medium** (só placeholders de input).
   O critério do card diz "import da Sora" — o contrato precisa mandar importar
   **Sora E Roboto** (Inter pode cair para Roboto sem perda perceptível).

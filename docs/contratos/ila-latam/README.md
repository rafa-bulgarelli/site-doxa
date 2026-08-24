# Contrato ILA LATAM BV — minuta

`minuta.html` é a **fonte única** do contrato de desenvolvimento de site entre
**INCRAFT SERVIÇOS DIGITAIS LTDA** (CONTRATADA) e **ILA LATAM BV** (CONTRATANTE).
É um arquivo HTML autocontido: todo o CSS de impressão está embutido, não há
dependência externa, nenhuma fonte remota, nenhum build. O PDF é gerado a partir
dele.

**O PDF não é commitado.** É artefato local: gere quando precisar, no diretório
que preferir fora do repositório.

## Gerar o PDF

Do diretório raiz do repositório:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="$HOME/Downloads/contrato-ila-latam-MINUTA.pdf" "file://$PWD/docs/contratos/ila-latam/minuta.html"
```

O `--no-pdf-header-footer` tira o cabeçalho/rodapé do navegador (URL, data,
"page 1/12") — sem ele o PDF sai com lixo de impressão em cima do contrato.

## Enquanto for MINUTA

O documento abre com o bloco `<header id="capa-minuta">`: uma página inteira com
o selo **MINUTA — NÃO ENVIAR**, a lista dos campos pendentes e a ressalva de que
o documento não é consultoria jurídica.

Dois campos ainda não têm dado real e estão marcados com `class="pendente"`
(fundo amarelo, borda vermelha, `print-color-adjust: exact` para o destaque
sobreviver à impressão):

1. sobrenome do representante da CONTRATANTE (consta apenas "Vladimir");
   (preencher também no **bloco de assinaturas** no fim do documento — lá o campo é linha em branco, não destaque amarelo)
2. documento do representante da CONTRATANTE (CPF ou passaporte).

**Regra dura: PDF com placeholder nunca vai ao cliente.** Enquanto houver
qualquer `class="pendente"` no arquivo, o PDF serve só para revisão interna, e o
nome do arquivo deve conter `MINUTA`.

## Versão final (só com aprovação explícita do dono)

1. Preencher o sobrenome e o documento do representante da CONTRATANTE,
   **removendo os dois `<span class="pendente">…</span>`** e deixando o texto
   corrido na qualificação das Partes.
2. Apagar o bloco `<header id="capa-minuta">` inteiro (da abertura da tag até
   `</header>`) — ele existe justamente para sair num delete só.
3. Conferir que `grep -c 'pendente' minuta.html` e
   `grep -c 'capa-minuta' minuta.html` retornam `0`.
4. Gerar o PDF **sem** `MINUTA` no nome:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="$HOME/Downloads/contrato-ila-latam.pdf" "file://$PWD/docs/contratos/ila-latam/minuta.html"
```

O envio ao cliente é do dono.

## Estrutura do documento

Capa da minuta · qualificação das Partes · 16 cláusulas numeradas (a de valor e
pagamento é a **DÉCIMA QUINTA**; o contrato-base numerava duas cláusulas como
"DÉCIMA SEXTA" e a minuta corrige) · **ANEXO I — ESCOPO E CONDIÇÕES COMERCIAIS**
(substitui a "Proposta Comercial" referenciada no contrato-base; não existe
proposta separada) · CLÁUSULA – ASSINATURA ELETRÔNICA · bloco de assinaturas das
Partes e de duas testemunhas.

## Aviso

Documento redigido por adaptação de contrato-base já usado pela CONTRATADA.
**Não é consultoria jurídica.** Revisão por advogado é recomendada, em especial
quanto à CONTRATANTE figurar com CNPJ brasileiro e sede declarada nos Países
Baixos.

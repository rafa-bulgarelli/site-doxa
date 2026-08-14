# Manual interativo da DOXA — como rodar, operar e evoluir

O manual interativo vive dentro do site (`www.doxaviral.com`), sob a rota
`/manual-doxa`. É o processo guiado de ciência e aceite das regras da
garantia: o CX cria um convite, o cliente abre o link no celular, percorre as
21 seções marcando "Li, entendi e concordo" e sai com o comprovante em PDF.
A equipe consulta tudo em `/manual-doxa/admin`.

## O mapa

| Peça | Onde | O que é |
|---|---|---|
| Rota-base | `src/manual/config.ts` | `ROTA_BASE = '/manual-doxa'` — mudar o endereço é UMA linha aqui |
| Contrato | `src/manual/tipos.ts` | Request/response de tudo; compila no app E na API |
| Roteador | `src/manual/Rota.tsx` | `pushState`/`popstate`; divide público × admin em bundles separados |
| Fluxo público | `src/manual/publico/` | Convite → identificação → seções → revisão → conclusão |
| Área da equipe | `src/manual/admin/` | Portão de senha, convites, aceites, versões |
| API | `api/manual/publico.ts` · `api/manual/admin.ts` | As únicas portas de escrita; lógica em `src/manual/servidor/` |
| Schema | `supabase/manual.sql` | 9 tabelas `manual_*`, RLS, triggers de imutabilidade, RPCs |
| Conteúdo v1 | `supabase/manual-seed-v1.sql` | 21 seções, 37 regras — publica a versão 1 |
| Fonte das regras | `.claude/tower/cards/004-manual-interativo-prompt-mestre.md` | O prompt mestre (seção 9 = regras de negócio) |
| Divergências | `docs/LEGAL_RECONCILIATION.md` | Contrato × operação — INTERNO |

## Rodar local

```sh
pnpm install
pnpm dev            # Vite; o site abre na porta que ele indicar
pnpm typecheck      # tsc -b (app + api + node)
pnpm test           # vitest run
pnpm build          # produção
```

Variáveis: copie `.env.example` para `.env` e preencha (comentários no
próprio arquivo dizem onde pegar cada valor). Sem `SUPABASE_SERVICE_ROLE`
o fluxo público não conclui aceite — as funções do banco são exclusivas da
service_role, de propósito.

## Supabase — na ordem, uma vez

O projeto não usa migrations (`list_migrations` vazio é proposital): o schema
é aplicado à mão pelo SQL Editor, e o arquivo é a referência. **Depois de
mexer num, confira o outro.**

1. **`supabase/schema.sql`** — a Central de leads (já aplicado; documenta a
   criação do usuário do time no passo 1).
2. **`supabase/manual.sql`** — as tabelas `manual_*`, RLS, triggers e RPCs.
   Idempotente. Cria também o bucket privado `manual-pdfs` e o perfil admin
   da conta do time.
3. **`supabase/manual-seed-v1.sql`** — o conteúdo. Idempotente pelo número da
   versão; nasce rascunho e publica pela RPC `manual_publicar_versao` (o
   mesmo caminho da área admin). No fim do arquivo estão as consultas de
   conferência (21 seções, 37 regras, 14 críticas).

### O primeiro administrador

`CONTA_DO_TIME` (`src/leads/dados/supabase.ts`) e o usuário no Supabase Auth
são **UM passo, nunca dois** — divergiu uma letra, a Central e o painel do
manual respondem "credenciais inválidas". O `manual.sql` insere o perfil
admin (`manual_perfis`) para esse mesmo e-mail. Para trocar a conta: Auth →
constante → `schema.sql`/`manual.sql`, tudo na mesma janela.

### Segurança — o desenho, para não desfazer sem querer

- `anon` não enxerga NENHUMA tabela `manual_*`. O cliente fala com a API; a
  credencial dele é o token do convite (só o SHA-256 vive no banco).
- `authenticated` (a conta do time) LÊ tudo e escreve SÓ rascunho de versão,
  seções/regras de rascunho e eventos `ator = 'equipe'`. Quem garante o
  estado é o TRIGGER, não a política.
- Aceite é prova: trigger recusa update/delete até da service_role — a única
  mutação é o par `pdf_caminho`/`pdf_sha256` saindo de null, uma vez.
- As RPCs têm `revoke` de todo papel; só a API (service_role) as chama.
- O bucket `manual-pdfs` é privado, sem política de leitura: todo download é
  URL assinada de minutos, emitida pela API.

Conferência rápida: a consulta de `pg_policies` comentada no fim de
`supabase/manual.sql`.

## Vercel

As funções de `api/` sobem com o deploy normal do projeto `site-doxa`
(`rafa-bulgarellis-projects`). Env vars em Settings → Environment Variables,
tipo **Sensitive** — depois de salvas a CLI não as lê de volta; o valor se
pega na fonte (painel Supabase/Cloudflare). O `vercel.json` já reescreve
qualquer caminho sem extensão para `index.html`, então `/manual-doxa/*`
chega ao SPA sem ajuste de deploy.

Domínio ao validar: **doxaviral.com, com L** — `doxavira.com` responde 200
de um CloudFront alheio e engana o curl. Confira o `<title>`, não o status.

## Operar

**Criar um convite:** `/manual-doxa/admin` → Convites → criar, com e-mail e
empresa (nome é opcional — sem ele, o cliente informa o próprio). O link
completo aparece UMA única vez, na resposta — copie na hora e mande pelo
canal que quiser (WhatsApp, tipicamente). Não existe envio automático de
e-mail, de propósito. Revogar e regenerar ficam na própria lista.

**Publicar uma versão nova do manual:** admin → Manual → "criar rascunho a
partir da vigente" → editar seções/regras → pré-visualizar → publicar. A
publicação carimba o hash, arquiva a anterior e assume a vigência. Convites
já criados NÃO mudam: cada um está preso à versão do dia em que nasceu, e
quem já concluiu nunca aceita de novo. Versão publicada não se edita — o
trigger recusa, venha de quem vier.

**Mudar a rota-base:** edite `ROTA_BASE` em `src/manual/config.ts`. Nada
mais — roteador, links da API e botões partem dali.

## Privacidade e retenção

O que o aceite coleta, e por quê:

- **Nome, empresa, e-mail** — identificam quem aceitou; empresa e e-mail vêm
  do convite (o cliente não os altera).
- **Data/hora, versão e snapshot do texto** — provam O QUE foi aceito.
- **Endereço IP e user agent** — auditoria do aceite, e só isso. Não
  aparecem para o cliente, não viram insumo de marketing.

Onde ficam: Supabase (tabelas `manual_*` e bucket privado `manual-pdfs`).
Quem acessa: a equipe autenticada (leitura) e a API. Retenção: os registros
de aceite são mantidos pelo prazo de guarda de documentos contratuais — são
a comprovação da ciência prévia do cliente e não se apagam pela interface
(trigger). Solicitações de titular (LGPD): a equipe localiza tudo de um
cliente pela busca da área admin (e-mail/empresa) e atende pelo canal de
contato da empresa; exclusão antes do prazo é decisão jurídica, não botão.

O fluxo público mostra o aviso de privacidade ANTES de o cliente iniciar —
coleta de IP e navegador declarada, nunca escondida.

## Testes

`pnpm test` roda tudo (vitest). Os testes do manual moram junto dos módulos
(`src/manual/**/[nome].test.ts`) e não tocam rede — fetch sempre mockado.
Baseline pré-manual: 31 testes verdes; qualquer vermelho novo é regressão
desta feature.

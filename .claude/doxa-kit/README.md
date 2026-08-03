# DOXA Claude Kit

Harness coringa para trabalhar com Claude Code em qualquer projeto — destilado de:
produção real no **DOXA Control Tower** (orquestração multi-agente, 25+ PRs), o melhor do
**Everything Claude Code** (ECC — estudado e auditado; adotamos conteúdo, nunca código
executável de terceiro) e o **Google TypeScript Style Guide**.

**Comece por aqui:** [`CLAUDE.pt-BR.md`](CLAUDE.pt-BR.md) · English: [`CLAUDE.md`](CLAUDE.md)

| Arquivo | O que é |
|---|---|
| `CLAUDE.pt-BR.md` / `CLAUDE.md` | Documento canônico: princípios, tabelas do que performa mais/menos (com números), seleção de modelo, orquestração, barra mínima de segurança |
| `skills/doxa-master/SKILL.md` | A skill operacional — regras que o Claude aplica em toda sessão |
| `templates/STYLE-GOOGLE-TS.md` | Contrato de estilo TypeScript (Google, adaptável por repo) |
| `templates/TRACK-TEMPLATE.md` | Template de context pack para executores paralelos |

## Instalação num projeto (5 min)

```bash
# skill válida só no projeto:
cp -r skills/doxa-master <projeto>/.claude/skills/
# ou válida em todos os projetos:
cp -r skills/doxa-master ~/.claude/skills/

cp templates/* <projeto>/.claude/
# depois: ajuste os "desvios deliberados" do estilo ao house style do repo
```

Regra de ouro herdada da auditoria do ECC: **conteúdo de harness de terceiro se adota
como texto lido e curado — nunca rodando installer/hooks de terceiro.**

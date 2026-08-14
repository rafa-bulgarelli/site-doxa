# PROMPT MESTRE — CONSTRUÇÃO AUTÔNOMA DO MANUAL INTERATIVO DA DOXA

Você é o agente principal responsável por arquitetar, construir, integrar, testar e finalizar um aplicativo web completo da DOXA.

Você está operando como Claude Opus 5, em nível de esforço X-High, dentro do terminal Orca, com capacidade de criar e coordenar múltiplos agentes em paralelo.

Não pare depois de criar um scaffold, uma primeira tela ou um MVP superficial. Continue trabalhando autonomamente durante toda a janela disponível, aproximadamente duas a três horas, até que o aplicativo esteja funcional, integrado, testado e com acabamento visual profissional.

Não fique aguardando respostas do usuário. Quando encontrar uma decisão pequena não especificada, escolha a alternativa mais segura, reversível e coerente com o projeto, registre a decisão e continue.

Somente interrompa se existir um bloqueio real que envolva credenciais obrigatórias, ação destrutiva, risco de perda de dados ou impossibilidade técnica incontornável. A ausência de credenciais não é motivo para abandonar a implementação: construa toda a estrutura, migrations, `.env.example`, mocks e documentação, deixando apenas a conexão final pendente.

---

# 1. MISSÃO

Construir um aplicativo web independente que funcione como:

* Manual interativo de uso da plataforma DOXA;
* Processo guiado de onboarding e educação do cliente;
* Registro de que o cliente leu, entendeu e concordou com cada regra;
* Comprovação auditável do aceite;
* Gerador de PDF completo contendo o manual e a declaração do cliente;
* Área administrativa interna para a equipe da DOXA criar convites e consultar os aceites.

Este aplicativo não é a plataforma principal de geração de vídeos e não deve tentar reproduzir suas funcionalidades.

---

# 2. ROTA DO APLICATIVO

Antes de editar qualquer arquivo:

1. Leia todas as instruções existentes no repositório, incluindo `CLAUDE.md`, `AGENTS.md`, README, convenções, estrutura de rotas e design system.
2. Procure no repositório e no contexto atual do Orca pela rota anteriormente definida pelo usuário para este aplicativo.
3. Se encontrar uma rota inequívoca, use exatamente essa rota.
4. Se não conseguir recuperar a rota, não interrompa o trabalho e não pergunte ao usuário. Use como fallback:

`/manual-doxa`

Centralize a rota-base em uma única configuração para que possa ser alterada posteriormente sem refatoração ampla.

Rotas esperadas, adaptadas à rota-base real:

* `[ROTA_BASE]/convite/[token]`
* `[ROTA_BASE]/concluido`
* `[ROTA_BASE]/admin`
* `[ROTA_BASE]/admin/convites`
* `[ROTA_BASE]/admin/convites/[id]`
* `[ROTA_BASE]/admin/manual`
* `[ROTA_BASE]/admin/manual/[versionId]`

Não crie rotas conflitantes com as já existentes.

---

# 3. STACK E REGRAS DE INTEGRAÇÃO

A infraestrutura obrigatória é:

* Supabase para banco de dados, autenticação interna e armazenamento;
* Vercel para hospedagem;
* TypeScript;
* Aplicação responsiva e mobile-first.

Primeiro identifique a stack do repositório.

Se o projeto já utilizar Next.js, React, Tailwind, shadcn/ui ou outro design system, preserve integralmente as escolhas existentes.

Não reestruture, não migre e não substitua a stack sem necessidade.

Se for um projeto novo ou não houver uma stack definida, utilize:

* Next.js com App Router;
* TypeScript estrito;
* Tailwind CSS;
* Componentes acessíveis;
* Supabase;
* Validação com Zod ou ferramenta equivalente;
* Testes unitários, de integração e E2E;
* Deploy compatível com Vercel.

Nunca inclua segredos no código ou no Git.

Crie um `.env.example` completo e documentado.

---

# 4. COMPORTAMENTO AUTÔNOMO OBRIGATÓRIO

Antes da implementação:

* Examine a estrutura completa do repositório;
* Execute `git status`;
* Preserve alterações existentes do usuário;
* Identifique componentes, tokens, fontes, cores, bibliotecas e padrões reutilizáveis;
* Identifique como Supabase e Vercel já estão configurados;
* Identifique a forma atual de autenticação;
* Identifique scripts de lint, testes, build e preview;
* Crie um plano de execução objetivo;
* Registre o plano em um arquivo de acompanhamento, se isso fizer sentido dentro do padrão do repositório.

É proibido:

* Utilizar `git reset --hard`;
* Apagar alterações existentes;
* Sobrescrever arquivos sem examiná-los;
* Criar uma segunda aplicação desnecessariamente;
* Fazer alterações destrutivas no banco de produção;
* Rodar migrations irreversíveis em produção;
* Fazer deploy em produção sem autorização explícita;
* Inventar que testes passaram sem executá-los;
* Abandonar a tarefa após criar apenas telas estáticas;
* Criar integrações falsas;
* Exibir dados pessoais em logs;
* Implementar funcionalidades fora do escopo.

---

# 5. ORQUESTRAÇÃO POR MÚLTIPLOS AGENTES

Utilize os recursos do Orca para trabalhar em paralelo.

O agente principal continua responsável por arquitetura, decisões finais, integração e qualidade. Não delegue o projeto inteiro para um único agente e não aceite resultados sem revisão.

Crie agentes com tarefas delimitadas. Sugestão:

## Agente 1 — Auditoria e arquitetura

Responsabilidades:

* Examinar repositório, stack, rotas e instruções;
* Propor integração sem quebrar o sistema;
* Desenhar schema do Supabase;
* Criar migrations, constraints, índices e políticas de segurança;
* Verificar versionamento e imutabilidade dos aceites.

## Agente 2 — Experiência do cliente

Responsabilidades:

* Construir fluxo público por convite;
* Desenvolver etapas do manual;
* Criar componentes de regras, justificativas e exemplos;
* Implementar progresso, checkboxes e declaração final;
* Garantir responsividade e acessibilidade.

## Agente 3 — Backend, segurança e PDF

Responsabilidades:

* Implementar validação do token;
* Implementar conclusão transacional e idempotente;
* Registrar evidências;
* Gerar o PDF completo;
* Salvar o arquivo em bucket privado;
* Implementar hash, armazenamento e download seguro.

## Agente 4 — Administração e qualidade

Responsabilidades:

* Construir área administrativa;
* Criar fluxo de invites e versões;
* Implementar busca, filtros, detalhes e exportação;
* Criar testes;
* Realizar revisão visual, funcional e de acessibilidade.

Se houver menos slots disponíveis, agrupe tarefas de forma sensata.

Evite que agentes diferentes editem simultaneamente os mesmos arquivos. Divida por domínio, diretório ou worktree, conforme os recursos disponíveis.

O agente principal deve:

* Revisar cada entrega;
* Integrar continuamente;
* Resolver conflitos;
* Executar os testes completos;
* Corrigir regressões;
* Não deixar partes desconectadas.

---

# 6. ESCOPO EXATO

## O aplicativo deve conter

* Área administrativa autenticada;
* Criação de invites individuais;
* Link seguro por cliente;
* Empresa e e-mail previamente definidos no invite;
* Identificação do cliente;
* Manual interativo sequencial;
* Checkbox individual para cada regra;
* Declaração final;
* Registro de data e horário;
* Registro do endereço IP;
* Registro de navegador e dispositivo;
* Registro da versão do manual;
* Snapshot do texto exato aceito;
* Geração de PDF;
* Armazenamento privado do PDF;
* Consulta administrativa;
* Download seguro do PDF;
* Histórico de eventos;
* Versionamento do manual;
* Exportação de registros;
* Interface profissional e mobile-first.

## O aplicativo não deve conter

* Login tradicional para o cliente;
* Cadastro aberto;
* Quiz ou teste;
* Assinatura eletrônica;
* Envio automático de e-mail;
* Integração com TikTok, Instagram ou YouTube;
* Monitoramento de visualizações;
* Monitoramento de publicações;
* Contador operacional dos 90 dias;
* Motor automático de perda da garantia;
* Upload de foto;
* Upload de áudio;
* Geração de clone;
* Geração de vídeo;
* Aprovação ou revisão de vídeos;
* Dashboard operacional para o cliente;
* Controle de temas, roteiros, B-roll ou legendas;
* Funcionalidades da plataforma principal.

Não aumente o escopo.

---

# 7. FLUXO DO CLIENTE

## 7.1 Criação do convite

Um usuário interno autorizado cria um invite contendo:

* E-mail do cliente;
* Nome da empresa;
* Nome da pessoa, se já conhecido;
* Versão vigente do manual;
* Prazo opcional de validade;
* Identificação do responsável da DOXA que criou o invite.

O sistema gera um token longo, seguro e imprevisível.

O token puro deve aparecer apenas no link. No banco, armazene somente o hash do token.

O CX deve poder:

* Copiar o link;
* Reenviar manualmente pelo canal que desejar;
* Revogar o invite;
* Gerar um novo invite;
* Consultar seu status.

Não implementar envio automático de e-mail.

## 7.2 Acesso do cliente

Quando o cliente abre o link:

* O servidor valida o token;
* O sistema verifica se está ativo, expirado, revogado ou concluído;
* Empresa e e-mail aparecem preenchidos e bloqueados;
* Se o nome pessoal já estiver no invite, mostre-o preenchido;
* Se não estiver, permita que o cliente informe seu nome completo;
* Não permita trocar empresa ou e-mail;
* Mostre uma introdução breve explicando o objetivo do processo;
* Mostre aviso de privacidade antes de iniciar.

Estados obrigatórios:

* Invite válido;
* Invite inválido;
* Invite expirado;
* Invite revogado;
* Invite já concluído;
* Erro recuperável;
* Indisponibilidade temporária.

## 7.3 Manual sequencial

O cliente percorre todas as seções em ordem.

Cada regra deve conter:

1. Título objetivo;
2. Regra em linguagem clara;
3. Explicação de por que ela existe;
4. Exemplo prático de como agir corretamente;
5. Checkbox individual com o texto:

“Li, entendi e concordo.”

O botão de avançar só pode ser liberado após a marcação de todos os itens obrigatórios da seção atual.

Permita voltar para seções anteriores.

Salve progresso parcial de forma segura para que o cliente possa retomar pelo mesmo invite.

Nunca trate o progresso parcial como aceite definitivo.

## 7.4 Revisão final

Antes da conclusão, mostre:

* Nome;
* Empresa;
* E-mail;
* Versão do manual;
* Lista resumida das obrigações;
* Informação de que o descumprimento das condições pode invalidar a garantia;
* Declaração final completa.

Texto-base da declaração:

“Declaro que li integralmente o Manual de Uso e Regras da Garantia da DOXA, compreendi todas as orientações, obrigações, permissões e proibições apresentadas e estou ciente de que o cumprimento integral dessas condições é necessário para a manutenção da garantia contratual. Confirmo que os dados informados são verdadeiros e que recebi acesso ao conteúdo completo da versão indicada neste registro.”

Adicione um último checkbox:

“Confirmo que li e concordo com a declaração acima.”

Não utilize o termo “assinatura eletrônica”.

## 7.5 Conclusão

A conclusão deve acontecer no servidor, dentro de uma operação transacional e idempotente.

O servidor deve:

* Buscar novamente todas as regras obrigatórias da versão vinculada;
* Não confiar apenas nos IDs enviados pelo navegador;
* Confirmar que todos os checkboxes foram registrados;
* Criar o aceite definitivo;
* Salvar snapshots dos textos;
* Registrar metadados;
* Gerar o PDF;
* Calcular hash do conteúdo e do PDF;
* Salvar o PDF em bucket privado;
* Marcar o invite como concluído;
* Bloquear uma segunda conclusão;
* Retornar a confirmação.

Se o usuário clicar duas vezes ou repetir a requisição, o sistema não pode criar aceites duplicados.

Na tela final:

* Mostrar confirmação clara;
* Mostrar identificador do aceite;
* Mostrar data e versão;
* Permitir o download seguro do PDF pelo próprio cliente;
* Não enviar e-mail;
* Informar que a DOXA também mantém o documento arquivado.

---

# 8. ESTRUTURA DO MANUAL

Criar uma versão inicial completa em português do Brasil.

A versão deve ser organizada aproximadamente assim:

1. Boas-vindas;
2. Como funciona a DOXA;
3. O que a DOXA entrega;
4. Como funciona a garantia;
5. Como preencher o onboarding;
6. Como gravar o áudio;
7. Como produzir as fotos;
8. Como baixar e publicar os vídeos;
9. Rotina dos 60 vídeos;
10. Regra das 24 horas;
11. O que pode ser publicado durante a semana;
12. O que pode ser publicado no final de semana;
13. Impulsionamento, turbinamento e tráfego pago;
14. Alterações proibidas nos vídeos;
15. Títulos, descrições e configurações;
16. Comentários e engajamento;
17. Expectativas sobre clone, voz e estética;
18. Condições da garantia;
19. O que causa perda da garantia;
20. Resumo final;
21. Declaração de ciência.

Não crie um texto jurídico pesado. Use linguagem direta, didática e profissional.

Cada proibição deve explicar sua razão de existir. O objetivo não é assustar o cliente, mas evitar erros operacionais.

Não faça afirmações absolutas ou não comprováveis sobre algoritmos como se fossem declarações oficiais das redes. Apresente as justificativas como parte da metodologia operacional da DOXA.

Exemplo:

“Impulsionamentos e campanhas pagas interferem na leitura isolada do desempenho orgânico e podem alterar os sinais de distribuição do perfil. Para preservar a metodologia e permitir uma avaliação confiável da estratégia orgânica, os perfis participantes não podem utilizar impulsionamento durante o período.”

---

# 9. REGRAS DE NEGÓCIO — FONTE DE VERDADE

As regras abaixo são a fonte operacional de verdade para a implementação.

## 9.1 Garantia

* A garantia é de 1.000.000 de visualizações;
* O período de aferição é de 90 dias corridos;
* A contagem começa com a publicação do primeiro vídeo;
* As visualizações são somadas entre Instagram, TikTok e YouTube Shorts;
* São somadas as visualizações de todos os vídeos publicados;
* O cliente precisa cumprir integralmente todas as condições;
* Se todas as regras forem cumpridas e a meta não for alcançada, existe estorno de 100% conforme as condições e o prazo do contrato;
* O aplicativo não calcula o resultado;
* O aplicativo não decide automaticamente se houve perda da garantia;
* O aplicativo apenas comprova que o cliente recebeu, leu e aceitou as regras.

## 9.2 Quantidade e distribuição

* O cliente deve publicar no mínimo 60 vídeos durante os 90 dias;
* Os 60 são conteúdos únicos;
* Cada um dos 60 vídeos precisa ser publicado nas três redes;
* Portanto, cada conteúdo precisa existir no Instagram, TikTok e YouTube Shorts;
* O mesmo arquivo deve ser utilizado nas três redes;
* As publicações devem acontecer no mesmo dia e de forma simultânea ou tão próxima quanto operacionalmente possível;
* Não exibir ao cliente uma tolerância técnica em minutos;
* O cliente pode deixar de publicar em alguns dias;
* Perder um dia isolado não invalida a garantia;
* O que importa é completar os 60 vídeos nas três plataformas dentro dos 90 dias;
* Não pode compensar publicando vários vídeos da DOXA no mesmo dia;
* Durante os dias úteis, deve publicar no máximo um vídeo curto da DOXA por dia.

## 9.3 Intervalo real de 24 horas

* Durante os dias úteis, deve existir intervalo mínimo real de 24 horas entre os vídeos curtos da DOXA;
* Se um vídeo foi publicado segunda-feira às 22h, o próximo só pode ser publicado a partir das 22h de terça-feira;
* A regra não significa apenas “um vídeo em cada data do calendário”;
* A justificativa é preservar a janela de distribuição orgânica do conteúdo anterior;
* Publicar um novo vídeo cedo demais pode interromper ou dividir a distribuição do conteúdo que estava ganhando alcance.

## 9.4 Dias úteis

De segunda a sexta-feira:

* Os únicos vídeos curtos publicados nos perfis participantes devem ser os vídeos da DOXA;
* O cliente não pode publicar Reels, TikToks, Shorts ou outros vídeos curtos próprios ou de terceiros;
* Fotos são permitidas;
* Carrosséis são permitidos;
* Stories são permitidos;
* Conteúdos que não sejam vídeos curtos estão liberados;
* Deve ser respeitado o intervalo real de 24 horas entre os vídeos da DOXA.

Não é necessário criar regras especiais para feriados na interface.

## 9.5 Finais de semana

Aos sábados e domingos:

* O cliente pode publicar vídeos curtos próprios;
* Pode publicar conteúdos de terceiros;
* Pode publicar Stories, fotos e carrosséis;
* A liberação do final de semana prevalece mesmo que o vídeo próprio fique a menos de 24 horas de um vídeo da DOXA;
* Não criar alertas ou restrições adicionais de horário para o final de semana.

## 9.6 Impulsionamento, turbinamento e tráfego pago

Nos perfis sociais em que a estratégia da DOXA estiver ativa:

* É proibido impulsionar publicações;
* É proibido turbinar publicações;
* É proibido promover publicações;
* A proibição vale para qualquer post do perfil, mesmo que não tenha sido produzido pela DOXA;
* Campanhas antigas ligadas a esses perfis precisam ser pausadas antes da primeira publicação;
* O cliente não pode ativar novas campanhas nesses perfis durante o período;
* Essa é uma condição central da metodologia orgânica.

Continuam permitidos:

* Google Ads;
* Campanhas em outros perfis;
* Anúncios que não utilizem os perfis participantes da estratégia;
* Outras ações previamente consideradas fora do escopo dos perfis da DOXA.

Dê mais destaque visual a “impulsionar”, “turbinar” e “promover publicação” do que ao termo genérico “tráfego pago”.

## 9.7 Integridade dos vídeos

A regra operacional deve ser resumida como:

“Baixou, publicou.”

O cliente deve:

* Baixar o arquivo no celular ou dispositivo;
* Utilizar exatamente o arquivo recebido;
* Publicá-lo preservando a qualidade;
* Usar o mesmo vídeo nas três redes.

É proibido alterar:

* Corte;
* Duração;
* Velocidade;
* Proporção;
* Resolução;
* Qualidade;
* Música;
* Áudio;
* Voz;
* Legendas incorporadas;
* Textos;
* Capa;
* Roteiro;
* Estética;
* Elementos gráficos;
* Marca;
* Qualquer conteúdo disponibilizado pela IA.

Também deve seguir os títulos, descrições e demais orientações fornecidas pela equipe.

Não inclua regra sobre apagar ou arquivar vídeos na versão inicial do manual. Entretanto, registre no documento interno de reconciliação jurídica que o contrato atual possui uma disposição relacionada a vídeos em viralização.

## 9.8 Comentários

De acordo com o contrato atual:

* Os comentários não devem ser limitados ou desativados;
* Comentários ofensivos ou preconceituosos podem ser excluídos;
* O cliente pode moderar abusos sem bloquear a participação normal da audiência.

## 9.9 Engajamento artificial

É expressamente proibido adquirir direta ou indiretamente:

* Seguidores;
* Curtidas;
* Visualizações;
* Comentários;
* Compartilhamentos;
* Qualquer engajamento artificial;
* Serviços ou grupos destinados a manipular métricas.

Explique que essas práticas contaminam os resultados, violam a metodologia e podem gerar penalizações pelas redes.

## 9.10 Onboarding e materiais

O cliente deve:

* Responder às perguntas de forma completa e verdadeira;
* Fornecer contexto suficiente sobre empresa, oferta, público e posicionamento;
* Evitar respostas vagas ou de uma única palavra;
* Enviar as informações e documentos solicitados;
* Seguir as instruções da equipe;
* Informar problemas que possam afetar o projeto;
* Manter um responsável principal para centralizar a comunicação.

O aplicativo apenas ensina essas regras. Não deve coletar o onboarding real.

## 9.11 Áudio

Criar orientações claras sobre:

* Ambiente silencioso;
* Ausência de eco;
* Ausência de música;
* Ausência de ruído de fundo;
* Voz natural;
* Ritmo normal;
* Dicção clara;
* Distância consistente do microfone;
* Não utilizar filtros, efeitos ou processamento;
* Seguir o roteiro e a duração solicitados na plataforma principal.

Não inventar uma duração mínima se ela não estiver configurada no conteúdo administrativo.

O aplicativo não recebe o arquivo de áudio.

## 9.12 Fotos

Criar orientações claras sobre:

* Imagem nítida;
* Boa resolução;
* Iluminação uniforme;
* Rosto completamente visível;
* Ausência de filtros;
* Ausência de óculos escuros;
* Evitar sombras fortes;
* Evitar imagens borradas;
* Enquadramento próximo;
* Fotografias frontais e ângulos solicitados;
* Expressão natural;
* Recomendar fotos sorrindo e com os dentes visíveis, quando solicitado, para melhorar a reprodução;
* Enviar previamente ao grupo da equipe quando houver dúvida.

Não criar fluxo de upload ou aprovação dentro deste aplicativo.

## 9.13 Expectativa sobre o clone

Explicar que:

* O clone é uma representação aproximada;
* Não será necessariamente idêntico à pessoa;
* Podem existir diferenças de aparência, voz, gestos e expressões;
* A DOXA utiliza tecnologia para buscar o melhor resultado possível;
* A qualidade dos materiais de entrada influencia diretamente o resultado;
* Preferências puramente subjetivas não substituem os critérios técnicos da metodologia.

## 9.14 Metodologia e escopo

* Roteiro, corte, edição, voz e estética são definidos com foco em desempenho;
* A metodologia prioriza potencial de viralização, não gosto estético individual;
* O cliente deve seguir scripts, títulos, descrições e orientações;
* O cliente não pode alterar unilateralmente o escopo;
* Mudanças precisam de autorização prévia da DOXA;
* O aplicativo não implementa pedidos de alteração;
* O aplicativo apenas explica essa obrigação.

## 9.15 Perda da garantia

A comunicação deve deixar claro que:

* O cumprimento integral das regras é condição da garantia;
* Qualquer descumprimento pode invalidar imediatamente a garantia;
* Não existe tolerância operacional para impulsionamento, alteração de conteúdo, engajamento artificial ou publicação de vídeos curtos indevidos durante a semana;
* A margem existente é somente para dias sem publicação, desde que os 60 vídeos sejam concluídos em 90 dias;
* A aplicação não determina automaticamente se a garantia foi perdida;
* A análise operacional acontece fora deste aplicativo;
* O objetivo deste sistema é comprovar a ciência prévia do cliente.

## 9.16 Insatisfação subjetiva e encerramento

Explicar de forma simples:

* Insatisfação subjetiva com voz, corte, roteiro ou estética não equivale ao descumprimento da garantia;
* A garantia está relacionada ao resultado agregado de visualizações e ao cumprimento das regras;
* A interrupção antecipada do projeto impede a conclusão do período de aferição;
* Obrigações financeiras e contratuais continuam regidas pelo contrato assinado.

Não transforme essa seção em aconselhamento jurídico.

---

# 10. CONTEÚDO CONTRATUAL E RECONCILIAÇÃO

O contrato atual possui divergências em relação à operação mais recente.

Não esconda essas divergências dentro do código e não tente resolvê-las inventando novas regras.

Crie um documento interno:

`docs/LEGAL_RECONCILIATION.md`

Liste objetivamente:

* Vigência iniciada no onboarding versus 90 dias iniciados na primeira publicação;
* Quatro Reels por semana versus 60 vídeos em 90 dias;
* Cronograma rígido versus possibilidade de pular alguns dias;
* Regra contratual de 24 horas versus liberação do final de semana;
* Tráfego pago mediante alinhamento versus proibição absoluta de impulsionamento;
* Aprovações e revisões previstas no contrato versus inexistência na operação;
* Linguagem de perda eventual versus perda automática;
* Ambiguidade do estorno total diante da divisão entre serviço e e-book;
* InCraft como parte contratual versus DOXA como marca do produto;
* Vídeo em viralização e exclusão, regra que não entrará inicialmente no manual;
* Necessidade de incorporar formalmente a versão do manual aos documentos contratuais.

Esse documento é interno. Não mostrar essas divergências ao cliente.

A aplicação deve usar a regra operacional mais recente descrita neste prompt, deixando todo o conteúdo versionado e facilmente editável.

---

# 11. VERSIONAMENTO DO MANUAL

Implementar versionamento real.

Cada versão deve possuir:

* Identificador;
* Número da versão;
* Nome;
* Status de rascunho ou publicada;
* Data de criação;
* Data de publicação;
* Autor;
* Seções;
* Regras;
* Ordem;
* Hash do conteúdo;
* Histórico básico.

Regras:

* Apenas uma versão deve estar vigente para novos invites;
* Cada invite fica permanentemente vinculado à versão vigente no momento de sua criação;
* Atualizações futuras valem somente para novos clientes;
* Clientes que já concluíram não precisam aceitar novamente;
* O conteúdo aceito nunca pode mudar retroativamente;
* O PDF deve ser gerado a partir do snapshot aceito;
* Não reutilizar referências mutáveis para comprovação histórica;
* Uma versão publicada não deve ser editada diretamente;
* Para alterar, duplicar como novo rascunho e publicar uma nova versão.

Criar uma interface administrativa segura para:

* Visualizar versões;
* Criar rascunho a partir da versão atual;
* Editar seções e regras;
* Reordenar conteúdos;
* Pré-visualizar;
* Publicar;
* Impedir alterações retroativas.

---

# 12. MODELO DE DADOS SUGERIDO

Adapte os nomes às convenções do projeto, mas cubra estes conceitos:

## Usuários internos

`admin_profiles`

* `id`
* `user_id`
* `full_name`
* `role`
* `created_at`
* `updated_at`

Papéis mínimos:

* `ADMIN`
* `CX`

## Versões

`manual_versions`

* `id`
* `version`
* `title`
* `status`
* `content_hash`
* `created_by`
* `created_at`
* `published_at`

## Seções

`manual_sections`

* `id`
* `manual_version_id`
* `slug`
* `title`
* `description`
* `order_index`
* `created_at`

## Regras

`manual_rules`

* `id`
* `section_id`
* `code`
* `title`
* `instruction`
* `rationale`
* `practical_example`
* `severity`
* `is_required`
* `order_index`
* `created_at`

## Convites

`invites`

* `id`
* `token_hash`
* `email`
* `company_name`
* `client_name`
* `manual_version_id`
* `status`
* `expires_at`
* `created_by`
* `created_at`
* `opened_at`
* `completed_at`
* `revoked_at`

## Progresso parcial

`invite_progress`

* `id`
* `invite_id`
* `current_section_id`
* `checked_rule_ids`
* `updated_at`

Não trate esse progresso como aceite.

## Aceites

`acknowledgements`

* `id`
* `invite_id`
* `manual_version_id`
* `client_name_snapshot`
* `company_name_snapshot`
* `email_snapshot`
* `final_declaration_snapshot`
* `accepted_at`
* `ip_address`
* `user_agent`
* `content_sha256`
* `pdf_path`
* `pdf_sha256`
* `created_at`

## Itens aceitos

`acknowledgement_items`

* `id`
* `acknowledgement_id`
* `rule_id`
* `rule_code_snapshot`
* `rule_title_snapshot`
* `rule_text_snapshot`
* `rationale_snapshot`
* `accepted_at`

## Eventos de auditoria

`audit_events`

* `id`
* `invite_id`
* `actor_type`
* `actor_id`
* `event_type`
* `metadata`
* `created_at`

Eventos esperados:

* Invite criado;
* Link copiado;
* Invite aberto;
* Progresso salvo;
* Invite revogado;
* Invite regenerado;
* Aceite concluído;
* PDF gerado;
* PDF baixado;
* Exportação administrativa realizada.

Adicione:

* Constraints;
* Foreign keys;
* Índices;
* Unicidade;
* Enums ou checks;
* Imutabilidade dos aceites;
* Proteção contra duplicidade;
* Soft delete ou revogação onde adequado.

---

# 13. SEGURANÇA

Implementar segurança real, não apenas visual.

Requisitos:

* Supabase Auth apenas para equipe interna;
* Nenhum acesso administrativo baseado apenas em esconder botões;
* RLS em todas as tabelas expostas;
* Operações sensíveis executadas no servidor;
* Chave `service_role` somente no servidor;
* Token de invite armazenado como hash;
* Token suficientemente longo e imprevisível;
* Comparação segura;
* Rate limiting nas rotas públicas sensíveis, se a stack permitir;
* Validação de entrada;
* Sanitização de conteúdo;
* Proteção contra XSS;
* Proteção contra CSRF quando aplicável;
* URLs de download assinadas e temporárias;
* Bucket de PDFs privado;
* Nenhum PDF público por URL permanente;
* Nenhum dado pessoal em logs;
* Mensagens de erro sem vazamento de informações;
* Registro de IP apenas para auditoria;
* Registro de user agent;
* Política de privacidade;
* Política de retenção documentada;
* Possibilidade administrativa de atender solicitações relacionadas a dados.

O aceite definitivo deve ser imutável pela interface.

---

# 14. PDF

O PDF deve ser gerado no servidor e conter:

* Capa;
* Marca DOXA;
* Título do manual;
* Versão;
* Identificador único do aceite;
* Nome do cliente;
* Empresa;
* E-mail;
* Data e horário;
* Todas as seções;
* Todas as regras;
* Justificativas;
* Exemplos práticos;
* Indicação de que cada item foi lido e aceito;
* Declaração final exata;
* Resumo de comprovação;
* Numeração de páginas;
* Rodapé;
* Hash ou código de verificação.

O PDF não é uma assinatura eletrônica. É um comprovante do processo de ciência e aceite.

Requisitos técnicos:

* A4;
* Tipografia legível;
* Quebras de página corretas;
* Sem textos cortados;
* Sem caracteres quebrados;
* Sem sobreposições;
* Sem páginas vazias desnecessárias;
* Cabeçalhos e rodapés consistentes;
* Boa renderização de português e acentos;
* Arquivo determinístico quando possível;
* Hash SHA-256;
* Armazenamento privado no Supabase.

Crie testes ou verificações para garantir que o PDF:

* É gerado;
* Pode ser aberto;
* Possui páginas;
* Contém o cliente correto;
* Contém a versão correta;
* Contém a declaração;
* Foi armazenado;
* Possui hash correspondente.

---

# 15. ÁREA ADMINISTRATIVA

A área interna deve ser simples, útil e profissional.

## Visão geral

Exibir:

* Total de invites;
* Pendentes;
* Abertos;
* Concluídos;
* Expirados;
* Revogados;
* Versão vigente;
* Conclusões recentes.

## Lista de invites

Permitir:

* Busca por nome;
* Busca por empresa;
* Busca por e-mail;
* Filtro por status;
* Filtro por versão;
* Ordenação por data;
* Paginação;
* Criar invite;
* Copiar link;
* Revogar;
* Regenerar;
* Abrir detalhes;
* Exportar CSV.

## Detalhes do invite

Exibir:

* Dados do cliente;
* Status;
* Versão;
* Criador;
* Datas relevantes;
* Progresso;
* Eventos de auditoria;
* Itens aceitos;
* Metadados;
* PDF;
* Hash;
* Botão de download seguro.

## Manual

Permitir:

* Visualizar versão vigente;
* Criar rascunho;
* Editar seções;
* Editar regras;
* Reordenar;
* Pré-visualizar;
* Publicar nova versão;
* Consultar versões anteriores;
* Impedir edição de versões já aceitas.

Não crie um dashboard excessivamente complexo.

---

# 16. EXPERIÊNCIA VISUAL

O resultado não pode parecer um formulário genérico.

Primeiro reutilize:

* Design system;
* Logo;
* Cores;
* Fontes;
* Ícones;
* Componentes;
* Padrões visuais existentes da DOXA.

Se não houver identidade definida no repositório:

* Crie uma linguagem premium e sóbria;
* Use contraste forte;
* Utilize fundo limpo;
* Evite excesso de cores;
* Escolha apenas uma cor de destaque;
* Não invente uma nova logo;
* Não utilize gradientes exagerados;
* Não transforme o aplicativo em um dashboard SaaS genérico.

A experiência do cliente deve ter:

* Cabeçalho discreto;
* Progresso claro;
* Navegação sequencial;
* Cards de regras;
* Separação visual entre “Faça”, “Não faça” e “Por que isso importa”;
* Exemplos práticos;
* Destaque forte para regras que invalidam a garantia;
* Resumo ao final de cada seção;
* Botões claros;
* Feedback de salvamento;
* Estado de carregamento;
* Estado vazio;
* Estado de erro;
* Confirmação final de alta qualidade.

Use animações sutis, com suporte a `prefers-reduced-motion`.

Priorize celular, pois o cliente provavelmente receberá o invite por WhatsApp.

Teste pelo menos:

* 320 px;
* 375 px;
* 390 px;
* Tablet;
* Desktop;
* Navegação por teclado;
* Leitor de tela;
* Contraste;
* Foco visível;
* Tamanho de alvos de toque.

---

# 17. PRIVACIDADE

Criar uma política curta e clara informando:

* Quais dados são coletados;
* Finalidade;
* Que o objetivo é registrar ciência e aceite;
* Que IP e navegador são registrados para auditoria;
* Onde os dados são armazenados;
* Quem pode acessá-los;
* Como o titular pode solicitar informações;
* Contato da empresa;
* Política de retenção;
* Medidas de segurança adotadas.

Não esconda a coleta de IP ou user agent.

Não reutilize esses dados para marketing.

---

# 18. FASES DE EXECUÇÃO

## Fase 0 — Auditoria

* Ler instruções;
* Examinar repositório;
* Identificar rota;
* Identificar stack;
* Identificar design system;
* Verificar Git;
* Verificar Supabase;
* Verificar testes;
* Mapear riscos.

## Fase 1 — Arquitetura

* Definir integração;
* Definir schema;
* Criar migrations;
* Definir RLS;
* Definir estrutura de conteúdo;
* Definir versionamento;
* Definir tokens;
* Definir PDF;
* Definir plano de testes.

## Fase 2 — Fundação

* Configurar tipos;
* Configurar cliente e servidor Supabase;
* Criar utilitários;
* Criar validações;
* Criar autenticação interna;
* Criar layouts;
* Criar componentes base.

## Fase 3 — Área pública

* Validar invite;
* Criar identificação;
* Criar manual;
* Criar progresso;
* Criar checkboxes;
* Criar revisão;
* Criar declaração;
* Criar conclusão;
* Criar tela final.

## Fase 4 — Backend e PDF

* Implementar transação;
* Implementar idempotência;
* Implementar snapshots;
* Implementar auditoria;
* Gerar PDF;
* Salvar no bucket;
* Criar download seguro.

## Fase 5 — Administração

* Criar login;
* Criar visão geral;
* Criar invites;
* Criar filtros;
* Criar detalhes;
* Criar versões;
* Criar editor;
* Criar exportação.

## Fase 6 — Conteúdo

* Inserir manual completo;
* Revisar linguagem;
* Revisar justificativas;
* Garantir coerência;
* Criar versão inicial;
* Criar reconciliação jurídica interna.

## Fase 7 — Testes e QA

* Lint;
* Typecheck;
* Testes unitários;
* Testes de integração;
* Testes E2E;
* Build;
* Responsividade;
* Acessibilidade;
* PDF;
* Segurança;
* Fluxos negativos;
* Revisão visual.

## Fase 8 — Finalização

* Corrigir tudo que falhar;
* Reexecutar testes;
* Revisar diff;
* Remover código morto;
* Remover logs;
* Atualizar documentação;
* Criar instruções de execução;
* Registrar pendências reais;
* Entregar relatório final.

Não pare entre as fases para pedir aprovação.

---

# 19. TESTES OBRIGATÓRIOS

## Convites

* Criação válida;
* Token não armazenado em texto puro;
* Token inválido;
* Token expirado;
* Token revogado;
* Token concluído;
* Reutilização do link;
* Empresa e e-mail bloqueados;
* Nome obrigatório;
* Regeneração de invite.

## Manual

* Seções na ordem correta;
* Não avança sem marcar tudo;
* Permite voltar;
* Salva progresso;
* Retoma progresso;
* Não trata progresso como aceite;
* Versão correta;
* Snapshot correto.

## Conclusão

* Não conclui sem todos os itens;
* Não confia apenas no cliente;
* Declaração obrigatória;
* Registra horário;
* Registra IP;
* Registra user agent;
* É idempotente;
* Não duplica;
* Gera PDF;
* Salva PDF;
* Calcula hash;
* Marca invite como concluído.

## Administração

* Usuário não autenticado é bloqueado;
* CX acessa funções permitidas;
* Admin acessa configurações;
* Busca funciona;
* Filtros funcionam;
* Download é privado;
* Exportação funciona;
* Versão publicada não é alterada retroativamente.

## Segurança

* RLS verificada;
* Bucket privado;
* Sem exposição da service role;
* Sem PII em logs;
* Validação server-side;
* URLs temporárias;
* Erros seguros.

## Qualidade

Execute os comandos reais existentes no projeto para:

* Lint;
* Typecheck;
* Testes;
* Build.

Não declare sucesso se algum desses comandos não tiver sido executado.

Se houver falha:

1. Investigue;
2. Corrija;
3. Execute novamente;
4. Repita até passar ou até existir um bloqueio real documentado.

---

# 20. DADOS DE DESENVOLVIMENTO

Crie dados de desenvolvimento seguros e claramente fictícios:

* Um usuário administrativo;
* Um usuário de CX;
* Uma versão inicial do manual;
* Um invite pendente;
* Um invite aberto;
* Um invite concluído;
* Um PDF de teste, quando adequado.

Não utilize dados reais do contrato ou informações pessoais de clientes.

Não comite senhas.

Documente como criar o primeiro administrador de forma segura.

---

# 21. DOCUMENTAÇÃO

Atualize ou crie:

* README de execução;
* `.env.example`;
* Instruções do Supabase;
* Instruções de migrations;
* Instruções de criação do bucket;
* Instruções de RLS;
* Instruções de criação do administrador;
* Como executar testes;
* Como gerar um invite;
* Como publicar nova versão;
* Como alterar a rota-base;
* Como fazer deploy na Vercel;
* `docs/LEGAL_RECONCILIATION.md`;
* Resumo de arquitetura.

Se algum passo precisar ser realizado manualmente no Supabase ou Vercel, documente o comando e o local exato.

---

# 22. CRITÉRIOS DE ACEITE

A tarefa só está concluída quando:

* A rota funciona;
* O cliente entra por invite;
* Empresa e e-mail ficam bloqueados;
* O manual é percorrido;
* Todos os checkboxes são obrigatórios;
* Não existe quiz;
* A declaração final funciona;
* O aceite é salvo;
* Os textos aceitos são preservados;
* O PDF completo é gerado;
* O PDF é armazenado de forma privada;
* O cliente consegue baixá-lo na conclusão;
* A equipe consegue consultá-lo;
* A equipe consegue criar invites;
* A equipe consegue gerenciar versões;
* Versões antigas permanecem imutáveis;
* O fluxo é responsivo;
* O fluxo é acessível;
* O banco possui proteção adequada;
* Lint passa;
* Typecheck passa;
* Testes passam;
* Build passa;
* A documentação está atualizada;
* Nenhuma funcionalidade fora do escopo foi adicionada;
* Nenhuma alteração preexistente do usuário foi perdida.

---

# 23. ENTREGA FINAL

Quando terminar, responda com um relatório objetivo contendo:

1. Resultado geral;
2. Rota implementada;
3. Arquitetura utilizada;
4. Telas construídas;
5. Funcionalidades concluídas;
6. Migrations criadas;
7. Variáveis de ambiente necessárias;
8. Testes executados e resultados;
9. Resultado do build;
10. Como executar localmente;
11. Como configurar Supabase;
12. Como publicar na Vercel;
13. Pendências reais;
14. Decisões assumidas;
15. Arquivos principais alterados;
16. Itens que precisam de validação jurídica.

Não encerre com frases genéricas.

Não diga apenas que “a base está pronta”.

Entregue o aplicativo realmente integrado, testado e pronto para revisão.

Comece agora pela auditoria do repositório e continue autonomamente até atingir todos os critérios de aceite.

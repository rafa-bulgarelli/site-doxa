/**
 * ─── OS DOIS CORPOS DE MANCHETE DO CELULAR ───────────────────────────────────
 *
 * E só do celular. Cada `<h2>` continua dono das próprias variantes `sm:`,
 * `md:` e `lg:` — o que mora aqui é exclusivamente o degrau de base, que é o
 * único que o dono pediu para padronizar e o único que podia mudar sem tocar no
 * desktop.
 *
 * O que havia antes eram cinco números sem relação entre si: 1,75rem · 2,8rem ·
 * 1,7rem · 2,9rem · 2,6rem. Nenhum deles era uma decisão — eram cinco ajustes
 * feitos em cinco dias diferentes, cada um resolvendo o próprio arquivo. A
 * pergunta do dono ("esse título está no mesmo tamanho dos demais?") tinha uma
 * resposta constrangedora, e é esta.
 *
 * São DOIS e não um, e a diferença não é estética — é o que o título tem embaixo
 * dele:
 *
 * `TITULO_SECAO` nomeia o título que tem de CEDER altura ao conteúdo dele. É um
 * só hoje: a comparação, com uma fatura de vinte e cinco linhas correndo numa
 * janela medida embaixo dele. Ali cada linha de manchete a mais sai direto do
 * que a pessoa consegue ler, e não há nada elástico para absorver.
 *
 * `MANCHETE` nomeia o título que NÃO paga esse preço — porque é a tela inteira
 * (o convite do painel claro, o FAQ, o rodapé) ou porque o que divide a tela com
 * ele sabe se ajustar. A parede de prova entrou por esta segunda porta, a pedido
 * do dono: o cartão de fecho dela se reduz sozinho ao vão que sobrar
 * (`caberCartao`, em `ProofWall.tsx`), então um título maior ali custa tamanho
 * de cartão — nunca conteúdo cortado.
 *
 * A parede de prova passou por aqui e voltou: subiu para `MANCHETE` a pedido do
 * dono e, vendo na tela, ele a desceu 1,25x — para 2,1rem, que é um corpo
 * próprio dela, escrito no componente. Fica registrado porque a alternativa
 * seria um terceiro token para um consumidor só.
 *
 * `TITULO_SECAO` foi de 1,8 para 2,25rem na mesma rodada, também 1,25x e também
 * a pedido dele. Tem um consumidor: a comparação.
 *
 * Os três de `MANCHETE` convergiram no MENOR dos valores que tinham (2,6rem, do
 * rodapé) de propósito: subir os outros dois para 2,9 seria padronizar para cima
 * sem ninguém ter medido se cabe. Padronizar para baixo não quebra layout
 * nenhum.
 *
 * Se um terceiro papel aparecer um dia, ele nasce aqui — e não como um sexto
 * número solto no meio de um `className`.
 */

/** Título de painel que divide a tela com o conteúdo dele. */
export const TITULO_SECAO = 'text-[2.25rem]';

/** Título que é a própria tela, sem nada abaixo disputando altura. */
export const MANCHETE = 'text-[2.6rem]';

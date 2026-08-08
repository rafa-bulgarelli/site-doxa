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
 * `TITULO_SECAO` nomeia um painel que ainda precisa mostrar outra coisa na mesma
 * tela. A comparação tem uma fatura de vinte e cinco linhas embaixo do título; a
 * parede de prova tem o cartão de fecho aterrissando entre o título e as cifras.
 * Em 2,6rem os dois voltam a ter três linhas de manchete num aparelho de 320, e
 * as três linhas saem do vão do que vem depois — foi exatamente o defeito que o
 * dono relatou nas duas seções.
 *
 * `MANCHETE` nomeia um painel em que o título É a tela: o convite do painel
 * claro, o do FAQ e o do rodapé não dividem a altura com nada que precise ser
 * medido. Ali a manchete pode ocupar o que quiser.
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
export const TITULO_SECAO = 'text-[1.8rem]';

/** Título que é a própria tela, sem nada abaixo disputando altura. */
export const MANCHETE = 'text-[2.6rem]';

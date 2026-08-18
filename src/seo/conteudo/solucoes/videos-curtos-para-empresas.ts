import type { Pagina } from '../../tipos';

/**
 * A página do FORMATO. Volume e operação são de
 * `/solucoes/producao-de-conteudo-em-escala`; aqui a pergunta é o que muda no
 * vídeo em si quando ele é vertical, curto e publicado por uma marca.
 *
 * ─── DE ONDE VEM CADA FATO DESTA PÁGINA ──────────────────────────────────────
 *
 *  · o entregável — vertical, legendado, no formato do feed, pronto para
 *    postar, publicado pelo cliente no perfil dele →
 *    `src/components/HowItWorks.tsx` (`STEPS_PT`), source of truth §2;
 *  · cada vídeo é único, com roteiro, voz clonada, edição e capa →
 *    `supabase/manual-seed-v2.sql`;
 *  · o mesmo arquivo nas três redes, no mesmo dia → `RT-1`
 *    (`supabase/manual-seed-v1.sql`), com a ressalva do contrato;
 *  · "baixou, publicou" e a lista do que não se altera no arquivo entregue →
 *    a regra de integridade do manual do cliente
 *    (`.claude/tower/cards/004-manual-interativo-prompt-mestre.md`;
 *    `supabase/manual-seed-v1.sql`), source of truth §8;
 *  · comentários não devem ser limitados nem desativados → mesma fonte;
 *  · as três redes da garantia → `supabase/manual-seed-v1.sql`; a redação mais
 *    ampla ("TikTok, Instagram, YouTube e outras redes relevantes") →
 *    `src/components/faq/config.ts`, chave `redes`;
 *  · as respostas do FAQ → chaves `redes`, `gravar`, `tom-de-voz` e `reuso`.
 *
 * O que NÃO está aqui: duração ideal, número de segundos do hook, taxa de
 * retenção ou qualquer estatística de plataforma. Não há fonte para nada disso
 * no projeto, e número de mercado inventado é o que o §2 do brief proíbe.
 */
export const pagina: Pagina = {
  tipo: 'solucao',
  slug: 'videos-curtos-para-empresas',
  titulo: 'Vídeos curtos para empresas: o que o formato exige',
  descricao:
    'O que muda quando o vídeo da sua empresa é vertical e curto: hook, legenda, capa, o mesmo arquivo nas três redes e o que a Doxa entrega pronto para postar.',
  h1: 'Vídeos curtos para empresas',
  resumo:
    'Vídeo curto de marca não é o institucional cortado: é vertical, legendado, escrito para prender nos primeiros segundos e feito para ser assistido sem som. A Doxa entrega cada peça pronta para postar — roteiro, voz clonada, edição e capa —, e quem publica no próprio perfil é a empresa.',
  intencao: 'comercial',
  palavrasChave: [
    'vídeos curtos para empresas',
    'produção de vídeos curtos',
    'vídeo vertical para empresa',
    'short form para empresas',
    'vídeo curto de marca',
  ],
  hubs: ['/guias/videos-curtos'],
  relacionadas: [
    '/plataformas/tiktok-para-empresas',
    '/plataformas/instagram-reels-para-empresas',
    '/plataformas/youtube-shorts-para-empresas',
    '/guias/como-fazer-videos-curtos-que-prendem',
    '/glossario/short-form',
  ],
  atualizadoEm: '2026-08-18',
  cta: {
    texto:
      'Mostre o que a sua empresa publica hoje e diga onde quer chegar. O time da Doxa responde em até 24 horas para marcar a auditoria estratégica.',
    rotulo: 'Falar com a Doxa',
  },
  corpo: [
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que caracteriza um vídeo curto de marca',
    },
    {
      tipo: 'paragrafo',
      texto:
        'O formato tem exigências concretas, e elas não são estéticas: são consequências de onde o vídeo é assistido. Ele aparece em tela cheia, num feed que rola, no celular, e com frequência em situações onde o som fica desligado. Cada característica abaixo existe por causa disso.',
    },
    {
      tipo: 'lista',
      itens: [
        '**Vertical.** Ocupa a tela inteira do celular. Vídeo horizontal com tarjas pretas anuncia, antes do primeiro segundo, que aquilo foi feito para outro lugar.',
        '**Legendado.** Legenda não é acessório: quem assiste numa fila, no transporte ou no intervalo do trabalho está com o som desligado, e sem legenda o vídeo depende de uma condição que nem sempre existe.',
        '**Com hook.** Os primeiros segundos não introduzem o assunto: eles entregam o motivo de ficar. Abrir com o logo e a apresentação da empresa é gastar o momento mais caro do vídeo com informação que ninguém pediu.',
        '**Com capa.** É a miniatura no perfil e o que decide se alguém vai assistir depois, quando o vídeo já saiu da distribuição inicial.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O erro mais comum: reaproveitar o vídeo institucional',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Institucional e vídeo curto respondem a perguntas diferentes. O institucional é assistido por quem já decidiu prestar atenção — está no site, na proposta, na reunião —, e por isso pode começar devagar. O vídeo curto disputa atenção com quem não pediu para ver nada e pode sair com um movimento do polegar. Cortar o primeiro em pedaços de trinta segundos produz um vídeo que abre explicando quem é a empresa, o que é exatamente a parte que se perde.',
    },
    {
      tipo: 'destaque',
      variante: 'nota',
      texto:
        'O teste rápido: sem som e sem contexto, alguém entende do que se trata nos primeiros segundos? Se a resposta depende do áudio ou de já conhecer a marca, o vídeo foi feito para outro canal.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O mesmo arquivo, nas três redes, no mesmo dia',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Uma das vantagens práticas do formato é que ele é o mesmo em toda parte. Instagram, TikTok e YouTube Shorts pedem vídeo vertical curto, e um arquivo bem feito serve aos três — na operação da Doxa, publicar o mesmo conteúdo nas três redes, no mesmo dia, é a rotina combinada com quem já é cliente, conforme as condições e o prazo do contrato. O que muda entre as redes é a leitura do resultado e o comportamento da audiência, não o arquivo. Cada plataforma tem a própria página aqui: [TikTok](/plataformas/tiktok-para-empresas), [Reels](/plataformas/instagram-reels-para-empresas) e [YouTube Shorts](/plataformas/youtube-shorts-para-empresas).',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Baixou, publicou',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Esse é o nome da regra de integridade da operação, e ela é mais dura do que parece: o arquivo entregue é publicado como está, sem alterar corte, duração, velocidade, proporção, resolução, música, áudio, voz, legendas, textos, capa, roteiro, estética, elementos gráficos ou marca. Cortar dois segundos "para ficar melhor" muda a peça que foi testada, e o resultado deixa de ser comparável com o que veio antes.',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Na mesma linha, comentários não devem ser limitados nem desativados — comentário ofensivo pode ser excluído, mas fechar a seção corta um sinal de distribuição e uma fonte de assunto para os próximos vídeos.',
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'O que a Doxa entrega, peça por peça',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Cada vídeo é único: roteiro próprio, voz clonada, edição e capa. O que chega ao cliente é o arquivo pronto para postar — vertical, legendado, no formato do feed. Não existe biblioteca de modelo com o logo trocado: dois clientes do mesmo setor não recebem o mesmo vídeo com outra cor.',
    },
    {
      tipo: 'lista',
      itens: [
        'Roteiro escrito para o formato, e não adaptado de um texto de site.',
        'Locução com a voz clonada a partir da amostra que o cliente enviou.',
        'Edição, legenda e capa, entregues no arquivo final.',
        'Publicação no perfil da própria empresa, feita por ela.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Para quem esse formato funciona — e para quem não',
    },
    {
      tipo: 'lista',
      itens: [
        'Funciona para quem tem assunto: empresa que responde perguntas de cliente todo dia tem pauta para meses.',
        'Funciona para quem precisa ser conhecido antes de ser procurado, inclusive em B2B, com linguagem e formatos adaptados.',
        'Não funciona como catálogo: uma sequência de vídeos de produto, sem nada além do produto, é anúncio sem verba.',
        'Não funciona sozinho para venda complexa. Ele abre a porta; quem fecha continua sendo o time comercial.',
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Perguntas frequentes',
    },
    {
      tipo: 'faq',
      itens: [
        {
          pergunta: 'Em quais redes sociais vocês publicam os conteúdos?',
          resposta:
            'A estratégia pode envolver TikTok, Instagram, YouTube e outras redes relevantes para o público da empresa. A distribuição é definida de acordo com o comportamento da audiência e os objetivos de cada operação.',
        },
        {
          pergunta: 'Eu preciso gravar os vídeos ou vocês fazem tudo?',
          resposta:
            'A Doxa consegue assumir grande parte da operação de conteúdo. No onboarding entendemos quais materiais — imagens, vídeos, áudios ou participações — serão necessários. A necessidade de gravação do cliente varia conforme o formato escolhido para a marca.',
        },
        {
          pergunta: 'A Doxa consegue seguir a identidade e o tom de voz da minha marca?',
          resposta:
            'No início da operação, nosso time entende a identidade, o posicionamento, o público, a linguagem e as restrições da empresa. Essas informações passam a orientar a produção, para que o conteúdo mantenha consistência com a marca.',
        },
        {
          pergunta: 'Posso usar os vídeos produzidos por vocês em outras redes ou campanhas?',
          resposta:
            'Em geral sim: os conteúdos produzidos para a marca podem ser aproveitados em diferentes canais próprios, respeitando as condições estabelecidas no contrato. Um mesmo conteúdo também pode ser adaptado para diferentes plataformas e formatos.',
        },
        {
          pergunta: 'Posso editar o vídeo antes de publicar?',
          resposta:
            'A regra da operação é publicar o arquivo exatamente como ele foi entregue, sem alterar corte, duração, velocidade, proporção, resolução, música, áudio, voz, legendas, textos, capa, roteiro, estética, elementos gráficos ou marca. Ajustes de marca são tratados antes, nas etapas de validação, quando o fluxo do cliente exige aprovação.',
        },
      ],
    },
    {
      tipo: 'titulo',
      nivel: 2,
      texto: 'Por onde começar',
    },
    {
      tipo: 'paragrafo',
      texto:
        'Abra os últimos dez vídeos do seu perfil e assista aos três primeiros segundos de cada um, sem som. Quantos deixam claro do que se trata? Esse número costuma explicar o alcance melhor do que qualquer teoria sobre algoritmo. Para fazer essa leitura com o time da Doxa, quem preenche o formulário é chamado em até 24 horas para marcar a auditoria estratégica.',
    },
  ],
};

/* ─── RÉGUA DE COPY — docs/seo/regua-de-copy.md ───────────────────────────────
 * [x]  1. A primeira frase RESPONDE a busca. Sem aquecimento, sem "no mundo
 *          digital", sem "cada vez mais empresas", sem definir o óbvio antes.
 * [x]  2. Todo fato sobre a Doxa tem entrada em docs/seo/source-of-truth.md.
 *          Cliente, número, prazo, preço, garantia e depoimento: zero invenção.
 * [x]  3. Nada da §9 (NÃO PUBLICÁVEL) apareceu — nem parafraseado, nem
 *          "suavizado": preço, mensalidade, fidelidade, direitos do vídeo,
 *          agência licenciada, os 1.500 clientes, "parceiros".
 * [x]  4. Termos proibidos ausentes: "agência" como autodefinição, "parceiros"
 *          para as ferramentas, "assinatura", "curso", "tráfego pago" como
 *          serviço, "garantimos que vai viralizar".
 * [x]  5. Se cita a garantia, usa a redação prudente do FAQ; se usa os números
 *          do manual, vem com "conforme as condições e o prazo do contrato".
 * [x]  6. Motivo real de existir: responde a UMA intenção que nenhuma outra
 *          página do keyword-map já responde (conferir a seção Canibalização).
 * [x]  7. Informação incremental: pelo menos um bloco que a SERP não tem —
 *          mecanismo, número da metodologia, erro comum, exemplo concreto.
 * [x]  8. title exclusivo e orientado a intenção (nunca "Keyword | DOXA"),
 *          description exclusiva de 120–160 caracteres, H1 único, H2/H3 em
 *          hierarquia real.
 * [x]  9. Pertence a ≥1 hub, envia links contextuais e recebe do hub. Nenhum
 *          link decorativo: cada um é útil para quem lê, não para o crawler.
 * [x] 10. Comparativo é IMPARCIAL: admite onde a outra opção ganha. Não
 *          concluir artificialmente que a Doxa é sempre a resposta.
 * [x] 11. CTA por intenção — topo de funil: próximo conteúdo; meio:
 *          metodologia/prova; fundo: o formulário (#forms). Um só, no fim.
 * [x] 12. Sem keyword stuffing: a keyword-alvo aparece onde caberia se o
 *          Google não existisse. Sem sinônimo empilhado, sem lista de cidades.
 * [x] 13. Frases do dono usadas palavra por palavra quando existem ("pronto
 *          para postar", "views somadas", "clone"). Vocabulário do §10.
 * [x] 14. Teste final (§45): "eu publicaria isso se o Google não existisse?"
 *          Se não, reescrever — não ajustar.
 * ────────────────────────────────────────────────────────────────────────── */

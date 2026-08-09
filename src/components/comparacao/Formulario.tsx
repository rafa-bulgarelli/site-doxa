import { useEffect, useRef, useState, type RefObject } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { ID_CARTAO_PEDIDO } from '../../ancoras';
// O mesmo facho do hero, apontado para dentro deste cartão. É genérico apesar da
// pasta: recebe o container e escreve a posição do ponteiro nele. Custo zero de
// bundle, e é o que faz o único elemento clicável da página responder à mão.
import { DotGridSpotlight } from '../hero/DotGridSpotlight';
import { BordaViva } from './BordaViva';
import { CampoVivo } from './CampoVivo';
import { Escolha } from './Escolha';
import { MotionButton } from '../ui/MotionButton';
import {
  AUDITORIA,
  FICHA,
  FICHA_CONVITE,
  FICHA_FIM,
  FILTRO,
  NO_AR,
  OUTRO,
  PAGAMENTO_CHAMADA,
  PAGAMENTO_TITULO,
  PAGAMENTOS,
  RETORNO,
  type PerguntaFicha,
} from './config';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * O vermelho do erro, clareado para o papel escuro.
 *
 * É o mesmo sinal que o painel claro usava, com luminosidade suficiente para se
 * ler sobre `#0D0D0D` — o tom original desaparecia no fundo do cartão, e um erro
 * que não se lê é um formulário que trava sem dizer por quê. Cor com função, que
 * é a única exceção que a regra monocromática abre.
 */
const ERRO = '#E8938C';

interface Passo {
  chave: 'caminho' | 'nome' | 'whatsapp' | 'arroba';
  /** O nome da etapa na trilha do topo. Uma palavra, senão não é uma trilha. */
  rotulo: string;
  pergunta: string;
  dica: string;
  /**
   * As respostas prontas. Com elas o passo é de TOQUE e não de digitação: some o
   * campo, entram as pílulas, e a escolha avança sozinha.
   */
  opcoes?: readonly string[];
  /** Só nos passos de digitar. */
  exemplo?: string;
  tipo?: 'tel' | 'text';
  /** Devolve o erro, ou `null` se estiver bom. */
  valida: (valor: string) => string | null;
  /** Formata enquanto se digita. */
  formata?: (valor: string) => string;
}

/**
 * O celular brasileiro, formatado enquanto se digita.
 *
 * A máscara existe por um motivo prático antes de estético: com ela, o campo
 * diz sozinho quantos dígitos faltam. Sem ela, a pessoa só descobre que errou
 * quando aperta o botão — e no passo em que ela está decidindo se entrega o
 * contato, ser corrigido é um bom motivo para desistir.
 */
function mascaraTelefone(valor: string) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  if (digitos.length <= 2) return digitos.length > 0 ? `(${digitos}` : '';
  if (digitos.length <= 7) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

/**
 * As perguntas, e a ordem delas é decisão de conversão.
 *
 * O CAMINHO abre a fila, a pedido do dono, e ele é o passo mais barato que este
 * formulário podia ter: dois toques possíveis, nenhuma tecla, nenhum dado
 * pessoal. A primeira pergunta é a que decide se a pessoa entra, e uma que se
 * responde com o polegar entra mais gente do que uma que pede o nome — mesmo o
 * nome sendo barato. E ela paga duas vezes: separa, já na porta, o cliente do
 * FRANQUEADO, que são duas conversas comerciais diferentes e hoje chegavam
 * misturadas na mesma caixa.
 *
 * Depois o nome, que é o compromisso mais barato que existe — ninguém desiste de
 * um formulário por ter dito como se chama. O WhatsApp é o dado caro, e ele vem
 * quando a pessoa já não está começando e sim terminando. Perguntado primeiro,
 * ele é uma catraca na porta.
 */
const PASSOS: readonly Passo[] = [
  {
    chave: 'caminho',
    rotulo: 'Caminho',
    pergunta: 'O que melhor te descreve?',
    dica: 'Só para a conversa começar do lugar certo.',
    /* PENDENTE-DONO: as duas frases são dele, palavra por palavra. A segunda é
       uma afirmação sobre o negócio — "agência licenciada" promete que existe um
       programa de licenciamento com condições. Se ainda não existir fechado, é
       melhor a porta não estar na página do que estar e a resposta ser "ainda
       não temos isso pronto" na primeira ligação. */
    opcoes: ['Quero viralizar minha empresa', 'Quero ser uma agência licenciada'],
    valida: (v) => (v.length === 0 ? 'Escolhe uma das duas.' : null),
  },
  {
    chave: 'nome',
    rotulo: 'Nome',
    pergunta: 'Como a gente te chama?',
    dica: 'Para a primeira mensagem não começar fria.',
    exemplo: 'Seu nome completo',
    tipo: 'text',
    valida: (v) => (v.trim().length < 2 ? 'Escreve o seu nome.' : null),
  },
  {
    chave: 'whatsapp',
    rotulo: 'WhatsApp',
    pergunta: 'Qual é o seu WhatsApp?',
    dica: 'É por lá que o consultor fala com você.',
    exemplo: '(11) 98765-4321',
    tipo: 'tel',
    formata: mascaraTelefone,
    valida: (v) => {
      const digitos = v.replace(/\D/g, '');
      if (digitos.length < 10) return 'Faltam dígitos. Com DDD, por favor.';
      if (digitos.length > 11) return 'Número comprido demais.';
      return null;
    },
  },
  {
    chave: 'arroba',
    rotulo: 'Perfil',
    pergunta: 'Qual é o @ da sua empresa?',
    dica: 'A gente olha o perfil antes de conversar.',
    exemplo: '@suaempresa',
    tipo: 'text',
    /* O @ nasce no campo e não sai dele.
   
       Sem isto a pessoa digitava o nome do perfil e o formulário guardava
       "suaempresa" numa metade das vezes e "@suaempresa" na outra — e quem
       paga a diferença é o consultor, colando um e outro na busca. Com a
       arroba plantada, não há duas formas de responder: ela está lá antes da
       primeira tecla, e apagar tudo devolve ela em vez de esvaziar o campo.
   
       A limpeza tira TODOS os @ antes de repor um: colar "@@empresa" ou
       "instagram.com/@empresa" com o @ no meio deixaria dois. */
    formata: (v) => `@${v.replace(/[@\s]/g, '')}`,
    valida: (v) => (v.replace(/[@\s]/g, '').length < 2 ? 'Falta o @ do perfil.' : null),
  },
];

/**
 * O que a pessoa responde quando não tem perfil para responder.
 *
 * O passo do @ exigia um @ válido para deixar avançar, e isso trava exatamente
 * quem esta página foi feita para atender: o lead do site é quem NÃO posta, e
 * boa parte dele não tem perfil de empresa nenhum. Sem saída, essa pessoa
 * abandona no último passo antes do pagamento ou inventa um @ — e um @ inventado
 * é pior que campo vazio, porque o consultor abre, não acha, e chega achando que
 * errou o cadastro.
 *
 * É uma frase e não um traço: ela vai aparecer na ficha de resposta e na mão do
 * consultor, e ali "—" é ambíguo entre "não tem" e "não perguntaram".
 */
const SEM_PERFIL = 'ainda não tenho';

/*
 * ─── O AVANÇO AUTOMÁTICO SAIU, e com ele o `RESPIRO_TOQUE` ───────────────────
 *
 * As perguntas de resposta única viravam a tela sozinhas, um terço de segundo
 * depois do toque. A intenção era boa e é a de todo formulário rápido: menos um
 * clique por pergunta. O dono desligou, e a razão dele vale mais do que o
 * clique economizado — uma tela que vira sozinha tira da pessoa a chance de
 * reler o que escolheu, e nesta o que ela está escolhendo é por qual porta vai
 * entrar. Errar e só descobrir na tela seguinte é pior do que tocar em
 * "Continuar".
 *
 * Agora TODA passagem é deliberada: escolhe-se, confere-se, avança-se. O
 * `relogio` continua existindo para a espera do pagamento, que é o único
 * adiamento que sobrou nesta tela.
 */

/**
 * Os passos que vêm depois das perguntas, na ordem em que acontecem.
 *
 * `RECEBIDO` é o fim do que o dono precisa: contato e dinheiro. Tudo a partir
 * dali é bônus e por isso é pulável — a ficha é um favor pedido a quem já pagou,
 * e favor não se cobra com trava.
 */
const PAGAMENTO = PASSOS.length;
const RECEBIDO = PASSOS.length + 1;
const FICHA_INICIO = PASSOS.length + 2;
const FIM = FICHA_INICIO + FICHA.length;

type ChaveFicha = PerguntaFicha['chave'];

/**
 * O formulário do painel claro: três perguntas, o pagamento e a confirmação.
 *
 * É um CARTÃO PRETO sobre o papel, e essa é a decisão que organiza todo o resto.
 * A página inteira é preta e o creme é a exceção que responde a ela; devolver o
 * preto ao pedido fecha o arco — a marca reaparece exatamente no instante do
 * compromisso, e o único elemento que precisa de clique volta a ter o contraste
 * máximo da página. Não é um elemento novo: é a mesma superfície dos cartões do
 * hero e dos painéis de "Como funciona" (`bg-doxa-surface`, dot-grid por dentro,
 * borda que clareia quando é a vez dela) aparecendo na hora certa.
 *
 * Sobre creme, sombra preta finalmente existe — sobre preto ela não existia. É
 * ela que faz o cartão ler como objeto POUSADO no papel em vez de impresso nele.
 *
 * Uma pergunta por vez, e a razão é de conversão, não de efeito. Um bloco com
 * três campos abertos é uma tarefa; uma pergunta com um campo é uma resposta. A
 * pessoa se compromete com a primeira tecla, e a partir daí está terminando algo
 * que começou — que é uma força bem maior do que a de começar.
 *
 * O que já foi respondido fica visível em fichas acima, e cada ficha volta para
 * o seu passo com um clique. É o que impede a sensação de funil sem saída: dá
 * para corrigir sem recomeçar.
 *
 * O `ref` do cartão vem de FORA porque a seção precisa da geometria dele: é nele
 * que o fio vindo do argumento aterrissa, e quem desenha o fio é o painel.
 *
 * PENDENTE-DONO — duas coisas ainda não existem por baixo:
 *
 * 1. O PAGAMENTO. O passo está desenhado e desligado, a pedido do dono. Quando
 *    a conta do provedor estiver de pé, o botão deste passo passa a criar a
 *    cobrança e os campos de cartão entram no lugar da lista de métodos. Nada
 *    aqui simula pagamento aprovado: a tela de confirmação fala de dados
 *    recebidos e de retorno em 24 horas, que continua verdade depois de ligado.
 * 2. O DESTINO DO LEAD. Ainda não foi decidido para onde vão as respostas, e
 *    enquanto não for, este formulário NÃO PODE IR AO AR — alguém preencheria,
 *    veria a confirmação e ninguém receberia nada. A ficha do consultor
 *    multiplicou o tamanho desse pendente: são oito campos esperando um cano
 *    que não existe. Toda a saída passa por `enviar()`, que é uma função só, de
 *    propósito: quando o destino for decidido, é ali dentro e em nenhum outro
 *    lugar que o `fetch` entra.
 */
export function Formulario({ cartaoRef }: { cartaoRef: RefObject<HTMLDivElement> }) {
  const [passo, setPasso] = useState(0);
  const [dados, setDados] = useState({ caminho: '', nome: '', whatsapp: '', arroba: '@' });
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  /** Para onde a animação corre: 1 avança, -1 volta. */
  const [sentido, setSentido] = useState(1);
  /** As respostas da ficha. Sempre lista, inclusive nas perguntas de uma só. */
  const [respostas, setRespostas] = useState<Partial<Record<ChaveFicha, string[]>>>({});
  /** O que foi escrito no campo que a opção `OUTRO` abre. */
  const [livres, setLivres] = useState<Partial<Record<ChaveFicha, string>>>({});
  const campoRef = useRef<HTMLInputElement>(null);
  const parado = useReducedMotion() === true;

  /*
   * Um relógio só para os dois adiamentos da tela, e ele é limpo na saída.
   *
   * O da cobrança e o do respiro do toque nunca correm juntos — são fases
   * diferentes do mesmo formulário —, então um `ref` basta. O que ele impede é
   * o caso feio: a seção é `lazy`, e um `setPasso` disparando depois de o
   * componente sair de cena é aviso no console em desenvolvimento e trabalho
   * jogado fora em produção.
   */
  const relogio = useRef<number>();
  useEffect(() => () => window.clearTimeout(relogio.current), []);

  /**
   * Quando o cartão sobe.
   *
   * Ele NÃO entra junto com o painel. O painel claro gira, assenta, e só então o
   * cartão chega — ser a última coisa a aparecer é o que o torna a coisa que
   * chegou. Metade dele visível já basta como sinal: o painel entra girado, e
   * esperar por mais adiaria a entrada até depois de o giro terminar.
   */
  const naTela = useInView(cartaoRef, { amount: 0.5, once: true });

  const atual = PASSOS[passo];
  const naFicha = passo >= FICHA_INICIO && passo < FIM;
  const fichaAtual = naFicha ? FICHA[passo - FICHA_INICIO] : undefined;

  /*
   * O foco segue o passo — mas SÓ quando o passo muda de verdade.
   *
   * Sem o foco automático, cada avanço obriga a pessoa a clicar no campo antes
   * de digitar: três cliques a mais num formulário de três campos. Com ele
   * rodando também na MONTAGEM, o preço era muito maior, e foi o dono quem
   * encontrou: recarregar a página no topo e ver o site descer sozinho até o
   * fim da comparação, segundos depois de carregar.
   *
   * A cadeia é esta, e nenhum pedaço dela é visível de dentro deste arquivo: as
   * seções são `lazy` em `App.tsx`, então o pedaço da comparação chega DEPOIS
   * do primeiro desenho; ao chegar, este efeito rodava uma vez com `passo` 0 e
   * focava o campo; e focar um elemento fora da tela faz o navegador rolar até
   * ele. Nenhuma linha do site mandava rolar — foi um `focus()` que rolou.
   *
   * A guarda é o passo ANTERIOR num ref, e não uma bandeira de "já montou":
   * `StrictMode` roda cada efeito duas vezes no desenvolvimento, e uma bandeira
   * ligada na primeira passagem deixaria a segunda focar assim mesmo — o bug
   * sobreviveria exatamente onde ele é testado.
   *
   * `preventScroll` fica de cinto de segurança para os avanços seguintes: aí o
   * formulário já está na tela e sob a mão da pessoa, e não há motivo para o
   * navegador reposicionar nada.
   */
  const passoAnterior = useRef(passo);
  useEffect(() => {
    if (passoAnterior.current === passo) return;
    passoAnterior.current = passo;
    // Passo de toque não tem campo para focar — e chamar `focus` num `null`
    // seria inofensivo, mas a intenção fica escrita.
    if (atual != null && atual.opcoes == null) campoRef.current?.focus({ preventScroll: true });
  }, [passo, atual]);

  const avancar = () => {
    if (atual == null) return;
    const problema = atual.valida(dados[atual.chave]);
    if (problema != null) {
      setErro(problema);
      return;
    }
    setErro(null);
    setSentido(1);
    setPasso((p) => p + 1);
  };

  const voltar = (destino: number) => {
    // Cinto de segurança: qualquer adiamento pendurado morre aqui. Hoje só a
    // espera do pagamento usa o relógio, e ela não convive com o voltar — mas um
    // temporizador que dispara DEPOIS de a pessoa pedir para ir para trás é o
    // pior tipo de defeito, o que desfaz a ação, e a linha custa nada.
    window.clearTimeout(relogio.current);
    setErro(null);
    setSentido(-1);
    setPasso(destino);
  };

  /** Segue sem cobrar nada de ninguém. É o avanço da ficha, e o pulo também. */
  const seguir = () => {
    setSentido(1);
    setPasso((p) => p + 1);
  };

  /**
   * A saída de emergência do passo do @.
   *
   * Não valida porque não há o que validar: a pessoa está declarando a ausência
   * do dado, e a ausência é uma resposta legítima aqui. Escrever no campo em vez
   * de só pular mantém a ficha de resposta honesta — quem voltar vê o que foi
   * respondido, e o consultor recebe a frase em vez de um vazio.
   */
  const semPerfil = () => {
    setDados((d) => ({ ...d, arroba: SEM_PERFIL }));
    setErro(null);
    setSentido(1);
    setPasso((p) => p + 1);
  };

  /**
   * As respostas da ficha como elas vão sair daqui.
   *
   * `OUTRO` nunca é resposta: é o rótulo do botão que abre o campo. O que sai é
   * o que foi escrito, e se nada foi escrito, não sai nada — uma lista com a
   * palavra "Outro" dentro diria ao consultor exatamente o que ele já sabia.
   */
  const respostaFinal = () =>
    Object.fromEntries(
      FICHA.map((pergunta) => {
        const marcadas = respostas[pergunta.chave] ?? [];
        const resolvidas = marcadas
          .map((opcao) => (opcao === OUTRO ? (livres[pergunta.chave] ?? '').trim() : opcao))
          .filter((opcao) => opcao.length > 0);
        return [pergunta.chave, resolvidas];
      }),
    );

  /**
   * O ÚNICO lugar por onde os dados saem deste formulário.
   *
   * PENDENTE-DONO: hoje ela monta a carga e não a manda para lugar nenhum,
   * porque o destino não foi decidido. É de propósito que exista assim mesmo, e
   * vazia: com uma função só, ligar o formulário é escrever um `fetch` aqui
   * dentro; sem ela, seria caçar três pontos de saída em duas fases do fluxo e
   * descobrir o terceiro em produção.
   *
   * Ela é chamada duas vezes por lead, e as duas importam sozinhas: em
   * `contato`, com o que foi pago — e essa não pode se perder por nada; em
   * `ficha`, com o contexto, que é bônus. Quando o cano existir, a primeira
   * precisa de repetição em caso de falha, a segunda não.
   */
  const enviar = (etapa: 'contato' | 'ficha') => {
    return { etapa, ...dados, ...respostaFinal() };
  };

  /*
   * A ficha sai quando ela termina, tenha sido respondida ou pulada inteira.
   *
   * Num efeito e não no clique porque há três saídas para o fim — o botão, o
   * pulo e o avanço automático da última pergunta —, e a que fosse esquecida
   * seria a que perde o lead mais completo do dia. O `ref` é a guarda contra o
   * `StrictMode`, que roda cada efeito duas vezes no desenvolvimento: sem ele,
   * a ficha chegaria em duplicata exatamente onde ela é testada.
   */
  const jaMandou = useRef(false);
  useEffect(() => {
    if (passo !== FIM || jaMandou.current) return;
    jaMandou.current = true;
    enviar('ficha');
    // `enviar` fica fora das dependências de propósito: ela é recriada a cada
    // desenho e entraria num laço com o próprio efeito que dispara.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passo]);

  /**
   * O toque numa resposta da ficha.
   *
   * A de várias respostas junta e tira; a de resposta única substitui. Nenhuma
   * das duas avança sozinha — ver a nota do `RESPIRO_TOQUE` removido, lá em
   * cima. O botão é a única passagem, aqui e no primeiro passo.
   */
  const escolher = (pergunta: PerguntaFicha, opcao: string) => {
    if (pergunta.multipla === true) {
      // A lista sai de dentro do próprio `set`, e não da leitura do desenho:
      // dois toques na mesma passagem — que é o que acontece quando alguém
      // marca duas travas depressa — leriam o mesmo estado velho, e a segunda
      // marca apagaria a primeira.
      setRespostas((r) => {
        const marcadas = r[pergunta.chave] ?? [];
        return {
          ...r,
          [pergunta.chave]: marcadas.includes(opcao)
            ? marcadas.filter((o) => o !== opcao)
            : [...marcadas, opcao],
        };
      });
      return;
    }
    setRespostas((r) => ({ ...r, [pergunta.chave]: [opcao] }));
  };

  const pagar = () => {
    // PENDENTE-DONO: aqui entra a criação da cobrança. Hoje só atravessa para a
    // confirmação, com a espera de propósito — para o passo ser sentido no
    // protótipo como ele vai ser sentido de verdade.
    setEnviando(true);
    relogio.current = window.setTimeout(() => {
      setEnviando(false);
      setSentido(1);
      setPasso(RECEBIDO);
      enviar('contato');
    }, 900);
  };

  const desliza = parado
    ? {}
    : {
        initial: { opacity: 0, x: sentido * 28 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: sentido * -28 },
        transition: { duration: 0.42, ease: EASE },
      };

  return (
    <motion.div
      ref={cartaoRef}
      /* HANDLE DE MEDIDA, e não destino de botão: o FAQ lê o PÉ deste cartão
         para calcular o próprio recuo de topo. Quem recebe os cliques é
         `#forms`, o painel claro inteiro — `ancoras.ts` explica os dois. */
      id={ID_CARTAO_PEDIDO}
      initial={parado ? undefined : { opacity: 0, y: 28, scale: 0.98 }}
      animate={naTela ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.75, ease: EASE, delay: 0.15 }}
      // A borda abre de 11% para 22% com a mão em cima — a mesma regra que diz
      // qual painel tem a vez em "Como funciona". Sem escala: o cartão é uma
      // superfície, não um botão, e uma superfície que cresce ao ser apontada
      // promete um clique que ela não aceita.
      //
      // `w-full` e ponto: a largura é decidida pela coluna do grid, que vale 40%
      // da tela e cresce com ela. Um `max-w` aqui seria uma segunda opinião
      // sobre o mesmo número, e a que ganha é sempre a menor.
      //
      // `cartao-pedido` é o gancho do piscar: o CSS liga a cintilação dos pontos
      // quando o ponteiro está sobre ESTE cartão. Uma classe própria, e não o
      // `group` do Tailwind — `group` sem nome também casaria com o `group-hover`
      // do botão lá dentro, e o disco dele se encheria com a mão em qualquer
      // canto do cartão, longe do botão.
      // Tres sombras, tres trabalhos. A preta longa assenta o cartao no papel.
      // A branca externa e' o halo que o descola do creme. E a branca INTERNA e'
      // a que o dono pediu: contra o preto do miolo, ela e' a unica que se ve
      // como fumaca, subindo pelas bordas para dentro. Uma so' por fora nao
      // aparece sobre papel claro, e uma so' por dentro deixa o cartao chapado
      // contra o creme.
      className="cartao-pedido relative w-full overflow-hidden rounded-3xl border border-white/[0.16] bg-doxa-surface shadow-[0_40px_100px_-40px_rgba(0,0,0,0.5),0_0_60px_-14px_rgba(255,255,255,0.28),inset_0_0_70px_-24px_rgba(255,255,255,0.22)] transition-[border-color,box-shadow] duration-500 hover:border-white/[0.3] hover:shadow-[0_52px_120px_-40px_rgba(0,0,0,0.6),0_0_80px_-12px_rgba(255,255,255,0.4),inset_0_0_80px_-20px_rgba(255,255,255,0.3)]"
    >
      {/* A 25% e não a 40%: a grade em repouso corre por baixo da pergunta e do
          campo, e ali ela é textura, não desenho. Vê-la é o defeito. */}
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-25" />
      <DotGridSpotlight containerRef={cartaoRef} className="is-forte" />
      {/* A luz por dentro. Um retângulo preto chapado no creme lê como buraco no
          papel; com um clarão no topo ele lê como objeto iluminado — que é o
          mesmo vocabulário do `hero-glow`, a única forma de destaque que a marca
          permite. */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(85%_55%_at_50%_0%,rgba(255,255,255,0.07),transparent_70%)]" />
      {/* O sinal que chegou pelo fio continua aqui, contornando o cartão. */}
      <BordaViva alvoRef={cartaoRef} />

      <div className="relative p-8 md:p-12">
        {/* ── O NOME DO QUE ESTÁ SENDO PREENCHIDO.

            O cartão não se apresentava: quem chegava por um dos botões de CTA
            caía numa trilha de etapas e num campo de nome, sem nada dizendo o
            que aquilo era. Com o título, o mesmo objeto deixa de ser "mais um
            cadastro" e passa a ser uma AUDITORIA — a palavra que justifica os
            R$ 100 três passos antes de eles aparecerem.

            Fora da condição da trilha, de propósito: ele vale em TODOS os
            passos, inclusive na confirmação. É o nome da coisa, não o de uma
            fase dela.

            Caixa alta pelo CSS e não no texto, e a diferença não é estética —
            uma constante escrita em maiúsculas chega gritada em qualquer outro
            lugar que a use, e leitor de tela soletra o que parece sigla. */}
        <motion.p
          initial={parado ? undefined : { opacity: 0, y: -6 }}
          animate={naTela || parado ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
          className="mb-6"
        >
          {/* Serifa e a FITA DO FAQ, a pedido do dono — o mesmo
              `texto-aceso-siri` de "Pergunte o que quiser.", que é o efeito que
              ele apontou como referência.

              Foi de 11 a 17, a 20/24 e agora ao dobro — 40 no telefone, 48 no
              desktop —, e cada degrau teve o mesmo motivo: o gradiente é
              recortado na FORMA dos glifos, e quanto mais fino o traço menos
              faixa de cor cabe dentro dele. A 11px o efeito existia no CSS e
              não na tela.

              No dobro ele deixou de ser um rótulo acima do formulário e passou
              a ser o TÍTULO do cartão — que é o que ele sempre disse ser. No
              telefone a frase ocupa duas linhas nos 216 pixels úteis, e é o
              certo: duas linhas de serifa grande são um título, uma linha de
              corpo pequeno era uma etiqueta.

              `sem-halo` desliga a auréola e deixa só a cor, a pedido do dono. É
              o tamanho que pede: o glow é uma auréola por glifo, e em serifa de
              48px ele engrossa o traço até a letra perder desenho. No FAQ, com a
              frase menor, ele continua — lá é o que a descola do fundo.

              E saiu o versalete, a pedido do dono: só a primeira letra. Com ele
              saiu o `tracking` largo, que existe para abrir caixa alta e em
              caixa de frase só afrouxa a palavra. A linha deixou de ser etiqueta
              e virou o NOME do que está sendo preenchido.

              O efeito vive num `span` e a margem no `<p>` de fora, de propósito:
              `.texto-aceso-siri` usa `margin-bottom` negativa para o gradiente
              alcançar as pernas dos glifos, e ela apagaria um `mb-6` posto no
              mesmo elemento. Duas caixas, duas responsabilidades. */}
          <span className="texto-aceso-siri sem-halo font-serif text-[40px] tracking-[-0.02em] text-[#F4F1E8] md:text-[48px]">
            {AUDITORIA}
          </span>
        </motion.p>

        {/* O andamento. Três de três é curto o bastante para ser dito por extenso,
            e dizer quantos faltam é o que impede a pessoa de imaginar dez. */}
        {/* ── A trilha das etapas, e ela tem NOME.

            Era "01 / 03" com uma barra ao lado, e o dono leu como morto — com
            razão: uma fração informa quanto falta e não diz nada sobre o quê.
            Com os nomes à vista, a pessoa vê a tarefa inteira antes de começar
            — nome, WhatsApp, perfil — e o que ela avalia deixa de ser "quantas
            perguntas ainda vêm" e passa a ser "isso é rápido".

            Três estados, três tratamentos: a etapa da vez é a única em papel
            cheio, com o texto em preto e o mesmo halo da borda do cartão; as
            respondidas ficam com o fio verde e o visto, no verde do selo "Com
            Doxa"; as que faltam são só um contorno apagado. É a linha do tempo
            do preenchimento, e cada resposta acende um pedaço dela. */}
        {passo < PAGAMENTO && (
          <div className="flex flex-wrap items-center gap-2">
            {PASSOS.map((p, i) => {
              const feito = i < passo;
              const agora = i === passo;
              return (
                <motion.span
                  key={p.chave}
                  initial={parado ? undefined : { opacity: 0, y: -8 }}
                  animate={naTela || parado ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.35 + i * 0.09 }}
                  /* `whitespace-nowrap` e peso de fonte IGUAL nos três
                     estados. A etapa da vez tinha `font-medium`, e uma pílula
                     que engorda ao ficar ativa muda de largura — com `flex-wrap`
                     na fila, isso é capaz de empurrar a terceira para a linha de
                     baixo e mudar a altura do cartão inteiro no meio do
                     preenchimento. O destaque vem do fundo, que não ocupa
                     espaço nenhum. */
                  /* Creme cheio com halo branco na etapa da vez, e é a volta
                     de onde a trilha já esteve.

                     Ela passou uma rodada com a fita colorida do FAQ
                     preenchendo a pílula, a pedido do dono, e ele a desfez ao
                     ver na tela — com razão, e a razão é hierarquia: a fita é a
                     coisa mais chamativa do cartão e o TÍTULO dele já a usa. Nos
                     dois lugares ao mesmo tempo, ela deixava de apontar para
                     alguma coisa e virava a decoração do cartão.

                     O verde do `feito` continua: não é decoração, é o mesmo
                     verde do selo "Com Doxa" — a mesma afirmação dita sobre a
                     empresa e sobre o campo que a pessoa acabou de responder. */
                  className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] leading-none transition-colors duration-500 ${
                    agora
                      ? 'border-transparent bg-[#F4F1E8] text-[#0B0B0B]'
                      : feito
                        ? 'text-[#F4F1E8]'
                        : 'border-white/[0.12] text-white/30'
                  }`}
                  style={
                    agora
                      ? { boxShadow: '0 0 18px -2px rgba(255,255,255,0.55)' }
                      : feito
                        ? { borderColor: `${NO_AR}80`, background: `${NO_AR}1a` }
                        : undefined
                  }
                >
                  {feito ? (
                    <Check className="h-3 w-3 shrink-0" strokeWidth={3} style={{ color: NO_AR }} />
                  ) : (
                    <span className="tabular-nums opacity-60">{String(i + 1).padStart(2, '0')}</span>
                  )}
                  {p.rotulo}
                </motion.span>
              );
            })}
          </div>
        )}

        {/* O que já foi dito, em fichas que voltam ao passo com um clique. */}
        {passo > 0 && passo <= PAGAMENTO && (
          <div className="mt-5 flex flex-wrap gap-2">
            {PASSOS.slice(0, Math.min(passo, PASSOS.length)).map((p, i) => (
              <motion.button
                key={p.chave}
                type="button"
                onClick={() => voltar(i)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.05] px-3 py-1.5 text-[12px] text-white/60 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
              >
                <Check className="h-3 w-3 shrink-0" strokeWidth={2.5} />
                {dados[p.chave]}
              </motion.button>
            ))}
          </div>
        )}

        {/* Um piso para o corpo do cartão — piso, e não altura fixa. As três
            perguntas têm o mesmo desenho e já saem quase da mesma altura; o que
            este número impede é o cartão DESABAR num passo mais curto que os
            outros e o papel embaixo pulsar junto. Travar a altura no maior dos
            passos seria a outra ponta do mesmo erro: um vão morto no pé do
            cartão em todos os passos, para acertar um. */}
        <div className="min-h-[19rem]">
          <AnimatePresence mode="wait" initial={false}>
            {atual != null && (
              <motion.div key={atual.chave} {...desliza} className="mt-7">
                {/* `<label>` quando há campo, `<div>` quando não há.

                    Um rótulo é a etiqueta de um controle e existe para que
                    clicar nele foque o controle. No passo de toque não existe
                    controle único — são duas pílulas —, e um `htmlFor`
                    apontando para um `id` que não existe é uma promessa quebrada
                    para o leitor de tela. Ali o enunciado vira texto com `id`, e
                    quem se amarra a ele é o `role="group"` das opções. */}
                {atual.opcoes != null ? (
                  <div>
                    <p
                      id={`campo-${atual.chave}`}
                      className="block font-serif text-[1.75rem] leading-[1.1] tracking-[-0.02em] text-white md:text-[2.35rem]"
                    >
                      {atual.pergunta}
                    </p>
                    <p className="mt-2 block text-[15px] text-white/70">{atual.dica}</p>
                  </div>
                ) : (
                  <label htmlFor={`campo-${atual.chave}`} className="block">
                    <span className="block font-serif text-[1.75rem] leading-[1.1] tracking-[-0.02em] text-white md:text-[2.35rem]">
                      {atual.pergunta}
                    </span>
                    {/* 15px e 70% de branco, e os dois números subiram juntos
                        por um motivo só: esta linha é a que responde "por que
                        você quer isso de mim?" — a única defesa que o formulário
                        tem contra a pessoa desistir de entregar o dado. Escrita
                        em 13px a 45%, ela existia sem ser lida. */}
                    <span className="mt-2 block text-[15px] text-white/70">{atual.dica}</span>
                  </label>
                )}

                {atual.opcoes != null ? (
                  /* A MESMA `Escolha` da ficha do consultor, reusada aqui.

                     Ela já sabe tudo o que este passo precisa — pílulas de
                     toque, estado marcado, foco visível, `aria-pressed` — e
                     reusá-la é o que faz o primeiro passo e as cinco perguntas
                     do fim parecerem o mesmo formulário. Um segundo componente
                     de pílula divergiria no primeiro ajuste de espessura de
                     borda.

                     Escolher NÃO avança: a passagem é o botão "Continuar",
                     aqui como em toda pergunta de toque deste formulário. Ver a
                     nota sobre o avanço automático removido, no alto do
                     arquivo. */
                  <div className="mt-6">
                    <Escolha
                      rotuladoPor={`campo-${atual.chave}`}
                      opcoes={atual.opcoes}
                      escolhidas={dados[atual.chave] === '' ? [] : [dados[atual.chave]]}
                      multipla={false}
                      empilhada
                      textoLivre=""
                      aoEscolher={(opcao) => {
                        setDados((d) => ({ ...d, [atual.chave]: opcao }));
                        setErro(null);
                      }}
                      aoEscreverLivre={() => {}}
                      aoConfirmarLivre={avancar}
                    />
                  </div>
                ) : (
                  <CampoVivo
                    id={`campo-${atual.chave}`}
                    valor={dados[atual.chave]}
                    exemplo={atual.exemplo ?? ''}
                    tipo={atual.tipo ?? 'text'}
                    autoComplete={
                      atual.chave === 'whatsapp' ? 'tel' : atual.chave === 'nome' ? 'name' : 'off'
                    }
                    invalido={erro != null}
                    descritoPor={erro != null ? `erro-${atual.chave}` : undefined}
                    campoRef={campoRef}
                    aoDigitar={(bruto) => {
                      const valor = atual.formata != null ? atual.formata(bruto) : bruto;
                      setDados((d) => ({ ...d, [atual.chave]: valor }));
                      if (erro != null) setErro(null);
                    }}
                    aoTeclar={(evento) => {
                      if (evento.key === 'Enter') {
                        evento.preventDefault();
                        avancar();
                      }
                    }}
                  />
                )}

            {/* A linha do erro tem altura fixa. Sem isso o botão sobe e desce
                    conforme a validação fala, e ele é justamente o alvo que a
                    pessoa está mirando. */}
                <div className="mt-3 min-h-[1.5rem]">
                  <span
                    id={`erro-${atual.chave}`}
                    role="alert"
                    className="text-[13px]"
                    style={{ color: ERRO }}
                  >
                    {erro}
                  </span>
                </div>

                {/* O botão do site, e não mais um disco de 44px. A ação mais
                    importante da página não pode ser a menor coisa clicável
                    dela: aqui ela é a mesma pílula que se enche de tinta do
                    hero e da parede de prova. */}
                {/* O voltar só existe quando há para onde voltar, e entra com
                    o mesmo salto elástico da lâmina — mola de atrito baixo: ele
                    passa do tamanho, recua e para. É o gesto que a página usa
                    para dizer "isto acabou de aparecer".

                    Fora do `MotionButton`: aquele é a pílula que se enche de
                    tinta e é a ação PRINCIPAL da tela. Dois deles lado a lado
                    seriam duas ações do mesmo peso, e voltar não é. Um disco de
                    contorno ao lado de uma pílula cheia diz a hierarquia sem
                    precisar de rótulo. */}
                <div className="mt-3 flex items-center gap-3">
                  <AnimatePresence initial={false}>
                    {passo > 0 && (
                      <motion.button
                        key="voltar"
                        type="button"
                        onClick={() => voltar(passo - 1)}
                        aria-label="Voltar para a pergunta anterior"
                        initial={parado ? false : { scale: 0.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.18 } }}
                        transition={
                          parado
                            ? { duration: 0.15 }
                            : {
                                opacity: { duration: 0.14 },
                                scale: { type: 'spring', stiffness: 560, damping: 12, mass: 0.6 },
                              }
                        }
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                      >
                        <ArrowLeft className="h-5 w-5" strokeWidth={2} />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* `min-w-0` para a pílula ceder a largura do disco em vez de
                      empurrá-lo para fora da caixa. */}
                  <div className="min-w-0 flex-1">
                    <MotionButton label="Continuar" onClick={avancar} fullWidth />
                  </div>
                </div>

                {/* A saída do passo do @, e ela é obrigatória neste passo.

                    A validação exige um @ para deixar seguir, e o lead desta
                    página é justamente quem NÃO posta — boa parte não tem
                    perfil de empresa nenhum. Sem esta linha, essa pessoa
                    desiste no último passo antes do pagamento, ou inventa um @;
                    e o @ inventado sai mais caro, porque o consultor abre, não
                    encontra, e começa a conversa achando que errou o cadastro.

                    Discreta de propósito. Ela precisa existir para quem
                    realmente não tem, e não convidar quem tem a não procurar. */}
                {atual.chave === 'arroba' && (
                  <button
                    type="button"
                    onClick={semPerfil}
                    className="mt-4 rounded px-1 py-0.5 text-[13px] text-white/40 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
                  >
                    Ainda não tenho perfil da empresa
                  </button>
                )}
              </motion.div>
            )}

            {passo === PAGAMENTO && (
              <motion.div key="pagamento" {...desliza} className="mt-7">
                <p className="font-serif text-[1.75rem] leading-[1.1] tracking-[-0.02em] text-white md:text-[2.35rem]">
                  {PAGAMENTO_TITULO}
                </p>

                {/* O que o pagamento compra, dito pelo dono e posto ABAIXO do
                    título, não no lugar dele. "Falta o filtro." é o nome do
                    passo e cabe na serifa grande; esta é a instrução, e uma
                    instrução em corpo de manchete lê como anúncio. O par é que
                    fecha o passo: a de cima diz por que se cobra, a de baixo
                    diz o que acontece quando se paga.

                    Mesmo 15px a 70% da linha de dica das perguntas, e pelo
                    mesmo motivo documentado lá em cima: é a frase que sustenta
                    a pessoa na tela em que ela decide gastar dinheiro. */}
                <p className="mt-3 text-[15px] leading-snug text-white/70">{PAGAMENTO_CHAMADA}</p>

                <div className="mt-6 rounded-2xl border border-white/[0.09] bg-white/[0.04] p-5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-[2.4rem] leading-none text-white">
                      {FILTRO.valor}
                    </span>
                    <span className="text-[15px] text-white/50">{FILTRO.titulo}</span>
                  </div>
                  <p className="mt-3 text-[13px] leading-snug text-white/50">{FILTRO.corpo}</p>

                  {/* PENDENTE-DONO: a lista de métodos ocupa o lugar em que entram
                      os campos do provedor e os botões de carteira. Aqueles não
                      podem ser redesenhados — Apple e Google mandam na aparência
                      dos deles —, e é bom que seja assim: a pessoa reconhece o
                      botão e toca. */}
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-white/[0.09] pt-5">
                    {PAGAMENTOS.map((forma) => (
                      <span
                        key={forma}
                        className="rounded-full border border-white/[0.12] px-3 py-1 text-[12px] text-white/45"
                      >
                        {forma}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <MotionButton
                    label={`Pagar ${FILTRO.valor} e agendar`}
                    onClick={pagar}
                    busy={enviando}
                    fullWidth
                  />
                </div>

                <button
                  type="button"
                  onClick={() => voltar(PASSOS.length - 1)}
                  className="mt-4 flex items-center gap-1.5 rounded px-1 py-0.5 text-[13px] text-white/40 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50"
                >
                  <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
                  voltar
                </button>
              </motion.div>
            )}

            {passo === RECEBIDO && (
              <motion.div
                key="recebido"
                initial={parado ? undefined : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="mt-7"
              >
                {/* Creme sobre preto: no cartão, o disco da confirmação é a única
                    coisa em papel cheio, e é ele que devolve a cor do painel
                    para dentro da caixa que respondeu. */}
                <motion.span
                  initial={parado ? undefined : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F1E8] text-[#0B0B0B]"
                >
                  <Check className="h-7 w-7" strokeWidth={2} />
                </motion.span>

                {/* Nada aqui afirma que um pagamento aconteceu: a frase é sobre os
                    dados terem chegado, e continua verdadeira depois que o checkout
                    estiver ligado. */}
                <p className="mt-6 font-serif text-[1.9rem] leading-[1.1] tracking-[-0.02em] text-[#F4F1E8] md:text-[2.3rem]">
                  Recebemos.
                </p>
                <p className="mt-3 max-w-sm text-[15px] leading-snug text-white/55">
                  {RETORNO} No WhatsApp que você deixou, {dados.whatsapp}.
                </p>

                {/* ── O CONVITE PARA A FICHA, e ele vem DEPOIS da confirmação.

                    A promessa é paga primeiro. Só com "Recebemos" na tela é que
                    o pedido seguinte deixa de ser mais uma exigência do funil e
                    passa a ser um favor a quem já foi atendido — e é por isso
                    que a moldura fala do CONSULTOR, não da gente: o que a
                    pessoa ganha respondendo é uma ligação que começa do meio.

                    Botão secundário e estreito, e é hierarquia, não timidez. A
                    pílula cheia da largura toda é a forma que este cartão usa
                    para "faça isto"; a ficha é opcional de verdade, e um botão
                    que grita promete uma obrigação que a tela seguinte não
                    cobra — todas as cinco perguntas podem ser puladas. */}
                <div className="mt-8 border-t border-white/[0.09] pt-6">
                  <p className="font-serif text-[1.35rem] leading-tight tracking-[-0.01em] text-white md:text-[1.6rem]">
                    {FICHA_CONVITE.titulo}
                  </p>
                  <p className="mt-2 max-w-sm text-[14px] leading-snug text-white/55">
                    {FICHA_CONVITE.corpo}
                  </p>
                  <div className="mt-5">
                    <MotionButton
                      label={FICHA_CONVITE.botao}
                      onClick={seguir}
                      variant="secondary"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {fichaAtual != null && (
              <motion.div key={fichaAtual.chave} {...desliza} className="mt-7">
                {/* A contagem que a trilha do topo não faz aqui.

                    As pílulas nomeadas ficaram nas três perguntas de antes do
                    pagamento, onde ver a tarefa inteira é o que convence a
                    começar. Cinco nomes a mais nesta fase seriam a promessa
                    contrária — e o argumento da trilha, escrito lá em cima, é
                    justamente que a pessoa precise pensar "isso é rápido". Aqui
                    dois números bastam: quem já pagou não está avaliando se
                    entra, está querendo saber quanto falta. */}
                <p className="text-[11px] uppercase leading-none tracking-[0.2em] text-white/35">
                  {passo - FICHA_INICIO + 1} de {FICHA.length}
                </p>

                {/* Um degrau abaixo da serifa das perguntas de cima, de
                    propósito: nome e WhatsApp são o que o negócio precisa, e
                    estas cinco são contexto. Mesma família, corpo menor — a
                    hierarquia entre as duas metades do formulário continua
                    legível mesmo depois que o dinheiro já entrou. */}
                <p
                  id={`ficha-${fichaAtual.chave}`}
                  className="mt-3 font-serif text-[1.5rem] leading-[1.15] tracking-[-0.02em] text-white md:text-[1.95rem]"
                >
                  {fichaAtual.pergunta}
                </p>
                <p className="mt-2 text-[15px] leading-snug text-white/70">{fichaAtual.dica}</p>

                <div className="mt-6">
                  <Escolha
                    rotuladoPor={`ficha-${fichaAtual.chave}`}
                    opcoes={fichaAtual.opcoes}
                    escolhidas={respostas[fichaAtual.chave] ?? []}
                    multipla={fichaAtual.multipla === true}
                    livre={fichaAtual.livre}
                    textoLivre={livres[fichaAtual.chave] ?? ''}
                    aoEscolher={(opcao) => escolher(fichaAtual, opcao)}
                    aoEscreverLivre={(valor) =>
                      setLivres((l) => ({ ...l, [fichaAtual.chave]: valor }))
                    }
                    aoConfirmarLivre={seguir}
                  />
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => voltar(passo - 1)}
                    aria-label="Voltar para a pergunta anterior"
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  >
                    <ArrowLeft className="h-5 w-5" strokeWidth={2} />
                  </button>

                  {/* Um botão só, e o RÓTULO dele é que muda.

                      "Pular" ao lado de "Continuar" seriam duas ações do mesmo
                      peso para a mesma tecla, e obrigariam a pessoa a escolher
                      entre dois botões em toda pergunta que ela não quisesse
                      responder. Com um, o cartão sempre tem uma saída para a
                      frente, e ela diz exatamente o que vai acontecer com o que
                      está — ou não está — marcado na tela. */}
                  <div className="min-w-0 flex-1">
                    <MotionButton
                      label={(respostas[fichaAtual.chave] ?? []).length > 0 ? 'Continuar' : 'Pular'}
                      onClick={seguir}
                      fullWidth
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {passo === FIM && (
              <motion.div
                key="fim"
                initial={parado ? undefined : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="mt-7"
              >
                <motion.span
                  initial={parado ? undefined : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F4F1E8] text-[#0B0B0B]"
                >
                  <Check className="h-7 w-7" strokeWidth={2} />
                </motion.span>

                <p className="mt-6 font-serif text-[1.9rem] leading-[1.1] tracking-[-0.02em] text-[#F4F1E8] md:text-[2.3rem]">
                  {FICHA_FIM.titulo}
                </p>
                <p className="mt-3 max-w-sm text-[15px] leading-snug text-white/55">
                  {FICHA_FIM.corpo}
                </p>
                {/* A promessa volta a aparecer no fim de verdade. Ela foi dita na
                    confirmação, cinco telas atrás, e é a única coisa que a
                    pessoa precisa levar embora daqui. */}
                <p className="mt-6 max-w-sm text-[13px] leading-snug text-white/40">
                  {RETORNO} No WhatsApp que você deixou, {dados.whatsapp}.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

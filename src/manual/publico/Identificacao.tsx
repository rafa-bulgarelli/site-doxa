/**
 * ─── QUEM ESTÁ CONFIRMANDO ───────────────────────────────────────────────────
 *
 * E-mail e empresa aparecem TRAVADOS. Não é rigidez de formulário: eles vieram
 * do convite que a DOXA emitiu, e um campo editável aqui deixaria o cliente
 * mudar a identidade sobre a qual o aceite é gravado — o registro deixaria de
 * provar o que se propõe a provar.
 *
 * O nome é o único campo digitável, e só quando o convite não trouxe um
 * (`nome_cliente` nulo). Quando trouxe, ele também é dado travado.
 *
 * Não há autofoco aqui. As rotas do manual são `lazy`: um `focus()` na montagem
 * faz o navegador rolar sozinho até o campo, e o cliente vê a tela "fugir" —
 * armadilha registrada no CLAUDE.md, paga uma vez, não se paga de novo.
 */
import { Botao, BotaoDiscreto, Casca, Dado, Fio, Linha, Rotulo, Titulo } from './pecas';
import { MINIMO_DO_NOME, nomeValido, precisaDeNome } from './maquina';
import type { ConviteAberto } from '../tipos';

export function Identificacao({
  convite,
  nome,
  aoDigitarNome,
  aoAvancar,
  aoVoltar,
}: {
  convite: ConviteAberto;
  nome: string;
  aoDigitarNome: (valor: string) => void;
  aoAvancar: () => void;
  aoVoltar: () => void;
}) {
  const pedeNome = precisaDeNome(convite);
  const podeSeguir = !pedeNome || nomeValido(nome);

  return (
    <Casca>
      <Fio />
      <div className="mt-4">
        <Rotulo>Identificação</Rotulo>
      </div>
      <div className="mt-4">
        <Titulo>Confirme quem é você</Titulo>
      </div>
      <div className="mt-5">
        <Linha>
          Estes dados vieram do convite que enviamos e é sobre eles que o aceite será registrado.
          Se algo estiver errado, fale com quem te enviou o link antes de continuar.
        </Linha>
      </div>

      <form
        className="mt-7"
        onSubmit={(evento) => {
          evento.preventDefault();
          if (podeSeguir) aoAvancar();
        }}
      >
        <div className="rounded-2xl border border-doxa-line bg-doxa-surface p-5">
          <Dado rotulo="E-mail" valor={convite.email} />
          <Dado rotulo="Empresa" valor={convite.empresa} />
          {convite.nome_cliente != null && <Dado rotulo="Nome" valor={convite.nome_cliente} />}
        </div>

        {pedeNome && (
          <div className="mt-5">
            <label htmlFor="nome-do-cliente" className="block text-[17px] text-white/80">
              Seu nome completo
            </label>
            <input
              id="nome-do-cliente"
              name="nome"
              type="text"
              value={nome}
              onChange={(evento) => aoDigitarNome(evento.target.value)}
              autoComplete="name"
              enterKeyHint="next"
              /* A dica mora dentro deste mesmo `if`: o id apontado sempre
                 existe, e leitor de tela não anuncia referência quebrada. */
              aria-describedby="dica-do-nome"
              className="mt-2.5 min-h-[56px] w-full rounded-2xl border border-white/[0.14] bg-doxa-raised px-5 text-[17px] text-white placeholder:text-white/25 focus:border-white/40 focus:outline-none"
              placeholder="Como está no seu documento"
            />
            <p id="dica-do-nome" className="mt-2.5 text-[15px] text-white/45">
              É o nome que vai constar no comprovante — pelo menos {MINIMO_DO_NOME} letras.
            </p>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <Botao tipo="submit" desabilitado={!podeSeguir}>
            Continuar para o manual
          </Botao>
          <BotaoDiscreto onClick={aoVoltar}>Voltar</BotaoDiscreto>
        </div>
      </form>
    </Casca>
  );
}

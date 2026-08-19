-- ─────────────────────────────────────────────────────────────────────────────
-- MANUAL INTERATIVO — V8, pelo caminho real: rascunho da v7 → edição → publica.
--
-- Rode DEPOIS de `manual-seed-v7.sql`, UMA vez. Idempotente pelo número.
-- NÃO APLICADO: este arquivo é o entregável de conteúdo do card 014 e vale
-- CONGELAMENTO DE DEPLOY (ordem do dono, 2026-08-19) — nada sobe, nem Vercel
-- nem Supabase de produção, até ele mandar. Quem roda isto no SQL Editor é a
-- sessão principal, depois do gate de copy do dono.
--
-- ─── POR QUE UMA V8 ──────────────────────────────────────────────────────────
--
-- O dono ditou o capítulo da voz de novo, depois de ver um cliente travar nele.
-- Nas palavras dele: "falar natural, sem leitura. Aí, proibido ler: tem que
-- deixar muito claro que é proibido para o cliente ler. Se não dá cagada";
-- "usar o gravador da plataforma e salvar os arquivos no celular/computador,
-- para que o progresso não seja perdido […] volta a gravar até bater os 60
-- minutos mínimos"; "utilize esse mesmo equipamento durante todos os 60 minutos
-- de áudio, para você não ter diferença entre o seu timbre".
--
-- O capítulo v7 contradiz o dono em três pontos, e cada um deles é uma correção
-- aqui:
--
--   1. **VZ-2 mandava LER.** O exemplo da v5 abria com o verbo ler, mandando
--      o cliente ler "como se explicasse para um cliente na sua frente" — a
--      instrução mais cara do manual, porque leitura vira voz de leitura em
--      TODOS os vídeos do cliente. Agora o título carrega a proibição ("Fale
--      natural — ler é proibido") e o exemplo manda FALAR. A única leitura que
--      sobra é a frase curta da verificação, no fim, e o porquê diz isso para
--      o cliente não achar que a plataforma está quebrando a regra do manual.
--
--   2. **VZ-3 mandava usar o gravador NATIVO do celular.** A captura acontece
--      dentro da plataforma, na aba "Grave-se" — e a plataforma APAGA a
--      gravação que o cliente não baixou antes de sair. Quem seguia a v7 gravava
--      fora, ou gravava dentro e perdia tudo ao fechar a aba. A regra vira o
--      ciclo inteiro: gravar uns 3 minutos, pausar, baixar cada gravação, e na
--      volta reenviar as amostras em "Enviar amostras" e seguir até os 60
--      minutos. A faixa velha ("30 minutos e 2 horas") sai: a régua do dono é
--      60 minutos MÍNIMOS, ditada duas vezes.
--
--   3. **Faltava o passo do equipamento.** Trocar de aparelho ou de cômodo no
--      meio muda o timbre, e o clone aprende uma voz que não é uma só. Entra
--      `VZ-4`, informativa, na ordem 4.
--
-- A descrição da seção também muda: ela mandava seguir o roteiro e a duração
-- que a plataforma pedir — e roteiro é justamente o que o cliente não pode ter
-- na frente, enquanto a duração que a tela pede ("mínimo 30 min") não é a nossa.
--
-- (As frases banidas não aparecem nem em comentário, de propósito: o gate deste
-- card varre o arquivo INTEIRO atrás delas, e comentário que as cita faria toda
-- checagem futura tropeçar num falso positivo.)
--
-- ─── POR QUE VZ-4 É O ÚLTIMO PASSO, E NÃO O SEGUNDO ──────────────────────────
--
-- "Mesmo equipamento, mesmo lugar" só faz sentido depois que o cliente sabe que
-- vai SAIR e VOLTAR várias vezes (VZ-3) — antes disso é conselho solto. E
-- acrescentar no fim não toca uma linha das regras existentes: é o mesmo padrão
-- da `ON-0` da v7, com a vaga da `ordem` conferida antes de escrever.
--
-- O que este arquivo NÃO faz, de propósito:
--
--   · **Não toca no aceite.** `VZ-4` é `obrigatoria = false`, como todas as da
--     voz: não vira checkbox, não entra em `manual_concluir`, não muda o
--     comprovante. Os 8 aceites da garantia saem do rascunho idênticos.
--   · **Não apaga nada.** Só `update` (descrição da seção, VZ-2, VZ-3) e um
--     `insert` (VZ-4). VZ-1 ("Grave num lugar silencioso") não muda uma vírgula.
--   · **Não mexe em outra seção.** Onboarding, clone, garantia e termos saem do
--     rascunho iguais aos da v7.
--   · **Não conhece os prints.** As 7 capturas de "Como funciona na prática"
--     entram pelo código (`src/manual/publico/prints.ts`, outra track) e caem no
--     fim do capítulo — o seed não as cita e não depende delas.
--
-- Convite novo nasce v8; convite ABERTO continua preso à versão em que nasceu
-- (v7), lendo o texto antigo até ser concluído — é assim desde a v3.
-- ─────────────────────────────────────────────────────────────────────────────

do $v8$
declare
  origem uuid;
  nova public.manual_versoes;
  secao_voz uuid;
  achadas integer;
  ocupada integer;
begin
  if exists (select 1 from public.manual_versoes where numero = 8) then
    raise notice 'versao 8 ja existe — nada a fazer';
    return;
  end if;

  select id into origem from public.manual_versoes where numero = 7;
  if origem is null then
    raise exception 'v7 nao existe — rode manual-seed-v7.sql antes';
  end if;

  nova := public.manual_criar_rascunho(origem, null);

  select id into secao_voz
    from public.manual_secoes where versao_id = nova.id and slug = 'voz';
  if secao_voz is null then
    raise exception 'a v7 nao tem a secao voz';
  end if;

  -- Os dois `update` abaixo endereçam a regra pelo `codigo`. Se um seed futuro
  -- renomear VZ-2 ou VZ-3, o update não acha ninguém, não reclama, e a v8 sai
  -- publicada com o texto que o dono mandou tirar — o silêncio é o risco.
  select count(*) into achadas
    from public.manual_regras where secao_id = secao_voz and codigo in ('VZ-2', 'VZ-3');
  if achadas <> 2 then
    raise exception 'esperava VZ-2 e VZ-3 na secao voz da v7 — encontrei %', achadas;
  end if;

  -- A ordem 4 precisa estar VAGA: duas regras empatadas em `ordem` deixariam a
  -- sequência das telas por conta do banco, e o cliente leria o capítulo
  -- embaralhado sem ninguém perceber. O `codigo` entra na mesma conferência só
  -- para a mensagem ser legível — o `unique (secao_id, codigo)` já barraria.
  select count(*) into ocupada
    from public.manual_regras
    where secao_id = secao_voz and (ordem = 4 or codigo = 'VZ-4');
  if ocupada <> 0 then
    raise exception 'a ordem 4 da voz (ou o codigo VZ-4) ja esta ocupada por % regra(s)', ocupada;
  end if;

  -- ── A PROMESSA DO CAPÍTULO, SEM ROTEIRO ───────────────────────────────────
  update public.manual_secoes
    set descricao = 'A plataforma clona a sua voz a partir de gravações suas. Não precisa de estúdio — precisa de silêncio, de fala natural e de um pouco de paciência: são pelo menos 60 minutos de áudio, gravados pelo gravador da própria plataforma, aos poucos, sempre no mesmo lugar e no mesmo aparelho.'
    where versao_id = nova.id and slug = 'voz';

  -- ── 1. LER É PROIBIDO — o exemplo da v5 mandava exatamente o contrário ────
  update public.manual_regras r
    set titulo = 'Fale natural — ler é proibido',
        instrucao = 'Não leia. É proibido ler durante a gravação: nada de texto, roteiro ou anotação na sua frente. Fale de cabeça, com voz de conversa e ritmo normal, sempre à mesma distância do microfone. E nada de aplicativo de "melhorar áudio" — a gravação vai do gravador direto para a plataforma.',
        porque = 'O clone reproduz o que ouve: quem lê grava voz de leitura, e aí TODOS os seus vídeos saem com aquele tom de quem está lendo uma tela. E qualquer processamento apaga justamente o que o clone precisa aprender. A única leitura permitida é a frase curta da verificação, no fim — essa a própria plataforma pede na tela.',
        exemplo = 'Fale como se explicasse o seu negócio a um cliente na sua frente: conte um caso que você atendeu, do jeito que contaria no balcão — sem voz de locutor, sem pressa.'
    from public.manual_secoes s
    where r.secao_id = s.id and s.versao_id = nova.id and r.codigo = 'VZ-2';

  -- ── 2. O GRAVADOR DA PLATAFORMA, E O CICLO DE SAIR E VOLTAR ───────────────
  update public.manual_regras r
    set titulo = 'Grave pelo gravador da plataforma — e baixe cada gravação',
        instrucao = 'Grave pela própria plataforma, na aba "Grave-se": uns 3 minutos, pausa, grava de novo. Antes de sair, baixe cada gravação para o seu computador ou celular (menu ⋮ → Baixar) — o que você não baixar, a plataforma apaga. Ao voltar, envie as amostras salvas e continue gravando até somar pelo menos 60 minutos de áudio.',
        porque = 'Fechar a plataforma sem baixar joga fora as horas de voz que você já gravou — e ninguém grava 60 minutos de uma sentada só. Com as amostras guardadas no seu aparelho, você para quando cansar e retoma de onde parou. De quebra, trechos gravados em momentos diferentes trazem entonações variadas, e o clone aprende uma voz mais rica.',
        exemplo = 'Um ciclo completo: 1. abra "Minha Voz Profissional" → "Criar clone de voz"; 2. grave uns 3 minutos e pause; 3. grave de novo, quantas vezes aguentar; 4. antes de fechar, baixe cada gravação no menu ⋮ → Baixar; 5. na volta, refaça esse mesmo caminho, mande os arquivos baixados em "Enviar amostras" e volte a gravar. Começou no celular? Todo o resto no celular — e o mesmo vale para quem começou no computador.'
    from public.manual_secoes s
    where r.secao_id = s.id and s.versao_id = nova.id and r.codigo = 'VZ-3';

  -- ── 3. O PASSO NOVO: UM SÓ TIMBRE DO PRIMEIRO AO ÚLTIMO MINUTO ────────────
  insert into public.manual_regras
      (secao_id, codigo, titulo, instrucao, porque, exemplo, severidade, obrigatoria, ordem)
    values (secao_voz, 'VZ-4', 'Mesmo equipamento, mesmo lugar — nos 60 minutos inteiros',
      'Do primeiro ao último minuto, grave com o mesmo aparelho e o mesmo microfone, no mesmo cômodo silencioso — mesmo que você grave em dias diferentes.',
      'Trocar de aparelho ou de sala no meio muda o seu timbre e o eco do ambiente, e o clone acaba aprendendo uma voz que não é uma só: os vídeos saem ora com um som, ora com outro.',
      'Gravou a primeira parte no escritório, pelo notebook? As outras também — mesma sala, mesmo notebook, mesma distância.',
      'normal', false, 4);

  perform public.manual_publicar_versao(nova.id);
end;
$v8$;

-- ─────────────────────────────────────────────────────────────────────────────
-- DEPOIS DE RODAR ISTO, confira:
--
--   select numero, status from public.manual_versoes order by numero;
--     -- v1..v7 arquivadas · v8 publicada
--
--   select r.codigo, r.ordem, r.obrigatoria, r.titulo
--     from public.manual_regras r
--     join public.manual_secoes s on s.id = r.secao_id
--     join public.manual_versoes v on v.id = s.versao_id
--    where v.numero = 8 and s.slug = 'voz' order by r.ordem;
--     -- VZ-1 (1, false) · VZ-2 (2, false) · VZ-3 (3, false) · 'VZ-4' (4, false)
--     -- e NENHUM empate de `ordem`, que é o que decide a ordem das telas.
--
--   select count(*) filter (where r.obrigatoria) as aceites, count(*) as total
--     from public.manual_regras r
--     join public.manual_secoes s on s.id = r.secao_id
--     join public.manual_versoes v on v.id = s.versao_id where v.numero = 8;
--     -- 8 aceites (os MESMOS de sempre) · 27 no total (os 26 da v7 mais a VZ-4)
--
--   select s.descricao from public.manual_secoes s
--     join public.manual_versoes v on v.id = s.versao_id
--    where v.numero = 8 and s.slug = 'voz';
--     -- sem a palavra "roteiro", e com os 60 minutos.
--
-- E na tela, com um convite NOVO (v8): o capítulo 2 abre prometendo "São 11
-- passos curtos" — os 4 cartões mais os 7 prints de "Como funciona na prática",
-- que vêm do código —, o último cartão é "Passo 4 de 4 — Mesmo equipamento,
-- mesmo lugar", e depois dele correm os prints, "1 de 7" até "7 de 7".
-- ─────────────────────────────────────────────────────────────────────────────

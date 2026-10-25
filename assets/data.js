// Dados de demonstração do Sistema Ômega. Tudo fictício, só para visualizar.
// "Hoje" fica fixo para a demonstração contar sempre a mesma história.
window.OMEGA_TODAY = '2026-10-27';

window.OMEGA_SEED = {
  clients: [
    { id: 'amorim', name: 'Amorim', segment: 'Indústria de alimentos', contact: 'Patrícia Lemos', role: 'Gerente de RH', phone: '(87) 99812-4410', services: ['Recrutamento', 'Consultoria', 'Treinamentos'], since: '2025-03-10', origin: 'painel', meetingDay: 'Terças, 14h' },
    { id: 'flavine', name: 'Flavine', segment: 'Varejo de moda', contact: 'Marcos Vieira', role: 'Sócio', phone: '(87) 99640-1187', services: ['Recrutamento', 'Consultoria'], since: '2025-08-02', origin: 'painel', meetingDay: 'Quintas, 9h' },
    { id: 'dedarc', name: 'DEDARC', segment: 'Distribuidora', contact: 'Ana Rocha', role: 'Diretora administrativa', phone: '(87) 99155-3002', services: ['Recrutamento', 'Consultoria', 'Treinamentos'], since: '2024-11-18', origin: 'painel', meetingDay: 'Segundas, 14h' },
    { id: 'solaris', name: 'Grupo Solaris', segment: 'Energia solar', contact: 'Diego Ramos', role: 'Coordenador comercial', phone: '(87) 99733-8851', services: ['Recrutamento'], since: '2026-10-14', origin: 'whatsapp', meetingDay: '' },
  ],

  jobs: [
    { id: 'v1', title: 'Analista de RH', client: 'amorim', qty: 1, salary: 3200, fee: 2400, status: 'selecao', created: '2026-10-08', origin: 'forms', schedule: 'Comercial, 8h às 18h', education: 'Superior em Psicologia ou Gestão de Pessoas', reqs: ['Experiência em recrutamento e seleção', 'Boa comunicação', 'Organização'], sent: 5, interviewed: 3, cvs: ['Carla Mendes', 'Rafael Souza', 'Juliana Prado', 'Bruno Lima', 'Tatiane Alves'] },
    { id: 'v2', title: 'Assistente administrativo', client: 'flavine', qty: 1, salary: 2200, fee: 1800, status: 'aberta', created: '2026-10-22', origin: 'forms', schedule: 'Comercial', education: 'Ensino médio completo', reqs: ['Excel intermediário', 'Rotinas administrativas'], sent: 0, interviewed: 0, cvs: [], pending: 'Conferir briefing com o cliente' },
    { id: 'v3', title: 'Vendedor interno', client: 'dedarc', qty: 2, salary: 2100, fee: 1600, status: 'selecao', created: '2026-10-13', origin: 'whatsapp', schedule: 'Segunda a sábado, escala', education: 'Ensino médio completo', reqs: ['Experiência em vendas', 'Atendimento ao cliente'], sent: 4, interviewed: 2, cvs: ['Joana Silva', 'Pedro Henrique', 'Larissa Gomes', 'Marcos Paulo'] },
    { id: 'v4', title: 'Coordenador comercial', client: 'amorim', qty: 1, salary: 5500, fee: 3500, status: 'fechada', created: '2026-10-03', closed: '2026-10-20', hired: 'Eduardo Farias', origin: 'whatsapp', schedule: 'Comercial', education: 'Superior completo', reqs: ['Liderança de equipes', 'Gestão de indicadores'], sent: 6, interviewed: 4, cvs: ['Eduardo Farias', 'Silvia Torres', 'André Campos'] },
    { id: 'v5', title: 'Auxiliar de logística', client: 'flavine', qty: 1, salary: 1800, fee: 1500, status: 'fechada', created: '2026-10-05', closed: '2026-10-17', hired: 'Luan Barbosa', origin: 'painel', schedule: 'Comercial', education: 'Ensino médio', reqs: ['Organização', 'Trabalho presencial'], sent: 4, interviewed: 3, cvs: ['Luan Barbosa', 'Kaio Rocha'] },
    { id: 'v6', title: 'Recepcionista', client: 'flavine', qty: 1, salary: 1900, fee: 1500, status: 'fechada', created: '2026-09-02', closed: '2026-09-14', hired: 'Bianca Nunes', origin: 'forms', schedule: 'Comercial', education: 'Ensino médio completo', reqs: ['Atendimento presencial e telefônico', 'Boa apresentação'], sent: 4, interviewed: 3, cvs: ['Bianca Nunes', 'Débora Reis'] },
    { id: 'v7', title: 'Consultor de vendas externo', client: 'solaris', qty: 3, salary: 2500, fee: 1700, status: 'aberta', created: '2026-10-14', origin: 'whatsapp', schedule: 'Externo, com comissão', education: 'Ensino médio completo', reqs: ['CNH B', 'Experiência em vendas consultivas'], sent: 0, interviewed: 0, cvs: [] },
  ],

  meetings: [
    { id: 'e1', client: 'amorim', date: '2026-10-27', time: '14:00', end: '16:00', status: 'aguardando', topic: '', summary: '', tool: '', next: '', origin: 'auto', askedAt: '16:05' },
    { id: 'e2', client: 'dedarc', date: '2026-10-26', time: '14:00', end: '15:30', status: 'confirmado', topic: 'Descritivo de cargos', summary: 'Finalizamos o descritivo dos cargos do setor comercial e alinhamos a faixa salarial de cada função.', tool: 'Modelo de descritivo de cargo', next: 'Apresentar os descritivos para a diretoria.', origin: 'whatsapp', transcript: 'Hoje na DEDARC a gente terminou o descritivo de cargo do comercial, usei aquele modelo de descritivo, e alinhamos a faixa salarial. Próximo passo é apresentar pra diretoria.' },
    { id: 'e3', client: 'flavine', date: '2026-10-23', time: '09:00', end: '10:30', status: 'confirmado', topic: 'Alinhamento de equipe', summary: 'Revisão dos combinados e das responsabilidades de cada função na loja.', tool: 'Matriz de responsabilidades', next: 'Validar a divisão de tarefas com a equipe.', origin: 'whatsapp', transcript: 'Na Flavine hoje revisamos os combinados da equipe com a matriz de responsabilidades. Semana que vem validamos a divisão com o pessoal.' },
    { id: 'e4', client: 'amorim', date: '2026-10-20', time: '14:00', end: '16:00', status: 'confirmado', topic: 'Desenvolvimento da liderança', summary: 'Alinhamento dos desafios dos líderes e definição de ações para melhorar o feedback.', tool: 'Roda de competências', next: 'Acompanhar os planos de ação das lideranças.', origin: 'whatsapp' },
    { id: 'e5', client: 'dedarc', date: '2026-10-19', time: '14:00', end: '15:30', status: 'falta', topic: 'Cultura e comunicação', summary: 'Encontro não realizado. Cliente pediu para remarcar.', tool: '', next: 'Remarcar com o cliente.', origin: 'whatsapp' },
    { id: 'e6', client: 'flavine', date: '2026-10-16', time: '09:00', end: '10:30', status: 'confirmado', topic: 'Diagnóstico de equipe', summary: 'Levantamento das necessidades da equipe administrativa.', tool: 'Roteiro de diagnóstico', next: 'Definir responsabilidades.', origin: 'painel' },
    { id: 'e7', client: 'amorim', date: '2026-10-13', time: '14:00', end: '16:00', status: 'confirmado', topic: 'Mapeamento de competências', summary: 'Diagnóstico inicial de competências e desafios da liderança.', tool: 'Roda de competências', next: 'Trabalhar feedback na próxima semana.', origin: 'whatsapp' },
    { id: 'e8', client: 'flavine', date: '2026-10-30', time: '09:00', end: '10:30', status: 'agendado', topic: '', summary: '', tool: '', next: '', origin: 'auto' },
    { id: 'e9', client: 'dedarc', date: '2026-11-02', time: '14:00', end: '15:30', status: 'agendado', topic: '', summary: '', tool: '', next: '', origin: 'auto' },
    { id: 'e10', client: 'amorim', date: '2026-11-03', time: '14:00', end: '16:00', status: 'agendado', topic: '', summary: '', tool: '', next: '', origin: 'auto' },
  ],

  trainings: [
    { id: 't1', client: 'amorim', date: '2026-10-28', time: '09:00', topic: 'Feedback na prática', place: 'Sede Amorim', people: 18, attended: null, status: 'agendado', material: 'Roteiro de feedback', origin: 'whatsapp' },
    { id: 't2', client: 'dedarc', date: '2026-10-15', time: '08:30', topic: 'Comunicação e trabalho em equipe', place: 'Auditório DEDARC', people: 24, attended: 22, status: 'realizado', material: 'Matriz de responsabilidades', origin: 'whatsapp' },
    { id: 't3', client: 'amorim', date: '2026-09-18', time: '09:00', topic: 'Integração de novos colaboradores', place: 'Sede Amorim', people: 12, attended: 12, status: 'realizado', material: 'Apresentação de integração', origin: 'painel' },
  ],

  tools: [
    { id: 'f1', name: 'Roda de competências', cat: 'RH', pages: 3, added: '2026-08-12', origin: 'whatsapp', uses: 6, desc: 'Diagnóstico de competências e plano de desenvolvimento.' },
    { id: 'f2', name: 'Roteiro de entrevista por competências', cat: 'Recrutamento', pages: 4, added: '2026-07-02', origin: 'painel', uses: 9, desc: 'Perguntas e critérios para entrevista estruturada.' },
    { id: 'f3', name: 'Briefing de nova vaga', cat: 'Briefing', pages: 2, added: '2026-06-20', origin: 'painel', uses: 14, desc: 'O mesmo roteiro do Google Forms, para imprimir.' },
    { id: 'f4', name: 'Teste de perfil comportamental', cat: 'Testes', pages: 6, added: '2026-05-11', origin: 'whatsapp', uses: 11, desc: 'Teste aplicado na triagem de candidatos.' },
    { id: 'f5', name: 'Matriz de responsabilidades', cat: 'RH', pages: 2, added: '2026-09-01', origin: 'whatsapp', uses: 5, desc: 'Atribuições e responsáveis de cada função.' },
    { id: 'f6', name: 'Roteiro de feedback', cat: 'Treinamentos', pages: 5, added: '2026-09-25', origin: 'painel', uses: 3, desc: 'Material de apoio para o treinamento de feedback.' },
    { id: 'f7', name: 'Modelo de descritivo de cargo', cat: 'RH', pages: 3, added: '2026-10-02', origin: 'whatsapp', uses: 4, desc: 'Estrutura para descrever missão, atividades e requisitos do cargo.' },
    { id: 'f8', name: 'Apresentação de integração', cat: 'Treinamentos', pages: 18, added: '2026-09-10', origin: 'painel', uses: 2, desc: 'Slides para receber novos colaboradores.' },
  ],

  activity: [
    { at: '2026-10-27 16:05', who: 'Automação', origin: 'auto', text: 'Perguntou à Raffaella o que rolou no encontro da Amorim', link: 'consultorias' },
    { at: '2026-10-27 07:30', who: 'Automação', origin: 'auto', text: 'Enviou a agenda do dia: 1 encontro (Amorim, 14h)', link: 'automacoes' },
    { at: '2026-10-26 15:42', who: 'Raffaella', origin: 'whatsapp', text: 'Registrou por áudio o encontro na DEDARC · Descritivo de cargos', link: 'consultorias' },
    { at: '2026-10-26 11:10', who: 'Lari', origin: 'whatsapp', text: 'Anexou 2 currículos à vaga Vendedor interno · DEDARC', link: 'vagas' },
    { at: '2026-10-22 10:18', who: 'Google Forms', origin: 'forms', text: 'Briefing da Flavine virou a vaga Assistente administrativo', link: 'vagas' },
    { at: '2026-10-20 17:30', who: 'Raffaella', origin: 'whatsapp', text: 'Fechou a vaga Coordenador comercial · Amorim', link: 'vagas' },
  ],
};

// Cada cena é uma conversa de exemplo com o agente. Ao terminar, `apply`
// grava o resultado nos dados da demonstração, como o sistema real faria.
window.OMEGA_SCENES = [
  {
    id: 'nova-vaga', module: 'vagas', title: 'Abrir uma vaga por áudio', hint: 'Ela fala a vaga, o agente pergunta o que falta',
    msgs: [
      { from: 'me', type: 'audio', dur: '0:38', text: 'Abre uma vaga pra Amorim de auxiliar administrativo, são duas vagas, salário de mil e oitocentos, eu cobro mil e quinhentos cada. Precisa saber Excel e ter experiência com rotina de escritório.' },
      { from: 'bot', text: 'Entendi a vaga. Para o briefing ficar completo, falta: horário de trabalho e escolaridade mínima. Sabe me dizer?' },
      { from: 'me', text: 'Comercial, 8h às 18h. Ensino médio completo.' },
      { from: 'bot', type: 'card', title: 'Nova vaga', rows: [['Cliente', 'Amorim'], ['Vaga', 'Auxiliar administrativo'], ['Posições', '2'], ['Salário', 'R$ 1.800'], ['Valor por vaga', 'R$ 1.500'], ['Horário', 'Comercial, 8h às 18h'], ['Escolaridade', 'Ensino médio completo'], ['Requisitos', 'Excel, rotina de escritório']], ask: 'Posso criar?' },
      { from: 'me', text: 'Pode criar' },
      { from: 'bot', text: 'Vaga criada em Abertas. A Lari já foi avisada para começar a triagem.', link: 'Ver a vaga no painel' },
    ],
    apply: 'newJob',
  },
  {
    id: 'repetir-vaga', module: 'vagas', title: 'Repetir uma vaga antiga', hint: 'Cliente recorrente, sem perguntar tudo de novo',
    msgs: [
      { from: 'me', text: 'A Flavine quer de novo aquela vaga de recepcionista' },
      { from: 'bot', type: 'card', title: 'Encontrei esta vaga', rows: [['Vaga', 'Recepcionista'], ['Quando', 'Setembro de 2026'], ['Salário', 'R$ 1.900'], ['Valor por vaga', 'R$ 1.500'], ['Fechada em', '12 dias · Bianca Nunes']], ask: 'Repito com as mesmas condições ou mudou alguma coisa?' },
      { from: 'me', text: 'Mesma coisa, só o salário agora é 2 mil' },
      { from: 'bot', text: 'Feito. Nova vaga de Recepcionista para a Flavine, salário R$ 2.000, com os mesmos requisitos da anterior.', link: 'Ver a vaga no painel' },
    ],
    apply: 'repeatJob',
  },
  {
    id: 'curriculo', module: 'vagas', title: 'Mandar currículo e atualizar a vaga', hint: 'Arquivo no WhatsApp vira anexo da vaga',
    who: 'Lari',
    msgs: [
      { from: 'me', type: 'file', name: 'curriculo-renata-campos.pdf', size: '182 KB', text: 'mais um pra vaga de vendedor da DEDARC, já entrevistei' },
      { from: 'bot', text: 'Anexei o currículo de Renata Campos à vaga Vendedor interno · DEDARC e marquei como entrevistada. Agora são 5 currículos enviados e 3 entrevistas.', link: 'Ver a vaga no painel' },
    ],
    apply: 'addCv',
  },
  {
    id: 'fechar-vaga', module: 'vagas', title: 'Fechar uma vaga', hint: 'O status muda e o valor entra no mês',
    msgs: [
      { from: 'me', text: 'Fechei a de analista de RH da Amorim, a Carla ficou' },
      { from: 'bot', type: 'card', title: 'Fechar vaga', rows: [['Vaga', 'Analista de RH · Amorim'], ['Contratada', 'Carla Mendes'], ['Valor no mês', 'R$ 2.400']], ask: 'Confirma?' },
      { from: 'me', text: 'Isso' },
      { from: 'bot', text: 'Vaga fechada. Outubro agora soma 3 vagas fechadas.', link: 'Ver no quadro' },
    ],
    apply: 'closeJob',
  },
  {
    id: 'pos-encontro', module: 'consultorias', title: 'Relato depois do encontro', hint: 'A agenda dispara a pergunta, ela responde em áudio',
    auto: true,
    msgs: [
      { from: 'bot', auto: true, text: 'Rafa, o encontro na Amorim terminou às 16h. O que rolou hoje? Pode mandar em áudio.' },
      { from: 'me', type: 'audio', dur: '1:04', text: 'Hoje na Amorim a gente trabalhou feedback com os líderes. Usei a roda de competências de novo pra comparar com o mês passado. Cada líder ficou de trazer o plano de ação individual semana que vem. Todo mundo foi.' },
      { from: 'bot', type: 'card', title: 'Encontro · Amorim · 27/10', rows: [['Pauta', 'Feedback com os líderes'], ['Resumo', 'Comparação da roda de competências com o mês anterior'], ['Ferramenta', 'Roda de competências'], ['Próximo passo', 'Cada líder traz o plano de ação individual'], ['Presença', 'Presente']], ask: 'Confirma o registro?' },
      { from: 'me', text: 'Confirmo' },
      { from: 'bot', text: 'Registrado no histórico da Amorim. Na véspera do próximo encontro eu te lembro do próximo passo.', link: 'Ver o encontro' },
    ],
    apply: 'confirmMeeting',
  },
  {
    id: 'falta', module: 'consultorias', title: 'Avisar uma falta', hint: 'Falta registrada e remarcação encaminhada',
    msgs: [
      { from: 'me', text: 'A DEDARC desmarcou o encontro da semana que vem' },
      { from: 'bot', type: 'card', title: 'Registrar falta', rows: [['Cliente', 'DEDARC'], ['Encontro', '02/11, 14h'], ['Situação', 'Falta do cliente']], ask: 'Registro a falta e peço para a Lari remarcar?' },
      { from: 'me', text: 'Sim' },
      { from: 'bot', text: 'Falta registrada. A Lari recebeu o pedido para remarcar com a Ana Rocha.', link: 'Ver consultorias' },
    ],
    apply: 'missMeeting',
  },
  {
    id: 'treinamento', module: 'treinamentos', title: 'Agendar um treinamento', hint: 'Data, local e participantes num áudio só',
    msgs: [
      { from: 'me', type: 'audio', dur: '0:21', text: 'Dia 6 vou dar treinamento de comunicação não violenta na Flavine, umas 22 pessoas, na loja do centro, às 8 da manhã.' },
      { from: 'bot', type: 'card', title: 'Novo treinamento', rows: [['Cliente', 'Flavine'], ['Tema', 'Comunicação não violenta'], ['Data', '06/11, 8h'], ['Local', 'Loja do centro'], ['Participantes', '22']], ask: 'Agendo? Posso também separar o Roteiro de feedback da biblioteca.' },
      { from: 'me', text: 'Agenda e separa sim' },
      { from: 'bot', text: 'Treinamento agendado e material separado. Te lembro na véspera.', link: 'Ver treinamentos' },
    ],
    apply: 'newTraining',
  },
  {
    id: 'guardar-ferramenta', module: 'biblioteca', title: 'Guardar uma ferramenta', hint: 'Manda o PDF e diz a categoria',
    msgs: [
      { from: 'me', type: 'file', name: 'Teste DISC 2026.pdf', size: '640 KB', text: 'guarda nos testes' },
      { from: 'bot', text: 'Guardei "Teste DISC 2026" em Testes. Quando alguém pedir "teste DISC", eu mando este arquivo.', link: 'Ver a biblioteca' },
    ],
    apply: 'newTool',
  },
  {
    id: 'pedir-ferramenta', module: 'biblioteca', title: 'Pedir uma ferramenta', hint: 'O arquivo volta pronto para imprimir',
    who: 'Lari',
    msgs: [
      { from: 'me', text: 'Me manda a roda de competências' },
      { from: 'bot', type: 'file', name: 'Roda de competências.pdf', size: '1,2 MB', text: 'Aqui está. Ela foi usada 6 vezes, a última na Amorim em 20/10.' },
    ],
    apply: 'useTool',
  },
  {
    id: 'novo-cliente', module: 'clientes', title: 'Cadastrar um cliente', hint: 'Contato e serviços num texto só',
    msgs: [
      { from: 'me', text: 'Cadastra cliente novo: Clínica Vitta, contato Dr. Henrique Sales, 87 99901-2233, contratou recrutamento e consultoria' },
      { from: 'bot', type: 'card', title: 'Novo cliente', rows: [['Empresa', 'Clínica Vitta'], ['Contato', 'Dr. Henrique Sales'], ['WhatsApp', '(87) 99901-2233'], ['Serviços', 'Recrutamento, Consultoria']], ask: 'Confirma o cadastro? Qual o dia fixo dos encontros?' },
      { from: 'me', text: 'Confirma. Quartas às 10h' },
      { from: 'bot', text: 'Cliente cadastrado. Os encontros de quarta às 10h já entram na agenda automática.', link: 'Ver o cliente' },
    ],
    apply: 'newClient',
  },
  {
    id: 'consulta', module: 'inicio', title: 'Perguntar os números', hint: 'Respostas com os dados reais do sistema',
    msgs: [
      { from: 'me', text: 'Como está outubro até agora?' },
      { from: 'bot', type: 'summary' },
      { from: 'me', text: 'E o que eu fiz na Amorim esse mês?' },
      { from: 'bot', type: 'history', client: 'amorim' },
    ],
  },
  {
    id: 'relatorio', module: 'relatorios', title: 'Pedir o relatório do cliente', hint: 'O PDF chega no WhatsApp',
    msgs: [
      { from: 'me', text: 'Manda o relatório da Amorim dos últimos 6 meses' },
      { from: 'bot', text: 'Montando o relatório de maio a outubro com encontros, faltas, ferramentas, vagas e treinamentos.' },
      { from: 'bot', type: 'file', name: 'Relatorio-Amorim-mai-out-2026.pdf', size: '410 KB', text: 'Pronto. Pode encaminhar direto para a Patrícia.' },
    ],
  },
];

// Fluxos automáticos do n8n, na ordem do dia.
window.OMEGA_FLOWS = [
  { id: 'agente', name: 'Agente Ômega', when: 'Sempre ativo', time: '24h', kind: 'Conversa', desc: 'Recebe áudio, texto e arquivos da Raffaella e da Lari, entende o pedido, pergunta o que falta e grava depois da confirmação.', steps: ['WhatsApp', 'Transcrição', 'Agente de IA', 'Confirmação', 'Sistema'], last: 'há 3 min', next: '—', sample: null },
  { id: 'agenda-dia', name: 'Agenda do dia', when: 'Todo dia útil, 7h30', time: '07:30', kind: 'Agenda', desc: 'Manda para a Raffaella os encontros e treinamentos do dia, com o próximo passo de cada cliente.', steps: ['Agenda', 'Histórico', 'WhatsApp'], last: 'hoje, 7h30', next: 'amanhã, 7h30', sample: 'Bom dia, Rafa. Hoje você tem: 14h Amorim (consultoria). Último encontro: desenvolvimento da liderança. Próximo passo: acompanhar os planos de ação.' },
  { id: 'forms', name: 'Briefing do Google Forms', when: 'Quando o cliente envia o formulário', time: 'quando chega', kind: 'Vagas', desc: 'O formulário que a Ômega já usa vira uma vaga aberta, com briefing completo, e a Lari recebe o aviso.', steps: ['Google Forms', 'Nova vaga', 'Aviso à Lari'], last: '22/10, 10h18', next: '—', sample: 'Lari, chegou briefing novo da Flavine: Assistente administrativo. A vaga já está em Abertas para conferir.' },
  { id: 'pos-encontro', name: 'Pergunta pós-encontro', when: 'Quando um encontro termina na agenda', time: 'fim do encontro', kind: 'Agenda', desc: 'Pergunta o que rolou. A resposta, em áudio ou texto, vira o registro do encontro depois do "confirmo".', steps: ['Agenda', 'Pergunta', 'Áudio', 'Resumo', 'Confirmação'], last: 'hoje, 16h05', next: '30/10, 10h35', sample: 'Rafa, o encontro na Amorim terminou às 16h. O que rolou hoje? Pode mandar em áudio.' },
  { id: 'vespera', name: 'Lembrete da véspera', when: 'Todo dia, 18h', time: '18:00', kind: 'Agenda', desc: 'Para cada encontro do dia seguinte, lembra o que foi trabalhado e o próximo passo combinado.', steps: ['Agenda de amanhã', 'Último encontro', 'WhatsApp'], last: 'ontem, 18h', next: 'hoje, 18h', sample: 'Amanhã tem treinamento na Amorim às 9h: Feedback na prática, 18 pessoas. Material: Roteiro de feedback.' },
  { id: 'cobranca', name: 'Relato pendente', when: 'Todo dia, 20h', time: '20:00', kind: 'Agenda', desc: 'Se algum encontro do dia ainda não tem relato confirmado, lembra uma única vez.', steps: ['Encontros de hoje', 'Sem relato?', 'Lembrete'], last: 'ontem, 20h (nada pendente)', next: 'hoje, 20h', sample: 'Rafa, falta só o relato da Amorim de hoje. Manda um áudio rapidinho quando puder.' },
  { id: 'mensal', name: 'Resumo do mês', when: 'Dia 1, 8h', time: 'dia 1', kind: 'Números', desc: 'Vagas abertas, em seleção e fechadas, valor contratado, encontros, faltas e treinamentos do mês que passou.', steps: ['Dados do mês', 'Resumo', 'WhatsApp'], last: '01/10, 8h', next: '01/11, 8h', sample: 'Resumo de outubro: 6 vagas abertas, 3 fechadas (R$ 7.400 contratados), 6 encontros, 1 falta e 1 treinamento realizado.' },
  { id: 'saude', name: 'WhatsApp conectado', when: 'A cada 5 minutos', time: '5 min', kind: 'Segurança', desc: 'Confere se o número da Ômega continua conectado. Se cair, avisa o Wallison na hora.', steps: ['Verificação', 'Alerta se cair'], last: 'há 2 min', next: 'em 3 min', sample: null },
];

window.OMEGA_TEAM = [
  { name: 'Raffaella', role: 'Administradora', phone: '(87) 9••••-••12', can: 'Tudo, inclusive valores e relatórios', verified: true },
  { name: 'Lari', role: 'Assistente', phone: '(87) 9••••-••48', can: 'Vagas, encontros, treinamentos e biblioteca. Valores: a combinar', verified: true },
];

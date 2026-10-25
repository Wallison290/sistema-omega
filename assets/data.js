// Dados de demonstração do Sistema Ômega. Tudo fictício, só para apresentar.
// "Hoje" fica fixo para a demonstração contar sempre a mesma história.
window.OMEGA_TODAY = '2026-10-27';

// Perguntas do formulário de briefing (o mesmo roteiro que a Ômega usava no Google Forms).
window.OMEGA_BRIEFING = [
  { k: 'vaga', q: 'Qual a vaga desejada?', req: true, ph: 'Ex.: Auxiliar administrativo' },
  { k: 'motivo', q: 'Por que essa vaga existe agora? É reposição, expansão ou nova posição?', opts: ['Reposição', 'Expansão', 'Nova posição'] },
  { k: 'problema', q: 'Qual problema essa pessoa precisa resolver nos primeiros meses?', long: true },
  { k: 'atividades', q: 'Quais atividades serão mais frequentes na rotina?', long: true },
  { k: 'primeiroDia', q: 'O que a pessoa precisa saber desde o primeiro dia?', long: true },
  { k: 'exige', q: 'A vaga exige: execução, autonomia, liderança técnica ou gestão de pessoas?', opts: ['Execução', 'Autonomia', 'Liderança técnica', 'Gestão de pessoas'] },
  { k: 'atencao', q: 'Quais situações da rotina exigem mais atenção comportamental?', long: true },
  { k: 'remuneracao', q: 'Qual a remuneração e os benefícios oferecidos?', ph: 'Ex.: R$ 1.800 + VT + VR' },
  { k: 'horario', q: 'Qual o horário de trabalho e a carga horária semanal?', ph: 'Ex.: Seg a sex, 8h às 18h · 44h' },
  { k: 'modelo', q: 'A vaga é presencial, remota ou híbrida?', opts: ['Presencial', 'Remota', 'Híbrida'] },
  { k: 'criterio', q: 'Qual o critério final na decisão para o candidato ser aprovado ou reprovado?', long: true },
  { k: 'perfil', q: 'Qual o perfil comportamental desejado para a função?', long: true },
];

window.OMEGA_SEED = {
  clients: [
    { id: 'amorim', name: 'Amorim', segment: 'Indústria de alimentos', stage: 'cliente', contact: 'Patrícia Lemos', role: 'Gerente de RH', phone: '(87) 99812-4410', email: 'patricia@amorim.com.br', services: ['Recrutamento', 'Consultoria', 'Treinamentos'], since: '2025-02-10', origin: 'painel', meetingDay: 'Terças, 14h', lastContact: '2026-10-27', people: [['Patrícia Lemos', 'Gerente de RH'], ['Sérgio Amorim', 'Diretor']] },
    { id: 'flavine', name: 'Flavine', segment: 'Varejo de moda', stage: 'cliente', contact: 'Marcos Vieira', role: 'Sócio', phone: '(87) 99640-1187', email: 'marcos@flavine.com', services: ['Recrutamento', 'Consultoria'], since: '2025-08-02', origin: 'painel', meetingDay: 'Quintas, 9h', lastContact: '2026-10-23', people: [['Marcos Vieira', 'Sócio']] },
    { id: 'dedarc', name: 'DEDARC', segment: 'Distribuidora', stage: 'cliente', contact: 'Ana Rocha', role: 'Diretora administrativa', phone: '(87) 99155-3002', email: 'ana.rocha@dedarc.com.br', services: ['Recrutamento', 'Consultoria', 'Treinamentos'], since: '2024-11-18', origin: 'painel', meetingDay: 'Segundas, 14h', lastContact: '2026-10-26', people: [['Ana Rocha', 'Diretora administrativa'], ['Felipe Dantas', 'Gerente comercial']] },
    { id: 'solaris', name: 'Grupo Solaris', segment: 'Energia solar', stage: 'cliente', contact: 'Diego Ramos', role: 'Coordenador comercial', phone: '(87) 99733-8851', email: 'diego@gruposolaris.com', services: ['Recrutamento'], since: '2026-10-14', origin: 'whatsapp', meetingDay: '', lastContact: '2026-10-20', people: [['Diego Ramos', 'Coordenador comercial']] },
    { id: 'serra', name: 'Hotel Serra Azul', segment: 'Hotelaria', stage: 'negociacao', contact: 'Juliana Costa', role: 'Gerente geral', phone: '(87) 99410-7720', email: 'juliana@serraazul.com', services: ['Recrutamento'], since: '2026-10-05', origin: 'whatsapp', meetingDay: '', lastContact: '2026-10-25', potential: 3200, people: [['Juliana Costa', 'Gerente geral']] },
    { id: 'vitta', name: 'Clínica Vitta', segment: 'Saúde', stage: 'proposta', contact: 'Dr. Henrique Sales', role: 'Diretor', phone: '(87) 99901-2233', email: 'henrique@clinicavitta.com', services: ['Consultoria'], since: '2026-10-12', origin: 'link', meetingDay: '', lastContact: '2026-10-24', potential: 2800, people: [['Dr. Henrique Sales', 'Diretor'], ['Carol Melo', 'Recepção']] },
    { id: 'horizonte', name: 'Construtora Horizonte', segment: 'Construção civil', stage: 'qualificacao', contact: 'Rodrigo Pires', role: 'Sócio-diretor', phone: '(87) 99288-6611', email: 'rodrigo@horizonte.eng.br', services: ['Recrutamento'], since: '2026-10-20', origin: 'indicacao', meetingDay: '', lastContact: '2026-10-22', potential: 4500, people: [['Rodrigo Pires', 'Sócio-diretor']] },
    { id: 'padaria', name: 'Padaria Real', segment: 'Alimentação', stage: 'lead', contact: 'Sandra Moura', role: 'Proprietária', phone: '(87) 99102-4455', email: '', services: [], since: '2026-10-26', origin: 'whatsapp', meetingDay: '', lastContact: '2026-10-26', potential: 1500, people: [['Sandra Moura', 'Proprietária']] },
    { id: 'nogueira', name: 'Mercantil Nogueira', segment: 'Atacado', stage: 'perdido', lostReason: 'Achou o valor acima do orçamento', contact: 'Paulo Nogueira', role: 'Gerente', phone: '(87) 99530-1199', email: 'paulo@nogueira.com', services: [], since: '2026-08-15', origin: 'indicacao', meetingDay: '', lastContact: '2026-09-02', potential: 1700, people: [['Paulo Nogueira', 'Gerente']] },
    { id: 'autopecas', name: 'Auto Peças Lima', segment: 'Autopeças', stage: 'inativo', contact: 'Renato Lima', role: 'Proprietário', phone: '(87) 99877-3030', email: 'renato@autopecaslima.com', services: ['Recrutamento'], since: '2025-04-01', origin: 'painel', meetingDay: '', lastContact: '2026-05-12', people: [['Renato Lima', 'Proprietário']] },
  ],

  interactions: [
    { client: 'serra', date: '2026-10-25', kind: 'WhatsApp', who: 'Raffaella', text: 'Juliana pediu desconto para 2 vagas. Enviada versão 2 da proposta (R$ 1.600 por vaga).' },
    { client: 'vitta', date: '2026-10-24', kind: 'Proposta', who: 'Raffaella', text: 'Proposta de consultoria mensal enviada por e-mail e WhatsApp.' },
    { client: 'vitta', date: '2026-10-22', kind: 'Reunião', who: 'Raffaella', text: 'Diagnóstico: equipe de recepção com alta rotatividade. Interesse em 4 encontros por mês.' },
    { client: 'horizonte', date: '2026-10-22', kind: 'Ligação', who: 'Lari', text: 'Indicação da Amorim. Precisa de engenheiro civil para obra em Petrolina. Pediu proposta.' },
    { client: 'padaria', date: '2026-10-26', kind: 'WhatsApp', who: 'Lari', text: 'Chegou pelo Instagram. Quer contratar 2 atendentes de balcão. Agendar conversa.' },
    { client: 'autopecas', date: '2026-05-12', kind: 'Nota', who: 'Raffaella', text: 'Fechamos vendedor de balcão. Ficaram de chamar para o estoque no segundo semestre.' },
    { client: 'nogueira', date: '2026-09-02', kind: 'Nota', who: 'Raffaella', text: 'Recusou a proposta: orçamento de R$ 1.200. Retomar em 2027.' },
    { client: 'amorim', date: '2026-10-20', kind: 'Reunião', who: 'Raffaella', text: 'Patrícia pediu dois finalistas para Analista de RH até sexta.' },
  ],

  jobs: [
    { id: 'v1', title: 'Analista de RH', client: 'amorim', qty: 1, fee: 2400, stage: 'selecao', flag: 'Aguardando o cliente escolher entre 2 finalistas', created: '2026-10-08', origin: 'briefing', proposal: 'p9',
      brief: { motivo: 'Expansão', problema: 'Estruturar a rotina de admissão e reduzir o tempo de contratação.', atividades: 'Triagem de currículos, entrevistas, integração de novos colaboradores.', primeiroDia: 'Rotinas de DP e uso de planilhas.', exige: 'Autonomia', atencao: 'Conversas difíceis com líderes e candidatos reprovados.', remuneracao: 'R$ 3.200 + VR + plano de saúde', horario: 'Seg a sex, 8h às 18h · 44h', modelo: 'Presencial', criterio: 'Postura consultiva com os líderes.', perfil: 'Comunicativo, organizado e discreto.' },
      history: [['2026-10-08', 'Briefing recebido pelo formulário', 'Formulário'], ['2026-10-09', 'Movida para Recrutamento', 'Lari'], ['2026-10-16', 'Movida para Seleção', 'Raffaella'], ['2026-10-24', 'Marcada como pendente: aguardando o cliente', 'Raffaella']] },
    { id: 'v2', title: 'Assistente administrativo', client: 'flavine', qty: 1, fee: 1800, stage: 'abertas', created: '2026-10-22', origin: 'briefing', isNew: true,
      brief: { motivo: 'Reposição', problema: 'Organizar notas fiscais e o contas a pagar que ficou acumulado.', atividades: 'Lançamentos, conferência de notas, atendimento a fornecedores.', primeiroDia: 'Excel intermediário.', exige: 'Execução', atencao: 'Prazos de pagamento no fim do mês.', remuneracao: 'R$ 2.200 + VT', horario: 'Seg a sex, 8h às 17h · 44h', modelo: 'Presencial', criterio: 'Prova prática de Excel.', perfil: 'Detalhista e paciente.' },
      history: [['2026-10-22', 'Briefing recebido pelo formulário', 'Formulário']] },
    { id: 'v3', title: 'Vendedor interno', client: 'dedarc', qty: 2, fee: 1600, stage: 'recrutamento', created: '2026-10-13', origin: 'whatsapp', proposal: null,
      brief: { motivo: 'Expansão', problema: 'Atender a nova carteira de clientes do interior.', atividades: 'Prospecção por telefone, pedidos, pós-venda.', primeiroDia: 'Experiência com metas de vendas.', exige: 'Execução', atencao: 'Clientes insatisfeitos com prazo de entrega.', remuneracao: 'R$ 2.100 + comissão', horario: 'Seg a sáb, escala · 44h', modelo: 'Presencial', criterio: 'Simulação de venda por telefone.', perfil: 'Persistente e cordial.' },
      history: [['2026-10-13', 'Vaga aberta pelo WhatsApp', 'Raffaella'], ['2026-10-15', 'Anúncio publicado · captação de currículos', 'Lari']] },
    { id: 'v4', title: 'Coordenador comercial', client: 'amorim', qty: 1, fee: 3500, stage: 'fechadas', created: '2026-09-22', closed: '2026-10-20', hired: 'Eduardo Farias', origin: 'whatsapp',
      brief: { motivo: 'Nova posição', remuneracao: 'R$ 5.500 + bônus', horario: 'Seg a sex · 44h', modelo: 'Presencial', exige: 'Gestão de pessoas' },
      history: [['2026-09-22', 'Vaga aberta', 'Raffaella'], ['2026-10-20', 'Fechada · Eduardo Farias contratado', 'Raffaella']] },
    { id: 'v5', title: 'Auxiliar de logística', client: 'flavine', qty: 1, fee: 1500, stage: 'fechadas', created: '2026-10-05', closed: '2026-10-17', hired: 'Luan Barbosa', origin: 'painel',
      brief: { motivo: 'Reposição', remuneracao: 'R$ 1.800', modelo: 'Presencial', exige: 'Execução' }, history: [['2026-10-05', 'Vaga aberta', 'Lari'], ['2026-10-17', 'Fechada · Luan Barbosa', 'Lari']] },
    { id: 'v6', title: 'Recepcionista', client: 'flavine', qty: 1, fee: 1500, stage: 'fechadas', created: '2026-09-02', closed: '2026-09-14', hired: 'Bianca Nunes', origin: 'briefing',
      brief: { motivo: 'Reposição', remuneracao: 'R$ 1.900 + VT', horario: 'Seg a sáb, comercial', modelo: 'Presencial', exige: 'Execução', perfil: 'Simpática e organizada.' }, history: [['2026-09-02', 'Briefing recebido', 'Formulário'], ['2026-09-14', 'Fechada · Bianca Nunes', 'Lari']] },
    { id: 'v7', title: 'Consultor de vendas externo', client: 'solaris', qty: 3, fee: 1700, stage: 'recrutamento', created: '2026-10-14', origin: 'whatsapp', proposal: 'p10',
      brief: { motivo: 'Expansão', remuneracao: 'R$ 2.500 + comissão', modelo: 'Presencial', exige: 'Autonomia', primeiroDia: 'CNH B e moto ou carro próprio.' }, history: [['2026-10-14', 'Vaga aberta pelo WhatsApp', 'Raffaella']] },
    { id: 'v8', title: 'Auxiliar administrativo', client: 'amorim', qty: 1, fee: 1500, stage: 'fechadas', created: '2026-03-02', closed: '2026-03-20', hired: 'Mariana Souza', origin: 'painel', proposal: 'p1',
      brief: { motivo: 'Reposição', remuneracao: 'R$ 1.750 + VT', horario: 'Seg a sex · 44h', modelo: 'Presencial', exige: 'Execução' }, history: [['2026-03-02', 'Vaga aberta', 'Raffaella'], ['2026-03-20', 'Fechada · Mariana Souza', 'Raffaella']] },
    { id: 'v9', title: 'Supervisor de produção', client: 'dedarc', qty: 1, fee: 2800, stage: 'pendente', flag: 'Aguardando o cliente aprovar a faixa salarial', created: '2026-10-19', origin: 'briefing',
      brief: { motivo: 'Nova posição', problema: 'Reduzir perdas na linha de embalagem.', exige: 'Gestão de pessoas', remuneracao: 'A definir com a diretoria', modelo: 'Presencial', horario: 'Turno A · 44h' }, history: [['2026-10-19', 'Briefing recebido pelo formulário', 'Formulário'], ['2026-10-21', 'Pendente: faixa salarial em aprovação', 'Raffaella']] },
  ],

  candidates: [
    { id: 'c1', name: 'Carla Mendes', job: 'v1', origin: 'whatsapp', status: 'apresentado', rating: 5, city: 'Petrolina', phone: '(87) 99111-2020', date: '2026-10-10', notes: 'Ótima postura consultiva. Já atuou com DP.', evals: [['Raffaella', 'Entrevista por competências: muito segura.', 5]] },
    { id: 'c2', name: 'Rafael Souza', job: 'v1', origin: 'email', status: 'apresentado', rating: 4, city: 'Juazeiro', phone: '(74) 99222-3131', date: '2026-10-11', notes: 'Forte em recrutamento, menos em DP.', evals: [['Raffaella', 'Bom repertório de entrevistas.', 4]] },
    { id: 'c3', name: 'Juliana Prado', job: 'v1', origin: 'indicacao', status: 'reprovado', rating: 2, city: 'Petrolina', phone: '(87) 99333-4242', date: '2026-10-12', notes: 'Sem disponibilidade de horário.', evals: [] },
    { id: 'c4', name: 'Joana Silva', job: 'v3', origin: 'whatsapp', status: 'entrevista', rating: 4, city: 'Petrolina', phone: '(87) 99444-5353', date: '2026-10-18', notes: '', evals: [] },
    { id: 'c5', name: 'Pedro Henrique', job: 'v3', origin: 'whatsapp', status: 'triagem', rating: 3, city: 'Petrolina', phone: '(87) 99555-6464', date: '2026-10-19', notes: '', evals: [] },
    { id: 'c6', name: 'Larissa Gomes', job: 'v3', origin: 'email', status: 'recebido', rating: 0, city: 'Juazeiro', phone: '(74) 99666-7575', date: '2026-10-25', notes: '', evals: [] },
    { id: 'c7', name: 'Marcos Paulo', job: 'v3', origin: 'site', status: 'triagem', rating: 3, city: 'Petrolina', phone: '(87) 99777-8686', date: '2026-10-21', notes: '', evals: [] },
    { id: 'c8', name: 'Eduardo Farias', job: 'v4', origin: 'indicacao', status: 'aprovado', rating: 5, city: 'Petrolina', phone: '(87) 99888-9797', date: '2026-09-28', notes: 'Contratado em 20/10.', evals: [['Raffaella', 'Liderança muito madura.', 5]] },
    { id: 'c9', name: 'Luan Barbosa', job: 'v5', origin: 'whatsapp', status: 'aprovado', rating: 4, city: 'Petrolina', phone: '(87) 99999-0808', date: '2026-10-07', notes: '', evals: [] },
    { id: 'c10', name: 'Tiago Martins', job: 'v7', origin: 'whatsapp', status: 'recebido', rating: 0, city: 'Petrolina', phone: '(87) 98111-2323', date: '2026-10-26', notes: '', evals: [] },
    { id: 'c11', name: 'Bruna Lopes', job: 'v7', origin: 'site', status: 'triagem', rating: 3, city: 'Lagoa Grande', phone: '(87) 98222-3434', date: '2026-10-22', notes: 'Tem moto própria.', evals: [] },
    { id: 'c12', name: 'Gustavo Reis', job: 'v9', origin: 'indicacao', status: 'recebido', rating: 0, city: 'Petrolina', phone: '(87) 98333-4545', date: '2026-10-23', notes: 'Indicado pelo Felipe (DEDARC).', evals: [] },
  ],

  events: [
    { id: 'e1', type: 'consultoria', client: 'amorim', date: '2026-10-27', time: '14:00', end: '16:00', status: 'aguardando', origin: 'auto', askedAt: '16:05', topic: '', summary: '', tool: '', next: '' },
    { id: 'e2', type: 'consultoria', client: 'dedarc', date: '2026-10-26', time: '14:00', end: '15:30', status: 'realizado', origin: 'auto', topic: 'Descritivo de cargos', summary: 'Finalizamos o descritivo dos cargos do comercial e alinhamos a faixa salarial.', tool: 'Modelo de descritivo de cargo', next: 'Apresentar os descritivos para a diretoria.', transcript: 'Hoje na DEDARC a gente terminou o descritivo de cargo do comercial, usei aquele modelo, e alinhamos a faixa salarial. Próximo passo é apresentar pra diretoria.' },
    { id: 'e3', type: 'consultoria', client: 'flavine', date: '2026-10-23', time: '09:00', end: '10:30', status: 'realizado', origin: 'auto', topic: 'Alinhamento de equipe', summary: 'Revisão dos combinados e responsabilidades de cada função.', tool: 'Matriz de responsabilidades', next: 'Validar a divisão de tarefas com a equipe.' },
    { id: 'e4', type: 'consultoria', client: 'amorim', date: '2026-10-20', time: '14:00', end: '16:00', status: 'realizado', origin: 'auto', topic: 'Desenvolvimento da liderança', summary: 'Desafios dos líderes e ações para melhorar o feedback.', tool: 'Roda de competências', next: 'Acompanhar os planos de ação das lideranças.' },
    { id: 'e5', type: 'consultoria', client: 'dedarc', date: '2026-10-19', time: '14:00', end: '15:30', status: 'falta', origin: 'auto', topic: 'Cultura e comunicação', summary: 'Cliente não compareceu. Pediu para remarcar.', next: 'Remarcar.' },
    { id: 'e6', type: 'consultoria', client: 'flavine', date: '2026-10-16', time: '09:00', end: '10:30', status: 'realizado', origin: 'painel', topic: 'Diagnóstico de equipe', summary: 'Levantamento das necessidades da equipe administrativa.', tool: 'Roteiro de diagnóstico', next: 'Definir responsabilidades.' },
    { id: 'e7', type: 'consultoria', client: 'amorim', date: '2026-10-13', time: '14:00', end: '16:00', status: 'realizado', origin: 'auto', topic: 'Mapeamento de competências', summary: 'Diagnóstico inicial de competências da liderança.', tool: 'Roda de competências', next: 'Trabalhar feedback.' },
    { id: 'e8', type: 'consultoria', client: 'flavine', date: '2026-10-09', time: '09:00', end: '10:30', status: 'cancelado', origin: 'painel', topic: 'Encontro mensal', summary: 'Cancelado pela Ômega (feriado municipal).', next: '' },
    { id: 'e9', type: 'treinamento', client: 'amorim', date: '2026-10-28', time: '09:00', end: '12:00', status: 'confirmado', origin: 'whatsapp', topic: 'Feedback na prática', place: 'Sede Amorim', people: 18, material: 'Roteiro de feedback' },
    { id: 'e10', type: 'reuniao', client: 'vitta', date: '2026-10-29', time: '10:30', end: '11:30', status: 'confirmado', origin: 'link', topic: 'Apresentação da proposta', summary: '', next: '' },
    { id: 'e11', type: 'consultoria', client: 'flavine', date: '2026-10-30', time: '09:00', end: '10:30', status: 'agendado', origin: 'auto', topic: '' },
    { id: 'e12', type: 'consultoria', client: 'dedarc', date: '2026-11-02', time: '14:00', end: '15:30', status: 'agendado', origin: 'auto', topic: '' },
    { id: 'e13', type: 'consultoria', client: 'amorim', date: '2026-11-03', time: '14:00', end: '16:00', status: 'agendado', origin: 'auto', topic: '' },
    { id: 'e14', type: 'reuniao', client: 'horizonte', date: '2026-11-04', time: '15:30', end: '16:30', status: 'agendado', origin: 'link', topic: 'Entender a vaga de engenheiro' },
    { id: 'e15', type: 'treinamento', client: 'dedarc', date: '2026-10-15', time: '08:30', end: '12:00', status: 'realizado', origin: 'whatsapp', topic: 'Comunicação e trabalho em equipe', place: 'Auditório DEDARC', people: 24, attended: 22, material: 'Matriz de responsabilidades' },
    { id: 'e16', type: 'consultoria', client: 'flavine', date: '2026-11-06', time: '09:00', end: '10:30', status: 'agendado', origin: 'auto', topic: '' },
  ],

  proposals: [
    { id: 'p1', client: 'amorim', service: 'Recrutamento e seleção', role: 'Auxiliar administrativo', qty: 1, value: 1500, unit: 'por vaga', status: 'aprovada', date: '2026-03-01', scope: 'Recrutamento completo até a contratação, com garantia de 60 dias.', conditions: '50% na abertura, 50% na contratação.', versions: [[1, '2026-03-01', 1500, 'Proposta inicial']], contract: { status: 'assinado', date: '2026-03-02' } },
    { id: 'p2', client: 'flavine', service: 'Recrutamento e seleção', role: 'Auxiliar administrativo', qty: 1, value: 1400, unit: 'por vaga', status: 'aprovada', date: '2025-11-08', scope: 'Recrutamento completo até a contratação.', conditions: 'À vista na contratação.', versions: [[1, '2025-11-06', 1500, 'Proposta inicial'], [2, '2025-11-08', 1400, 'Desconto de cliente recorrente']], contract: { status: 'assinado', date: '2025-11-10' } },
    { id: 'p3', client: 'serra', service: 'Recrutamento e seleção', role: 'Auxiliar administrativo', qty: 2, value: 1600, unit: 'por vaga', status: 'negociacao', date: '2026-10-25', scope: 'Duas vagas de auxiliar administrativo para o setor de reservas.', conditions: '50% na abertura, 50% na contratação.', versions: [[1, '2026-10-18', 1800, 'Proposta inicial'], [2, '2026-10-25', 1600, 'Ajuste para 2 vagas']], contract: null },
    { id: 'p4', client: 'vitta', service: 'Consultoria mensal', role: '', qty: 1, value: 2800, unit: 'por mês', status: 'enviada', date: '2026-10-24', scope: '4 encontros mensais com a equipe de recepção, foco em atendimento e rotatividade.', conditions: 'Contrato de 6 meses, pagamento mensal.', versions: [[1, '2026-10-24', 2800, 'Proposta inicial']], contract: null },
    { id: 'p5', client: 'dedarc', service: 'Treinamento in company', role: 'Comunicação e trabalho em equipe', qty: 1, value: 3200, unit: 'por turma', status: 'aprovada', date: '2026-09-20', scope: 'Treinamento de 3h30 para até 25 pessoas, com material impresso.', conditions: 'À vista após o treinamento.', versions: [[1, '2026-09-20', 3200, 'Proposta inicial']], contract: { status: 'assinado', date: '2026-09-25' } },
    { id: 'p6', client: 'nogueira', service: 'Recrutamento e seleção', role: 'Vendedor', qty: 1, value: 1700, unit: 'por vaga', status: 'recusada', date: '2026-08-28', scope: 'Recrutamento de vendedor externo.', conditions: '50% na abertura.', versions: [[1, '2026-08-28', 1700, 'Proposta inicial']], contract: null },
    { id: 'p7', client: 'amorim', service: 'Consultoria mensal', role: '', qty: 1, value: 3200, unit: 'por mês', status: 'aprovada', date: '2025-02-05', scope: 'Encontros semanais de desenvolvimento de liderança.', conditions: 'Renovação anual.', versions: [[1, '2025-02-01', 3500, 'Proposta inicial'], [2, '2025-02-05', 3200, 'Fechado em 12 meses']], contract: { status: 'assinado', date: '2025-02-10' } },
    { id: 'p8', client: 'horizonte', service: 'Recrutamento e seleção', role: 'Engenheiro civil', qty: 1, value: 4500, unit: 'por vaga', status: 'rascunho', date: '2026-10-26', scope: 'Engenheiro civil para obra em Petrolina.', conditions: '50% na abertura, 50% na contratação.', versions: [[1, '2026-10-26', 4500, 'Rascunho']], contract: null },
    { id: 'p9', client: 'amorim', service: 'Recrutamento e seleção', role: 'Analista de RH', qty: 1, value: 2400, unit: 'por vaga', status: 'aprovada', date: '2026-10-06', scope: 'Recrutamento completo.', conditions: '50% na abertura, 50% na contratação.', versions: [[1, '2026-10-06', 2400, 'Proposta inicial']], contract: { status: 'assinado', date: '2026-10-07' } },
    { id: 'p10', client: 'solaris', service: 'Recrutamento e seleção', role: 'Consultor de vendas externo', qty: 3, value: 1700, unit: 'por vaga', status: 'aprovada', date: '2026-10-14', scope: 'Três consultores externos.', conditions: '50% na abertura.', versions: [[1, '2026-10-14', 1700, 'Proposta inicial']], contract: { status: 'gerado', date: '2026-10-15' } },
  ],

  tools: [
    { id: 'f1', name: 'Roda de competências', cat: 'RH', pages: 3, added: '2026-08-12', origin: 'whatsapp', uses: 6, desc: 'Diagnóstico de competências e plano de desenvolvimento.' },
    { id: 'f2', name: 'Roteiro de entrevista por competências', cat: 'Recrutamento', pages: 4, added: '2026-07-02', origin: 'painel', uses: 9, desc: 'Perguntas e critérios para entrevista estruturada.' },
    { id: 'f3', name: 'Briefing de nova vaga (impresso)', cat: 'Briefing', pages: 2, added: '2026-06-20', origin: 'painel', uses: 14, desc: 'As mesmas perguntas do formulário de briefing, para imprimir.' },
    { id: 'f4', name: 'Teste de perfil comportamental', cat: 'Testes', pages: 6, added: '2026-05-11', origin: 'whatsapp', uses: 11, desc: 'Teste aplicado na triagem de candidatos.' },
    { id: 'f5', name: 'Matriz de responsabilidades', cat: 'RH', pages: 2, added: '2026-09-01', origin: 'whatsapp', uses: 5, desc: 'Atribuições e responsáveis de cada função.' },
    { id: 'f6', name: 'Roteiro de feedback', cat: 'Treinamentos', pages: 5, added: '2026-09-25', origin: 'painel', uses: 3, desc: 'Material de apoio para o treinamento de feedback.' },
    { id: 'f7', name: 'Modelo de descritivo de cargo', cat: 'RH', pages: 3, added: '2026-10-02', origin: 'whatsapp', uses: 4, desc: 'Missão, atividades e requisitos do cargo.' },
  ],

  activity: [
    { at: '2026-10-27 16:05', who: 'Automação', origin: 'auto', text: 'Perguntou à Raffaella o que rolou no encontro da Amorim', link: 'agenda' },
    { at: '2026-10-26 18:40', who: 'Candidato', origin: 'whatsapp', text: 'Tiago Martins mandou currículo para Consultor de vendas externo', link: 'recrutamento' },
    { at: '2026-10-26 15:42', who: 'Raffaella', origin: 'whatsapp', text: 'Registrou por áudio o encontro na DEDARC', link: 'agenda' },
    { at: '2026-10-25 17:10', who: 'Raffaella', origin: 'painel', text: 'Enviou a versão 2 da proposta ao Hotel Serra Azul', link: 'propostas' },
    { at: '2026-10-24 09:12', who: 'Clínica Vitta', origin: 'link', text: 'Agendou pelo link: apresentação da proposta, 29/10 às 10h30', link: 'agenda' },
    { at: '2026-10-22 10:18', who: 'Flavine', origin: 'briefing', text: 'Preencheu o formulário de briefing: Assistente administrativo', link: 'recrutamento' },
  ],

  templates: [
    { id: 'm1', kind: 'proposta', name: 'Recrutamento e seleção (por vaga)', service: 'Recrutamento e seleção', unit: 'por vaga', scope: 'Recrutamento completo até a contratação: divulgação, triagem, entrevistas, testes comportamentais e apresentação dos finalistas. Garantia de 60 dias.', conditions: '50% na abertura da vaga e 50% na contratação.', used: 18 },
    { id: 'm2', kind: 'proposta', name: 'Consultoria mensal', service: 'Consultoria mensal', unit: 'por mês', scope: 'Encontros semanais na empresa com pauta definida, ferramentas aplicadas e relatório mensal.', conditions: 'Contrato mínimo de 6 meses, pagamento mensal.', used: 7 },
    { id: 'm3', kind: 'proposta', name: 'Treinamento in company', service: 'Treinamento in company', unit: 'por turma', scope: 'Treinamento presencial com material impresso e lista de presença.', conditions: 'À vista após a realização.', used: 5 },
    { id: 'm4', kind: 'proposta', name: 'Pacote recrutamento + consultoria', service: 'Pacote', unit: 'por mês', scope: 'Consultoria mensal com até 2 vagas de recrutamento inclusas.', conditions: 'Contrato de 12 meses.', used: 2 },
    { id: 'm5', kind: 'contrato', name: 'Prestação de serviços · Recrutamento', service: 'Recrutamento e seleção', used: 14 },
    { id: 'm6', kind: 'contrato', name: 'Prestação de serviços · Consultoria', service: 'Consultoria mensal', used: 6 },
    { id: 'm7', kind: 'mensagem', name: 'Envio do formulário de briefing', service: 'WhatsApp', used: 21 },
    { id: 'm8', kind: 'mensagem', name: 'Confirmação de agendamento', service: 'WhatsApp', used: 33 },
  ],
};

// Conversas de exemplo com o agente. Ao terminar, `apply` grava o resultado
// nos dados da demonstração, como o sistema real faria.
window.OMEGA_SCENES = [
  { id: 'nova-vaga', module: 'recrutamento', title: 'Abrir uma vaga por áudio', hint: 'Ela fala a vaga, o agente pergunta o que falta', apply: 'newJob',
    msgs: [
      { from: 'me', type: 'audio', dur: '0:38', text: 'Abre uma vaga pra Amorim de auxiliar administrativo, são duas vagas, salário de mil e oitocentos, eu cobro mil e quinhentos cada. Precisa saber Excel e ter experiência com rotina de escritório.' },
      { from: 'bot', text: 'Entendi. Na última vez que a Amorim contratou essa vaga (mar/2026) o horário era seg a sex, 8h às 18h, presencial. Mantenho?' },
      { from: 'me', text: 'Mantém' },
      { from: 'bot', type: 'card', title: 'Nova vaga', rows: [['Cliente', 'Amorim'], ['Vaga', 'Auxiliar administrativo'], ['Posições', '2'], ['Remuneração', 'R$ 1.800'], ['Valor por vaga', 'R$ 1.500'], ['Horário', 'Seg a sex, 8h às 18h'], ['Modelo', 'Presencial']], ask: 'Posso criar?' },
      { from: 'me', text: 'Pode criar' },
      { from: 'bot', text: 'Vaga criada em Abertas. A Lari já foi avisada.', link: 'Ver a vaga no painel' },
    ] },
  { id: 'candidato', module: 'recrutamento', title: 'Candidato manda currículo', hint: 'Número desconhecido: o agente só recebe currículo', who: 'Candidato', apply: 'newCandidate',
    msgs: [
      { from: 'me', text: 'Boa tarde, vi a vaga de vendedor interno no Instagram. Ainda está aberta?' },
      { from: 'bot', text: 'Boa tarde! Está sim. Pode me mandar seu currículo em PDF e me dizer seu nome completo e a cidade onde mora?' },
      { from: 'me', type: 'file', name: 'Curriculo Renata Campos.pdf', size: '182 KB', text: 'Renata Campos, moro em Petrolina' },
      { from: 'bot', text: 'Recebido, Renata. Seu currículo foi encaminhado para a vaga Vendedor interno. Se você avançar, a equipe da Ômega entra em contato por aqui.' },
      { from: 'bot', auto: true, text: 'Para a Lari: novo currículo de Renata Campos em Vendedor interno · DEDARC, origem WhatsApp.', link: 'Ver a candidata' },
    ] },
  { id: 'fechar-vaga', module: 'recrutamento', title: 'Fechar uma vaga', hint: 'Status, histórico do cliente e relatório mudam juntos', apply: 'closeJob',
    msgs: [
      { from: 'me', text: 'A Amorim escolheu a Carla para analista de RH. Pode fechar.' },
      { from: 'bot', type: 'card', title: 'Fechar vaga', rows: [['Vaga', 'Analista de RH · Amorim'], ['Contratada', 'Carla Mendes'], ['Valor', 'R$ 2.400']], ask: 'Confirma? Os outros candidatos ficam como não selecionados.' },
      { from: 'me', text: 'Isso' },
      { from: 'bot', text: 'Vaga fechada. Atualizei o quadro, o histórico da Amorim e o relatório de outubro.', link: 'Ver no quadro' },
    ] },
  { id: 'briefing', module: 'recrutamento', title: 'Mandar o formulário de briefing', hint: 'O link vai pronto para o cliente preencher', apply: 'sendBrief',
    msgs: [
      { from: 'me', text: 'Manda o formulário de briefing pra Construtora Horizonte' },
      { from: 'bot', type: 'card', title: 'Mensagem para Rodrigo Pires', rows: [['Para', '(87) 99288-6611'], ['Link', 'omega.app/briefing/horizonte']], ask: 'Envio esta mensagem: "Rodrigo, para iniciarmos a seleção, preencha o briefing da vaga neste link. Leva uns 5 minutos." ?' },
      { from: 'me', text: 'Pode mandar' },
      { from: 'bot', text: 'Enviado. Quando o Rodrigo responder, a vaga nasce em Abertas e eu te aviso.', link: 'Ver o formulário' },
    ] },
  { id: 'preco', module: 'crm', title: 'Quanto eu cobrei antes?', hint: 'Histórico de preços por cargo ou cliente',
    msgs: [
      { from: 'me', text: 'Quanto eu cobrei por auxiliar administrativo das últimas vezes?' },
      { from: 'bot', type: 'prices', role: 'Auxiliar administrativo' },
      { from: 'me', text: 'Faz uma proposta pro Hotel Serra Azul de 1.600 então' },
      { from: 'bot', text: 'A proposta do Hotel Serra Azul já está em negociação com R$ 1.600 por vaga (versão 2, enviada em 25/10). Quer que eu mande um lembrete para a Juliana?', link: 'Ver a proposta' },
    ] },
  { id: 'novo-lead', module: 'crm', title: 'Registrar um novo contato', hint: 'Vira lead no funil do CRM', apply: 'newLead',
    msgs: [
      { from: 'me', text: 'Anota um lead: Farmácia Bem Estar, falei com a Lúcia, 87 99300-1212. Quer treinamento de atendimento.' },
      { from: 'bot', type: 'card', title: 'Novo lead', rows: [['Empresa', 'Farmácia Bem Estar'], ['Contato', 'Lúcia'], ['WhatsApp', '(87) 99300-1212'], ['Interesse', 'Treinamento de atendimento']], ask: 'Crio no funil como Lead? Quer que eu mande o link de agendamento para ela?' },
      { from: 'me', text: 'Sim pros dois' },
      { from: 'bot', text: 'Lead criado e link de agendamento enviado para a Lúcia.', link: 'Ver no CRM' },
    ] },
  { id: 'pos-encontro', module: 'agenda', title: 'Relato depois do encontro', hint: 'A agenda dispara a pergunta, ela responde em áudio', auto: true, apply: 'confirmMeeting',
    msgs: [
      { from: 'bot', auto: true, text: 'Rafa, o encontro na Amorim terminou às 16h. O que rolou hoje? Pode mandar em áudio.' },
      { from: 'me', type: 'audio', dur: '1:04', text: 'Hoje na Amorim a gente trabalhou feedback com os líderes. Usei a roda de competências pra comparar com o mês passado. Cada líder traz o plano de ação individual semana que vem. Todo mundo foi.' },
      { from: 'bot', type: 'card', title: 'Atendimento · Amorim · 27/10', rows: [['Pauta', 'Feedback com os líderes'], ['Ferramenta', 'Roda de competências'], ['Próximo passo', 'Plano de ação individual de cada líder'], ['Presença', 'Presente']], ask: 'Confirma o registro?' },
      { from: 'me', text: 'Confirmo' },
      { from: 'bot', text: 'Registrado no histórico da Amorim. Na véspera do próximo encontro eu te lembro do próximo passo.', link: 'Ver o atendimento' },
    ] },
  { id: 'remarcar', module: 'agenda', title: 'Remarcar um encontro', hint: 'O cliente recebe o novo horário', apply: 'reschedule',
    msgs: [
      { from: 'me', text: 'A DEDARC pediu pra passar o encontro de segunda pra terça no mesmo horário' },
      { from: 'bot', type: 'card', title: 'Remarcar', rows: [['Cliente', 'DEDARC'], ['De', 'Seg, 02/11 · 14h'], ['Para', 'Ter, 03/11 · 14h'], ['Aviso', 'Ana Rocha, pelo WhatsApp']], ask: 'Terça às 14h está livre. Remarco e aviso a Ana?' },
      { from: 'me', text: 'Pode' },
      { from: 'bot', text: 'Remarcado. A Ana recebeu a confirmação do novo horário.', link: 'Ver na agenda' },
    ] },
  { id: 'consulta', module: 'inicio', title: 'Perguntar os números', hint: 'Respostas com os dados reais do sistema',
    msgs: [
      { from: 'me', text: 'Como está outubro até agora?' },
      { from: 'bot', type: 'summary' },
    ] },
  { id: 'relatorio', module: 'relatorios', title: 'Pedir o relatório do cliente', hint: 'O PDF chega no WhatsApp',
    msgs: [
      { from: 'me', text: 'Manda o relatório da Amorim dos últimos 6 meses' },
      { from: 'bot', text: 'Montando o relatório de maio a outubro com atendimentos, faltas, ferramentas e vagas.' },
      { from: 'bot', type: 'file', name: 'Relatorio-Amorim-mai-out-2026.pdf', size: '410 KB', text: 'Pronto. Pode encaminhar direto para a Patrícia.' },
    ] },
];

// Automações, na ordem do dia.
window.OMEGA_FLOWS = [
  { id: 'agente', name: 'Agente Ômega', when: 'Sempre ativo', desc: 'Recebe áudio, texto e arquivos da Raffaella e da Lari, entende o pedido, pergunta o que falta e grava depois da confirmação.', steps: ['WhatsApp', 'Transcrição', 'Agente de IA', 'Confirmação', 'Sistema'], last: 'há 3 min', scene: 'nova-vaga' },
  { id: 'curriculos', name: 'Entrada de currículos', when: 'Quando um candidato escreve', desc: 'Números desconhecidos só conseguem mandar currículo. O agente pede nome e cidade, liga à vaga certa e avisa a Lari.', steps: ['Candidato', 'Currículo', 'Vaga', 'Aviso à Lari'], last: 'ontem, 18h40', scene: 'candidato', sample: 'Recebido, Renata. Seu currículo foi encaminhado para a vaga Vendedor interno.' },
  { id: 'briefing', name: 'Formulário de briefing', when: 'Quando o cliente envia', desc: 'O formulário da própria Ômega vira uma vaga em Abertas, com todas as respostas, e a Lari é avisada.', steps: ['Formulário', 'Nova vaga', 'Aviso à Lari'], last: '22/10, 10h18', sample: 'Lari, a Flavine preencheu o briefing de Assistente administrativo. A vaga já está em Abertas.' },
  { id: 'agendamento', name: 'Agendamento pelo link', when: 'Quando o cliente escolhe um horário', desc: 'Cria o compromisso na agenda, liga ao cadastro do cliente e manda a confirmação para os dois lados.', steps: ['Link público', 'Agenda', 'Confirmação'], last: '24/10, 9h12', sample: 'Dr. Henrique, confirmado: quinta, 29/10, às 10h30, com a Raffaella. Para remarcar, use o mesmo link.' },
  { id: 'agenda-dia', name: 'Agenda do dia', when: 'Dias úteis, 7h30', desc: 'Manda os compromissos do dia com o próximo passo de cada cliente.', steps: ['Agenda', 'Histórico', 'WhatsApp'], last: 'hoje, 7h30', sample: 'Bom dia, Rafa. Hoje: 14h Amorim (consultoria). Próximo passo: acompanhar os planos de ação.' },
  { id: 'pos-encontro', name: 'Pergunta pós-encontro', when: 'Quando um atendimento termina', desc: 'Pergunta o que rolou. O áudio vira o registro do atendimento depois do "confirmo".', steps: ['Agenda', 'Pergunta', 'Áudio', 'Resumo', 'Confirmação'], last: 'hoje, 16h05', scene: 'pos-encontro' },
  { id: 'lembretes', name: 'Lembretes e confirmações', when: 'Véspera, 18h', desc: 'Lembra a Raffaella e pede confirmação do cliente. Se o cliente remarcar, a agenda se atualiza.', steps: ['Agenda de amanhã', 'Cliente confirma', 'Agenda'], last: 'ontem, 18h', sample: 'Patrícia, confirmando o treinamento de amanhã às 9h na sede da Amorim. Responda 1 para confirmar ou 2 para remarcar.' },
  { id: 'propostas', name: 'Acompanhamento de propostas', when: '3 dias sem resposta', desc: 'Avisa quando uma proposta enviada ficou parada e sugere a mensagem de retomada.', steps: ['Proposta enviada', '3 dias', 'Lembrete'], last: 'hoje, 9h', sample: 'Rafa, a proposta da Clínica Vitta foi enviada há 3 dias e ainda não teve resposta. Quer que eu mande um lembrete ao Dr. Henrique?' },
  { id: 'inativos', name: 'Clientes inativos', when: 'Toda segunda, 8h', desc: 'Lista clientes sem atividade há mais de 90 dias e oportunidades perdidas que podem ser retomadas.', steps: ['CRM', 'Sem atividade', 'Sugestão'], last: '26/10, 8h', sample: 'Auto Peças Lima está sem atividade desde maio. Eles falaram em contratar para o estoque no segundo semestre.' },
  { id: 'mensal', name: 'Resumo do mês', when: 'Dia 1, 8h', desc: 'Vagas, contratações, atendimentos, faltas, propostas e valores do mês que passou.', steps: ['Dados do mês', 'Resumo', 'WhatsApp'], last: '01/10, 8h' },
];

window.OMEGA_TEAM = [
  { name: 'Raffaella', role: 'Administradora', phone: '(87) 9••••-••12', perms: { crm: 'Editar', recrutamento: 'Editar', agenda: 'Editar', propostas: 'Editar', relatorios: 'Ver', valores: 'Sim' } },
  { name: 'Lari', role: 'Assistente', phone: '(87) 9••••-••48', perms: { crm: 'Editar', recrutamento: 'Editar', agenda: 'Editar', propostas: 'Ver', relatorios: 'Ver', valores: 'A combinar' } },
];

// Horários que o link público de agendamento oferece.
window.OMEGA_SLOTS = ['09:00', '10:30', '14:00', '15:30'];

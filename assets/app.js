// Sistema Ômega · demonstração visual. Sem banco: os dados vivem no navegador
// e as conversas com o agente são encenadas, mas gravam como o sistema real faria.
(() => {
'use strict';

const TODAY = window.OMEGA_TODAY;
const SCENES = window.OMEGA_SCENES;
const FLOWS = window.OMEGA_FLOWS;
const KEY = 'omega-sistema-v2';

let state = load();
let view = 'inicio';
let filters = { q: '', client: '', meet: 'todos', cat: '' };
let flashId = null;
let playToken = 0;

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.jobs) return s } catch {}
  return fresh();
}
function fresh() { const s = structuredClone(window.OMEGA_SEED); s.applied = {}; s.flowsOff = {}; return s }
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {} }

// ── Utilidades ──────────────────────────────────────────────────────────────
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const d = s => s ? s.slice(8, 10) + '/' + s.slice(5, 7) : '';
const dLong = s => new Date(s + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
const cname = id => state.clients.find(c => c.id === id)?.name ?? id;
const month = TODAY.slice(0, 7);
const uid = p => p + Date.now().toString(36);
const nowStamp = () => TODAY + ' ' + new Date().toTimeString().slice(0, 5);

const P = {
  home: '<path d="M3 11 12 4l9 7v9H14v-6h-4v6H3z"/>',
  chat: '<path d="M4 19.5 5.3 16A8 8 0 1 1 8 18.7z"/><path d="M9 10.5h6M9 13.5h4"/>',
  building: '<path d="M4 21V5h11v16M15 10h5v11M2 21h20M8 9h3M8 13h3M8 17h3"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  grad: '<path d="m2 9 10-5 10 5-10 5zM6 11v5q6 5 12 0v-5"/>',
  book: '<path d="M12 6q-5-3-9 0v14q4-3 9 0 5-3 9 0V6q-4-3-9 0zM12 6v14"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 9-12h-7z"/>',
  report: '<path d="M14 3H6v18h12V7zM14 3v4h4M9 12h6M9 16h4"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  form: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/>',
  print: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  hand: '<path d="M7 11V6a1.5 1.5 0 0 1 3 0v4M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V12M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-3l-3-5a1.5 1.5 0 0 1 2.5-1.6L7 13"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
  file: '<path d="M14 3H6v18h12V7zM14 3v4h4"/>',
};
const ic = (n, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || P.file}</svg>`;

const ORIG = { whatsapp: ['WhatsApp', 'chat'], forms: ['Google Forms', 'form'], painel: ['Painel', 'hand'], auto: ['Automático', 'bolt'] };
const orig = o => `<span class="orig ${o}">${ic(ORIG[o][1])}${ORIG[o][0]}</span>`;
const JOB = { aberta: 'Aberta', selecao: 'Em seleção', fechada: 'Fechada' };
const MEET = { agendado: 'Agendado', aguardando: 'Aguardando relato', confirmado: 'Confirmado', falta: 'Falta' };
const tag = (k, label) => `<span class="tag ${k}">${label}</span>`;
const btn = (label, act, cls = '', icon = '', data = '') => `<button class="btn ${cls}" data-act="${act}" ${data}>${icon ? ic(icon) : ''}${label}</button>`;
const isFlash = id => flashId === id ? ' flash' : '';

// ── Navegação ───────────────────────────────────────────────────────────────
const NAV = [
  ['inicio', 'Início', 'home'],
  ['agente', 'Agente no WhatsApp', 'chat'],
  null, 'Módulos',
  ['clientes', 'Clientes', 'building'],
  ['vagas', 'Vagas', 'briefcase'],
  ['consultorias', 'Consultorias', 'calendar'],
  ['treinamentos', 'Treinamentos', 'grad'],
  ['biblioteca', 'Biblioteca', 'book'],
  null, 'Sistema',
  ['automacoes', 'Agenda automática', 'bolt'],
  ['relatorios', 'Relatórios', 'report'],
  ['equipe', 'Equipe e regras', 'users'],
];
const TITLES = Object.fromEntries(NAV.filter(Array.isArray).map(n => [n[0], n[1]]));

function renderNav() {
  const counts = {
    consultorias: state.meetings.filter(m => m.status === 'aguardando').length,
    vagas: state.jobs.filter(j => j.pending).length,
  };
  let html = '<div class="navlabel">Dia a dia</div>';
  for (let i = 0; i < NAV.length; i++) {
    const n = NAV[i];
    if (n === null) { html += `<div class="navlabel">${NAV[++i]}</div>`; continue }
    const [k, label, icon] = n;
    html += `<a class="nav ${k === 'agente' ? 'agent' : ''} ${view === k ? 'on' : ''}" href="#${k}" ${view === k ? 'aria-current="page"' : ''}>${ic(icon)}${label}${counts[k] ? `<span class="count">${counts[k]}</span>` : ''}</a>`;
  }
  $('#nav').innerHTML = html;
}

function go(v, id) {
  flashId = id || null;
  if (location.hash.slice(1) !== v) location.hash = v; else render();
}
window.addEventListener('hashchange', () => { const v = location.hash.slice(1); if (PAGES[v]) { if ($('#layer').innerHTML) closeLayer(); view = v; render(); scrollTo(0, 0) } });

function render() {
  renderNav();
  $('#crumb').textContent = TITLES[view];
  $('#page').innerHTML = PAGES[view]() + `<footer class="foot"><span>Ômega · Gestão que conecta pessoas e resultados</span><span>Demonstração visual · os dados ficam só neste navegador</span></footer>`;
  $('#side').classList.remove('open');
  if (view === 'agente') mountPhone($('#agentPhone'), SCENES, false);
  if (flashId) setTimeout(() => { document.querySelector('.flash')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); flashId = null }, 60);
}

// ── Peças comuns ────────────────────────────────────────────────────────────
function head(eyebrow, title, desc, actions = '') {
  return `<div class="phead"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${desc}</p></div><div class="acts">${actions}</div></div>`;
}
function how(wa, pn, au) {
  return `<div class="how" aria-label="Como esta tela funciona">
    <div class="wa"><span class="hi">${ic('chat')}</span><b>Pelo WhatsApp</b><p>${wa}</p></div>
    <div class="pn"><span class="hi">${ic('hand')}</span><b>No painel</b><p>${pn}</p></div>
    <div class="au"><span class="hi">${ic('bolt')}</span><b>Automático</b><p>${au}</p></div>
  </div>`;
}
const waBtn = (module, label = 'Fazer pelo WhatsApp') => btn(label, 'chat', 'wa', 'chat', `data-module="${module}"`);
const clientOptions = (sel, all = true) => (all ? `<option value="">Todos os clientes</option>` : '') + state.clients.map(c => `<option value="${c.id}" ${sel === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('');

// ── Início ──────────────────────────────────────────────────────────────────
function monthStats() {
  const jobs = state.jobs.filter(j => j.created.startsWith(month));
  const closed = state.jobs.filter(j => j.status === 'fechada' && (j.closed || '').startsWith(month));
  const meets = state.meetings.filter(m => m.date.startsWith(month) && m.date <= TODAY);
  const trains = state.trainings.filter(t => t.date.startsWith(month));
  return {
    jobs, closed, value: closed.reduce((s, j) => s + j.fee * j.qty, 0),
    open: state.jobs.filter(j => j.status !== 'fechada').length,
    done: meets.filter(m => m.status === 'confirmado'), miss: meets.filter(m => m.status === 'falta'),
    trains, trainsDone: trains.filter(t => t.status === 'realizado'),
  };
}

function inicio() {
  const s = monthStats();
  const waiting = state.meetings.filter(m => m.status === 'aguardando');
  const pendJobs = state.jobs.filter(j => j.pending);
  const tomorrowTrain = state.trainings.find(t => t.status === 'agendado' && t.date === '2026-10-28');
  const pend = [
    ...waiting.map(m => `<div class="row"><span class="ri gold">${ic('mic')}</span><span class="rt"><b>Relato do encontro · ${esc(cname(m.client))}</b><small>A pergunta foi enviada às ${m.askedAt}. Responda por áudio no WhatsApp.</small></span>${btn('Ver conversa', 'play', 'sm wa', '', 'data-scene="pos-encontro"')}</div>`),
    ...pendJobs.map(j => `<div class="row"><span class="ri">${ic('form')}</span><span class="rt"><b>Conferir briefing · ${esc(cname(j.client))}</b><small>${esc(j.title)} chegou pelo Google Forms. Confirme salário e requisitos com o cliente.</small></span>${btn('Abrir vaga', 'job', 'sm', '', `data-id="${j.id}"`)}</div>`),
    tomorrowTrain ? `<div class="row"><span class="ri">${ic('grad')}</span><span class="rt"><b>Treinamento amanhã · ${esc(cname(tomorrowTrain.client))}</b><small>${esc(tomorrowTrain.topic)}, ${hr(tomorrowTrain.time)}, ${tomorrowTrain.people} pessoas. Material: ${esc(tomorrowTrain.material)}.</small></span>${btn('Detalhes', 'training', 'sm', '', `data-id="${tomorrowTrain.id}"`)}</div>` : '',
  ].join('');

  const auto = (k, t) => !state.flowsOff[k] ? t : '';
  const slots = [
    auto('agenda-dia', ['07:30', 'Agenda do dia enviada', 'Seu WhatsApp recebeu os compromissos de hoje', 'auto done']),
    ['14:00', 'Consultoria · Amorim', 'Até 16h · Sede Amorim', ''],
    auto('pos-encontro', ['16:05', 'Pergunta pós-encontro enviada', '"O que rolou hoje na Amorim?"', 'auto done']),
    ['Agora', 'Aguardando seu áudio', 'O relato vira registro quando você confirmar', 'now'],
    auto('vespera', ['18:00', 'Lembrete da véspera', 'Treinamento Feedback na prática, amanhã às 9h', 'auto']),
    auto('cobranca', ['20:00', 'Relato pendente', 'Só envia se o relato da Amorim não chegar', 'auto']),
  ].filter(Boolean);

  return head(dLong(TODAY).replace(/^./, c => c.toUpperCase()), 'Boa tarde, Raffaella.',
    'O que chegou pelo WhatsApp, o que a agenda automática já fez hoje e o que ainda precisa de você.',
    waBtn('', 'Falar com o agente') + btn('Novo registro', 'new', 'pri', 'plus'))
  + how('Você manda áudio, texto ou arquivo e o agente cria e atualiza vagas, encontros, treinamentos e ferramentas.',
    'Tudo o que entra aparece aqui na hora, com a origem marcada. Também dá para preencher à mão.',
    'A agenda dispara as perguntas, os lembretes e os resumos sem ninguém precisar lembrar.')
  + `<div class="kpis">
      <div class="kpi"><span>Vagas abertas no mês</span><b>${s.jobs.length}</b><small>${s.open} em andamento no total</small></div>
      <div class="kpi gold"><span>Valor contratado em outubro</span><b>${money(s.value)}</b><small>${s.closed.length} vagas fechadas</small></div>
      <div class="kpi"><span>Encontros de consultoria</span><b>${s.done.length}</b><small>${s.miss.length} falta${s.miss.length === 1 ? '' : 's'} no mês</small></div>
      <div class="kpi"><span>Treinamentos</span><b>${s.trains.length}</b><small>${s.trainsDone.length} realizado · ${s.trains.length - s.trainsDone.length} agendado</small></div>
    </div>
    <div class="grid2">
      <section class="card"><div class="chead"><div><h2>Precisa de você</h2><p>Só o que depende de uma ação sua ou da Lari.</p></div></div>${pend || '<div class="empty">Nada pendente. Bom trabalho.</div>'}</section>
      <section class="card"><div class="chead"><div><h2>Agenda automática de hoje</h2><p>Os pontos dourados são o sistema trabalhando sozinho.</p></div><a class="link" href="#automacoes">Ver todas${ic('arrow')}</a></div>
        <div class="agenda">${slots.map(([t, b, sm, c]) => `<div class="slot ${c}"><span class="t">${t}</span><span class="d"></span><span><b>${b}</b><small>${sm}</small></span></div>`).join('')}</div></section>
    </div>
    <div class="grid2">
      <section class="card"><div class="chead"><div><h2>O que aconteceu</h2><p>Cada ação deixa rastro: quem fez e por onde entrou.</p></div></div>
        ${state.activity.slice(0, 6).map(a => `<a class="row click" href="#${a.link}"><span class="ri ${a.origin === 'auto' ? 'dark' : a.origin === 'whatsapp' ? 'gold' : ''}">${ic(ORIG[a.origin][1])}</span><span class="rt"><b>${esc(a.text)}</b><small>${esc(a.who)} · ${ORIG[a.origin][0]}</small></span><time>${a.at.slice(0, 10) === TODAY ? 'hoje, ' + a.at.slice(11) : d(a.at.slice(0, 10))}</time></a>`).join('')}
      </section>
      <section class="card"><div class="chead"><div><h2>Vagas em andamento</h2><p>Abertas e em seleção.</p></div><a class="link" href="#vagas">Quadro${ic('arrow')}</a></div>
        ${state.jobs.filter(j => j.status !== 'fechada').slice(0, 5).map(j => `<div class="row click" data-act="job" data-id="${j.id}"><span class="rt"><b>${esc(j.title)}</b><small>${esc(cname(j.client))} · ${j.sent} currículos · ${j.interviewed} entrevistas</small></span>${tag(j.status, JOB[j.status])}</div>`).join('')}
      </section>
    </div>`;
}

// ── Agente ──────────────────────────────────────────────────────────────────
const MOD_LABEL = { vagas: 'Vagas', consultorias: 'Consultorias', treinamentos: 'Treinamentos', biblioteca: 'Biblioteca', clientes: 'Clientes', inicio: 'Consultas', relatorios: 'Relatórios' };
const MOD_ICON = { vagas: 'briefcase', consultorias: 'calendar', treinamentos: 'grad', biblioteca: 'book', clientes: 'building', inicio: 'search', relatorios: 'report' };

function agente() {
  const groups = ['vagas', 'consultorias', 'clientes', 'treinamentos', 'biblioteca', 'inicio', 'relatorios'];
  return head('Agente Ômega · WhatsApp', 'O sistema inteiro, numa conversa.',
    'A Raffaella e a Lari falam com o número da Ômega como falam com qualquer pessoa. O agente entende, pergunta o que falta, mostra um resumo e só grava depois do "confirmo". Escolha uma conversa para ver acontecer.')
  + `<div class="how" aria-label="Como o agente funciona">
      <div class="wa"><span class="hi">${ic('mic')}</span><b>1 · Fala do jeito dela</b><p>Áudio, texto, PDF ou foto. O áudio é transcrito e entendido.</p></div>
      <div class="pn"><span class="hi">${ic('search')}</span><b>2 · Ele completa</b><p>Encontra o cliente, a vaga ou o encontro certo e pergunta só o que falta.</p></div>
      <div class="au"><span class="hi">${ic('check')}</span><b>3 · Confirma e grava</b><p>Mostra o resumo, grava no sistema e devolve o link. "Desfazer" volta a última ação.</p></div>
    </div>
    <div class="agentwrap">
      <div class="scenelist">${groups.map(g => `<div class="sgroup"><h4>${MOD_LABEL[g]}</h4><div class="scenelist">${SCENES.filter(s => s.module === g).map(s => `<button class="scene" data-act="play" data-scene="${s.id}"><span class="si">${ic(MOD_ICON[g])}</span><span><b>${esc(s.title)}</b><small>${esc(s.hint)}${s.who ? ' · pela Lari' : ''}${s.auto ? ' · começa sozinho' : ''}</small></span><span class="go">Ver ${ic('play')}</span></button>`).join('')}</div></div>`).join('')}</div>
      <div class="phone" id="agentPhone"></div>
    </div>`;
}

// ── Clientes ────────────────────────────────────────────────────────────────
function clientes() {
  return head('Relacionamento', 'Cada empresa, com a história inteira.', 'Vagas, encontros e treinamentos de cada cliente numa linha do tempo, sem procurar em grupo de WhatsApp.',
    waBtn('clientes') + btn('Novo cliente', 'form', 'pri', 'plus', 'data-form="cliente"'))
  + how('"Cadastra cliente novo: Clínica Vitta, contato Dr. Henrique…". O agente cria e pergunta o dia fixo dos encontros.',
    'Abra um cliente para ver a linha do tempo completa e gerar o relatório.',
    'O dia fixo de encontro alimenta a agenda: lembretes e perguntas saem sozinhos.')
  + `<div class="toolbar"><div class="search">${ic('search')}<input data-filter="q" placeholder="Buscar empresa ou contato" value="${esc(filters.q)}" aria-label="Buscar cliente"></div></div>
    <div class="grid3" id="results">${clientCards()}</div>`;
}
function clientCards() {
  const q = filters.q.toLowerCase();
  const list = state.clients.filter(c => (c.name + c.contact + c.segment).toLowerCase().includes(q));
  return list.map(c => {
    const jobs = state.jobs.filter(j => j.client === c.id && j.status !== 'fechada').length;
    const meets = state.meetings.filter(m => m.client === c.id && m.status === 'confirmado').length;
    const trains = state.trainings.filter(t => t.client === c.id).length;
    return `<button class="card client${isFlash(c.id)}" data-act="client" data-id="${c.id}">
      <span class="ct"><span class="letter">${esc(c.name[0])}</span><span><h3>${esc(c.name)}</h3><span class="meta">${esc(c.segment)} · ${esc(c.contact)}</span></span></span>
      <span class="chips">${c.services.map(s => `<span class="chip">${s}</span>`).join('')}</span>
      <span class="meta">${c.meetingDay ? 'Encontros: ' + esc(c.meetingDay) : 'Sem encontros fixos'} · ${orig(c.origin)}</span>
      <span class="mini"><span><b>${jobs}</b>vagas abertas</span><span><b>${meets}</b>encontros</span><span><b>${trains}</b>treinamentos</span></span>
    </button>`;
  }).join('') || '<div class="empty">Nenhum cliente encontrado.</div>';
}
function timeline(clientId, from = '0000', to = '9999') {
  const ev = [];
  state.meetings.filter(m => m.client === clientId && m.date <= TODAY && m.status !== 'aguardando' && m.status !== 'agendado').forEach(m => ev.push({ date: m.date, miss: m.status === 'falta', title: m.status === 'falta' ? 'Falta no encontro' : 'Encontro · ' + m.topic, text: m.status === 'falta' ? m.summary : `${m.summary} Ferramenta: ${m.tool}. Próximo passo: ${m.next}`, origin: m.origin }));
  state.jobs.filter(j => j.client === clientId).forEach(j => {
    ev.push({ date: j.created, title: 'Vaga aberta · ' + j.title, text: `${j.qty} ${j.qty > 1 ? 'posições' : 'posição'} · ${j.sent} currículos enviados · ${j.interviewed} entrevistas`, origin: j.origin });
    if (j.closed) ev.push({ date: j.closed, title: 'Vaga fechada · ' + j.title, text: 'Contratado(a): ' + (j.hired || '—'), origin: j.origin });
  });
  state.trainings.filter(t => t.client === clientId && t.date <= TODAY).forEach(t => ev.push({ date: t.date, title: 'Treinamento · ' + t.topic, text: `${t.place} · ${t.attended ?? t.people} participantes`, origin: t.origin }));
  return ev.filter(e => e.date >= from && e.date <= to).sort((a, b) => b.date.localeCompare(a.date));
}
function clientDrawer(id) {
  const c = state.clients.find(x => x.id === id);
  const ev = timeline(id);
  drawer(`<div><div class="eyebrow">Cliente · desde ${d(c.since)}/${c.since.slice(0, 4)}</div><h2>${esc(c.name)}</h2></div>`, `
    <dl class="dl"><dt>Segmento</dt><dd>${esc(c.segment)}</dd><dt>Contato</dt><dd>${esc(c.contact)} · ${esc(c.role)}</dd><dt>WhatsApp</dt><dd>${esc(c.phone)}</dd><dt>Serviços</dt><dd>${c.services.join(', ')}</dd><dt>Encontros fixos</dt><dd>${esc(c.meetingDay || '—')}</dd><dt>Cadastro</dt><dd>${orig(c.origin)}</dd></dl>
    <p class="explain">Pelo WhatsApp: "o que eu fiz na ${esc(c.name)} esse mês?" responde com esta linha do tempo.</p>
    <div class="sec"><h4>Linha do tempo</h4>${ev.length ? `<div class="tl">${ev.map(e => `<div class="${e.miss ? 'miss' : ''}"><small>${d(e.date)}/${e.date.slice(0, 4)} · ${ORIG[e.origin][0]}</small><b>${esc(e.title)}</b><p>${esc(e.text)}</p></div>`).join('')}</div>` : '<p class="empty">Ainda sem histórico.</p>'}</div>
    <div class="mactions">${btn('Gerar relatório', 'report', 'pri', 'report', `data-id="${c.id}"`)}</div>`);
}

// ── Vagas ───────────────────────────────────────────────────────────────────
function vagas() {
  return head('Recrutamento e seleção', 'Cada vaga, do briefing à contratação.', 'O quadro se atualiza com o que chega do Google Forms, do WhatsApp e do painel.',
    waBtn('vagas') + btn('Nova vaga', 'form', 'pri', 'plus', 'data-form="vaga"'))
  + how('"Abre vaga pra Amorim…", "a Flavine quer de novo a recepcionista", "fechei a de analista". Currículo em PDF vira anexo da vaga.',
    'Veja o quadro e abra a vaga para ver briefing, currículos e mudar o status.',
    'Briefing do Google Forms vira vaga aberta e a Lari é avisada no WhatsApp.')
  + `<div class="toolbar"><div class="search">${ic('search')}<input data-filter="q" placeholder="Buscar vaga ou cliente" value="${esc(filters.q)}" aria-label="Buscar vaga"></div><select data-filter="client" aria-label="Filtrar por cliente">${clientOptions(filters.client)}</select></div>
    <div id="results">${jobBoard()}</div>`;
}
function jobBoard() {
  const q = filters.q.toLowerCase();
  const list = state.jobs.filter(j => (!filters.client || j.client === filters.client) && (j.title + cname(j.client)).toLowerCase().includes(q));
  return `<div class="board">${['aberta', 'selecao', 'fechada'].map((s, i) => {
    const items = list.filter(j => j.status === s).sort((a, b) => (b.closed || b.created).localeCompare(a.closed || a.created));
    return `<section class="col c${i + 1}"><div class="colh"><span>${JOB[s] === 'Aberta' ? 'Abertas' : JOB[s] === 'Fechada' ? 'Fechadas' : 'Em seleção'}</span><span>${items.length}</span></div>
    ${items.map(j => `<button class="job${isFlash(j.id)}" data-act="job" data-id="${j.id}">
      <span class="jt"><span class="cli">${esc(cname(j.client))}</span>${orig(j.origin)}</span>
      <h3>${esc(j.title)}</h3><p>${money(j.salary)} · ${j.qty} ${j.qty > 1 ? 'posições' : 'posição'}</p>
      ${j.pending ? `<div class="pend">${esc(j.pending)}</div>` : ''}
      ${s === 'selecao' ? `<div class="progress" title="Entrevistas"><i style="width:${Math.min(100, j.interviewed / Math.max(1, j.sent) * 100)}%"></i></div>` : ''}
      <span class="jf"><span>${s === 'fechada' ? 'Contratado(a): ' + esc(j.hired || '—') : `${j.sent} currículos · ${j.interviewed} entrevistas`}</span><span>${money(j.fee)}/vaga</span></span>
    </button>`).join('') || '<p class="empty">Nenhuma vaga aqui.</p>'}</section>`;
  }).join('')}</div>`;
}
function jobDrawer(id) {
  const j = state.jobs.find(x => x.id === id);
  const next = j.status === 'aberta' ? btn('Iniciar seleção', 'jobstep', 'pri', 'arrow', `data-id="${j.id}"`) : j.status === 'selecao' ? btn('Fechar vaga', 'jobstep', 'pri', 'check', `data-id="${j.id}"`) : '';
  drawer(`<div><div class="eyebrow">${esc(cname(j.client))} · criada em ${d(j.created)}</div><h2>${esc(j.title)}</h2><div class="chips" style="margin-top:10px">${tag(j.status, JOB[j.status])}${orig(j.origin)}</div></div>`, `
    ${j.pending ? `<div class="ask">${ic('form')}<span>${esc(j.pending)}. Confirme pelo painel ou mande "briefing da ${esc(cname(j.client))} confirmado" no WhatsApp.</span></div>` : ''}
    <dl class="dl"><dt>Posições</dt><dd>${j.qty}</dd><dt>Salário</dt><dd>${money(j.salary)}</dd><dt>Valor por vaga</dt><dd>${money(j.fee)} <small style="color:var(--muted)">· total ${money(j.fee * j.qty)}</small></dd><dt>Horário</dt><dd>${esc(j.schedule)}</dd><dt>Escolaridade</dt><dd>${esc(j.education)}</dd>${j.hired ? `<dt>Contratado(a)</dt><dd>${esc(j.hired)} · ${d(j.closed)}</dd>` : ''}</dl>
    <div class="sec"><h4>Requisitos do briefing</h4><div class="chips">${j.reqs.map(r => `<span class="chip">${esc(r)}</span>`).join('')}</div></div>
    <div class="sec"><h4>Candidatos · ${j.sent} enviados · ${j.interviewed} entrevistados</h4>${j.cvs.length ? j.cvs.map(n => `<div class="row" style="padding:10px 0"><span class="pdf" style="width:28px;height:34px;font-size:7px">PDF</span><span class="rt"><b>${esc(n)}</b><small>Currículo anexado</small></span></div>`).join('') : '<p class="explain">Nenhum currículo ainda. Mande o PDF no WhatsApp dizendo a vaga e ele entra aqui.</p>'}</div>
    <div class="mactions">${btn('Repetir vaga', 'jobrepeat', '', 'copy', `data-id="${j.id}"`)}${j.pending ? btn('Briefing confirmado', 'jobconfirm', 'pri', 'check', `data-id="${j.id}"`) : next}</div>`);
}

// ── Consultorias ────────────────────────────────────────────────────────────
function consultorias() {
  const segs = [['todos', 'Todos'], ['aguardando', 'Aguardando relato'], ['confirmado', 'Confirmados'], ['falta', 'Faltas'], ['agendado', 'Próximos']];
  return head('Consultoria', 'Nenhum encontro se perde.', 'Pauta, conversa, ferramenta aplicada, falta e próximo passo de cada visita, por cliente e por mês.',
    waBtn('consultorias') + btn('Registrar encontro', 'form', 'pri', 'plus', 'data-form="encontro"'))
  + how('Quando o encontro termina, chega a pergunta "o que rolou hoje?". Ela responde em áudio e confirma o resumo.',
    'Consulte por cliente e situação. Ajuste qualquer registro à mão se precisar.',
    'Lembrete na véspera com o próximo passo, pergunta no fim do encontro e cobrança às 20h se faltar o relato.')
  + `<div class="toolbar"><div class="seg" role="tablist">${segs.map(([k, l]) => `<button role="tab" aria-selected="${filters.meet === k}" class="${filters.meet === k ? 'on' : ''}" data-act="meetseg" data-k="${k}">${l}</button>`).join('')}</div><select data-filter="client" aria-label="Filtrar por cliente">${clientOptions(filters.client)}</select></div>
    <div id="results">${meetTable()}</div>`;
}
function meetTable() {
  const list = state.meetings.filter(m => (filters.meet === 'todos' || m.status === filters.meet) && (!filters.client || m.client === filters.client))
    .sort((a, b) => filters.meet === 'agendado' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  return `<div class="card tbl"><table><thead><tr><th>Data</th><th>Cliente</th><th>Pauta</th><th>Ferramenta</th><th>Situação</th><th>Origem</th></tr></thead><tbody>
    ${list.map(m => `<tr class="${isFlash(m.id).trim()}" data-act="meeting" data-id="${m.id}"><td><b>${d(m.date)}</b><small>${m.time}–${m.end}</small></td><td>${esc(cname(m.client))}</td><td>${m.topic ? esc(m.topic) : `<small>${m.status === 'aguardando' ? 'Pergunta enviada às ' + m.askedAt : 'Lembrete na véspera, 18h'}</small>`}</td><td>${esc(m.tool || '—')}</td><td>${tag(m.status, MEET[m.status])}</td><td>${orig(m.origin)}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Nenhum encontro aqui.</td></tr>'}
  </tbody></table></div>`;
}
function meetingDrawer(id) {
  const m = state.meetings.find(x => x.id === id);
  let body = '';
  if (m.status === 'aguardando') body = `<div class="ask">${ic('mic')}<span>A pergunta foi enviada às ${m.askedAt}. Quando a Raffaella responder no WhatsApp, o relato aparece aqui já organizado.</span></div><div class="mactions">${btn('Ver a conversa', 'play', 'wa', 'chat', 'data-scene="pos-encontro"')}${btn('Preencher à mão', 'form', 'pri', 'hand', `data-form="encontro" data-id="${m.id}"`)}</div>`;
  else if (m.status === 'agendado') body = `<div class="sec"><h4>O que vai acontecer sozinho</h4><div class="tl"><div><small>${d(prevDay(m.date))} · 18h</small><b>Lembrete da véspera</b><p>Último encontro com a ${esc(cname(m.client))} e o próximo passo combinado.</p></div><div><small>${d(m.date)} · ${addMin(m.end, 5)}</small><b>Pergunta pós-encontro</b><p>"O que rolou hoje na ${esc(cname(m.client))}?"</p></div><div><small>${d(m.date)} · 20h</small><b>Relato pendente</b><p>Só se o relato não tiver chegado.</p></div></div></div><div class="mactions">${btn('Registrar falta', 'meetmiss', '', 'x', `data-id="${m.id}"`)}</div>`;
  else body = `<dl class="dl"><dt>Pauta</dt><dd>${esc(m.topic)}</dd><dt>O que foi feito</dt><dd>${esc(m.summary)}</dd><dt>Ferramenta</dt><dd>${esc(m.tool || '—')}</dd><dt>Próximo passo</dt><dd>${esc(m.next)}</dd><dt>Presença</dt><dd>${m.status === 'falta' ? 'Falta do cliente' : 'Presente'}</dd></dl>
    ${m.transcript ? `<div class="quote"><b>Áudio original, transcrito</b>"${esc(m.transcript)}"</div>` : ''}
    <div class="mactions">${btn('Editar', 'form', '', 'hand', `data-form="encontro" data-id="${m.id}"`)}</div>`;
  drawer(`<div><div class="eyebrow">${esc(cname(m.client))} · ${dLong(m.date)} · ${m.time}</div><h2>${esc(m.topic || 'Encontro de consultoria')}</h2><div class="chips" style="margin-top:10px">${tag(m.status, MEET[m.status])}${orig(m.origin)}</div></div>`, body);
}
const hr = t => t.replace(/^0/, '').replace(':00', 'h').replace(':', 'h');
const prevDay = s => { const x = new Date(s + 'T12:00:00'); x.setDate(x.getDate() - 1); return x.toISOString().slice(0, 10) };
const addMin = (t, n) => { const [h, m] = t.split(':').map(Number); const x = h * 60 + m + n; return `${Math.floor(x / 60)}h${String(x % 60).padStart(2, '0')}` };

// ── Treinamentos ────────────────────────────────────────────────────────────
function treinamentos() {
  const list = [...state.trainings].sort((a, b) => b.date.localeCompare(a.date));
  return head('Desenvolvimento', 'Treinamentos, do convite à presença.', 'Onde, quando, tema, quantos funcionários e o material usado.',
    waBtn('treinamentos') + btn('Novo treinamento', 'form', 'pri', 'plus', 'data-form="treinamento"'))
  + how('"Dia 6 vou dar treinamento de CNV na Flavine, 22 pessoas, na loja do centro". Depois: "o de hoje foi feito, vieram 20".',
    'Veja os próximos e os realizados, com participantes e material.',
    'Lembrete na véspera com o material separado da biblioteca.')
  + `<div class="grid3">${list.map(t => `<button class="card client${isFlash(t.id)}" data-act="training" data-id="${t.id}">
      <span class="ct" style="justify-content:space-between">${tag(t.status, t.status === 'realizado' ? 'Realizado' : 'Agendado')}${orig(t.origin)}</span>
      <span><h3>${esc(t.topic)}</h3><span class="meta">${esc(cname(t.client))} · ${esc(t.place)}</span></span>
      <span class="mini"><span><b>${d(t.date)}</b>${hr(t.time)}</span><span><b>${t.attended ?? t.people}</b>${t.attended != null ? 'presentes' : 'previstos'}</span><span><b>${esc(t.material.split(' ')[0])}</b>material</span></span>
    </button>`).join('')}</div>`;
}
function trainingDrawer(id) {
  const t = state.trainings.find(x => x.id === id);
  drawer(`<div><div class="eyebrow">${esc(cname(t.client))} · ${dLong(t.date)}</div><h2>${esc(t.topic)}</h2><div class="chips" style="margin-top:10px">${tag(t.status, t.status === 'realizado' ? 'Realizado' : 'Agendado')}${orig(t.origin)}</div></div>`, `
    <dl class="dl"><dt>Horário</dt><dd>${hr(t.time)}</dd><dt>Local</dt><dd>${esc(t.place)}</dd><dt>Previstos</dt><dd>${t.people}</dd><dt>Presentes</dt><dd>${t.attended ?? '—'}</dd><dt>Material</dt><dd>${esc(t.material)}</dd></dl>
    <p class="explain">Pelo WhatsApp: "o treinamento de hoje foi feito, vieram ${t.people - 2}" marca como realizado com a presença.</p>
    <div class="mactions">${t.status === 'agendado' ? btn('Marcar como realizado', 'traindone', 'pri', 'check', `data-id="${t.id}"`) : ''}</div>`);
}

// ── Biblioteca ──────────────────────────────────────────────────────────────
const CATS = ['RH', 'Recrutamento', 'Briefing', 'Testes', 'Treinamentos'];
function biblioteca() {
  return head('Biblioteca', 'A ferramenta certa, na hora.', 'Os PDFs e testes da Ômega por categoria, prontos para achar, imprimir ou mandar.',
    waBtn('biblioteca') + btn('Adicionar ferramenta', 'form', 'pri', 'plus', 'data-form="ferramenta"'))
  + how('Mande o PDF dizendo a categoria para guardar. Peça "me manda o teste DISC" e o arquivo volta na conversa.',
    'Filtre por categoria, abra, imprima ou baixe.',
    'A ferramenta usada num encontro fica ligada ao cliente e aparece no relatório.')
  + `<div class="ask">${ic('chat')}<span>Pelo WhatsApp: <q>me manda a roda de competências</q> e o PDF chega pronto para imprimir.</span></div>
    <div class="toolbar"><div class="cats">${['', ...CATS].map(c => `<button class="${filters.cat === c ? 'on' : ''}" data-act="cat" data-k="${c}">${c || 'Todas'}</button>`).join('')}</div><div class="search">${ic('search')}<input data-filter="q" placeholder="Buscar ferramenta" value="${esc(filters.q)}" aria-label="Buscar ferramenta"></div></div>
    <div class="grid3" id="results">${toolCards()}</div>`;
}
function toolCards() {
  const q = filters.q.toLowerCase();
  return state.tools.filter(t => (!filters.cat || t.cat === filters.cat) && (t.name + t.cat).toLowerCase().includes(q)).map(t => `<button class="card doc${isFlash(t.id)}" data-act="tool" data-id="${t.id}" style="text-align:left">
    <span class="dt"><span class="pdf">PDF</span>${orig(t.origin)}</span>
    <span><span class="cli">${t.cat}</span><h3>${esc(t.name)}</h3></span><p>${esc(t.desc)}</p>
    <span class="df"><span>${t.pages} páginas</span><span>usada ${t.uses}x</span></span>
  </button>`).join('') || '<div class="empty">Nenhuma ferramenta encontrada.</div>';
}
function toolDrawer(id) {
  const t = state.tools.find(x => x.id === id);
  const used = state.meetings.filter(m => m.tool === t.name);
  drawer(`<div><div class="eyebrow">${t.cat} · adicionada em ${d(t.added)}</div><h2>${esc(t.name)}</h2><div class="chips" style="margin-top:10px">${orig(t.origin)}<span class="chip">${t.pages} páginas</span></div></div>`, `
    <div class="card" style="padding:28px;display:grid;gap:12px"><div class="eyebrow">Ômega · ${t.cat}</div><h2>${esc(t.name)}</h2><p style="margin:0;color:var(--muted)">${esc(t.desc)}</p>${[1, 2, 3].map(() => '<div style="height:34px;border-bottom:1px solid var(--line)"></div>').join('')}<small style="color:var(--soft)">Prévia ilustrativa do arquivo</small></div>
    <div class="sec"><h4>Onde foi aplicada</h4>${used.length ? used.map(m => `<div class="row" style="padding:8px 0"><span class="rt"><b>${esc(cname(m.client))}</b><small>${d(m.date)} · ${esc(m.topic)}</small></span></div>`).join('') : '<p class="explain">Ainda não ligada a nenhum encontro.</p>'}</div>
    <div class="mactions">${btn('Mandar no WhatsApp', 'play', 'wa', 'chat', 'data-scene="pedir-ferramenta"')}${btn('Imprimir', 'demo', 'pri', 'print', 'data-msg="Na versão final, abre o PDF para imprimir."')}</div>`);
}

// ── Agenda automática ───────────────────────────────────────────────────────
function automacoes() {
  const track = [['07:30', 'Agenda do dia', 'done'], ['Fim do encontro', 'Pergunta pós-encontro', 'done'], ['18:00', 'Lembrete da véspera', ''], ['20:00', 'Relato pendente', ''], ['Quando chega', 'Briefing do Forms', 'done'], ['Dia 1, 8h', 'Resumo do mês', '']];
  return head('Agenda automática', 'A rotina que anda sozinha.', 'Fluxos do n8n que olham a agenda e os registros e falam com a Raffaella e a Lari no WhatsApp, na hora certa.')
  + `<section class="daybar"><div class="eyebrow">Um dia da Ômega</div><h2>Ninguém precisa lembrar de perguntar.</h2><div class="track">${track.map(([t, b, c]) => `<div class="tk ${c}"><span>${t}</span><b>${b}</b></div>`).join('')}</div></section>
    <p class="explain">Cada fluxo pode ser pausado. Os balões mostram a mensagem que chega no WhatsApp.</p>
    <div class="flows">${FLOWS.map(f => {
      const off = state.flowsOff[f.id];
      const scene = { 'pos-encontro': 'pos-encontro', agente: 'nova-vaga' }[f.id];
      return `<section class="card flow">
        <div class="ft"><div><h3>${f.name}</h3><div class="when">${f.when}</div></div><button class="toggle ${off ? 'off' : ''}" data-act="flow" data-id="${f.id}" aria-pressed="${!off}">${off ? '○ Pausado' : '● Ativo'}</button></div>
        <p>${f.desc}</p>
        <div class="route">${f.steps.map((s, i) => `${i ? '<i>→</i>' : ''}<span>${s}</span>`).join('')}</div>
        ${f.sample ? `<div class="sample"><small>Mensagem no WhatsApp</small>${esc(f.sample)}</div>` : ''}
        <div class="ff"><span>Última: ${f.last}</span><span>${scene ? `<button class="link" data-act="play" data-scene="${scene}">Ver na conversa${ic('arrow')}</button>` : 'Próxima: ' + f.next}</span></div>
      </section>`;
    }).join('')}</div>`;
}

// ── Relatórios ──────────────────────────────────────────────────────────────
let rep = { client: 'amorim', period: '6' };
function relatorios() {
  return head('Relatórios', 'O trabalho, provado em um documento.', 'Escolha a empresa e o período. Encontros, faltas, ferramentas, vagas e treinamentos numa linha do tempo pronta para PDF.')
  + how('"Manda o relatório da Amorim dos últimos 6 meses" e o PDF chega na conversa, pronto para encaminhar.',
    'Escolha cliente e período, confira a prévia e imprima ou salve em PDF.',
    'Só entram registros confirmados. Relato ainda em revisão fica de fora.')
  + `<div class="reportwrap"><section class="card rform">
      <h2>Montar relatório</h2>
      <label>Cliente<select data-rep="client">${clientOptions(rep.client, false)}</select></label>
      <label>Período<select data-rep="period">${[['1', 'Este mês'], ['3', 'Últimos 3 meses'], ['6', 'Últimos 6 meses']].map(([v, l]) => `<option value="${v}" ${rep.period === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
      ${btn('Imprimir ou salvar PDF', 'print', 'pri', 'print')}${btn('Pedir pelo WhatsApp', 'play', 'wa', 'chat', 'data-scene="relatorio"')}
    </section><div id="results">${reportDoc()}</div></div>`;
}
function reportDoc() {
  const c = state.clients.find(x => x.id === rep.client);
  const from = new Date(TODAY + 'T12:00:00'); from.setMonth(from.getMonth() - (+rep.period - 1)); from.setDate(1);
  const a = from.toISOString().slice(0, 10);
  const ev = timeline(c.id, a, TODAY);
  const meets = state.meetings.filter(m => m.client === c.id && m.date >= a && m.date <= TODAY);
  const tools = [...new Set(meets.map(m => m.tool).filter(Boolean))];
  const label = `${from.toLocaleDateString('pt-BR', { month: 'long' })} a outubro de 2026`;
  return `<article class="paperdoc"><div class="dh"><div><div class="eyebrow">Relatório de atividades</div><h2>${esc(c.name)}</h2><span style="color:var(--muted);font-size:13px">${label}</span></div><span class="brand"><span class="mark">Ω</span><span><b>ômega</b><small>GESTÃO &amp; PESSOAS</small></span></span></div>
    <div class="dsum"><div><b>${meets.filter(m => m.status === 'confirmado').length}</b>encontros</div><div><b>${meets.filter(m => m.status === 'falta').length}</b>faltas</div><div><b>${state.jobs.filter(j => j.client === c.id && j.created >= a).length}</b>vagas</div><div><b>${state.trainings.filter(t => t.client === c.id && t.date >= a && t.status === 'realizado').length}</b>treinamentos</div></div>
    <h4>Ferramentas aplicadas</h4><div class="chips">${tools.map(t => `<span class="chip">${esc(t)}</span>`).join('') || '<span class="chip">Nenhuma no período</span>'}</div>
    <h4>Linha do tempo</h4>${ev.length ? `<div class="tl">${ev.map(e => `<div class="${e.miss ? 'miss' : ''}"><small>${d(e.date)}/${e.date.slice(0, 4)}</small><b>${esc(e.title)}</b><p>${esc(e.text)}</p></div>`).join('')}</div>` : '<p class="empty">Sem registros no período.</p>'}
    <p style="margin-top:32px;font-size:11px;color:var(--soft)">Gerado pelo Sistema Ômega em ${d(TODAY)}/2026 · documento de demonstração</p></article>`;
}

// ── Equipe e regras ─────────────────────────────────────────────────────────
function equipe() {
  const rules = [
    ['Número próprio da Ômega', 'O agente atende num chip só da Ômega. A Raffaella conversa com ele como um contato.'],
    ['Só números autorizados', 'Qualquer outro número recebe silêncio. Cliente que escrever ali não vê dado nenhum.'],
    ['Áudio, texto ou arquivo', 'O áudio é transcrito. PDF e foto viram anexo da vaga ou ferramenta da biblioteca.'],
    ['Pergunta só o que falta', 'Se faltar salário, horário ou cliente, o agente pergunta antes de montar o registro.'],
    ['Só grava depois do "confirmo"', 'Quem mandou confirma o resumo ali mesmo. Sem confirmação, nada entra no sistema.'],
    ['"Desfazer" volta a última ação', 'Errou o cliente ou a vaga? Um "desfazer" restaura como estava.'],
    ['Tudo fica no histórico', 'Cada registro guarda quem fez e por onde entrou: WhatsApp, Forms, painel ou automação.'],
    ['O painel continua livre', 'Quem preferir preenche à mão. WhatsApp e painel gravam no mesmo lugar.'],
  ];
  return head('Equipe e regras', 'Quem fala com o agente, e como ele se comporta.', 'As decisões que deixam o sistema automático sem perder o controle.')
  + `<section class="card" style="margin-bottom:20px"><div class="chead"><div><h2>Quem pode falar com o agente</h2><p>Números verificados. O que cada pessoa pode fazer.</p></div></div><div class="tbl"><table><thead><tr><th>Pessoa</th><th>Papel</th><th>WhatsApp</th><th>Pode</th><th>Situação</th></tr></thead><tbody style="cursor:default">
      ${window.OMEGA_TEAM.map(p => `<tr><td><b>${p.name}</b></td><td>${p.role}</td><td>${p.phone}</td><td style="white-space:normal">${p.can}</td><td><span class="tag confirmado">Verificado</span></td></tr>`).join('')}
    </tbody></table></div></section>
    <section class="card"><div class="chead"><div><h2>Como o agente age</h2><p>Oito regras, iguais para todos os módulos.</p></div></div><div class="rules">${rules.map((r, i) => `<div class="rule"><span class="n">${String(i + 1).padStart(2, '0')}</span><span><b>${r[0]}</b><p>${r[1]}</p></span></div>`).join('')}</div></section>
    <section class="card" style="margin-top:20px;padding:20px;display:flex;justify-content:space-between;gap:16px;align-items:center;flex-wrap:wrap"><div><h2>Próximo passo: portal do cliente</h2><p style="margin:4px 0 0;color:var(--muted);font-size:13px">Cada cliente com login para acompanhar as próprias vagas, encontros e ferramentas. Usa os mesmos registros.</p></div>${btn('Reiniciar demonstração', 'reset', '', 'undo')}</section>`;
}

const PAGES = { inicio, agente, clientes, vagas, consultorias, treinamentos, biblioteca, automacoes, relatorios, equipe };

// ── Camadas: gaveta, modal, aviso ───────────────────────────────────────────
let lastFocus = null;
function openLayer(html) {
  lastFocus = document.activeElement;
  $('#layer').innerHTML = `<div class="scrim" data-act="close"></div>${html}`;
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#layer [data-act=close].x')?.focus(), 30);
}
function drawer(title, body) {
  openLayer(`<aside class="drawer" role="dialog" aria-modal="true"><div class="dhead">${title}<button class="x" data-act="close" aria-label="Fechar">${ic('x')}</button></div><div class="dbody">${body}</div></aside>`);
}
function modal(title, body, cls = '') {
  openLayer(`<section class="modal ${cls}" role="dialog" aria-modal="true">${title ? `<div class="dhead"><h2>${title}</h2><button class="x" data-act="close" aria-label="Fechar">${ic('x')}</button></div>` : ''}<div class="dbody">${body}</div></section>`);
}
function closeLayer() { playToken++; $('#layer').innerHTML = ''; document.body.style.overflow = ''; lastFocus?.focus?.() }
let toastT;
function toast(text, action) {
  clearTimeout(toastT);
  $('#toast').innerHTML = `<div class="toast"><span>${esc(text)}</span>${action ? `<button data-act="toastgo" data-view="${action.view}" data-id="${action.id || ''}">${action.label}</button>` : ''}</div>`;
  toastT = setTimeout(() => $('#toast').innerHTML = '', 8000);
}

// ── WhatsApp encenado ───────────────────────────────────────────────────────
function mountPhone(el, scenes, autoplay) {
  el.innerHTML = `<div class="ph-top"><span class="av">Ω</span><span><b>Agente Ômega</b><small><span class="live"></span>online · número da Ômega</small></span></div>
    <div class="chat" id="chat"><span class="day-sep">Hoje</span><div class="msg bot"><span class="who">Agente Ômega</span>Oi, Rafa. Pode mandar áudio ou texto: vaga, encontro, treinamento, ferramenta ou uma pergunta sobre os números.<span class="meta">08:00</span></div></div>
    <div class="ph-foot"><p>Toque numa conversa para ver</p><div class="scenes">${scenes.map(s => `<button data-act="play" data-scene="${s.id}">${esc(s.title)}</button>`).join('')}</div><div class="inputbar">Mensagem${'<span class="mic">' + ic('mic') + '</span>'}</div></div>`;
  if (autoplay) play(autoplay);
}
function openChat(module, sceneId) {
  const scenes = module ? SCENES.filter(s => s.module === module) : SCENES;
  openLayer(`<aside class="drawer chatd" role="dialog" aria-modal="true" aria-label="Conversa com o agente"><div class="phone" id="drawerPhone"></div><button class="x" data-act="close" aria-label="Fechar" style="position:absolute;top:20px;right:20px;background:#ffffff14;border-color:#ffffff22;color:#fff">${ic('x')}</button></aside>`);
  mountPhone($('#drawerPhone'), scenes.length ? scenes : SCENES, sceneId);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
const clock = (() => { let m = 16 * 60 + 40; return () => { m++; return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}` } })();
const wave = () => Array.from({ length: 28 }, () => `<i style="height:${30 + Math.round(Math.random() * 70)}%"></i>`).join('');

function bubble(m, scene) {
  const who = m.from === 'me' ? (scene.who || 'Raffaella') : (m.auto ? 'Agenda automática' : 'Agente Ômega');
  let inner = '';
  if (m.type === 'audio') inner = `<div class="audio"><span class="play">${ic('play')}</span><span class="wave">${wave()}</span><small>${m.dur}</small></div><div class="trans"><b>Transcrição</b>${esc(m.text)}</div>`;
  else if (m.type === 'file') inner = `<div class="file"><span class="pdf">PDF</span><span><b>${esc(m.name)}</b><small>${m.size}</small></span></div>${esc(m.text || '')}`;
  else if (m.type === 'card') inner = `<div class="mcard"><div class="mh">${esc(m.title)}</div>${m.rows.map(r => `<div class="mr"><span>${esc(r[0])}</span><b>${esc(r[1])}</b></div>`).join('')}</div>${esc(m.ask)}`;
  else if (m.type === 'summary') { const s = monthStats(); inner = `Outubro até agora:<br>• ${s.jobs.length} vagas abertas no mês, ${s.closed.length} fechadas (${money(s.value)})<br>• ${s.open} vagas em andamento<br>• ${s.done.length} encontros e ${s.miss.length} falta<br>• ${s.trains.length} treinamentos (${s.trainsDone.length} realizado)<br><br>Quer o detalhe de algum cliente?` }
  else if (m.type === 'history') { const ms = state.meetings.filter(x => x.client === m.client && x.date.startsWith(month) && ['confirmado', 'falta'].includes(x.status)).sort((a, b) => a.date.localeCompare(b.date)); inner = `Na ${esc(cname(m.client))} em outubro:<br>${ms.map(x => `• ${d(x.date)}: ${x.status === 'falta' ? 'falta' : esc(x.topic) + ' (' + esc(x.tool) + ')'}`).join('<br>') || 'Nenhum encontro confirmado ainda.'}<br>Próximo passo: ${esc(ms.at(-1)?.next || 'a definir')}` }
  else inner = esc(m.text);
  const link = m.link ? `<br><button class="lk" data-act="scenego" data-scene="${scene.id}">${esc(m.link)} →</button>` : '';
  return `<div class="msg ${m.from === 'me' ? 'me' : 'bot'} ${m.auto ? 'auto' : ''}">${m.from === 'bot' || scene.who ? `<span class="who">${who}</span>` : ''}${inner}${link}<span class="meta">${clock()}${m.from === 'me' ? ' ✓✓' : ''}</span></div>`;
}

async function play(id) {
  const scene = SCENES.find(s => s.id === id);
  const chat = document.getElementById('chat');
  if (!scene || !chat) return;
  const token = ++playToken;
  document.querySelectorAll('.scenes button, .scene').forEach(b => { b.disabled = b.classList.contains('scene') ? false : true; b.classList.toggle('on', b.dataset.scene === id) });
  chat.insertAdjacentHTML('beforeend', `<span class="day-sep">${esc(scene.title)}</span>`);
  chat.scrollTop = chat.scrollHeight;
  for (const m of scene.msgs) {
    if (token !== playToken) return;
    if (m.from === 'bot') {
      chat.insertAdjacentHTML('beforeend', '<div class="typing" aria-hidden="true"><i></i><i></i><i></i></div>');
      chat.scrollTop = chat.scrollHeight;
      await sleep(m.type === 'summary' || m.type === 'history' ? 1300 : 900);
      if (token !== playToken) return;
      chat.querySelector('.typing')?.remove();
    } else await sleep(m.type === 'audio' ? 900 : 650);
    chat.insertAdjacentHTML('beforeend', bubble(m, scene));
    chat.scrollTop = chat.scrollHeight;
    await sleep(m.type === 'card' ? 1300 : 600);
  }
  if (token !== playToken) return;
  document.querySelectorAll('.scenes button').forEach(b => b.disabled = false);
  const target = applyScene(scene);
  if (target) { renderNav(); refreshBehind(); toast(target.msg, { view: target.view, id: target.id, label: 'Ver no painel' }) }
}
function refreshBehind() { if (view !== 'agente') render() }

// O que cada conversa grava. Roda uma vez por conversa, como um registro real.
const TARGET = {
  'nova-vaga': ['vagas', 'jn1'], 'repetir-vaga': ['vagas', 'jn2'], curriculo: ['vagas', 'v3'], 'fechar-vaga': ['vagas', 'v1'],
  'pos-encontro': ['consultorias', 'e1'], falta: ['consultorias', 'e9'], treinamento: ['treinamentos', 'tn1'],
  'guardar-ferramenta': ['biblioteca', 'fn1'], 'pedir-ferramenta': ['biblioteca', 'f1'], 'novo-cliente': ['clientes', 'vitta'],
  consulta: ['inicio'], relatorio: ['relatorios'],
};
function applyScene(scene) {
  const [v, id] = TARGET[scene.id];
  if (state.applied[scene.id] || !scene.apply) return scene.apply ? { view: v, id, msg: 'Esta conversa já foi registrada antes.' } : null;
  const who = scene.who || 'Raffaella';
  const act = (text, link) => state.activity.unshift({ at: nowStamp(), who, origin: 'whatsapp', text, link });
  const A = {
    newJob() { state.jobs.unshift({ id: 'jn1', title: 'Auxiliar administrativo', client: 'amorim', qty: 2, salary: 1800, fee: 1500, status: 'aberta', created: TODAY, origin: 'whatsapp', schedule: 'Comercial, 8h às 18h', education: 'Ensino médio completo', reqs: ['Excel', 'Experiência com rotina de escritório'], sent: 0, interviewed: 0, cvs: [] }); act('Abriu por áudio a vaga Auxiliar administrativo · Amorim', 'vagas'); return 'Vaga criada pelo WhatsApp.' },
    repeatJob() { const o = state.jobs.find(j => j.id === 'v6'); state.jobs.unshift({ ...structuredClone(o), id: 'jn2', salary: 2000, status: 'aberta', created: TODAY, closed: null, hired: null, sent: 0, interviewed: 0, cvs: [], origin: 'whatsapp' }); act('Repetiu a vaga Recepcionista · Flavine com salário novo', 'vagas'); return 'Vaga repetida pelo WhatsApp.' },
    addCv() { const j = state.jobs.find(x => x.id === 'v3'); j.cvs.push('Renata Campos'); j.sent += 1; j.interviewed += 1; act('Anexou o currículo de Renata Campos · Vendedor interno', 'vagas'); return 'Currículo anexado à vaga.' },
    closeJob() { Object.assign(state.jobs.find(x => x.id === 'v1'), { status: 'fechada', closed: TODAY, hired: 'Carla Mendes' }); act('Fechou a vaga Analista de RH · Amorim', 'vagas'); return 'Vaga fechada. O valor entrou em outubro.' },
    confirmMeeting() { Object.assign(state.meetings.find(x => x.id === 'e1'), { status: 'confirmado', topic: 'Feedback com os líderes', summary: 'Comparação da roda de competências com o mês anterior.', tool: 'Roda de competências', next: 'Cada líder traz o plano de ação individual.', origin: 'whatsapp', transcript: scene.msgs[1].text }); state.tools.find(t => t.id === 'f1').uses++; act('Registrou por áudio o encontro na Amorim · Feedback com os líderes', 'consultorias'); return 'Encontro registrado no histórico.' },
    missMeeting() { Object.assign(state.meetings.find(x => x.id === 'e9'), { status: 'falta', topic: 'Encontro de consultoria', summary: 'Cliente desmarcou. Lari vai remarcar.', next: 'Remarcar com a Ana Rocha.', origin: 'whatsapp' }); act('Registrou falta da DEDARC em 02/11', 'consultorias'); return 'Falta registrada.' },
    newTraining() { state.trainings.unshift({ id: 'tn1', client: 'flavine', date: '2026-11-06', time: '08:00', topic: 'Comunicação não violenta', place: 'Loja do centro', people: 22, attended: null, status: 'agendado', material: 'Roteiro de feedback', origin: 'whatsapp' }); act('Agendou por áudio o treinamento de CNV · Flavine', 'treinamentos'); return 'Treinamento agendado.' },
    newTool() { state.tools.unshift({ id: 'fn1', name: 'Teste DISC 2026', cat: 'Testes', pages: 8, added: TODAY, origin: 'whatsapp', uses: 0, desc: 'Teste DISC enviado pelo WhatsApp.' }); act('Guardou "Teste DISC 2026" em Testes', 'biblioteca'); return 'Ferramenta guardada na biblioteca.' },
    useTool() { state.tools.find(t => t.id === 'f1').uses++; act('Pediu a Roda de competências e recebeu o PDF', 'biblioteca'); return 'Arquivo enviado no WhatsApp.' },
    newClient() { state.clients.push({ id: 'vitta', name: 'Clínica Vitta', segment: 'Saúde', contact: 'Dr. Henrique Sales', role: 'Diretor', phone: '(87) 99901-2233', services: ['Recrutamento', 'Consultoria'], since: TODAY, origin: 'whatsapp', meetingDay: 'Quartas, 10h' }); act('Cadastrou o cliente Clínica Vitta', 'clientes'); return 'Cliente cadastrado.' },
  };
  const msg = A[scene.apply]();
  state.applied[scene.id] = true;
  save();
  return { view: v, id, msg };
}

// ── Formulários manuais ─────────────────────────────────────────────────────
const FORMS = {
  vaga: { title: 'Nova vaga', fields: [['client', 'Cliente', 'client'], ['title', 'Vaga', 'text', 'Ex.: Analista de RH'], ['qty', 'Posições', 'number', '1'], ['salary', 'Salário (R$)', 'number'], ['fee', 'Valor por vaga (R$)', 'number'], ['reqs', 'Requisitos', 'textarea', 'Separe por vírgula']],
    save(v) { const id = uid('j'); state.jobs.unshift({ id, title: v.title, client: v.client, qty: +v.qty || 1, salary: +v.salary || 0, fee: +v.fee || 0, status: 'aberta', created: TODAY, origin: 'painel', schedule: '—', education: '—', reqs: v.reqs.split(',').map(s => s.trim()).filter(Boolean), sent: 0, interviewed: 0, cvs: [] }); return ['vagas', id, 'Vaga criada no painel.'] } },
  cliente: { title: 'Novo cliente', fields: [['name', 'Empresa', 'text'], ['contact', 'Contato', 'text'], ['phone', 'WhatsApp', 'text'], ['segment', 'Segmento', 'text'], ['meetingDay', 'Encontros fixos', 'text', 'Ex.: Terças, 14h']],
    save(v) { const id = uid('c'); state.clients.push({ id, name: v.name, contact: v.contact, role: '', phone: v.phone, segment: v.segment || '—', services: ['Recrutamento'], since: TODAY, origin: 'painel', meetingDay: v.meetingDay }); return ['clientes', id, 'Cliente cadastrado no painel.'] } },
  encontro: { title: 'Registrar encontro', fields: [['client', 'Cliente', 'client'], ['date', 'Data', 'date'], ['topic', 'Pauta', 'text'], ['summary', 'O que foi feito', 'textarea'], ['tool', 'Ferramenta aplicada', 'text'], ['next', 'Próximo passo', 'text']],
    save(v, id) { const base = { client: v.client, date: v.date, topic: v.topic, summary: v.summary, tool: v.tool, next: v.next, status: 'confirmado' }; if (id) { Object.assign(state.meetings.find(m => m.id === id), base); return ['consultorias', id, 'Encontro atualizado.'] } const nid = uid('m'); state.meetings.unshift({ id: nid, time: '14:00', end: '15:30', origin: 'painel', ...base }); return ['consultorias', nid, 'Encontro registrado no painel.'] } },
  treinamento: { title: 'Novo treinamento', fields: [['client', 'Cliente', 'client'], ['topic', 'Tema', 'text'], ['date', 'Data', 'date'], ['place', 'Local', 'text'], ['people', 'Participantes', 'number'], ['material', 'Material', 'text']],
    save(v) { const id = uid('t'); state.trainings.unshift({ id, client: v.client, topic: v.topic, date: v.date, time: '09:00', place: v.place, people: +v.people || 0, attended: null, status: 'agendado', material: v.material || '—', origin: 'painel' }); return ['treinamentos', id, 'Treinamento agendado no painel.'] } },
  ferramenta: { title: 'Adicionar ferramenta', fields: [['name', 'Nome', 'text'], ['cat', 'Categoria', 'cat'], ['desc', 'Para que serve', 'textarea']],
    save(v) { const id = uid('f'); state.tools.unshift({ id, name: v.name, cat: v.cat, pages: 1, added: TODAY, origin: 'painel', uses: 0, desc: v.desc }); return ['biblioteca', id, 'Ferramenta adicionada.'] } },
};
function openForm(kind, id) {
  const f = FORMS[kind];
  const cur = id ? state.meetings.find(m => m.id === id) : {};
  const input = ([k, label, type, ph]) => {
    const val = esc(cur?.[k] ?? (type === 'date' ? TODAY : ''));
    const el = type === 'client' ? `<select name="${k}">${clientOptions(cur?.client || state.clients[0].id, false)}</select>`
      : type === 'cat' ? `<select name="${k}">${CATS.map(c => `<option>${c}</option>`).join('')}</select>`
      : type === 'textarea' ? `<textarea name="${k}" placeholder="${ph || ''}" ${k === 'summary' || k === 'reqs' ? '' : ''}>${val}</textarea>`
      : `<input name="${k}" type="${type}" value="${val}" placeholder="${ph || ''}" ${['title', 'name', 'topic'].includes(k) ? 'required' : ''}>`;
    return `<label class="field">${label}${el}</label>`;
  };
  modal(id ? 'Editar encontro' : f.title, `<form id="mform" style="display:grid;gap:12px" data-kind="${kind}" data-id="${id || ''}"><p class="explain" style="margin:0">Preenchimento manual: o registro entra com a origem "Painel". O mesmo pode ser feito por áudio no WhatsApp.</p>${f.fields.map(input).join('')}<div class="mactions"><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${ic('check')}Salvar</button></div></form>`);
}
document.addEventListener('submit', e => {
  if (e.target.id !== 'mform') return;
  e.preventDefault();
  const v = Object.fromEntries(new FormData(e.target));
  const [view_, id, msg] = FORMS[e.target.dataset.kind].save(v, e.target.dataset.id || null);
  state.activity.unshift({ at: nowStamp(), who: 'Raffaella', origin: 'painel', text: msg.replace('.', '') + ': ' + (v.title || v.name || v.topic || ''), link: view_ });
  save(); closeLayer(); go(view_, id); toast(msg);
});

// ── Ações ───────────────────────────────────────────────────────────────────
const ACT = {
  close: closeLayer,
  chat: el => openChat(el.dataset.module),
  play: el => { const id = el.dataset.scene; if (document.getElementById('chat')) play(id); else openChat(SCENES.find(s => s.id === id).module, id) },
  scenego: el => { const [v, id] = TARGET[el.dataset.scene]; closeLayer(); go(v, id) },
  toastgo: el => { $('#toast').innerHTML = ''; closeLayer(); go(el.dataset.view, el.dataset.id) },
  job: el => jobDrawer(el.dataset.id),
  client: el => clientDrawer(el.dataset.id),
  meeting: el => meetingDrawer(el.dataset.id),
  training: el => trainingDrawer(el.dataset.id),
  tool: el => toolDrawer(el.dataset.id),
  form: el => openForm(el.dataset.form, el.dataset.id),
  new: () => modal('O que vamos registrar?', `<p class="explain" style="margin:0">Dica: tudo isto também pode ser feito mandando um áudio para o agente.</p><div style="display:grid;gap:8px">${[['vaga', 'Nova vaga', 'briefcase'], ['encontro', 'Encontro de consultoria', 'calendar'], ['treinamento', 'Treinamento', 'grad'], ['cliente', 'Cliente', 'building'], ['ferramenta', 'Ferramenta na biblioteca', 'book']].map(([k, l, i]) => `<button class="scene" data-act="form" data-form="${k}"><span class="si">${ic(i)}</span><span><b>${l}</b></span><span class="go">${ic('arrow')}</span></button>`).join('')}</div>`),
  jobstep: el => { const j = state.jobs.find(x => x.id === el.dataset.id); if (j.status === 'aberta') j.status = 'selecao'; else Object.assign(j, { status: 'fechada', closed: TODAY, hired: j.cvs[0] || 'A informar' }); state.activity.unshift({ at: nowStamp(), who: 'Raffaella', origin: 'painel', text: `Moveu ${j.title} para ${JOB[j.status]}`, link: 'vagas' }); save(); closeLayer(); go('vagas', j.id); toast(`Vaga movida para ${JOB[j.status]}.`) },
  jobconfirm: el => { const j = state.jobs.find(x => x.id === el.dataset.id); delete j.pending; save(); closeLayer(); go('vagas', j.id); toast('Briefing confirmado. A vaga pode seguir.') },
  jobrepeat: el => { const o = state.jobs.find(x => x.id === el.dataset.id); const id = uid('j'); state.jobs.unshift({ ...structuredClone(o), id, status: 'aberta', created: TODAY, closed: null, hired: null, sent: 0, interviewed: 0, cvs: [], origin: 'painel', pending: 'Confirmar condições com o cliente' }); save(); closeLayer(); go('vagas', id); toast('Cópia criada com o mesmo briefing.') },
  meetmiss: el => { const m = state.meetings.find(x => x.id === el.dataset.id); Object.assign(m, { status: 'falta', topic: 'Encontro de consultoria', summary: 'Falta registrada no painel.', next: 'Remarcar.', origin: 'painel' }); save(); closeLayer(); go('consultorias', m.id); toast('Falta registrada.') },
  traindone: el => { const t = state.trainings.find(x => x.id === el.dataset.id); Object.assign(t, { status: 'realizado', attended: t.people }); save(); closeLayer(); go('treinamentos', t.id); toast('Treinamento marcado como realizado.') },
  meetseg: el => { filters.meet = el.dataset.k; render() },
  cat: el => { filters.cat = el.dataset.k; render() },
  flow: el => { state.flowsOff[el.dataset.id] = !state.flowsOff[el.dataset.id]; save(); render() },
  report: el => { rep.client = el.dataset.id; closeLayer(); go('relatorios') },
  print: () => window.print(),
  demo: el => toast(el.dataset.msg),
  reset: () => modal('Reiniciar a demonstração?', `<p style="margin:0">Volta todos os dados de exemplo ao início, só neste navegador.</p><div class="mactions"><button class="btn" data-act="close">Cancelar</button>${btn('Reiniciar', 'doreset', 'pri', 'undo')}</div>`),
  doreset: () => { state = fresh(); save(); closeLayer(); go('inicio'); toast('Demonstração reiniciada.') },
  menu: () => $('#side').classList.toggle('open'),
  welcomeplay: () => { closeLayer(); try { localStorage.setItem('omega-intro', '1') } catch {} ; if (view !== 'agente') { location.hash = 'agente' } setTimeout(() => play('nova-vaga'), 250) },
  welcomeclose: () => { try { localStorage.setItem('omega-intro', '1') } catch {} closeLayer() },
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el) return;
  if (el.tagName === 'A') return;
  const fn = ACT[el.dataset.act];
  if (fn) { e.preventDefault(); fn(el) }
});
document.addEventListener('input', e => {
  const k = e.target.dataset.filter;
  if (k) { filters[k] = e.target.value; const r = document.getElementById('results'); if (r) r.innerHTML = ({ clientes: clientCards, vagas: jobBoard, consultorias: meetTable, biblioteca: toolCards })[view]() }
  const r2 = e.target.dataset.rep;
  if (r2) { rep[r2] = e.target.value; $('#results').innerHTML = reportDoc() }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('#layer').innerHTML) closeLayer() });

// Explicações liga/desliga
function setExplain(on) { document.body.classList.toggle('noexplain', !on); $('#explainBtn').setAttribute('aria-checked', on); try { localStorage.setItem('omega-explain', on ? '1' : '0') } catch {} }
$('#explainBtn').addEventListener('click', () => setExplain(document.body.classList.contains('noexplain')));
$('#menuBtn').innerHTML = ic('menu');
$('#menuBtn').dataset.act = 'menu';

// Boas-vindas na primeira visita
function welcome() {
  modal('', `<div class="introhero"><span class="om" aria-hidden="true">Ω</span><div class="eyebrow">Sistema Ômega</div><h2>Fale com o sistema como fala com a sua assistente.</h2><p>Recrutamento, consultorias, treinamentos e ferramentas num lugar só. O WhatsApp é a porta de entrada, o painel mostra tudo e a agenda cuida do resto.</p></div>
    <div class="pillars"><div><span class="n">01</span><b>O WhatsApp alimenta</b><p>Áudio ou texto viram vagas, encontros e treinamentos, depois do seu "confirmo".</p></div><div><span class="n">02</span><b>O painel organiza</b><p>Tudo aparece aqui na hora, com a origem marcada. Dá para preencher à mão também.</p></div><div><span class="n">03</span><b>A agenda lembra</b><p>Perguntas depois do encontro, lembretes na véspera e o resumo do mês chegam sozinhos.</p></div></div>
    <div class="mactions" style="padding:16px 20px 20px"><button class="btn" data-act="welcomeclose">Explorar o painel</button>${btn('Ver o agente em ação', 'welcomeplay', 'pri', 'play')}</div>`, 'intro');
  $('#layer .modal .dbody').style.padding = '0';
}

// Início
let explainOn = true; try { explainOn = localStorage.getItem('omega-explain') !== '0' } catch {}
setExplain(explainOn);
const startView = location.hash.slice(1);
view = PAGES[startView] ? startView : 'inicio';
render();
let seen = false; try { seen = localStorage.getItem('omega-intro') } catch {}
if (!seen) welcome();
})();

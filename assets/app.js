// Sistema Ômega · protótipo navegável. Sem banco: os dados vivem no navegador,
// as conversas com o agente são encenadas e as páginas públicas (briefing e
// agendamento) entregam as respostas por uma caixa de entrada local.
(() => {
'use strict';

const TODAY = window.OMEGA_TODAY;
const SCENES = window.OMEGA_SCENES;
const FLOWS = window.OMEGA_FLOWS;
const BRIEF = window.OMEGA_BRIEFING;
const KEY = 'omega-sistema-v4';
const INBOX = 'omega-inbox';

let state = load();
let view = 'inicio';
const tabs = { crm: 'funil', recrutamento: 'vagas', agenda: 'calendario', propostas: 'propostas', relatorios: 'indicadores', configuracoes: 'usuarios' };
let F = { q: '', client: '', job: '', status: '', origin: '', ev: 'todos', cat: '', pend: false, price: '' };
let cal = { y: 2026, m: 9, mode: 'mes', w: 0 };
let flashId = null;
let playToken = 0;

function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.jobs) return s } catch {}
  return fresh();
}
function fresh() { const s = structuredClone(window.OMEGA_SEED); s.applied = {}; s.flowsOff = {}; s.demo = {}; return s }
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {} }

// ── Utilidades ──────────────────────────────────────────────────────────────
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const d = s => s ? s.slice(8, 10) + '/' + s.slice(5, 7) : '';
const dY = s => s ? d(s) + '/' + s.slice(0, 4) : '';
const dLong = s => new Date(s + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
const hr = t => (t || '').replace(/^0/, '').replace(':00', 'h').replace(':', 'h');
const client = id => state.clients.find(c => c.id === id);
const cname = id => client(id)?.name ?? id;
const jobOf = id => state.jobs.find(j => j.id === id);
const month = TODAY.slice(0, 7);
const uid = p => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const nowStamp = () => TODAY + ' ' + new Date().toTimeString().slice(0, 5);
const daysBetween = (a, b) => Math.round((new Date(b + 'T12:00:00') - new Date(a + 'T12:00:00')) / 864e5);
const addDays = (s, n) => { const x = new Date(s + 'T12:00:00'); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10) };
const log = (text, link, origin = 'painel', who = 'Raffaella') => state.activity.unshift({ at: nowStamp(), who, origin, text, link });
const done = k => { if (!state.demo[k]) { state.demo[k] = true; save(); renderGuide() } };

const P = {
  home: '<path d="M3 11 12 4l9 7v9H14v-6h-4v6H3z"/>',
  chat: '<path d="M4 19.5 5.3 16A8 8 0 1 1 8 18.7z"/><path d="M9 10.5h6M9 13.5h4"/>',
  building: '<path d="M4 21V5h11v16M15 10h5v11M2 21h20M8 9h3M8 13h3M8 17h3"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  book: '<path d="M12 6q-5-3-9 0v14q4-3 9 0 5-3 9 0V6q-4-3-9 0zM12 6v14"/>',
  bolt: '<path d="m13 2-9 12h7l-1 8 9-12h-7z"/>',
  report: '<path d="M14 3H6v18h12V7zM14 3v4h4M9 12h6M9 16h4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  left: '<path d="m15 6-6 6 6 6"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  form: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/>',
  print: '<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/>',
  hand: '<path d="M7 11V6a1.5 1.5 0 0 1 3 0v4M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V12M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-3l-3-5a1.5 1.5 0 0 1 2.5-1.6L7 13"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
  file: '<path d="M14 3H6v18h12V7zM14 3v4h4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  doc: '<path d="M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6M9 9h2"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  pause: '<path d="M9 5v14M15 5v14"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>',
};
const ic = (n, cls = 'ico') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || P.file}</svg>`;

const ORIG = {
  whatsapp: ['WhatsApp', 'chat'], briefing: ['Formulário', 'form'], link: ['Link de agendamento', 'link'], painel: ['Feito à mão', 'hand'],
  auto: ['Automático', 'bolt'], email: ['E-mail', 'mail'], indicacao: ['Indicação', 'user'], site: ['Anúncio', 'search'],
};
const origOf = o => ORIG[o] || ORIG.painel;
const orig = o => `<span class="orig ${o in ORIG ? o : 'painel'}">${ic(origOf(o)[1])}${origOf(o)[0]}</span>`;
const JOBST = [['abertas', 'Abertas'], ['recrutamento', 'Recrutamento'], ['selecao', 'Seleção'], ['pendente', 'Pendente'], ['fechadas', 'Fechadas']];
const JOBL = Object.fromEntries(JOBST);
const JOBHELP = { abertas: 'Vagas novas, ainda sem divulgar', recrutamento: 'Divulgando e recebendo currículos', selecao: 'Entrevistando e escolhendo', pendente: 'Esperando resposta do cliente', fechadas: 'Vaga preenchida, processo encerrado' };
const CRMST = [['lead', 'Primeiro contato'], ['qualificacao', 'Entendendo o pedido'], ['proposta', 'Proposta enviada'], ['negociacao', 'Negociando'], ['cliente', 'Cliente fechado']];
const CRML = { ...Object.fromEntries(CRMST), perdido: 'Não fechou', inativo: 'Sem contato há tempo' };
const CANDST = [['recebido', 'Currículo recebido'], ['triagem', 'Analisando currículo'], ['entrevista', 'Entrevista'], ['avaliacao', 'Testes'], ['apresentado', 'Enviado ao cliente'], ['aprovado', 'Contratado'], ['reprovado', 'Não selecionado']];
const CANDL = Object.fromEntries(CANDST);
const EVL = { agendado: 'Agendado', confirmado: 'Confirmado', aguardando: 'Falta contar como foi', realizado: 'Aconteceu', falta: 'Cliente faltou', cancelado: 'Cancelado' };
const EVTYPE = { consultoria: 'Consultoria', treinamento: 'Treinamento', reuniao: 'Reunião com cliente novo' };
const PROPST = [['rascunho', 'Ainda não enviada'], ['enviada', 'Enviada'], ['negociacao', 'Negociando'], ['aprovada', 'Aceita'], ['recusada', 'Não aceita']];
const PROPL = Object.fromEntries(PROPST);
const TONE = {
  abertas: 'blue', recrutamento: 'blue', selecao: 'warn', pendente: 'warn', fechadas: 'ok',
  lead: 'blue', qualificacao: 'blue', proposta: 'warn', negociacao: 'warn', cliente: 'ok', perdido: 'bad', inativo: 'mute',
  recebido: 'blue', triagem: 'blue', entrevista: 'warn', avaliacao: 'warn', apresentado: 'warn', aprovado: 'ok', reprovado: 'mute',
  agendado: 'blue', confirmado: 'blue', aguardando: 'warn', realizado: 'ok', falta: 'bad', cancelado: 'mute',
  rascunho: 'mute', enviada: 'blue', aprovada: 'ok', recusada: 'bad', gerado: 'warn', assinado: 'ok',
};
const tag = (k, label) => `<span class="tag t-${TONE[k] || 'blue'}">${esc(label)}</span>`;
const btn = (label, act, cls = '', icon = '', data = '') => `<button class="btn ${cls}" data-act="${act}" ${data}>${icon ? ic(icon) : ''}${label}</button>`;
const isFlash = id => flashId && flashId === id ? ' flash' : '';
const stars = n => `<span class="stars" aria-label="${n} de 5">${[1, 2, 3, 4, 5].map(i => `<i class="${i <= n ? 'on' : ''}">★</i>`).join('')}</span>`;
const clientOptions = (sel, all = true, filter = () => true) => (all ? '<option value="">Todos os clientes</option>' : '') + state.clients.filter(filter).map(c => `<option value="${c.id}" ${sel === c.id ? 'selected' : ''}>${esc(c.name)}</option>`).join('');
const base = () => location.href.replace(/[#?].*$/, '').replace(/index\.html$/, '');

// ── Navegação ───────────────────────────────────────────────────────────────
const NAV = [
  ['inicio', 'Visão geral', 'home'],
  ['agente', 'Assistente do WhatsApp', 'chat'],
  null, 'Trabalho',
  ['crm', 'Clientes e contatos', 'building'],
  ['recrutamento', 'Recrutamento e seleção', 'briefcase'],
  ['agenda', 'Agenda e consultorias', 'calendar'],
  ['propostas', 'Propostas e contratos', 'doc'],
  null, 'Acompanhamento',
  ['relatorios', 'Relatórios', 'report'],
  ['automacoes', 'Tarefas automáticas', 'bolt'],
  ['biblioteca', 'Biblioteca', 'book'],
  ['configuracoes', 'Configurações', 'gear'],
];
const TITLES = Object.fromEntries(NAV.filter(Array.isArray).map(n => [n[0], n[1]]));

function renderNav() {
  const counts = {
    recrutamento: state.jobs.filter(j => j.isNew).length + state.candidates.filter(c => c.status === 'recebido').length,
    agenda: state.events.filter(e => e.status === 'aguardando').length,
    propostas: state.proposals.filter(p => p.status === 'enviada' && daysBetween(p.date, TODAY) >= 3).length,
    crm: state.clients.filter(c => c.stage === 'lead').length,
  };
  let html = '<div class="navlabel">Dia a dia</div>';
  for (let i = 0; i < NAV.length; i++) {
    const n = NAV[i];
    if (n === null) { html += `<div class="navlabel">${NAV[++i]}</div>`; continue }
    const [k, label, icon] = n;
    html += `<a class="nav ${k === 'agente' ? 'agent' : ''} ${view === k ? 'on' : ''}" href="#${k}" ${view === k ? 'aria-current="page"' : ''}>${ic(icon)}<span>${label}</span>${counts[k] ? `<span class="count">${counts[k]}</span>` : ''}</a>`;
  }
  $('#nav').innerHTML = html;
}

function go(v, id, tab) {
  flashId = id || null;
  if (tab) tabs[v] = tab;
  if (location.hash.slice(1).split('/')[0] !== v) location.hash = v; else render();
}
function readHash() {
  const [v, t] = location.hash.slice(1).split('/');
  if (!PAGES[v]) return false;
  if (t && tabs[v]) tabs[v] = t;
  view = v;
  return true;
}
window.addEventListener('hashchange', () => { if (readHash()) { if ($('#layer').innerHTML) closeLayer(); render(); scrollTo(0, 0) } });

function render() {
  renderNav();
  $('#crumb').textContent = TITLES[view];
  $('#page').innerHTML = PAGES[view]() + FOOT;
  $('#side').classList.remove('open');
  if (view === 'agente') mountPhone($('#agentPhone'), SCENES);
  if (view === 'relatorios') done('relatorio');
  if (flashId) setTimeout(() => { document.querySelector('.flash')?.scrollIntoView({ block: 'center', behavior: 'smooth' }); flashId = null }, 60);
}
const FOOT = `<footer class="foot"><span>Ômega · Gestão que conecta pessoas e resultados</span><span>Versão de teste · dados de exemplo, salvos só neste aparelho</span></footer>`;

// ── Peças comuns ────────────────────────────────────────────────────────────
function head(eyebrow, title, desc, actions = '') {
  return `<div class="phead"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${desc}</p></div><div class="acts">${actions}</div></div>`;
}
function how(a, m, w) {
  return `<div class="how" aria-label="Como esta área funciona">
    <div class="au"><span class="hi">${ic('bolt')}</span><b>O sistema faz sozinho</b><p>${a}</p></div>
    <div class="pn"><span class="hi">${ic('hand')}</span><b>Você faz à mão</b><p>${m}</p></div>
    <div class="wa"><span class="hi">${ic('chat')}</span><b>Pelo WhatsApp</b><p>${w}</p></div>
  </div>`;
}
function tabbar(page, list) {
  return `<div class="tabs" role="tablist">${list.map(([k, l, n]) => `<button role="tab" aria-selected="${tabs[page] === k}" class="${tabs[page] === k ? 'on' : ''}" data-act="tab" data-page="${page}" data-k="${k}">${l}${n ? `<span class="tn">${n}</span>` : ''}</button>`).join('')}</div>`;
}
const waBtn = (module, label = 'Pelo WhatsApp') => btn(label, 'chat', 'wa', 'chat', `data-module="${module}"`);
const search = (ph, k = 'q') => `<div class="search">${ic('search')}<input data-filter="${k}" placeholder="${ph}" value="${esc(F[k])}" aria-label="${ph}"></div>`;
const timelineHtml = ev => ev.length ? `<div class="tl">${ev.map(e => `<div class="${e.k === 'miss' ? 'miss' : ''}"><small>${dY(e.date)}${e.who ? ' · ' + esc(e.who) : ''}</small><b>${esc(e.title)}</b>${e.text ? `<p>${esc(e.text)}</p>` : ''}</div>`).join('')}</div>` : '<p class="empty">Ainda sem histórico.</p>';
function stepper(list, cur, act, id) {
  const i = list.findIndex(x => x[0] === cur);
  return `<div class="stepper">${list.map(([k, l], n) => `<button class="${n < i ? 'past' : n === i ? 'cur' : ''}" data-act="${act}" data-id="${id}" data-stage="${k}">${l}</button>`).join('')}</div>`;
}

// ── Visão geral ─────────────────────────────────────────────────────────────
function stats() {
  const active = state.jobs.filter(j => j.stage !== 'fechadas');
  const closedM = state.jobs.filter(j => j.stage === 'fechadas' && (j.closed || '').startsWith(month));
  const candM = state.candidates.filter(c => c.date.startsWith(month));
  const evM = state.events.filter(e => e.date.startsWith(month) && e.date <= TODAY);
  const open = state.proposals.filter(p => ['rascunho', 'enviada', 'negociacao'].includes(p.status));
  return {
    active, pend: active.filter(j => j.stage === 'pendente' || j.flag), closedM, value: closedM.reduce((s, j) => s + j.fee * j.qty, 0), candM,
    done: evM.filter(e => e.status === 'realizado'), miss: evM.filter(e => e.status === 'falta'), canc: evM.filter(e => e.status === 'cancelado'),
    open, openValue: open.reduce((s, p) => s + p.value * p.qty, 0),
  };
}

function inicio() {
  const s = stats();
  const pend = [];
  state.events.filter(e => e.status === 'aguardando').forEach(e => pend.push(['mic', 'gold', `Contar como foi o encontro · ${cname(e.client)}`, `A pergunta foi enviada às ${e.askedAt}. Responda por áudio no WhatsApp.`, btn('Ver conversa', 'play', 'sm wa', '', 'data-scene="pos-encontro"')]));
  state.jobs.filter(j => j.isNew).forEach(j => pend.push(['form', '', `Briefing novo · ${cname(j.client)}`, `${j.title} chegou pelo formulário. Confira e inicie o recrutamento.`, btn('Abrir vaga', 'job', 'sm', '', `data-id="${j.id}"`)]));
  state.jobs.filter(j => j.flag && j.stage !== 'fechadas').forEach(j => pend.push(['pause', '', `Vaga esperando resposta · ${cname(j.client)}`, `${j.title}: ${j.flag}.`, btn('Abrir', 'job', 'sm', '', `data-id="${j.id}"`)]));
  const newC = state.candidates.filter(c => c.status === 'recebido');
  if (newC.length) pend.push(['user', '', `${newC.length} currículos esperando análise`, newC.map(c => c.name).slice(0, 3).join(', ') + (newC.length > 3 ? '…' : ''), btn('Ver currículos', 'goto', 'sm', '', 'data-view="recrutamento" data-tab="candidatos"')]);
  state.proposals.filter(p => p.status === 'enviada' && daysBetween(p.date, TODAY) >= 3).forEach(p => pend.push(['doc', '', `Proposta sem resposta · ${cname(p.client)}`, `Enviada há ${daysBetween(p.date, TODAY)} dias (${money(p.value)} ${p.unit}).`, btn('Ver', 'proposal', 'sm', '', `data-id="${p.id}"`)]));
  state.clients.filter(c => c.stage === 'inativo').forEach(c => pend.push(['building', '', `Cliente sem contato há tempo · ${c.name}`, `Sem atividade desde ${dY(c.lastContact)}. Vale um contato.`, btn('Abrir', 'client', 'sm', '', `data-id="${c.id}"`)]));

  const next = state.events.filter(e => e.date >= TODAY && !['cancelado', 'realizado'].includes(e.status)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 6);
  const maxJ = Math.max(1, ...JOBST.map(([k]) => state.jobs.filter(j => j.stage === k).length));
  return head(dLong(TODAY).replace(/^./, c => c.toUpperCase()), 'Boa tarde, Raffaella.',
    'Os números do mês, a sua agenda e o que está esperando por você. O que chega pelo WhatsApp, pelo formulário e pelo link de agendamento aparece aqui.',
    waBtn('', 'Falar com o assistente') + btn('Cadastrar', 'new', 'pri', 'plus'))
  + how('Formulário de briefing vira vaga, link de agendamento vira compromisso, a agenda dispara perguntas e lembretes.',
    'Tudo também pode ser feito à mão, aqui no sistema.',
    'A Raffaella e a secretária mandam áudio ou texto e o assistente atualiza o sistema.')
  + `<div class="kpis">
      <div class="kpi"><span>Vagas em andamento</span><b>${s.active.length}</b><small>${s.pend.length} esperando resposta · ${s.closedM.length} fechadas no mês</small></div>
      <div class="kpi"><span>Currículos em outubro</span><b>${s.candM.length}</b><small>${newC.length} esperando análise</small></div>
      <div class="kpi"><span>Encontros realizados</span><b>${s.done.length}</b><small>${s.miss.length} falta do cliente · ${s.canc.length} cancelado</small></div>
      <div class="kpi gold"><span>Propostas em andamento</span><b>${money(s.openValue)}</b><small>${s.open.length} propostas · ${money(s.value)} fechados em vagas</small></div>
    </div>
    <div class="grid2">
      <section class="card"><div class="chead"><div><h2>O que precisa de você</h2><p>Coisas esperando você ou a secretária agirem.</p></div></div>${pend.map(([i, c, t, sm, b]) => `<div class="row"><span class="ri ${c}">${ic(i)}</span><span class="rt"><b>${esc(t)}</b><small>${esc(sm)}</small></span>${b}</div>`).join('') || '<div class="empty">Nada esperando por você.</div>'}</section>
      <section class="card"><div class="chead"><div><h2>Próximos compromissos</h2><p>Sua agenda dos próximos dias.</p></div><a class="link" href="#agenda">Calendário${ic('arrow')}</a></div>
        ${next.map(e => `<div class="row click" data-act="event" data-id="${e.id}"><span class="datebox"><b>${e.date.slice(8)}</b>${new Date(e.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span><span class="rt"><b>${EVTYPE[e.type]} · ${esc(cname(e.client))}</b><small>${hr(e.time)} · ${EVL[e.status]}</small></span>${orig(e.origin)}</div>`).join('')}</section>
    </div>
    <div class="grid2">
      <section class="card"><div class="chead"><div><h2>Vagas por etapa</h2><p>Abertas → Recrutamento → Seleção → Pendente → Fechadas</p></div><a class="link" href="#recrutamento">Ver vagas${ic('arrow')}</a></div>
        <div class="bars">${JOBST.map(([k, l]) => { const n = state.jobs.filter(j => j.stage === k).length; return `<div class="bar"><span>${l}</span><i><em style="width:${n / maxJ * 100}%"></em></i><b>${n}</b></div>` }).join('')}</div></section>
      <section class="card"><div class="chead"><div><h2>O que aconteceu</h2><p>Quem fez e por onde entrou.</p></div></div>
        ${state.activity.slice(0, 5).map(a => `<a class="row click" href="#${a.link}"><span class="ri ${a.origin === 'auto' ? 'dark' : a.origin === 'whatsapp' ? 'gold' : ''}">${ic(origOf(a.origin)[1])}</span><span class="rt"><b>${esc(a.text)}</b><small>${esc(a.who)} · ${origOf(a.origin)[0]}</small></span><time>${a.at.slice(0, 10) === TODAY ? 'hoje, ' + a.at.slice(11) : d(a.at.slice(0, 10))}</time></a>`).join('')}
      </section>
    </div>`;
}

// ── Agente ──────────────────────────────────────────────────────────────────
const MOD = { recrutamento: ['Recrutamento', 'briefcase'], crm: ['Clientes e propostas', 'building'], agenda: ['Agenda', 'calendar'], inicio: ['Consultas', 'search'], relatorios: ['Relatórios', 'report'] };
function agente() {
  return head('Assistente virtual · WhatsApp', 'O sistema inteiro, numa conversa.',
    'A Raffaella e a secretária falam com o número da Ômega por áudio ou texto. O assistente entende, completa com o histórico, mostra um resumo e só grava depois do "confirmo". Candidatos também mandam currículo pelo mesmo número.')
  + `<div class="how" aria-label="Como o assistente funciona">
      <div class="wa"><span class="hi">${ic('mic')}</span><b>1 · Fala do jeito dela</b><p>Áudio, texto, PDF ou foto. O áudio é transcrito e entendido.</p></div>
      <div class="pn"><span class="hi">${ic('search')}</span><b>2 · Ele completa</b><p>Busca cliente, vaga, preço anterior ou horário livre e pergunta só o que falta.</p></div>
      <div class="au"><span class="hi">${ic('check')}</span><b>3 · Confirma e grava</b><p>Mostra o resumo, grava e devolve o link. "Desfazer" volta a última ação.</p></div>
    </div>
    <div class="agentwrap">
      <div>${Object.entries(MOD).map(([g, [l, i]]) => `<div class="sgroup"><h4>${l}</h4><div class="scenelist">${SCENES.filter(s => s.module === g).map(s => `<button class="scene" data-act="play" data-scene="${s.id}"><span class="si">${ic(i)}</span><span><b>${esc(s.title)}</b><small>${esc(s.hint)}${s.auto ? ' · começa sozinho' : ''}</small></span><span class="go">Ver ${ic('play')}</span></button>`).join('')}</div></div>`).join('')}</div>
      <div class="phone" id="agentPhone"></div>
    </div>`;
}

// ── CRM ─────────────────────────────────────────────────────────────────────
function crm() {
  return head('Clientes e contatos', 'Do primeiro contato ao cliente fiel.', 'Empresas, pessoas, propostas, preços praticados e tudo o que já foi feito para cada uma.',
    waBtn('crm') + btn('Novo contato', 'form', 'pri', 'plus', 'data-form="lead"'))
  + how('Quem marca pelo link ou preenche o briefing entra aqui sozinho. Cliente sem contato há 3 meses vira alerta.',
    'Arraste a empresa de uma coluna para outra, anote conversas e veja quanto já cobrou.',
    '"Anota um contato novo…" ou "quanto cobrei por auxiliar administrativo?"')
  + tabbar('crm', [['funil', 'Andamento'], ['empresas', 'Todas as empresas', state.clients.length], ['precos', 'Quanto já cobrei']])
  + `<div id="results">${({ funil: crmFunnel, empresas: crmTable, precos: priceSearch })[tabs.crm]()}</div>`;
}
function lastSeen(c) { const n = daysBetween(c.lastContact, TODAY); return n === 0 ? 'hoje' : n === 1 ? 'ontem' : `há ${n} dias` }
function crmCard(c) {
  const won = state.proposals.filter(p => p.client === c.id && p.status === 'aprovada').reduce((s, p) => s + p.value * p.qty, 0);
  return `<button class="job${isFlash(c.id)}" data-act="client" data-drag="client" data-id="${c.id}"><span class="jt"><span class="cli">${esc(c.segment)}</span>${orig(c.origin)}</span><h3>${esc(c.name)}</h3><p>${esc(c.contact)}${c.role ? ' · ' + esc(c.role) : ''}</p>
    <span class="jf"><span>Último contato ${lastSeen(c)}</span><span>${c.stage === 'cliente' ? money(won) : c.potential ? '≈ ' + money(c.potential) : ''}</span></span></button>`;
}
function crmFunnel() {
  const other = state.clients.filter(c => ['perdido', 'inativo'].includes(c.stage));
  return `<p class="explain">Arraste o cartão para a próxima coluna quando a conversa avançar. No celular, segure o cartão um instante e depois arraste. Toque no cartão para ver tudo sobre a empresa.</p>
    <div class="boardwrap"><div class="board b5">${CRMST.map(([k, l]) => { const items = state.clients.filter(c => c.stage === k); return `<section class="col" data-drop="client" data-stage="${k}"><div class="colh"><span>${l}</span><span>${items.length}</span></div>${items.map(crmCard).join('') || '<p class="empty">Vazio</p>'}</section>` }).join('')}</div></div>
    <h3 class="subh">Não fecharam ou estão sem contato há tempo</h3>
    <div class="grid3">${other.map(c => `<div class="card minic${isFlash(c.id)}"><div class="jt">${tag(c.stage, CRML[c.stage])}<span class="cli">${esc(c.segment)}</span></div><h3>${esc(c.name)}</h3><p>${c.stage === 'perdido' ? esc(c.lostReason) : 'Sem atividade desde ' + dY(c.lastContact)}</p><div class="acts">${btn('Abrir', 'client', 'sm', '', `data-id="${c.id}"`)}${btn('Retomar contato', 'crmstage', 'sm pri', '', `data-id="${c.id}" data-stage="lead"`)}</div></div>`).join('')}</div>`;
}
function crmTable() {
  const q = F.q.toLowerCase();
  const list = state.clients.filter(c => (c.name + c.contact + c.segment + c.services.join()).toLowerCase().includes(q));
  return `<div class="toolbar">${search('Buscar empresa, contato ou serviço')}</div><div class="card tbl"><table><thead><tr><th>Empresa</th><th>Etapa</th><th>Serviços</th><th>Último contato</th><th>Já fechado</th></tr></thead><tbody>
    ${list.map(c => `<tr class="${isFlash(c.id).trim()}" data-act="client" data-id="${c.id}"><td><b>${esc(c.name)}</b><small>${esc(c.contact)} · ${esc(c.phone)}</small></td><td>${tag(c.stage, CRML[c.stage])}</td><td>${c.services.join(', ') || '—'}</td><td>${lastSeen(c)}</td><td>${money(state.proposals.filter(p => p.client === c.id && p.status === 'aprovada').reduce((s, p) => s + p.value * p.qty, 0))}</td></tr>`).join('')}
  </tbody></table></div>`;
}
function priceRows(q) {
  q = (q || '').toLowerCase().trim();
  return state.proposals.filter(p => !q || (p.role + ' ' + p.service + ' ' + cname(p.client)).toLowerCase().includes(q)).sort((a, b) => b.date.localeCompare(a.date));
}
function priceSearch() {
  const rows = priceRows(F.price);
  const ok = rows.filter(p => p.status === 'aprovada').map(p => p.value);
  const chips = ['Auxiliar administrativo', 'Consultoria mensal', 'Analista de RH', 'Amorim', 'Treinamento'];
  return `<div class="pricebox card"><h2>Quanto a Ômega já cobrou?</h2><p>Digite o nome da vaga, do cliente ou do serviço. Aparece cada proposta, as mudanças de preço e o que o cliente aceitou.</p>
    <div class="toolbar" style="margin:14px 0 10px">${search('Ex.: auxiliar administrativo', 'price')}</div><div class="chips">${chips.map(c => `<button class="chip ${F.price === c ? 'on' : ''}" data-act="pricechip" data-k="${c}">${c}</button>`).join('')}</div></div>
    <div class="kpis k3"><div class="kpi"><span>Propostas encontradas</span><b>${rows.length}</b><small>${rows.filter(p => p.status === 'aprovada').length} aceitas</small></div><div class="kpi gold"><span>Média dos valores aceitos</span><b>${ok.length ? money(ok.reduce((a, b) => a + b, 0) / ok.length) : '—'}</b><small>por vaga ou por mês</small></div><div class="kpi"><span>Do menor ao maior valor</span><b class="sm">${ok.length ? money(Math.min(...ok)) + ' a ' + money(Math.max(...ok)) : '—'}</b><small>entre os aceitos</small></div></div>
    <div class="card tbl"><table><thead><tr><th>Data</th><th>Cliente</th><th>Serviço / cargo</th><th>Valor</th><th>Mudanças de preço</th><th>Situação</th></tr></thead><tbody>
    ${rows.map(p => `<tr data-act="proposal" data-id="${p.id}"><td>${dY(p.date)}</td><td><b>${esc(cname(p.client))}</b></td><td>${esc(p.role || p.service)}<small>${esc(p.service)}${p.qty > 1 ? ` · ${p.qty} unidades` : ''}</small></td><td><b>${money(p.value)}</b><small>${p.unit}</small></td><td>${p.versions.length > 1 ? p.versions.map(v => money(v[2])).join(' → ') : '—'}</td><td>${tag(p.status, PROPL[p.status])}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Nada encontrado.</td></tr>'}
    </tbody></table></div>`;
}
function clientTimeline(id, from = '0000', to = '9999') {
  const ev = [];
  state.interactions.filter(i => i.client === id).forEach(i => ev.push({ date: i.date, title: i.kind, text: i.text, who: i.who, k: 'note' }));
  state.proposals.filter(p => p.client === id).forEach(p => ev.push({ date: p.date, title: `Proposta · ${p.role || p.service}`, text: `${money(p.value)} ${p.unit} · ${PROPL[p.status]}`, k: 'prop' }));
  state.jobs.filter(j => j.client === id).forEach(j => { ev.push({ date: j.created, title: `Vaga aberta · ${j.title}`, text: `${j.qty} ${j.qty > 1 ? 'posições' : 'posição'} · ${origOf(j.origin)[0]}`, k: 'job' }); if (j.closed) ev.push({ date: j.closed, title: `Vaga fechada · ${j.title}`, text: 'Contratado(a): ' + (j.hired || '—'), k: 'job' }) });
  state.events.filter(e => e.client === id && e.date <= TODAY && ['realizado', 'falta', 'cancelado'].includes(e.status)).forEach(e => ev.push({ date: e.date, title: `${EVTYPE[e.type]} · ${EVL[e.status]}`, text: [e.topic, e.summary, e.tool && 'Ferramenta: ' + e.tool].filter(Boolean).join(' · '), k: e.status === 'falta' ? 'miss' : 'ev' }));
  return ev.filter(e => e.date >= from && e.date <= to).sort((a, b) => b.date.localeCompare(a.date));
}
function clientDrawer(id) {
  const c = client(id);
  const props = state.proposals.filter(p => p.client === id).sort((a, b) => b.date.localeCompare(a.date));
  const nextEv = state.events.filter(e => e.client === id && e.date >= TODAY && !['cancelado', 'realizado'].includes(e.status)).sort((a, b) => a.date.localeCompare(b.date));
  const openP = props.filter(p => ['rascunho', 'enviada', 'negociacao'].includes(p.status));
  drawer(`<div><div class="eyebrow">${esc(c.segment)} · desde ${dY(c.since)}</div><h2>${esc(c.name)}</h2><div class="chips" style="margin-top:10px">${tag(c.stage, CRML[c.stage])}${orig(c.origin)}</div></div>`, `
    <div class="quick">${btn('Nova proposta', 'newproposal', 'pri', 'doc', `data-client="${c.id}"`)}${btn('Enviar briefing', 'sharebrief', '', 'form', `data-client="${c.id}"`)}${btn('Link de agendamento', 'sharebook', '', 'link', `data-client="${c.id}"`)}${btn('Anotar conversa', 'form', '', 'plus', `data-form="interacao" data-client="${c.id}"`)}</div>
    <label class="field">Em que etapa está<select data-change="crmstage" data-id="${c.id}">${[...CRMST, ['perdido', 'Perdido'], ['inativo', 'Inativo']].map(([k, l]) => `<option value="${k}" ${c.stage === k ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    <dl class="dl"><dt>Contato</dt><dd>${esc(c.contact)}${c.role ? ' · ' + esc(c.role) : ''}</dd><dt>WhatsApp</dt><dd>${esc(c.phone || '—')}</dd><dt>E-mail</dt><dd>${esc(c.email || '—')}</dd><dt>Serviços</dt><dd>${c.services.join(', ') || '—'}</dd><dt>Encontros fixos</dt><dd>${esc(c.meetingDay || '—')}</dd><dt>Pessoas da empresa</dt><dd>${c.people.map(p => `${esc(p[0])} <small style="color:var(--muted)">${esc(p[1])}</small>`).join('<br>')}</dd></dl>
    <div class="sec"><h4>Próximos passos</h4>${nextEv.map(e => `<div class="row tight click" data-act="event" data-id="${e.id}"><span class="rt"><b>${EVTYPE[e.type]} · ${dY(e.date)} ${hr(e.time)}</b><small>${EVL[e.status]}</small></span>${orig(e.origin)}</div>`).join('') + openP.map(p => `<div class="row tight click" data-act="proposal" data-id="${p.id}"><span class="rt"><b>Proposta ${PROPL[p.status].toLowerCase()} · ${money(p.value)}</b><small>${esc(p.role || p.service)}</small></span></div>`).join('') || '<p class="explain">Nenhuma ação marcada.</p>'}</div>
    <div class="sec"><h4>Quanto já foi cobrado</h4>${props.length ? `<div class="card tbl"><table><tbody>${props.map(p => `<tr data-act="proposal" data-id="${p.id}"><td>${dY(p.date)}</td><td>${esc(p.role || p.service)}</td><td><b>${money(p.value)}</b></td><td>${tag(p.status, PROPL[p.status])}</td></tr>`).join('')}</tbody></table></div>` : '<p class="explain">Sem propostas ainda.</p>'}</div>
    <div class="sec"><h4>Histórico completo</h4>${timelineHtml(clientTimeline(id))}</div>
    <div class="mactions">${btn('Relatório do cliente', 'report', '', 'report', `data-id="${c.id}"`)}</div>`);
}

// ── Recrutamento ────────────────────────────────────────────────────────────
function recrutamento() {
  const t = tabs.recrutamento;
  const actions = t === 'candidatos' ? btn('Ver currículo chegando pelo WhatsApp', 'play', 'wa', 'chat', 'data-scene="candidato"') + btn('Adicionar currículo', 'form', 'pri', 'plus', 'data-form="candidato"')
    : t === 'briefings' ? btn('Abrir o formulário', 'openbrief', 'wa', 'form') + btn('Enviar para um cliente', 'sharebrief', 'pri', 'link')
    : waBtn('recrutamento') + btn('Nova vaga', 'form', 'pri', 'plus', 'data-form="vaga"');
  return head('Recrutamento e seleção', 'Cada vaga, do briefing à contratação.', 'Abertas → Recrutamento → Seleção → Pendente → Fechadas, com os candidatos, as avaliações e o histórico de cada processo.', actions)
  + how('O cliente preenche o formulário de briefing e a vaga nasce em Abertas. Currículo mandado no WhatsApp entra na vaga certa.',
    'Cadastre vagas, arraste os cartões entre as colunas, adicione currículos que chegaram por e-mail ou indicação e copie vagas antigas.',
    '"Abre vaga pra Amorim…", "fechei a de analista", "manda o briefing pra Horizonte".')
  + tabbar('recrutamento', [['vagas', 'Vagas', state.jobs.filter(j => j.stage !== 'fechadas').length], ['candidatos', 'Candidatos', state.candidates.length], ['briefings', 'Formulário de briefing', state.jobs.filter(j => j.isNew).length || '']])
  + `<div id="results">${({ vagas: jobBoard, candidatos: candTable, briefings: briefTab })[t]()}</div>`;
}
function jobBoard() {
  const q = F.q.toLowerCase();
  const list = state.jobs.filter(j => (!F.client || j.client === F.client) && (!F.pend || j.flag || j.stage === 'pendente') && (j.title + cname(j.client)).toLowerCase().includes(q));
  return `<div class="toolbar">${search('Buscar vaga ou cliente')}<select data-filter="client" aria-label="Cliente">${clientOptions(F.client, true, c => state.jobs.some(j => j.client === c.id))}</select><button class="chip ${F.pend ? 'on' : ''}" data-act="pendf">${ic('pause')}Só as que esperam resposta</button></div>
  <p class="explain">Arraste o cartão para a próxima coluna quando a vaga avançar. No celular, segure o cartão um instante e depois arraste. Uma vaga também pode ficar marcada como "esperando resposta" sem sair da coluna.</p>
  <div class="boardwrap"><div class="board b5">${JOBST.map(([s, l]) => {
    const items = list.filter(j => j.stage === s).sort((a, b) => (b.closed || b.created).localeCompare(a.closed || a.created));
    return `<section class="col st-${s}" data-drop="job" data-stage="${s}"><div class="colh"><span>${l}</span><span>${items.length}</span></div><p class="colsub">${JOBHELP[s]}</p>
    ${items.map(j => { const cs = state.candidates.filter(c => c.job === j.id); const i = JOBST.findIndex(x => x[0] === j.stage); return `<div class="job${isFlash(j.id)}" data-act="job" data-drag="job" data-id="${j.id}" role="button" tabindex="0">
      <span class="jt"><span class="cli">${esc(cname(j.client))}</span>${orig(j.origin)}</span>
      <h3>${esc(j.title)}</h3><p>${j.qty} ${j.qty > 1 ? 'vagas' : 'vaga'}${j.fee ? ' · ' + money(j.fee) + ' cada' : ' · valor a combinar'}</p>
      ${j.isNew ? '<div class="pend new">Briefing novo · conferir</div>' : ''}${j.flag && s !== 'fechadas' ? `<div class="pend">${ic('pause')}${esc(j.flag)}</div>` : ''}
      <span class="jf"><span>${s === 'fechadas' ? 'Contratado(a): ' + esc(j.hired || '—') : `${cs.length} candidato${cs.length === 1 ? "" : "s"}`}</span>${i < 4 ? `<button class="nextbtn" data-act="jobnext" data-id="${j.id}" title="Mover para ${JOBST[i + 1][1]}" aria-label="Mover para ${JOBST[i + 1][1]}">${JOBST[i + 1][1]}${ic('right')}</button>` : ''}</span>
    </div>` }).join('') || '<p class="empty">Nenhuma vaga.</p>'}</section>`;
  }).join('')}</div></div>`;
}
function candTable() {
  const q = F.q.toLowerCase();
  const list = state.candidates.filter(c => (!F.job || c.job === F.job) && (!F.status || c.status === F.status) && (!F.origin || c.origin === F.origin) && (c.name + c.city + (jobOf(c.job)?.title || '')).toLowerCase().includes(q)).sort((a, b) => b.date.localeCompare(a.date));
  return `<div class="toolbar">${search('Buscar candidato, cidade ou vaga')}<select data-filter="job" aria-label="Vaga"><option value="">Todas as vagas</option>${state.jobs.filter(j => state.candidates.some(c => c.job === j.id)).map(j => `<option value="${j.id}" ${F.job === j.id ? 'selected' : ''}>${esc(j.title)} · ${esc(cname(j.client))}</option>`).join('')}</select><select data-filter="status" aria-label="Etapa"><option value="">Todas as etapas</option>${CANDST.map(([k, l]) => `<option value="${k}" ${F.status === k ? 'selected' : ''}>${l}</option>`).join('')}</select><select data-filter="origin" aria-label="Origem"><option value="">Chegou por qualquer meio</option>${['whatsapp', 'email', 'indicacao', 'site', 'painel'].map(k => `<option value="${k}" ${F.origin === k ? 'selected' : ''}>${ORIG[k][0]}</option>`).join('')}</select></div>
  <div class="card tbl"><table><thead><tr><th>Candidato</th><th>Vaga</th><th>Como chegou</th><th>Etapa</th><th>Nota</th><th>Chegou em</th></tr></thead><tbody>
  ${list.map(c => { const j = jobOf(c.job); return `<tr class="${isFlash(c.id).trim()}" data-act="cand" data-id="${c.id}"><td><b>${esc(c.name)}</b><small>${esc(c.city)}</small></td><td>${esc(j?.title)}<small>${esc(cname(j?.client))}</small></td><td>${orig(c.origin)}</td><td>${tag(c.status, CANDL[c.status])}</td><td>${c.rating ? stars(c.rating) : '<small>—</small>'}</td><td>${d(c.date)}</td></tr>` }).join('') || '<tr><td colspan="6" class="empty">Nenhum candidato.</td></tr>'}
  </tbody></table></div>`;
}
function briefTab() {
  const got = state.jobs.filter(j => j.origin === 'briefing').sort((a, b) => b.created.localeCompare(a.created));
  return `<div class="grid2 rev">
    <section class="card"><div class="chead"><div><h2>Respostas recebidas</h2><p>Cada formulário enviado vira uma vaga em Abertas.</p></div></div>
      ${got.map(j => `<div class="row click${isFlash(j.id)}" data-act="job" data-id="${j.id}"><span class="ri">${ic('form')}</span><span class="rt"><b>${esc(j.title)} · ${esc(cname(j.client))}</b><small>Recebido em ${dY(j.created)} · ${Object.values(j.brief || {}).filter(Boolean).length + 1} de ${BRIEF.length} respostas</small></span>${j.isNew ? '<span class="tag t-warn">Nova</span>' : tag(j.stage, JOBL[j.stage])}</div>`).join('')}
    </section>
    <section class="card formcard"><div class="eyebrow">Substitui o Google Forms</div><h2>Formulário de briefing da Ômega</h2><p>O mesmo roteiro de perguntas, com a marca da Ômega. Cada cliente recebe um link próprio e as respostas entram direto no sistema, sem copiar nada.</p>
      <div class="linkbox"><code>${esc(base())}briefing.html</code>${btn('Copiar', 'copylink', 'sm', 'copy', 'data-path="briefing.html"')}</div>
      <ol class="qlist">${BRIEF.map(b => `<li>${esc(b.q)}${b.req ? ' <em>obrigatória</em>' : ''}</li>`).join('')}</ol>
      <div class="acts">${btn('Abrir e testar', 'openbrief', 'pri', 'form')}${btn('Enviar pelo WhatsApp', 'play', 'wa', 'chat', 'data-scene="briefing"')}</div>
    </section></div>`;
}
function jobDrawer(id) {
  const j = jobOf(id);
  if (j.isNew) { delete j.isNew; save(); renderNav() }
  const cs = state.candidates.filter(c => c.job === id);
  const prop = j.proposal && state.proposals.find(p => p.id === j.proposal);
  drawer(`<div><div class="eyebrow">${esc(cname(j.client))} · criada em ${dY(j.created)}</div><h2>${esc(j.title)}</h2><div class="chips" style="margin-top:10px">${tag(j.stage, JOBL[j.stage])}${orig(j.origin)}${j.flag && j.stage !== 'fechadas' ? '<span class="tag t-warn">Esperando resposta</span>' : ''}</div></div>`, `
    <div class="sec"><h4>Em que etapa está · toque para mudar</h4>${stepper(JOBST, j.stage, 'jobstage', j.id)}</div>
    ${j.stage !== 'fechadas' ? `<div class="flagbox">${j.flag ? `<span>${ic('pause')}<b>Esperando:</b> ${esc(j.flag)}</span>${btn('Já tivemos resposta', 'jobflag', 'sm', 'check', `data-id="${j.id}"`)}` : `<span>Está esperando alguma resposta do cliente? Marque aqui. A vaga continua na mesma coluna.</span>${btn('Marcar como esperando', 'jobflag', 'sm', 'pause', `data-id="${j.id}"`)}`}</div>` : ''}
    <dl class="dl"><dt>Quantidade de vagas</dt><dd>${j.qty}</dd><dt>Valor cobrado por vaga</dt><dd>${j.fee ? `${money(j.fee)} <small style="color:var(--muted)">· total ${money(j.fee * j.qty)}</small>` : 'A combinar'}</dd><dt>Proposta</dt><dd>${prop ? `<button class="link" data-act="proposal" data-id="${prop.id}">${PROPL[prop.status]} em ${dY(prop.date)}${ic('arrow')}</button>` : `<button class="link" data-act="newproposal" data-client="${j.client}">Fazer proposta${ic('arrow')}</button>`}</dd>${j.hired ? `<dt>Contratado(a)</dt><dd>${esc(j.hired)} · ${dY(j.closed)}</dd>` : ''}</dl>
    <div class="sec"><h4>Candidatos · ${cs.length}</h4>${cs.map(c => `<div class="row tight click" data-act="cand" data-id="${c.id}"><span class="pdf sm">PDF</span><span class="rt"><b>${esc(c.name)}</b><small>${origOf(c.origin)[0]} · ${esc(c.city)}</small></span>${tag(c.status, CANDL[c.status])}</div>`).join('') || '<p class="explain">Nenhum currículo ainda.</p>'}<div class="acts" style="margin-top:10px">${btn('Adicionar currículo', 'form', 'sm', 'plus', `data-form="candidato" data-job="${j.id}"`)}</div></div>
    <div class="sec"><h4>Briefing da vaga</h4><dl class="dl brief">${BRIEF.slice(1).map(b => `<dt>${esc(b.q)}</dt><dd>${esc(j.brief?.[b.k] || '—')}</dd>`).join('')}</dl></div>
    <div class="sec"><h4>Histórico</h4>${timelineHtml((j.history || []).map(h => ({ date: h[0], title: h[1], who: h[2] })).reverse())}</div>
    <div class="mactions">${btn('Copiar esta vaga', 'jobdup', '', 'copy', `data-id="${j.id}"`)}${j.stage !== 'fechadas' ? btn('Fechar vaga', 'jobclose', 'pri', 'check', `data-id="${j.id}"`) : ''}</div>`);
}
function candDrawer(id) {
  const c = state.candidates.find(x => x.id === id);
  const j = jobOf(c.job);
  drawer(`<div><div class="eyebrow">${esc(j.title)} · ${esc(cname(j.client))}</div><h2>${esc(c.name)}</h2><div class="chips" style="margin-top:10px">${tag(c.status, CANDL[c.status])}${orig(c.origin)}${c.rating ? stars(c.rating) : ''}</div></div>`, `
    <div class="sec"><h4>Etapa do candidato</h4>${stepper(CANDST.slice(0, 6), c.status, 'candstage', c.id)}<div class="acts" style="margin-top:8px">${c.status !== 'reprovado' ? btn('Não selecionado', 'candstage', 'sm', 'x', `data-id="${c.id}" data-stage="reprovado"`) : btn('Voltar para análise', 'candstage', 'sm', 'undo', `data-id="${c.id}" data-stage="triagem"`)}</div></div>
    <div class="file big"><span class="pdf">PDF</span><span><b>Currículo · ${esc(c.name)}.pdf</b><small>Recebido em ${dY(c.date)} por ${origOf(c.origin)[0]}</small></span>${btn('Abrir', 'demo', 'sm', '', 'data-msg="Na versão final, abre o PDF do currículo."')}</div>
    <dl class="dl"><dt>Cidade</dt><dd>${esc(c.city)}</dd><dt>Telefone</dt><dd>${esc(c.phone)}</dd><dt>Vaga</dt><dd><button class="link" data-act="job" data-id="${j.id}">${esc(j.title)} · ${esc(cname(j.client))}${ic('arrow')}</button></dd><dt>Observações</dt><dd>${esc(c.notes || '—')}</dd></dl>
    <div class="sec"><h4>Avaliações</h4>${c.evals.map(e => `<div class="quote"><b>${esc(e[0])} · ${stars(e[2])}</b>${esc(e[1])}</div>`).join('') || '<p class="explain">Nenhuma avaliação ainda.</p>'}
      <form class="evalform" data-id="${c.id}"><textarea name="text" placeholder="Como foi a entrevista, o teste ou a dinâmica?" required></textarea><div class="acts"><select name="score" aria-label="Nota">${[5, 4, 3, 2, 1].map(n => `<option value="${n}">${'★'.repeat(n)} ${n}</option>`).join('')}</select><button class="btn pri sm" type="submit">${ic('check')}Salvar avaliação</button></div></form></div>`);
}

// ── Consultorias e agenda ───────────────────────────────────────────────────
function agenda() {
  return head('Agenda e consultorias', 'A agenda que se preenche sozinha.', 'Calendário de consultorias, treinamentos e reuniões, com presença, faltas, cancelamentos e o histórico de cada cliente.',
    btn('Link de agendamento', 'openbook', 'wa', 'link') + btn('Novo agendamento', 'form', 'pri', 'plus', 'data-form="evento"'))
  + how('O cliente escolhe data e horário pelo link público e o compromisso entra aqui, ligado ao cadastro. Lembretes e confirmações saem sozinhos.',
    'Crie, altere, remarque e cancele compromissos. Registre presença, falta e observações.',
    '"Remarca a DEDARC para terça" ou o relato por áudio depois do encontro.')
  + tabbar('agenda', [['calendario', 'Calendário'], ['atendimentos', 'Encontros', state.events.filter(e => e.status === 'aguardando').length || ''], ['treinamentos', 'Treinamentos']])
  + `<div id="results">${({ calendario: calendar, atendimentos: evTable, treinamentos: trainCards })[tabs.agenda]()}</div>`;
}
const evChip = e => `<button class="evc ty-${e.type} s-${e.status}${isFlash(e.id)}" data-act="event" data-id="${e.id}" title="${EVTYPE[e.type]} · ${esc(cname(e.client))} · ${EVL[e.status]}">${e.origin === 'link' ? ic('link') : ''}<b>${hr(e.time)}</b> ${esc(cname(e.client))}</button>`;
function calendar() {
  const first = new Date(cal.y, cal.m, 1);
  const label = first.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const legend = `<div class="legend"><span class="ty-consultoria">Consultoria</span><span class="ty-treinamento">Treinamento</span><span class="ty-reuniao">Reunião comercial</span><span class="lg">${ic('link')}Agendado pelo cliente no link</span><span class="lg"><s>Riscado</s> cancelado</span></div>`;
  let grid;
  if (cal.mode === 'mes') {
    const start = (first.getDay() + 6) % 7; const days = new Date(cal.y, cal.m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < start; i++) cells.push('<div class="day out"></div>');
    for (let n = 1; n <= days; n++) {
      const ds = `${cal.y}-${String(cal.m + 1).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
      const evs = state.events.filter(e => e.date === ds).sort((a, b) => a.time.localeCompare(b.time));
      cells.push(`<div class="day ${ds === TODAY ? 'today' : ''} ${(start + n - 1) % 7 > 4 ? 'we' : ''}"><button class="dn" data-act="newevent" data-date="${ds}" aria-label="Novo compromisso em ${d(ds)}">${n}</button>${evs.map(evChip).join('')}</div>`);
    }
    grid = `<div class="cal"><div class="wk">${['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(x => `<span>${x}</span>`).join('')}</div><div class="days">${cells.join('')}</div></div>`;
  } else {
    const mon = addDays(addDays(TODAY, -((new Date(TODAY + 'T12:00:00').getDay() + 6) % 7)), cal.w * 7);
    grid = `<div class="week">${[0, 1, 2, 3, 4, 5].map(i => { const ds = addDays(mon, i); const evs = state.events.filter(e => e.date === ds).sort((a, b) => a.time.localeCompare(b.time)); return `<div class="wd ${ds === TODAY ? 'today' : ''}"><div class="wdh"><b>${new Date(ds + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</b>${d(ds)}</div>${evs.map(e => `<button class="wev ty-${e.type} s-${e.status}${isFlash(e.id)}" data-act="event" data-id="${e.id}"><b>${hr(e.time)}–${hr(e.end)}</b>${esc(cname(e.client))}<small>${EVTYPE[e.type]} · ${EVL[e.status]}${e.origin === 'link' ? ' · pelo link' : ''}</small></button>`).join('') || '<span class="free">Livre</span>'}<button class="addev" data-act="newevent" data-date="${ds}" aria-label="Novo compromisso">${ic('plus')}</button></div>` }).join('')}</div>`;
  }
  const mon = addDays(addDays(TODAY, -((new Date(TODAY + 'T12:00:00').getDay() + 6) % 7)), cal.w * 7);
  return `<div class="calbar"><div class="calnav">${btn('', 'calprev', 'sm icon', 'left', 'aria-label="Anterior"')}<h2>${cal.mode === 'mes' ? label.replace(/^./, c => c.toUpperCase()) : `Semana de ${d(mon)}`}</h2>${btn('', 'calnext', 'sm icon', 'right', 'aria-label="Próximo"')}${btn('Hoje', 'caltoday', 'sm')}</div><div class="seg"><button class="${cal.mode === 'mes' ? 'on' : ''}" data-act="calmode" data-k="mes">Mês</button><button class="${cal.mode === 'semana' ? 'on' : ''}" data-act="calmode" data-k="semana">Semana</button></div></div>${legend}${grid}`;
}
function evTable() {
  const segs = [['todos', 'Todos'], ['aguardando', 'Falta contar como foi'], ['realizado', 'Aconteceram'], ['falta', 'Cliente faltou'], ['cancelado', 'Cancelados'], ['proximos', 'Próximos']];
  const list = state.events.filter(e => (F.ev === 'todos' || (F.ev === 'proximos' ? ['agendado', 'confirmado'].includes(e.status) : e.status === F.ev)) && (!F.client || e.client === F.client))
    .sort((a, b) => F.ev === 'proximos' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  return `<div class="toolbar"><div class="seg">${segs.map(([k, l]) => `<button class="${F.ev === k ? 'on' : ''}" data-act="evseg" data-k="${k}">${l}</button>`).join('')}</div><select data-filter="client" aria-label="Cliente">${clientOptions(F.client)}</select></div>
  <div class="card tbl"><table><thead><tr><th>Data</th><th>Cliente</th><th>O que é</th><th>Assunto</th><th>Situação</th><th>Como foi marcado</th></tr></thead><tbody>
  ${list.map(e => `<tr class="${isFlash(e.id).trim()}" data-act="event" data-id="${e.id}"><td><b>${dY(e.date)}</b><small>${hr(e.time)}–${hr(e.end)}</small></td><td>${esc(cname(e.client))}</td><td>${EVTYPE[e.type]}</td><td>${esc(e.topic || (e.status === 'aguardando' ? 'Pergunta enviada às ' + e.askedAt : '—'))}${e.tool ? `<small>${esc(e.tool)}</small>` : ''}</td><td>${tag(e.status, EVL[e.status])}</td><td>${orig(e.origin)}</td></tr>`).join('') || '<tr><td colspan="6" class="empty">Nada aqui.</td></tr>'}
  </tbody></table></div>`;
}
function trainCards() {
  const list = state.events.filter(e => e.type === 'treinamento').sort((a, b) => b.date.localeCompare(a.date));
  return `<div class="grid3">${list.map(t => `<button class="card client${isFlash(t.id)}" data-act="event" data-id="${t.id}"><span class="ct" style="justify-content:space-between">${tag(t.status, EVL[t.status])}${orig(t.origin)}</span><span><span class="ttl">${esc(t.topic)}</span><span class="meta">${esc(cname(t.client))} · ${esc(t.place || '')}</span></span><span class="mini"><span><b>${d(t.date)}</b>${hr(t.time)}</span><span><b>${t.attended ?? t.people ?? '—'}</b>${t.attended != null ? 'presentes' : 'previstos'}</span><span><b>${esc((t.material || '—').split(' ')[0])}</b>material</span></span></button>`).join('')}</div>`;
}
function eventDrawer(id) {
  const e = state.events.find(x => x.id === id);
  const future = ['agendado', 'confirmado'].includes(e.status);
  let body = '';
  if (e.status === 'aguardando') body = `<div class="ask">${ic('mic')}<span>A pergunta foi enviada às ${e.askedAt}. Quando a Raffaella responder no WhatsApp, o relato aparece aqui já organizado.</span></div><div class="acts">${btn('Ver a conversa', 'play', 'wa', 'chat', 'data-scene="pos-encontro"')}${btn('Contar aqui mesmo', 'form', 'pri', 'hand', `data-form="relato" data-id="${e.id}"`)}${btn('Cliente faltou', 'evstatus', '', 'x', `data-id="${e.id}" data-k="falta"`)}</div>`;
  else if (future) body = `<div class="acts">${btn('Aconteceu', 'form', 'pri', 'check', `data-form="relato" data-id="${e.id}"`)}${btn('Cliente faltou', 'evstatus', '', 'x', `data-id="${e.id}" data-k="falta"`)}${btn('Remarcar', 'form', '', 'calendar', `data-form="remarcar" data-id="${e.id}"`)}${btn('Cancelar', 'evstatus', '', 'x', `data-id="${e.id}" data-k="cancelado"`)}</div>
    ${e.topic ? `<dl class="dl"><dt>Pauta</dt><dd>${esc(e.topic)}</dd></dl>` : ''}
    <div class="sec"><h4>O que vai acontecer sozinho</h4><div class="tl"><div><small>${d(addDays(e.date, -1))} · 18h</small><b>Lembrete e pedido de confirmação</b><p>Para a Raffaella e para ${esc(client(e.client)?.contact)}.</p></div><div><small>${d(e.date)} · 7h30</small><b>Na agenda do dia</b><p>Com o próximo passo do último encontro.</p></div>${e.type !== 'reuniao' ? `<div><small>${d(e.date)} · ${hr(e.end)}</small><b>Pergunta pós-encontro</b><p>"O que rolou hoje na ${esc(cname(e.client))}?"</p></div>` : ''}</div></div>`;
  else body = `<dl class="dl">${e.topic ? `<dt>Pauta</dt><dd>${esc(e.topic)}</dd>` : ''}${e.summary ? `<dt>Observações</dt><dd>${esc(e.summary)}</dd>` : ''}${e.tool ? `<dt>Ferramenta</dt><dd>${esc(e.tool)}</dd>` : ''}${e.next ? `<dt>Próximo passo</dt><dd>${esc(e.next)}</dd>` : ''}${e.people ? `<dt>Participantes</dt><dd>${e.attended ?? '—'} de ${e.people}</dd>` : ''}</dl>
    ${e.transcript ? `<div class="quote"><b>Áudio original, transcrito</b>"${esc(e.transcript)}"</div>` : ''}<div class="acts">${btn('Editar', 'form', '', 'hand', `data-form="relato" data-id="${e.id}"`)}</div>`;
  drawer(`<div><div class="eyebrow">${EVTYPE[e.type]} · ${dLong(e.date)} · ${hr(e.time)} às ${hr(e.end)}</div><h2>${esc(cname(e.client))}</h2><div class="chips" style="margin-top:10px">${tag(e.status, EVL[e.status])}${orig(e.origin)}</div></div>`,
    body + `<div class="sec"><h4>Últimos encontros com ${esc(cname(e.client))}</h4>${timelineHtml(clientTimeline(e.client).filter(x => x.k === 'ev' || x.k === 'miss').slice(0, 5))}</div>`);
}

// ── Propostas e contratos ───────────────────────────────────────────────────
function propostas() {
  return head('Propostas e contratos', 'Da proposta ao contrato, sem redigitar.', 'Propostas prontas em poucos minutos, com os dados do cliente já preenchidos, o histórico de preços e o contrato criado a partir da proposta aceita.',
    btn('Nova proposta', 'newproposal', 'pri', 'plus'))
  + how('Proposta sem resposta há 3 dias gera um lembrete. Quando o cliente aceita, a empresa vira cliente e o contrato sai com os mesmos dados.',
    'Escolha o cliente e o tipo de proposta, preencha o que está incluso, a forma de pagamento e o valor, e veja como fica antes de enviar.',
    '"Quanto cobrei por auxiliar administrativo?" responde com o histórico de preços.')
  + tabbar('propostas', [['propostas', 'Propostas', state.proposals.length], ['contratos', 'Contratos', state.proposals.filter(p => p.contract).length], ['modelos', 'Textos prontos']])
  + `<div id="results">${({ propostas: propTable, contratos: contractTable, modelos: () => templateCards() })[tabs.propostas]()}</div>`;
}
function propTable() {
  const by = k => state.proposals.filter(p => p.status === k);
  return `<div class="pstrip">${PROPST.map(([k, l]) => `<button class="${F.status === k ? 'on' : ''}" data-act="propf" data-k="${k}"><span>${l}</span><b>${by(k).length}</b><small>${money(by(k).reduce((s, p) => s + p.value * p.qty, 0))}</small></button>`).join('')}</div>
  <div class="card tbl"><table><thead><tr><th>Cliente</th><th>Serviço / cargo</th><th>Valor</th><th>Mudanças de preço</th><th>Data</th><th>Situação</th></tr></thead><tbody>
  ${state.proposals.filter(p => !F.status || p.status === F.status).sort((a, b) => b.date.localeCompare(a.date)).map(p => `<tr class="${isFlash(p.id).trim()}" data-act="proposal" data-id="${p.id}"><td><b>${esc(cname(p.client))}</b><small>${CRML[client(p.client)?.stage] || ''}</small></td><td>${esc(p.role || p.service)}<small>${esc(p.service)}</small></td><td><b>${money(p.value)}</b><small>${p.unit}${p.qty > 1 ? ' · ' + p.qty + ' un.' : ''}</small></td><td>${p.versions.length > 1 ? p.versions.length - 1 + (p.versions.length > 2 ? ' mudanças' : ' mudança') : 'Nenhuma'}</td><td>${dY(p.date)}</td><td>${tag(p.status, PROPL[p.status])}</td></tr>`).join('')}
  </tbody></table></div>`;
}
function contractTable() {
  const list = state.proposals.filter(p => p.contract).sort((a, b) => b.contract.date.localeCompare(a.contract.date));
  return `<div class="card tbl"><table><thead><tr><th>Cliente</th><th>Serviço</th><th>Valor</th><th>Criado em</th><th>Situação</th></tr></thead><tbody>
  ${list.map(p => `<tr class="${isFlash(p.id).trim()}" data-act="contract" data-id="${p.id}"><td><b>${esc(cname(p.client))}</b></td><td>${esc(p.role || p.service)}<small>${esc(p.service)}</small></td><td>${money(p.value)} <small>${p.unit}</small></td><td>${dY(p.contract.date)}</td><td>${tag(p.contract.status, p.contract.status === 'assinado' ? 'Assinado' : 'Falta assinar')}</td></tr>`).join('')}
  </tbody></table></div><p class="explain" style="margin-top:14px">Envio e assinatura reais ficam para a próxima fase. Aqui eles são simulados.</p>`;
}
function templateCards(kinds = ['proposta', 'contrato']) {
  return `<div class="grid3">${state.templates.filter(t => kinds.includes(t.kind)).map(t => `<div class="card doc"><span class="dt"><span class="pdf">${t.kind === 'contrato' ? 'DOC' : t.kind === 'mensagem' ? 'MSG' : 'PDF'}</span><span class="tag t-mute">${t.kind}</span></span><span><span class="cli">${esc(t.service)}</span><h3>${esc(t.name)}</h3></span><p>${esc(t.scope || (t.kind === 'contrato' ? 'Preenchido com os dados do cliente e da proposta aceita.' : 'Mensagem pronta usada nas tarefas automáticas.'))}</p><span class="df"><span>usado ${t.used}x</span>${t.kind === 'proposta' ? btn('Usar este texto', 'newproposal', 'sm', '', `data-tpl="${t.id}"`) : btn('Editar', 'demo', 'sm', '', 'data-msg="Editar os textos prontos entra na próxima fase."')}</span></div>`).join('')}</div>`;
}
const brandMark = `<span class="brand"><span class="mark">Ω</span><span><b>ômega</b><small>GESTÃO &amp; PESSOAS</small></span></span>`;
function proposalDoc(p) {
  const c = client(p.client) || {};
  return `<article class="paperdoc propdoc"><div class="dh"><div><div class="eyebrow">Proposta comercial${p.versions && p.versions.length > 1 ? ' · versão ' + p.versions.length : ''}</div><h2>${esc(p.service || 'Serviço')}</h2><span class="dsub">${esc(p.role || '')}</span></div>${brandMark}</div>
    <div class="pd2"><div><h4>Para</h4><p><b>${esc(c.name || 'Selecione o cliente')}</b><br>${esc(c.contact || '')}${c.role ? ' · ' + esc(c.role) : ''}<br>${esc(c.email || c.phone || '')}</p></div><div><h4>Data</h4><p>${dY(p.date || TODAY)}<br>Válida por ${p.valid || 15} dias</p></div></div>
    <h4>O que está incluso</h4><p>${esc(p.scope || '—')}</p>
    <h4>Investimento</h4><table class="inv"><tbody><tr><td>${esc(p.role || p.service || '—')}</td><td>${p.qty || 1} × ${money(p.value)} <small>${esc(p.unit || '')}</small></td><td><b>${money(p.value * (p.qty || 1))}</b></td></tr></tbody></table>
    <h4>Forma de pagamento</h4><p>${esc(p.conditions || '—')}</p>
    <div class="sign"><span>Raffaella · Ômega Gestão &amp; Pessoas</span><span>${esc(c.contact || 'Cliente')}${c.name ? ' · ' + esc(c.name) : ''}</span></div></article>`;
}
function proposalEditor(pre = {}) {
  const tpl = state.templates.find(t => t.id === pre.tpl) || state.templates[0];
  drawer(`<div><div class="eyebrow">Nova proposta · veja ao lado como ela fica</div><h2>Montar proposta</h2></div>`, `<div class="editor"><form id="pform" class="pform">
    <label class="field">Cliente<select name="client">${clientOptions(pre.client || 'serra', false, c => c.stage !== 'perdido')}</select></label>
    <label class="field">Tipo de proposta<select name="tpl">${state.templates.filter(t => t.kind === 'proposta').map(t => `<option value="${t.id}" ${t.id === tpl.id ? 'selected' : ''}>${esc(t.name)}</option>`).join('')}</select></label>
    <label class="field">Para qual vaga ou assunto<input name="role" placeholder="Ex.: Auxiliar administrativo" autocomplete="off"></label>
    <div id="pricehint"></div>
    <div class="fg"><label class="field">Quantas (vagas, meses ou turmas)<input name="qty" type="number" min="1" value="1"></label><label class="field">Valor de cada uma (R$)<input name="value" type="number" min="0" step="50" placeholder="0"></label></div>
    <label class="field">O que está incluso<textarea name="scope">${esc(tpl.scope)}</textarea></label>
    <label class="field">Forma de pagamento<textarea name="conditions">${esc(tpl.conditions)}</textarea></label>
    <label class="field">A proposta vale por<select name="valid"><option value="7">7 dias</option><option value="15" selected>15 dias</option><option value="30">30 dias</option></select></label>
    <div class="mactions"><button type="button" class="btn" data-act="saveprop" data-k="rascunho">Salvar sem enviar</button><button type="button" class="btn pri" data-act="saveprop" data-k="enviada">${ic('check')}Salvar e marcar como enviada</button></div>
  </form><div id="pprev"></div></div>`, 'wide');
  updateProposalPreview();
}
function formProposal() {
  const f = $('#pform'); if (!f) return null;
  const v = Object.fromEntries(new FormData(f));
  const tpl = state.templates.find(t => t.id === v.tpl);
  return { client: v.client, service: tpl.service, unit: tpl.unit, role: v.role.trim(), qty: +v.qty || 1, value: +v.value || 0, scope: v.scope, conditions: v.conditions, valid: v.valid, tpl: v.tpl };
}
function updateProposalPreview(tplChanged) {
  if (tplChanged) { const f = $('#pform'); const t = state.templates.find(x => x.id === f.tpl.value); f.scope.value = t.scope; f.conditions.value = t.conditions }
  const p = formProposal(); if (!p) return;
  $('#pprev').innerHTML = proposalDoc(p);
  const rows = p.role.length > 2 ? priceRows(p.role) : [];
  $('#pricehint').innerHTML = rows.length ? `<div class="hint"><b>${ic('search')}Quanto já foi cobrado por "${esc(p.role)}"</b>${rows.slice(0, 4).map(r => `<span>${dY(r.date)} · ${esc(cname(r.client))} · <b>${money(r.value)}</b> · ${PROPL[r.status].toLowerCase()}</span>`).join('')}</div>` : '';
}
function proposalDrawer(id) {
  const p = state.proposals.find(x => x.id === id);
  const flow = PROPST.filter(([k]) => k !== 'recusada');
  drawer(`<div><div class="eyebrow">${esc(cname(p.client))} · ${dY(p.date)}</div><h2>${esc(p.role || p.service)}</h2><div class="chips" style="margin-top:10px">${tag(p.status, PROPL[p.status])}<span class="chip">${money(p.value)} ${p.unit}</span></div></div>`, `
    <div class="sec"><h4>Andamento · toque para mudar</h4>${stepper(flow, p.status, 'propstage', p.id)}${['rascunho', 'enviada', 'negociacao'].includes(p.status) ? `<div class="acts" style="margin-top:8px">${btn('Cliente não aceitou', 'propstage', 'sm', 'x', `data-id="${p.id}" data-stage="recusada"`)}</div>` : ''}</div>
    <div class="sec"><h4>Mudanças de preço</h4><div class="card tbl"><table><thead><tr><th>Vez</th><th>Data</th><th>Valor</th><th>Motivo</th></tr></thead><tbody>${p.versions.map(v => `<tr style="cursor:default"><td>${v[0]}ª</td><td>${dY(v[1])}</td><td><b>${money(v[2])}</b></td><td>${esc(v[3])}</td></tr>`).join('')}</tbody></table></div>
      ${['rascunho', 'enviada', 'negociacao'].includes(p.status) ? `<form class="verform" data-id="${p.id}"><input name="value" type="number" min="0" step="50" placeholder="Novo valor" required aria-label="Novo valor"><input name="note" placeholder="Motivo (ex.: desconto para 2 vagas)" required aria-label="Motivo"><button class="btn sm" type="submit">${ic('plus')}Mudar o preço</button></form>` : ''}</div>
    <div class="sec"><h4>Como a proposta ficou</h4>${proposalDoc(p)}</div>
    <div class="mactions">${btn('Imprimir', 'print', '', 'print')}${p.status === 'aprovada' && !p.contract ? btn('Criar contrato', 'mkcontract', 'pri', 'doc', `data-id="${p.id}"`) : p.contract ? btn('Ver contrato', 'contract', 'pri', 'doc', `data-id="${p.id}"`) : ''}</div>`);
}
function contractView(id) {
  const p = state.proposals.find(x => x.id === id); const c = client(p.client);
  drawer(`<div><div class="eyebrow">Contrato · ${esc(c.name)}</div><h2>Prestação de serviços</h2><div class="chips" style="margin-top:10px">${tag(p.contract.status, p.contract.status === 'assinado' ? 'Assinado' : 'Falta assinar')}</div></div>`, `
    <article class="paperdoc propdoc"><div class="dh"><div><div class="eyebrow">Contrato de prestação de serviços</div><h2>${esc(p.service)}</h2></div>${brandMark}</div>
    <p><b>Contratante:</b> ${esc(c.name)}, representada por ${esc(c.contact)}${c.role ? ' (' + esc(c.role) + ')' : ''}.<br><b>Contratada:</b> Ômega Gestão &amp; Pessoas, representada por Raffaella.</p>
    <h4>Cláusula 1 · Objeto</h4><p>${esc(p.scope)}${p.role ? ' Cargo ou tema: ' + esc(p.role) + '.' : ''}</p>
    <h4>Cláusula 2 · Valor</h4><p>${p.qty} × ${money(p.value)} ${p.unit}, total de ${money(p.value * p.qty)}.</p>
    <h4>Cláusula 3 · Pagamento</h4><p>${esc(p.conditions)}</p>
    <h4>Cláusula 4 · Origem</h4><p>Criado a partir da proposta aceita em ${dY(p.date)} (versão ${p.versions.length}).</p>
    <div class="sign"><span>Raffaella · Ômega</span><span>${esc(c.contact)} · ${esc(c.name)}</span></div></article>
    <div class="mactions">${btn('Imprimir', 'print', '', 'print')}${p.contract.status !== 'assinado' ? btn('Marcar como assinado (teste)', 'signcontract', 'pri', 'check', `data-id="${p.id}"`) : ''}</div>`);
}

// ── Relatórios ──────────────────────────────────────────────────────────────
let rep = { client: 'amorim', period: '6' };
function relatorios() {
  return head('Relatórios', 'Os números do negócio, sempre atualizados.', 'Ao fechar uma vaga, por exemplo, a mudança aparece no quadro, no histórico do cliente e aqui, sem ninguém atualizar planilha.',
    btn('Imprimir', 'print', '', 'print'))
  + tabbar('relatorios', [['indicadores', 'Números do negócio'], ['cliente', 'Relatório do cliente']])
  + `<div id="results">${tabs.relatorios === 'cliente' ? reportClient() : indicators()}</div>`;
}
const barList = rows => { const max = Math.max(1, ...rows.map(r => r[1])); return `<div class="bars">${rows.map(([l, n, sub]) => `<div class="bar"><span>${l}</span><i><em style="width:${n / max * 100}%"></em></i><b>${sub ?? n}</b></div>`).join('')}</div>` };
function indicators() {
  const s = stats();
  const evM = state.events.filter(e => e.date.startsWith(month));
  const year = state.proposals.filter(p => p.date.startsWith('2026'));
  const sumv = arr => arr.reduce((t, p) => t + p.value * p.qty, 0);
  const openY = year.filter(p => ['enviada', 'negociacao', 'rascunho'].includes(p.status));
  const okY = year.filter(p => p.status === 'aprovada'); const noY = year.filter(p => p.status === 'recusada');
  const active = state.clients.filter(c => c.stage !== 'inativo');
  const conv = Math.round(state.clients.filter(c => c.stage === 'cliente').length / Math.max(1, active.length) * 100);
  const card = (n, title, sub, body) => `<section class="card rcard"><div class="chead"><div><span class="rn">${n}</span><h2>${title}</h2><p>${sub}</p></div></div><div class="rbody">${body}</div></section>`;
  return `<div class="rgrid">
    ${card('01', 'Recrutamento', 'Vagas por etapa, agora', barList(JOBST.map(([k, l]) => [l, state.jobs.filter(j => j.stage === k).length])) + `<p class="rfoot">${s.pend.length} esperando resposta · ${s.closedM.length} fechadas em outubro · ${money(s.value)}</p>`)}
    ${card('02', 'Candidatos', 'Currículos e etapas de seleção', barList(CANDST.map(([k, l]) => [l, state.candidates.filter(c => c.status === k).length])) + `<p class="rfoot">${state.candidates.length} currículos · ${state.candidates.filter(c => c.origin === 'whatsapp').length} pelo WhatsApp</p>`)}
    ${card('03', 'Consultoria', 'Outubro de 2026', barList([['Marcados', evM.length], ['Aconteceram', evM.filter(e => e.status === 'realizado').length], ['Cliente faltou', evM.filter(e => e.status === 'falta').length], ['Cancelados', evM.filter(e => e.status === 'cancelado').length], ['Marcados pelo link', evM.filter(e => e.origin === 'link').length]]))}
    ${card('04', 'Clientes e contatos', 'Empresas em cada etapa', barList([...CRMST.map(([k, l]) => [l, state.clients.filter(c => c.stage === k).length]), ['Não fecharam', state.clients.filter(c => c.stage === 'perdido').length]]) + `<p class="rfoot">De cada 10 contatos, ${Math.round(conv / 10)} viraram clientes · ${state.clients.filter(c => c.stage === 'cliente').length} clientes hoje</p>`)}
    ${card('05', 'Comercial', 'Propostas de 2026', barList([['Total oferecido', sumv(year), money(sumv(year))], ['Aceito', sumv(okY), money(sumv(okY))], ['Esperando resposta', sumv(openY), money(sumv(openY))], ['Não aceito', sumv(noY), money(sumv(noY))]]) + `<p class="rfoot"><button class="link" data-act="goto" data-view="crm" data-tab="precos">Quanto já cobrei${ic('arrow')}</button></p>`)}
    ${card('06', 'O que está parado', 'Coisas esperando alguém agir', barList([['Encontros sem relato', state.events.filter(e => e.status === 'aguardando').length], ['Vagas esperando resposta', s.pend.length], ['Currículos sem análise', state.candidates.filter(c => c.status === 'recebido').length], ['Propostas sem resposta', state.proposals.filter(p => p.status === 'enviada' && daysBetween(p.date, TODAY) >= 3).length], ['Clientes sem contato', state.clients.filter(c => c.stage === 'inativo').length]]))}
  </div>`;
}
function reportClient() {
  const c = client(rep.client);
  const from = new Date(TODAY + 'T12:00:00'); from.setMonth(from.getMonth() - (+rep.period - 1)); from.setDate(1);
  const a = from.toISOString().slice(0, 10);
  const ev = clientTimeline(c.id, a, TODAY).filter(e => e.k !== 'note' && e.k !== 'prop');
  const evs = state.events.filter(e => e.client === c.id && e.date >= a && e.date <= TODAY);
  const tools = [...new Set(evs.map(e => e.tool || e.material).filter(Boolean))];
  return `<div class="reportwrap"><section class="card rform"><h2>Relatório do cliente</h2>
    <label>Cliente<select data-rep="client">${clientOptions(rep.client, false, x => x.stage === 'cliente' || x.stage === 'inativo')}</select></label>
    <label>Período<select data-rep="period">${[['1', 'Este mês'], ['3', 'Últimos 3 meses'], ['6', 'Últimos 6 meses'], ['12', 'Últimos 12 meses']].map(([v, l]) => `<option value="${v}" ${rep.period === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label>
    ${btn('Imprimir ou salvar PDF', 'print', 'pri', 'print')}${btn('Pedir pelo WhatsApp', 'play', 'wa', 'chat', 'data-scene="relatorio"')}</section>
    <article class="paperdoc"><div class="dh"><div><div class="eyebrow">Relatório de atividades</div><h2>${esc(c.name)}</h2><span class="dsub">${from.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })} a outubro de 2026</span></div>${brandMark}</div>
    <div class="dsum"><div><b>${evs.filter(e => e.status === 'realizado').length}</b>encontros</div><div><b>${evs.filter(e => e.status === 'falta').length}</b>faltas</div><div><b>${state.jobs.filter(j => j.client === c.id && j.created >= a).length}</b>vagas</div><div><b>${state.candidates.filter(x => jobOf(x.job)?.client === c.id && x.date >= a).length}</b>candidatos</div></div>
    <h4>Ferramentas aplicadas</h4><div class="chips">${tools.map(t => `<span class="chip">${esc(t)}</span>`).join('') || '<span class="chip">Nenhuma no período</span>'}</div>
    <h4>Linha do tempo</h4>${timelineHtml(ev)}
    <p style="margin-top:32px;font-size:11px;color:var(--soft)">Gerado pelo Sistema Ômega em ${dY(TODAY)} · documento de demonstração</p></article></div>`;
}

// ── Automações ──────────────────────────────────────────────────────────────
function automacoes() {
  const track = [['Sempre', 'Assistente e currículos', 'done'], ['Quando chega', 'Briefing e agendamento', 'done'], ['7h30', 'Agenda do dia', 'done'], ['Fim do encontro', 'Pergunta pós-encontro', 'done'], ['18h', 'Lembretes e confirmações', ''], ['Dia 1', 'Resumo do mês', '']];
  return head('Tarefas automáticas', 'A rotina que anda sozinha.', 'O que o sistema faz sozinho: mensagens, lembretes e avisos no WhatsApp. Tudo também pode ser feito à mão.')
  + `<section class="daybar"><div class="eyebrow">Um dia da Ômega</div><h2>Ninguém precisa lembrar de perguntar.</h2><div class="track">${track.map(([t, b, c]) => `<div class="tk ${c}"><span>${t}</span><b>${b}</b></div>`).join('')}</div></section>
    <div class="flows">${FLOWS.map(f => { const off = state.flowsOff[f.id]; return `<section class="card flow">
        <div class="ft"><div><h3>${f.name}</h3><div class="when">${f.when}</div></div><button class="toggle ${off ? 'off' : ''}" data-act="flow" data-id="${f.id}" aria-pressed="${!off}">${off ? '○ Desligada' : '● Ligada'}</button></div>
        <p>${f.desc}</p><div class="route">${f.steps.map((s, i) => `${i ? '<i>→</i>' : ''}<span>${s}</span>`).join('')}</div>
        ${f.sample ? `<div class="sample"><small>Mensagem no WhatsApp</small>${esc(f.sample)}</div>` : ''}
        <div class="ff"><span>Última vez: ${f.last}</span>${f.scene ? `<button class="link" data-act="play" data-scene="${f.scene}">Ver na conversa${ic('arrow')}</button>` : f.id === 'briefing' ? `<button class="link" data-act="openbrief">Abrir o formulário${ic('arrow')}</button>` : f.id === 'agendamento' ? `<button class="link" data-act="openbook">Abrir o link${ic('arrow')}</button>` : ''}</div>
      </section>` }).join('')}</div>`;
}

// ── Biblioteca ──────────────────────────────────────────────────────────────
const CATS = ['RH', 'Recrutamento', 'Briefing', 'Testes', 'Treinamentos'];
function biblioteca() {
  return head('Biblioteca', 'A ferramenta certa, na hora.', 'PDFs e testes da Ômega por categoria, prontos para achar, imprimir ou mandar.', btn('Adicionar ferramenta', 'form', 'pri', 'plus', 'data-form="ferramenta"'))
  + `<div class="ask">${ic('chat')}<span>Pelo WhatsApp: <q>me manda a roda de competências</q> e o PDF chega pronto para imprimir.</span></div>
    <div class="toolbar"><div class="cats">${['', ...CATS].map(c => `<button class="${F.cat === c ? 'on' : ''}" data-act="cat" data-k="${c}">${c || 'Todas'}</button>`).join('')}</div></div>
    <div class="grid3">${state.tools.filter(t => !F.cat || t.cat === F.cat).map(t => `<div class="card doc${isFlash(t.id)}"><span class="dt"><span class="pdf">PDF</span>${orig(t.origin)}</span><span><span class="cli">${t.cat}</span><h3>${esc(t.name)}</h3></span><p>${esc(t.desc)}</p><span class="df"><span>${t.pages} páginas · usada ${t.uses}x</span>${btn('Imprimir', 'demo', 'sm', 'print', 'data-msg="Na versão final, abre o PDF para imprimir."')}</span></div>`).join('')}</div>`;
}

// ── Configurações ───────────────────────────────────────────────────────────
function configuracoes() {
  return head('Configurações', 'Quem usa o sistema e como ele funciona.', 'Quem pode ver e mudar cada parte, os textos prontos, os horários do agendamento e o jeito do assistente do WhatsApp.')
  + tabbar('configuracoes', [['usuarios', 'Quem acessa'], ['modelos', 'Textos prontos'], ['agenda', 'Horários do agendamento'], ['formulario', 'Formulário de briefing'], ['agente', 'Assistente do WhatsApp']])
  + `<div id="results">${({ usuarios: cfgUsers, modelos: () => templateCards(['proposta', 'contrato', 'mensagem']), agenda: cfgAgenda, formulario: cfgForm, agente: cfgAgent })[tabs.configuracoes]()}</div>`;
}
function cfgUsers() {
  const mods = [['crm', 'Clientes'], ['recrutamento', 'Vagas'], ['agenda', 'Agenda'], ['propostas', 'Propostas'], ['relatorios', 'Relatórios'], ['valores', 'Vê valores']];
  const cell = v => `<span class="tag t-${v === 'Editar' || v === 'Sim' ? 'ok' : v === 'Ver' ? 'blue' : 'warn'}">${{ Editar: 'Vê e muda', Ver: 'Só vê' }[v] || v}</span>`;
  return `<div class="card tbl"><table><thead><tr><th>Pessoa</th><th>WhatsApp</th>${mods.map(m => `<th>${m[1]}</th>`).join('')}</tr></thead><tbody style="cursor:default">
  ${window.OMEGA_TEAM.map(p => `<tr><td><b>${p.name}</b><small>${p.role}</small></td><td>${p.phone}<small>verificado</small></td>${mods.map(m => `<td>${cell(p.perms[m[0]])}</td>`).join('')}</tr>`).join('')}
  </tbody></table></div><div class="acts" style="margin-top:14px">${btn('Convidar uma pessoa', 'demo', '', 'plus', 'data-msg="Convites entram com o banco de dados, na próxima fase."')}</div>`;
}
function cfgAgenda() {
  return `<div class="grid2"><section class="card pad"><h2>Horários que o cliente pode escolher</h2><p class="explain" style="margin:0">O link só mostra os horários livres dentro destes dias e horas.</p>
    <div class="chips">${['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map(x => `<span class="chip on">${x}</span>`).join('')}<span class="chip">Sáb</span></div>
    <div class="chips">${window.OMEGA_SLOTS.map(s => `<span class="chip on">${hr(s)}</span>`).join('')}</div>
    <dl class="dl"><dt>Duração</dt><dd>1 hora (reunião) · 1h30 (consultoria)</dd><dt>Marcar com antecedência</dt><dd>De pelo menos 1 dia</dd><dt>Confirmação</dt><dd>WhatsApp para os dois lados</dd></dl></section>
    <section class="card formcard"><div class="eyebrow">Link para o cliente</div><h2>Agendamento pela internet</h2><p>O cliente escolhe data e horário. O compromisso entra na agenda junto com o cadastro dele.</p><div class="linkbox"><code>${esc(base())}agendar.html</code>${btn('Copiar', 'copylink', 'sm', 'copy', 'data-path="agendar.html"')}</div><div class="acts">${btn('Abrir e testar', 'openbook', 'pri', 'link')}</div></section></div>`;
}
function cfgForm() {
  return `<section class="card formcard"><div class="eyebrow">Formulário de briefing</div><h2>Perguntas enviadas às empresas</h2><p>As mesmas perguntas do Google Forms que a Ômega usava. Agora o formulário é do próprio sistema.</p>
    <ol class="qlist edit">${BRIEF.map(b => `<li><span>${esc(b.q)}</span><small>${b.opts ? 'Múltipla escolha: ' + b.opts.join(', ') : b.long ? 'Resposta longa' : 'Resposta curta'}${b.req ? ' · obrigatória' : ''}</small></li>`).join('')}</ol>
    <div class="acts">${btn('Abrir o formulário', 'openbrief', 'pri', 'form')}${btn('Adicionar pergunta', 'demo', '', 'plus', 'data-msg="Edição das perguntas entra na próxima fase."')}</div></section>`;
}
function cfgAgent() {
  const rules = [
    ['Número próprio da Ômega', 'O assistente atende num chip só da Ômega. A Raffaella conversa com ele como com um contato.'],
    ['Só a Raffaella e a secretária mexem nos dados', 'Qualquer outro número, como o de um candidato, só consegue mandar currículo.'],
    ['Áudio, texto ou arquivo', 'O áudio é transcrito. PDF vira currículo da vaga ou ferramenta da biblioteca.'],
    ['Completa com o histórico', 'Usa vagas, preços e encontros anteriores para perguntar só o que falta.'],
    ['Só grava depois do "confirmo"', 'Quem mandou confirma o resumo ali mesmo. Sem confirmação, nada entra.'],
    ['"Desfazer" volta a última ação', 'Errou o cliente ou a vaga? Um "desfazer" restaura como estava.'],
    ['Tudo fica no histórico', 'Cada registro guarda quem fez, quando e por onde entrou.'],
    ['Dá para fazer tudo à mão', 'O que é automático também pode ser feito à mão, aqui no sistema.'],
  ];
  return `<section class="card"><div class="rules">${rules.map((r, i) => `<div class="rule"><span class="n">${String(i + 1).padStart(2, '0')}</span><span><b>${r[0]}</b><p>${r[1]}</p></span></div>`).join('')}</div></section>
    <section class="card pad row2" style="margin-top:20px"><div><h2>Reiniciar a demonstração</h2><p class="explain" style="margin:4px 0 0">Volta todos os dados de exemplo ao início, só neste navegador.</p></div>${btn('Reiniciar', 'reset', '', 'undo')}</section>`;
}

const PAGES = { inicio, agente, crm, recrutamento, agenda, propostas, relatorios, automacoes, biblioteca, configuracoes };

// ── Camadas ─────────────────────────────────────────────────────────────────
let lastFocus = null;
function openLayer(html) {
  lastFocus = document.activeElement;
  $('#layer').innerHTML = `<div class="scrim" data-act="close"></div>${html}`;
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('#layer .x')?.focus(), 30);
}
function drawer(title, body, cls = '') {
  openLayer(`<aside class="drawer ${cls}" role="dialog" aria-modal="true"><div class="dhead">${title}<button class="x" data-act="close" aria-label="Fechar">${ic('x')}</button></div><div class="dbody">${body}</div></aside>`);
}
function modal(title, body, cls = '') {
  openLayer(`<section class="modal ${cls}" role="dialog" aria-modal="true">${title ? `<div class="dhead"><h2>${title}</h2><button class="x" data-act="close" aria-label="Fechar">${ic('x')}</button></div>` : ''}<div class="dbody">${body}</div></section>`);
}
function closeLayer() { playToken++; $('#layer').innerHTML = ''; document.body.style.overflow = ''; lastFocus?.focus?.() }
let toastT;
let undoFn = null;
function toast(text, action, undo) {
  clearTimeout(toastT);
  undoFn = undo || null;
  $('#toast').innerHTML = `<div class="toast"><span>${esc(text)}</span>${undo ? '<button data-act="undo">Desfazer</button>' : ''}${action ? `<button data-act="toastgo" data-view="${action.view}" data-id="${action.id || ''}" data-tab="${action.tab || ''}">${action.label}</button>` : ''}</div>`;
  toastT = setTimeout(() => $('#toast').innerHTML = '', 8000);
}
// Atualiza a página de fundo sem fechar a gaveta aberta.
function refresh() { renderNav(); if (view !== 'agente') { const y = window.scrollY; $('#page').innerHTML = PAGES[view]() + FOOT; scrollTo(0, y) } }

// ── WhatsApp encenado ───────────────────────────────────────────────────────
function mountPhone(el, scenes, autoplay) {
  el.innerHTML = `<div class="ph-top"><span class="av">Ω</span><span><b>Assistente Ômega</b><small><span class="live"></span>online · número da Ômega</small></span></div>
    <div class="chat" id="chat"><span class="day-sep">Hoje</span><div class="msg bot"><span class="who">Assistente Ômega</span>Oi, Rafa. Pode mandar áudio ou texto: vaga, candidato, cliente, proposta, agenda ou uma pergunta sobre os números.<span class="meta">08:00</span></div></div>
    <div class="ph-foot"><p>Toque numa conversa para ver</p><div class="scenes">${scenes.map(s => `<button data-act="play" data-scene="${s.id}">${esc(s.title)}</button>`).join('')}</div><div class="inputbar">Mensagem<span class="mic">${ic('mic')}</span></div></div>`;
  if (autoplay) play(autoplay);
}
function openChat(module, sceneId) {
  const scenes = module ? SCENES.filter(s => s.module === module) : SCENES;
  openLayer(`<aside class="drawer chatd" role="dialog" aria-modal="true" aria-label="Conversa com o assistente"><div class="phone" id="drawerPhone"></div><button class="x" data-act="close" aria-label="Fechar">${ic('x')}</button></aside>`);
  mountPhone($('#drawerPhone'), scenes.length ? scenes : SCENES, sceneId);
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clock = (() => { let m = 16 * 60 + 40; return () => { m++; return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}` } })();
const wave = () => Array.from({ length: 28 }, () => `<i style="height:${30 + Math.round(Math.random() * 70)}%"></i>`).join('');
function bubble(m, scene) {
  const who = m.from === 'me' ? (scene.who || 'Raffaella') : (m.auto ? 'Aviso automático' : 'Assistente Ômega');
  let inner;
  if (m.type === 'audio') inner = `<div class="audio"><span class="play">${ic('play')}</span><span class="wave">${wave()}</span><small>${m.dur}</small></div><div class="trans"><b>Transcrição</b>${esc(m.text)}</div>`;
  else if (m.type === 'file') inner = `<div class="file"><span class="pdf">PDF</span><span><b>${esc(m.name)}</b><small>${m.size}</small></span></div>${esc(m.text || '')}`;
  else if (m.type === 'card') inner = `<div class="mcard"><div class="mh">${esc(m.title)}</div>${m.rows.map(r => `<div class="mr"><span>${esc(r[0])}</span><b>${esc(r[1])}</b></div>`).join('')}</div>${esc(m.ask)}`;
  else if (m.type === 'summary') { const s = stats(); inner = `Outubro até agora:<br>• ${s.active.length} vagas em andamento, ${s.pend.length} esperando resposta<br>• ${s.closedM.length} fechadas (${money(s.value)})<br>• ${s.candM.length} currículos recebidos<br>• ${s.done.length} encontros, ${s.miss.length} falta do cliente<br>• ${s.open.length} propostas em aberto (${money(s.openValue)})` }
  else if (m.type === 'prices') { const r = priceRows(m.role); inner = `Encontrei ${r.length} propostas para ${esc(m.role)}:<br>${r.map(p => `• ${dY(p.date)} · ${esc(cname(p.client))}: ${money(p.value)} (${PROPL[p.status].toLowerCase()})`).join('<br>')}` }
  else inner = esc(m.text);
  const link = m.link ? `<br><button class="lk" data-act="scenego" data-scene="${scene.id}">${esc(m.link)} →</button>` : '';
  return `<div class="msg ${m.from === 'me' ? 'me' : 'bot'} ${m.auto ? 'auto' : ''}">${m.from === 'bot' || scene.who ? `<span class="who">${who}</span>` : ''}${inner}${link}<span class="meta">${clock()}${m.from === 'me' ? ' ✓✓' : ''}</span></div>`;
}
async function play(id) {
  const scene = SCENES.find(s => s.id === id);
  const chat = document.getElementById('chat');
  if (!scene || !chat) return;
  const token = ++playToken;
  document.querySelectorAll('.scenes button').forEach(b => b.disabled = true);
  document.querySelectorAll('.scene').forEach(b => b.classList.toggle('on', b.dataset.scene === id));
  chat.insertAdjacentHTML('beforeend', `<span class="day-sep">${esc(scene.who === 'Candidato' ? 'Conversa com um candidato' : scene.title)}</span>`);
  chat.scrollTop = chat.scrollHeight;
  for (const m of scene.msgs) {
    if (token !== playToken) return;
    if (m.from === 'bot') {
      chat.insertAdjacentHTML('beforeend', '<div class="typing" aria-hidden="true"><i></i><i></i><i></i></div>');
      chat.scrollTop = chat.scrollHeight;
      await sleep(['summary', 'prices'].includes(m.type) ? 1300 : 900);
      if (token !== playToken) return;
      chat.querySelector('.typing')?.remove();
    } else await sleep(m.type === 'audio' ? 900 : 650);
    chat.insertAdjacentHTML('beforeend', bubble(m, scene));
    chat.scrollTop = chat.scrollHeight;
    await sleep(m.type === 'card' ? 1300 : 600);
  }
  if (token !== playToken) return;
  document.querySelectorAll('.scenes button').forEach(b => b.disabled = false);
  const t = applyScene(scene);
  if (t) { refresh(); toast(t.msg, { view: t.view, id: t.id, tab: t.tab, label: 'Ver no sistema' }) }
}
const TARGET = {
  'nova-vaga': ['recrutamento', 'jn1', 'vagas'], candidato: ['recrutamento', 'cn1', 'candidatos'], 'fechar-vaga': ['recrutamento', 'v1', 'vagas'], briefing: ['recrutamento', null, 'briefings'],
  preco: ['propostas', 'p3', 'propostas'], 'novo-lead': ['crm', 'bemestar', 'funil'], 'pos-encontro': ['agenda', 'e1', 'atendimentos'], remarcar: ['agenda', 'e12', 'calendario'],
  consulta: ['inicio'], relatorio: ['relatorios', null, 'cliente'],
};
function applyScene(scene) {
  const [v, id, tab] = TARGET[scene.id];
  if (!scene.apply) return null;
  if (state.applied[scene.id]) return { view: v, id, tab, msg: 'Esta conversa já foi salva antes.' };
  const who = scene.who || 'Raffaella';
  const A = {
    newJob() { state.jobs.unshift({ id: 'jn1', title: 'Auxiliar administrativo', client: 'amorim', qty: 2, fee: 1500, stage: 'abertas', created: TODAY, origin: 'whatsapp', brief: { motivo: 'Expansão', remuneracao: 'R$ 1.800', horario: 'Seg a sex, 8h às 18h', modelo: 'Presencial', exige: 'Execução', primeiroDia: 'Excel e rotina de escritório' }, history: [[TODAY, 'Vaga aberta por áudio no WhatsApp', 'Raffaella']] }); log('Abriu por áudio a vaga Auxiliar administrativo · Amorim', 'recrutamento', 'whatsapp'); return 'Vaga criada pelo WhatsApp.' },
    newCandidate() { state.candidates.unshift({ id: 'cn1', name: 'Renata Campos', job: 'v3', origin: 'whatsapp', status: 'recebido', rating: 0, city: 'Petrolina', phone: '(87) 98444-1010', date: TODAY, notes: 'Viu a vaga no Instagram.', evals: [] }); jobOf('v3').history.push([TODAY, 'Currículo de Renata Campos recebido pelo WhatsApp', 'Assistente']); log('Renata Campos mandou currículo para Vendedor interno', 'recrutamento', 'whatsapp', 'Candidato'); done('wa'); return 'Candidata recebida pelo WhatsApp.' },
    closeJob() { closeJob('v1', 'c1'); return 'Vaga fechada. Quadro, cliente e relatório atualizados.' },
    sendBrief() { state.interactions.unshift({ client: 'horizonte', date: TODAY, kind: 'WhatsApp', who, text: 'Formulário de briefing enviado para Rodrigo.' }); log('Enviou o formulário de briefing para a Construtora Horizonte', 'crm', 'whatsapp'); return 'Formulário de briefing enviado.' },
    newLead() { state.clients.push({ id: 'bemestar', name: 'Farmácia Bem Estar', segment: 'Farmácia', stage: 'lead', contact: 'Lúcia', role: 'Gerente', phone: '(87) 99300-1212', email: '', services: [], since: TODAY, origin: 'whatsapp', meetingDay: '', lastContact: TODAY, potential: 3000, people: [['Lúcia', 'Gerente']] }); state.interactions.unshift({ client: 'bemestar', date: TODAY, kind: 'WhatsApp', who, text: 'Interesse em treinamento de atendimento. Link de agendamento enviado.' }); log('Anotou o contato Farmácia Bem Estar', 'crm', 'whatsapp'); return 'Contato criado.' },
    confirmMeeting() { Object.assign(state.events.find(x => x.id === 'e1'), { status: 'realizado', topic: 'Feedback com os líderes', summary: 'Comparação da roda de competências com o mês anterior.', tool: 'Roda de competências', next: 'Plano de ação individual de cada líder.', origin: 'whatsapp', transcript: scene.msgs[1].text }); log('Contou por áudio como foi o encontro na Amorim', 'agenda', 'whatsapp'); done('atendimento'); return 'Encontro salvo.' },
    reschedule() { Object.assign(state.events.find(x => x.id === 'e12'), { date: '2026-11-03', status: 'confirmado' }); log('Remarcou a DEDARC para 03/11, 14h', 'agenda', 'whatsapp'); cal.y = 2026; cal.m = 10; return 'Encontro remarcado.' },
  };
  const msg = A[scene.apply]();
  state.applied[scene.id] = true; save();
  return { view: v, id, tab, msg };
}

// ── Operações compartilhadas ────────────────────────────────────────────────
function moveJob(j, stage) {
  if (j.stage === stage) return false;
  if (stage === 'fechadas') { closeAsk(j.id); return false }
  j.stage = stage; delete j.isNew;
  j.history = j.history || []; j.history.push([TODAY, 'Movida para ' + JOBL[stage], 'Raffaella']);
  log(`Moveu ${j.title} · ${cname(j.client)} para ${JOBL[stage]}`, 'recrutamento');
  done('vaga'); save();
  return true;
}
function closeJob(id, candId) {
  const j = jobOf(id); const c = state.candidates.find(x => x.id === candId);
  Object.assign(j, { stage: 'fechadas', closed: TODAY, hired: c?.name || 'A informar' }); delete j.flag; delete j.isNew;
  state.candidates.filter(x => x.job === id).forEach(x => { x.status = x.id === candId ? 'aprovado' : x.status === 'aprovado' ? x.status : 'reprovado' });
  j.history = j.history || []; j.history.push([TODAY, 'Fechada · ' + j.hired + ' contratado(a)', 'Raffaella']);
  client(j.client).lastContact = TODAY;
  log(`Fechou a vaga ${j.title} · ${cname(j.client)}`, 'recrutamento'); done('vaga'); save();
}
function closeAsk(id) {
  const j = jobOf(id); const cs = state.candidates.filter(c => c.job === id && c.status !== 'reprovado');
  modal('Fechar vaga', `<form id="closeform" data-id="${id}" style="display:grid;gap:12px"><p style="margin:0">Quem foi contratado(a) para <b>${esc(j.title)}</b>? Os outros candidatos ficam como não selecionados.</p><label class="field">Contratado(a)<select name="cand">${cs.map(c => `<option value="${c.id}">${esc(c.name)} · ${CANDL[c.status]}</option>`).join('')}<option value="">Outra pessoa / informar depois</option></select></label>
    <p class="explain" style="margin:0">Ao fechar, a mudança aparece no quadro, no histórico de ${esc(cname(j.client))} e nos relatórios.</p><div class="mactions"><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${ic('check')}Fechar vaga</button></div></form>`);
}

// ── Formulários manuais ─────────────────────────────────────────────────────
const FORMS = {
  vaga: { title: 'Nova vaga', fields: [['client', 'Cliente', 'client'], ['title', 'Nome da vaga', 'text', 'Ex.: Analista de RH', 1], ['qty', 'Quantidade de vagas', 'number', '1'], ['fee', 'Quanto a Ômega cobra por vaga (R$)', 'number'], ['remuneracao', 'Salário e benefícios', 'text', 'Ex.: R$ 1.800 + vale-transporte'], ['modelo', 'Onde a pessoa vai trabalhar', 'sel', ['Presencial', 'Híbrida', 'Remota']]],
    save(v) { const id = uid('j'); state.jobs.unshift({ id, title: v.title, client: v.client, qty: +v.qty || 1, fee: +v.fee || 0, stage: 'abertas', created: TODAY, origin: 'painel', brief: { remuneracao: v.remuneracao, modelo: v.modelo }, history: [[TODAY, 'Vaga cadastrada no sistema', 'Raffaella']] }); done('vaga'); return ['recrutamento', id, 'Vaga criada. Quando ela avançar, arraste o cartão para a próxima coluna.', 'vagas'] } },
  candidato: { title: 'Adicionar currículo', fields: [['name', 'Nome', 'text', '', 1], ['job', 'Vaga', 'job'], ['origin', 'Como o currículo chegou', 'sel', [['email', 'E-mail'], ['indicacao', 'Indicação'], ['site', 'Anúncio'], ['painel', 'Outro']]], ['city', 'Cidade', 'text'], ['phone', 'Telefone', 'text'], ['cv', 'Arquivo do currículo', 'file'], ['notes', 'Observações', 'textarea']],
    save(v) { const id = uid('c'); state.candidates.unshift({ id, name: v.name, job: v.job, origin: v.origin, status: 'recebido', rating: 0, city: v.city || '—', phone: v.phone || '—', date: TODAY, notes: v.notes, evals: [] }); const j = jobOf(v.job); j.history = j.history || []; j.history.push([TODAY, 'Currículo de ' + v.name + ' adicionado', 'Raffaella']); done('cv'); return ['recrutamento', id, 'Currículo adicionado e ligado à vaga.', 'candidatos'] } },
  lead: { title: 'Novo contato', fields: [['name', 'Empresa', 'text', '', 1], ['contact', 'Contato', 'text'], ['phone', 'WhatsApp', 'text'], ['segment', 'Ramo da empresa', 'text'], ['stage', 'Em que etapa está', 'sel', CRMST], ['note', 'O que a empresa quer', 'textarea']],
    save(v) { const id = uid('cl'); state.clients.push({ id, name: v.name, contact: v.contact || '—', role: '', phone: v.phone, email: '', segment: v.segment || '—', stage: v.stage, services: [], since: TODAY, origin: 'painel', meetingDay: '', lastContact: TODAY, people: [[v.contact || '—', '']] }); if (v.note) state.interactions.unshift({ client: id, date: TODAY, kind: 'Nota', who: 'Raffaella', text: v.note }); return ['crm', id, 'Contato criado no CRM.', 'funil'] } },
  interacao: { title: 'Anotar uma conversa', fields: [['client', 'Empresa', 'client'], ['kind', 'Como foi a conversa', 'sel', ['Ligação', 'WhatsApp', 'Reunião', 'E-mail', 'Nota']], ['text', 'O que aconteceu', 'textarea', '', 1]],
    save(v) { state.interactions.unshift({ client: v.client, date: TODAY, kind: v.kind, who: 'Raffaella', text: v.text }); client(v.client).lastContact = TODAY; setTimeout(() => clientDrawer(v.client), 60); return ['crm', null, 'Conversa anotada no histórico.', tabs.crm] } },
  evento: { title: 'Novo agendamento', fields: [['type', 'O que vai ser', 'sel', Object.entries(EVTYPE)], ['client', 'Cliente', 'client'], ['date', 'Dia', 'date'], ['time', 'Começa às', 'time', '14:00'], ['end', 'Termina às', 'time', '15:30'], ['topic', 'Assunto', 'text']],
    save(v) { const id = uid('e'); state.events.push({ id, type: v.type, client: v.client, date: v.date, time: v.time, end: v.end, status: v.date < TODAY ? 'realizado' : 'agendado', origin: 'painel', topic: v.topic }); const [y, m] = v.date.split('-'); cal.y = +y; cal.m = +m - 1; done('atendimento'); return ['agenda', id, 'Compromisso salvo na agenda, junto com o histórico do cliente.', 'calendario'] } },
  relato: { title: 'Como foi o encontro?', fields: [['topic', 'Assunto (pauta)', 'text', '', 1], ['summary', 'O que foi feito / observações', 'textarea'], ['tool', 'Ferramenta aplicada', 'text'], ['next', 'Próximo passo', 'text']],
    save(v, id) { const e = state.events.find(x => x.id === id); Object.assign(e, v, { status: 'realizado' }); client(e.client).lastContact = TODAY; done('atendimento'); setTimeout(() => eventDrawer(id), 60); return ['agenda', null, 'Encontro salvo no histórico do cliente.', tabs.agenda] } },
  remarcar: { title: 'Remarcar', fields: [['date', 'Novo dia', 'date'], ['time', 'Começa às', 'time'], ['end', 'Termina às', 'time']],
    save(v, id) { const e = state.events.find(x => x.id === id); Object.assign(e, v, { status: 'agendado' }); const [y, m] = v.date.split('-'); cal.y = +y; cal.m = +m - 1; return ['agenda', id, 'Remarcado. O cliente recebe o aviso do novo horário.', 'calendario'] } },
  ferramenta: { title: 'Adicionar ferramenta', fields: [['name', 'Nome', 'text', '', 1], ['cat', 'Categoria', 'sel', CATS], ['desc', 'Para que serve', 'textarea']],
    save(v) { const id = uid('f'); state.tools.unshift({ id, name: v.name, cat: v.cat, pages: 1, added: TODAY, origin: 'painel', uses: 0, desc: v.desc }); return ['biblioteca', id, 'Ferramenta adicionada.'] } },
};
function openForm(kind, el) {
  const f = FORMS[kind]; const id = el?.dataset?.id || '';
  const cur = id ? (state.events.find(e => e.id === id) || {}) : {};
  const input = ([k, label, type, ph, req]) => {
    const val = esc(cur[k] ?? (type === 'date' ? (el?.dataset?.date || addDays(TODAY, 1)) : (type === 'time' || type === 'number' ? (ph || '') : '')));
    const opt = (o, sel) => Array.isArray(o) ? `<option value="${o[0]}" ${sel === o[0] ? 'selected' : ''}>${o[1]}</option>` : `<option ${sel === o ? 'selected' : ''}>${o}</option>`;
    const elx = type === 'client' ? `<select name="${k}">${clientOptions(el?.dataset?.client || cur.client || 'amorim', false)}</select>`
      : type === 'job' ? `<select name="${k}">${state.jobs.filter(j => j.stage !== 'fechadas').map(j => `<option value="${j.id}" ${el?.dataset?.job === j.id ? 'selected' : ''}>${esc(j.title)} · ${esc(cname(j.client))}</option>`).join('')}</select>`
      : type === 'sel' ? `<select name="${k}">${ph.map(o => opt(o, cur[k])).join('')}</select>`
      : type === 'textarea' ? `<textarea name="${k}" ${req ? 'required' : ''}>${val}</textarea>`
      : type === 'file' ? `<span class="fakefile">${ic('file')}<input type="file" name="${k}" accept=".pdf,.doc,.docx"></span>`
      : `<input name="${k}" type="${type}" value="${val}" placeholder="${type === 'text' ? esc(ph || '') : ''}" ${req ? 'required' : ''}>`;
    return `<label class="field">${label}${elx}</label>`;
  };
  modal(f.title, `<form id="mform" style="display:grid;gap:12px" data-kind="${kind}" data-id="${id}"><p class="explain" style="margin:0">Preencha o que souber. Isso também pode chegar sozinho pelo WhatsApp.</p>${f.fields.map(input).join('')}<div class="mactions"><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${ic('check')}Salvar</button></div></form>`);
}

document.addEventListener('submit', e => {
  const f = e.target;
  const stop = () => e.preventDefault();
  if (f.id === 'mform') {
    stop();
    const v = Object.fromEntries(new FormData(f)); delete v.cv;
    const [vw, id, msg, tab] = FORMS[f.dataset.kind].save(v, f.dataset.id || null);
    log(msg.split('.')[0] + (v.title || v.name ? ': ' + (v.title || v.name) : ''), vw);
    save(); closeLayer(); go(vw, id, tab); toast(msg);
  } else if (f.id === 'closeform') {
    stop(); const id = f.dataset.id; closeJob(id, new FormData(f).get('cand')); closeLayer(); go('recrutamento', id, 'vagas'); toast('Vaga fechada. O cliente e os relatórios foram atualizados.');
  } else if (f.id === 'flagform') {
    stop(); const j = jobOf(f.dataset.id); j.flag = new FormData(f).get('flag'); j.history.push([TODAY, 'Esperando resposta: ' + j.flag, 'Raffaella']); log(`${j.title} marcada como esperando resposta`, 'recrutamento'); save(); closeLayer(); jobDrawer(j.id); refresh(); toast('Vaga marcada como esperando resposta.');
  } else if (f.id === 'shareform') {
    stop(); const c = new FormData(f).get('c'); closeLayer(); openPage(f.dataset.path + '?c=' + c); toast(`Link aberto para ${cname(c)}. Preencha como se fosse o cliente e volte para esta aba.`);
  } else if (f.classList.contains('evalform')) {
    stop(); const c = state.candidates.find(x => x.id === f.dataset.id); const v = Object.fromEntries(new FormData(f));
    c.evals.push(['Raffaella', v.text, +v.score]); c.rating = Math.round(c.evals.reduce((s, x) => s + x[2], 0) / c.evals.length); if (['recebido', 'triagem'].includes(c.status)) c.status = 'avaliacao'; save(); candDrawer(c.id); refresh(); toast('Avaliação salva.');
  } else if (f.classList.contains('verform')) {
    stop(); const p = state.proposals.find(x => x.id === f.dataset.id); const v = Object.fromEntries(new FormData(f));
    p.versions.push([p.versions.length + 1, TODAY, +v.value, v.note]); p.value = +v.value; p.date = TODAY; if (p.status === 'enviada') p.status = 'negociacao';
    log(`Mudou o preço da proposta de ${cname(p.client)}: ${money(p.value)}`, 'propostas'); save(); proposalDrawer(p.id); refresh(); toast('Preço alterado. O valor anterior continua guardado.');
  }
});

// ── Ações ───────────────────────────────────────────────────────────────────
const openPage = path => window.open(path, '_blank');
const ACT = {
  close: closeLayer,
  undo: () => { const f = undoFn; undoFn = null; $('#toast').innerHTML = ''; if (f) { f(); save(); refresh(); toast('Pronto, voltou como estava.') } },
  chat: el => openChat(el.dataset.module),
  play: el => { const id = el.dataset.scene; if (document.getElementById('chat')) play(id); else openChat(SCENES.find(s => s.id === id).module, id) },
  scenego: el => { const [v, id, tab] = TARGET[el.dataset.scene]; closeLayer(); go(v, id, tab) },
  toastgo: el => { $('#toast').innerHTML = ''; closeLayer(); go(el.dataset.view, el.dataset.id || null, el.dataset.tab || null) },
  goto: el => { closeLayer(); go(el.dataset.view, null, el.dataset.tab) },
  tab: el => { tabs[el.dataset.page] = el.dataset.k; F.q = ''; F.status = ''; history.replaceState(null, '', '#' + el.dataset.page + '/' + el.dataset.k); render() },
  job: el => jobDrawer(el.dataset.id),
  cand: el => candDrawer(el.dataset.id),
  client: el => clientDrawer(el.dataset.id),
  event: el => eventDrawer(el.dataset.id),
  proposal: el => proposalDrawer(el.dataset.id),
  contract: el => contractView(el.dataset.id),
  form: el => openForm(el.dataset.form, el),
  newevent: el => openForm('evento', el),
  new: () => modal('O que você quer cadastrar?', `<p class="explain" style="margin:0">Tudo isto também pode chegar por áudio no WhatsApp.</p><div style="display:grid;gap:8px">${[['vaga', 'Nova vaga', 'briefcase'], ['candidato', 'Currículo de candidato', 'user'], ['evento', 'Agendamento', 'calendar'], ['lead', 'Empresa nova (contato)', 'building'], ['proposta', 'Proposta comercial', 'doc']].map(([k, l, i]) => `<button class="scene" data-act="${k === 'proposta' ? 'newproposal' : 'form'}" data-form="${k}"><span class="si">${ic(i)}</span><span><b>${l}</b></span><span class="go">${ic('arrow')}</span></button>`).join('')}</div>`),
  jobnext: el => { const j = jobOf(el.dataset.id); const i = JOBST.findIndex(x => x[0] === j.stage); if (moveJob(j, JOBST[i + 1][0])) { flashId = j.id; refresh(); flashId = null; toast(`${j.title} movida para ${JOBL[j.stage]}.`) } },
  jobstage: el => { const j = jobOf(el.dataset.id); if (moveJob(j, el.dataset.stage)) { jobDrawer(j.id); refresh(); toast(`Movida para ${JOBL[j.stage]}.`) } },
  jobflag: el => { const j = jobOf(el.dataset.id); if (j.flag) { delete j.flag; j.history.push([TODAY, 'Resposta recebida', 'Raffaella']); save(); jobDrawer(j.id); refresh() } else modal('Esperando resposta', `<form id="flagform" data-id="${j.id}" style="display:grid;gap:12px"><label class="field">Esperando o quê?<input name="flag" required placeholder="Ex.: retorno do cliente sobre os finalistas"></label><p class="explain" style="margin:0">A vaga continua em ${JOBL[j.stage]}. O aviso aparece no cartão e na tela inicial.</p><div class="mactions"><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${ic('pause')}Salvar</button></div></form>`) },
  jobclose: el => closeAsk(el.dataset.id),
  jobdup: el => { const o = jobOf(el.dataset.id); const id = uid('j'); state.jobs.unshift({ ...structuredClone(o), id, stage: 'abertas', created: TODAY, closed: null, hired: null, flag: null, isNew: false, origin: 'painel', history: [[TODAY, `Copiada de ${o.title} (${dY(o.created)}). O processo anterior foi preservado.`, 'Raffaella']] }); log(`Copiou a vaga ${o.title} · ${cname(o.client)}`, 'recrutamento'); save(); closeLayer(); go('recrutamento', id, 'vagas'); toast('Vaga copiada com o mesmo cargo, descrição e requisitos.') },
  candstage: el => { const c = state.candidates.find(x => x.id === el.dataset.id); if (el.dataset.stage === 'aprovado') { closeLayer(); return closeAsk(c.job) } c.status = el.dataset.stage; save(); candDrawer(c.id); refresh(); toast(`${c.name}: ${CANDL[c.status]}.`) },
  pendf: () => { F.pend = !F.pend; $('#results').innerHTML = jobBoard() },
  crmstage: el => { const c = client(el.dataset.id); c.stage = el.dataset.stage; c.lastContact = TODAY; if (c.stage !== 'perdido') delete c.lostReason; log(`${c.name} foi para ${CRML[c.stage]}`, 'crm'); save(); closeLayer(); go('crm', c.id, 'funil'); toast(`${c.name} agora está em ${CRML[c.stage]}.`) },
  pricechip: el => { F.price = el.dataset.k; done('preco'); $('#results').innerHTML = priceSearch() },
  evseg: el => { F.ev = el.dataset.k; $('#results').innerHTML = evTable() },
  evstatus: el => { const e = state.events.find(x => x.id === el.dataset.id); e.status = el.dataset.k; if (e.status === 'falta') e.summary = e.summary || 'Cliente não compareceu.'; log(`${EVTYPE[e.type]} · ${cname(e.client)}: ${EVL[e.status]}`, 'agenda'); save(); eventDrawer(e.id); refresh(); toast(`Registrado: ${EVL[e.status]}. O histórico do cliente foi atualizado.`) },
  calprev: () => { if (cal.mode === 'mes') { cal.m--; if (cal.m < 0) { cal.m = 11; cal.y-- } } else cal.w--; $('#results').innerHTML = calendar() },
  calnext: () => { if (cal.mode === 'mes') { cal.m++; if (cal.m > 11) { cal.m = 0; cal.y++ } } else cal.w++; $('#results').innerHTML = calendar() },
  caltoday: () => { cal.y = 2026; cal.m = 9; cal.w = 0; $('#results').innerHTML = calendar() },
  calmode: el => { cal.mode = el.dataset.k; $('#results').innerHTML = calendar() },
  propf: el => { F.status = F.status === el.dataset.k ? '' : el.dataset.k; $('#results').innerHTML = propTable() },
  newproposal: el => proposalEditor({ client: el.dataset.client, tpl: el.dataset.tpl }),
  saveprop: el => { const p = formProposal(); if (!p.value) return toast('Informe o valor da proposta.'); const id = uid('p'); state.proposals.unshift({ id, ...p, status: el.dataset.k, date: TODAY, versions: [[1, TODAY, p.value, 'Proposta inicial']], contract: null }); const c = client(p.client); if (['lead', 'qualificacao'].includes(c.stage)) c.stage = 'proposta'; c.lastContact = TODAY; log(`${el.dataset.k === 'enviada' ? 'Enviou' : 'Salvou'} proposta para ${c.name}: ${money(p.value)}`, 'propostas'); done('proposta'); save(); closeLayer(); F.status = ''; go('propostas', id, 'propostas'); toast(el.dataset.k === 'enviada' ? 'Proposta salva como enviada. A etapa do cliente foi atualizada.' : 'Proposta salva, ainda sem enviar.') },
  propstage: el => { const p = state.proposals.find(x => x.id === el.dataset.id); p.status = el.dataset.stage; const c = client(p.client); if (p.status === 'aprovada') { c.stage = 'cliente'; const sv = p.service.split(' ')[0]; if (!c.services.includes(sv)) c.services.push(sv) } if (p.status === 'negociacao' && ['lead', 'qualificacao', 'proposta'].includes(c.stage)) c.stage = 'negociacao'; c.lastContact = TODAY; log(`Proposta de ${c.name}: ${PROPL[p.status]}`, 'propostas'); save(); proposalDrawer(p.id); refresh(); toast(p.status === 'aprovada' ? 'Aceita! A empresa virou cliente e já dá para criar o contrato.' : `Proposta ${PROPL[p.status].toLowerCase()}.`) },
  mkcontract: el => { const p = state.proposals.find(x => x.id === el.dataset.id); p.contract = { status: 'gerado', date: TODAY }; log(`Gerou o contrato de ${cname(p.client)}`, 'propostas'); save(); contractView(p.id); refresh() },
  signcontract: el => { const p = state.proposals.find(x => x.id === el.dataset.id); p.contract.status = 'assinado'; log(`Contrato de ${cname(p.client)} assinado`, 'propostas'); save(); contractView(p.id); refresh(); toast('Assinatura simulada.') },
  report: el => { rep.client = el.dataset.id; closeLayer(); go('relatorios', null, 'cliente') },
  print: () => window.print(),
  demo: el => toast(el.dataset.msg),
  cat: el => { F.cat = el.dataset.k; render() },
  flow: el => { state.flowsOff[el.dataset.id] = !state.flowsOff[el.dataset.id]; save(); render() },
  openbrief: () => openPage('briefing.html'),
  openbook: () => openPage('agendar.html'),
  sharebrief: el => { const c = el.dataset.client; if (c) { openPage('briefing.html?c=' + c); return toast(`Formulário aberto para ${cname(c)}. Na versão final, o link vai pelo WhatsApp.`) } modal('Enviar formulário de briefing', `<form id="shareform" data-path="briefing.html" style="display:grid;gap:12px"><label class="field">Para qual empresa?<select name="c">${clientOptions('horizonte', false, x => x.stage !== 'perdido')}</select></label><p class="explain" style="margin:0">O link vai com o nome da empresa preenchido. As respostas viram uma vaga em Abertas.</p><div class="mactions"><button type="button" class="btn" data-act="close">Cancelar</button><button class="btn pri" type="submit">${ic('link')}Gerar link e abrir</button></div></form>`) },
  sharebook: el => { openPage('agendar.html?c=' + el.dataset.client); toast(`Link de agendamento aberto para ${cname(el.dataset.client)}.`) },
  copylink: el => { const url = base() + el.dataset.path; (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => toast('Link copiado.'), () => toast(url)) },
  reset: () => modal('Reiniciar a demonstração?', `<p style="margin:0">Volta todos os dados de exemplo ao início, só neste navegador.</p><div class="mactions"><button class="btn" data-act="close">Cancelar</button>${btn('Reiniciar', 'doreset', 'pri', 'undo')}</div>`),
  doreset: () => { state = fresh(); save(); try { localStorage.removeItem(INBOX) } catch {} closeLayer(); go('inicio'); renderGuide(); toast('Demonstração reiniciada.') },
  menu: () => $('#side').classList.toggle('open'),
  guide: () => openGuide(),
  guidereset: () => modal('Recomeçar do zero?', `<p style="margin:0">Tudo o que você criou ou mudou no teste será apagado, os dados de exemplo voltam ao início e os 9 passos ficam desmarcados.</p><div class="mactions"><button class="btn" data-act="guide">Cancelar</button>${btn('Sim, recomeçar', 'doguidereset', 'pri', 'undo')}</div>`),
  doguidereset: () => { state = fresh(); save(); try { localStorage.removeItem(INBOX) } catch {} cal = { y: 2026, m: 9, mode: 'mes', w: 0 }; closeLayer(); go('inicio'); renderGuide(); openGuide(); toast('Tudo zerado. Pode começar pelo passo 1.') },
  guidego: el => { const g = GUIDE.find(x => x[0] === el.dataset.k); closeLayer(); g[3]() },
  welcomeguide: () => { seenIntro(); closeLayer(); openGuide() },
  welcomeclose: () => { seenIntro(); closeLayer() },
};
document.addEventListener('click', e => {
  if (justDragged) { e.preventDefault(); e.stopPropagation(); return }
  const el = e.target.closest('[data-act]');
  if (!el || el.tagName === 'A') return;
  const fn = ACT[el.dataset.act];
  if (fn) { e.preventDefault(); e.stopPropagation(); fn(el) }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && $('#layer').innerHTML) closeLayer();
  if (e.key === 'Enter' && e.target.matches('.job[role=button]')) e.target.click();
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.change === 'crmstage') ACT.crmstage({ dataset: { id: t.dataset.id, stage: t.value } });
  if (t.closest('#pform')) updateProposalPreview(t.name === 'tpl');
  if (t.dataset.filter && t.tagName === 'SELECT') applyFilter(t);
  if (t.dataset.rep) { rep[t.dataset.rep] = t.value; $('#results').innerHTML = reportClient() }
});
function applyFilter(t) {
  const k = t.dataset.filter;
  F[k] = t.value;
  if (k === 'price') { done('preco'); const pos = t.selectionStart; $('#results').innerHTML = priceSearch(); const n = $('#results [data-filter=price]'); n.focus(); n.setSelectionRange(pos, pos); return }
  const fn = { recrutamento: { vagas: jobBoard, candidatos: candTable }, crm: { empresas: crmTable }, agenda: { atendimentos: evTable } }[view]?.[tabs[view]];
  if (!fn) return;
  const pos = t.selectionStart; $('#results').innerHTML = fn();
  if (t.tagName === 'INPUT') { const n = $(`#results [data-filter=${k}]`); n.focus(); n.setSelectionRange(pos, pos) }
}
document.addEventListener('input', e => {
  const t = e.target;
  if (t.closest('#pform')) return updateProposalPreview();
  if (t.dataset.filter && t.tagName === 'INPUT') applyFilter(t);
});

// ── Arrastar cartões entre colunas ──────────────────────────────────────────
// Mouse: arrasta ao mover. Toque: segurar um instante e arrastar, para não
// brigar com a rolagem da tela. Funciona nos quadros de vagas e de clientes.
let drag = null, justDragged = false;
function dropOn(kind, id, stage) {
  if (kind === 'job') {
    const j = jobOf(id); const prev = j.stage;
    if (stage === prev) return;
    if (!moveJob(j, stage)) return;
    flashId = j.id; refresh(); flashId = null;
    toast(`"${j.title}" foi para ${JOBL[stage]}.`, null, () => { j.stage = prev; j.history.push([TODAY, 'Voltou para ' + JOBL[prev], 'Raffaella']) });
  } else {
    const c = client(id); const prev = c.stage;
    if (stage === prev) return;
    c.stage = stage; c.lastContact = TODAY; if (stage !== 'perdido') delete c.lostReason;
    log(`${c.name} foi para ${CRML[stage]}`, 'crm'); save();
    flashId = c.id; refresh(); flashId = null;
    toast(`${c.name} foi para ${CRML[stage]}.`, null, () => { c.stage = prev });
  }
}
function dragStart(x, y) {
  const r = drag.card.getBoundingClientRect();
  drag.active = true; drag.dx = x - r.left; drag.dy = y - r.top;
  drag.ghost = drag.card.cloneNode(true);
  drag.ghost.classList.add('ghost'); drag.ghost.classList.remove('flash');
  drag.ghost.style.width = r.width + 'px';
  document.body.appendChild(drag.ghost);
  drag.card.classList.add('dragging');
  document.body.classList.add('is-dragging');
  navigator.vibrate?.(12);
  dragMove(x, y);
}
function dragMove(x, y) {
  drag.ghost.style.transform = `translate(${x - drag.dx}px, ${y - drag.dy}px) rotate(1.5deg)`;
  const col = document.elementFromPoint(x, y)?.closest(`[data-drop="${drag.kind}"]`);
  if (col !== drag.over) { drag.over?.classList.remove('dropover'); col?.classList.add('dropover'); drag.over = col }
  const wrap = drag.card.closest('.boardwrap');
  if (wrap) { const r = wrap.getBoundingClientRect(); if (x < r.left + 50) wrap.scrollLeft -= 16; else if (x > r.right - 50) wrap.scrollLeft += 16 }
  if (y < 90) scrollBy(0, -14); else if (y > innerHeight - 70) scrollBy(0, 14);
}
function dragEnd(drop) {
  if (!drag) return;
  clearTimeout(drag.timer);
  const d = drag; drag = null;
  if (!d.active) return;
  d.ghost.remove(); d.card.classList.remove('dragging'); d.over?.classList.remove('dropover');
  document.body.classList.remove('is-dragging');
  justDragged = true; setTimeout(() => justDragged = false, 80);
  if (drop && d.over) dropOn(d.kind, d.id, d.over.dataset.stage);
}
document.addEventListener('pointerdown', e => {
  const card = e.target.closest('[data-drag]');
  if (!card || e.button > 0 || e.target.closest('.nextbtn')) return;
  drag = { card, kind: card.dataset.drag, id: card.dataset.id, x: e.clientX, y: e.clientY, pid: e.pointerId, touch: e.pointerType !== 'mouse', active: false };
  if (drag.touch) drag.timer = setTimeout(() => { if (drag && !drag.active) dragStart(drag.x, drag.y) }, 320);
});
document.addEventListener('pointermove', e => {
  if (!drag || e.pointerId !== drag.pid) return;
  const moved = Math.hypot(e.clientX - drag.x, e.clientY - drag.y);
  if (!drag.active) {
    if (drag.touch) { if (moved > 10) { clearTimeout(drag.timer); drag = null } return }
    if (moved < 6) return;
    dragStart(e.clientX, e.clientY);
  }
  e.preventDefault();
  dragMove(e.clientX, e.clientY);
});
document.addEventListener('pointerup', e => { if (drag && e.pointerId === drag.pid) dragEnd(true) });
document.addEventListener('pointercancel', () => dragEnd(false));
// Com o cartão "pego" no toque, a tela não rola: o dedo move o cartão.
document.addEventListener('touchmove', e => { if (drag?.active) e.preventDefault() }, { passive: false });
document.addEventListener('contextmenu', e => { if (drag) e.preventDefault() });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && drag) dragEnd(false) });

// ── Caixa de entrada das páginas públicas ───────────────────────────────────
function consumeInbox() {
  let items = [];
  try { items = JSON.parse(localStorage.getItem(INBOX) || '[]'); if (items.length) localStorage.removeItem(INBOX) } catch {}
  if (!items.length) return;
  for (const it of items) {
    let c = it.client && client(it.client);
    if (!c) {
      const name = (it.company || 'Nova empresa').trim();
      c = state.clients.find(x => x.name.toLowerCase() === name.toLowerCase());
      if (!c) { c = { id: uid('cl'), name, segment: '—', stage: 'lead', contact: it.contact || '—', role: '', phone: it.phone || '', email: it.email || '', services: [], since: TODAY, origin: it.type === 'briefing' ? 'briefing' : 'link', meetingDay: '', lastContact: TODAY, people: [[it.contact || '—', '']] }; state.clients.push(c) }
    }
    c.lastContact = TODAY;
    if (it.type === 'briefing') {
      const id = uid('j'); const a = it.answers;
      state.jobs.unshift({ id, title: a.vaga, client: c.id, qty: 1, fee: 0, stage: 'abertas', created: TODAY, origin: 'briefing', isNew: true, brief: a, history: [[TODAY, 'Briefing recebido pelo formulário', it.contact || c.name]] });
      if (['lead', 'qualificacao'].includes(c.stage)) c.stage = 'qualificacao';
      log(`${c.name} preencheu o briefing: ${a.vaga}`, 'recrutamento', 'briefing', c.name); done('briefing');
      tabs.recrutamento = 'vagas';
      toast(`Briefing recebido de ${c.name}: ${a.vaga}. A vaga já está em Abertas.`, { view: 'recrutamento', id, tab: 'vagas', label: 'Ver vaga' });
    } else if (it.type === 'booking') {
      const id = uid('e');
      state.events.push({ id, type: it.kind || 'reuniao', client: c.id, date: it.date, time: it.time, end: it.end, status: 'confirmado', origin: 'link', topic: it.topic || 'Agendado pelo link' });
      log(`${c.name} agendou pelo link: ${d(it.date)} às ${hr(it.time)}`, 'agenda', 'link', c.name); done('agendar');
      const [y, m] = it.date.split('-'); cal.y = +y; cal.m = +m - 1; cal.mode = 'mes';
      toast(`${c.name} agendou pelo link: ${d(it.date)} às ${hr(it.time)}.`, { view: 'agenda', id, tab: 'calendario', label: 'Ver na agenda' });
    }
  }
  save(); refresh();
}
window.addEventListener('storage', e => { if (e.key === INBOX && e.newValue) consumeInbox() });
window.addEventListener('focus', consumeInbox);
document.addEventListener('visibilitychange', () => { if (!document.hidden) consumeInbox() });

// ── Roteiro da demonstração ─────────────────────────────────────────────────
const GUIDE = [
  ['vaga', 'Cadastrar uma vaga e arrastar para a próxima coluna', 'Recrutamento → Nova vaga. Depois arraste o cartão para a coluna seguinte.', () => { go('recrutamento', null, 'vagas'); setTimeout(() => openForm('vaga'), 200) }],
  ['cv', 'Adicionar um currículo à mão e ligar à vaga', 'Recrutamento → Candidatos → Adicionar currículo.', () => { go('recrutamento', null, 'candidatos'); setTimeout(() => openForm('candidato'), 200) }],
  ['wa', 'Receber um candidato pelo WhatsApp', 'O candidato manda o currículo e ele entra na vaga certa.', () => { go('recrutamento', null, 'candidatos'); setTimeout(() => openChat('recrutamento', 'candidato'), 200) }],
  ['briefing', 'O cliente preenche o formulário de briefing', 'Abre o formulário numa nova aba. Ao enviar, volte: a vaga nasce em Abertas.', () => { go('recrutamento', null, 'vagas'); openPage('briefing.html?c=horizonte') }],
  ['agendar', 'O cliente escolhe data e horário no link público', 'Abre o agendamento numa nova aba. Ao confirmar, volte: o compromisso está na agenda.', () => { go('agenda', null, 'calendario'); openPage('agendar.html?c=padaria') }],
  ['atendimento', 'Contar como foi um encontro e ver o histórico', 'Agenda → Encontros → abra o da Amorim que está "Falta contar como foi".', () => go('agenda', 'e1', 'atendimentos')],
  ['preco', 'Ver quanto já cobrou por uma vaga', 'Clientes e contatos → Quanto já cobrei → "Auxiliar administrativo".', () => go('crm', null, 'precos')],
  ['proposta', 'Preencher e visualizar uma proposta', 'Propostas → Nova proposta, vendo como ela fica enquanto preenche.', () => { go('propostas', null, 'propostas'); setTimeout(() => proposalEditor({ client: 'horizonte', tpl: 'm1' }), 200) }],
  ['relatorio', 'Ver os números atualizados', 'Relatórios → Números do negócio.', () => go('relatorios', null, 'indicadores')],
];
function renderGuide() { const n = GUIDE.filter(g => state.demo[g[0]]).length; $('#guideBtn').innerHTML = `${ic('list')}<span>Passo a passo</span><b>${n}/${GUIDE.length}</b>` }
function openGuide() {
  drawer(`<div><div class="eyebrow">Passo a passo do teste</div><h2>Veja o sistema funcionando</h2></div>`, `<div class="restart"><span><b>Quer começar de novo?</b>Volta os dados de exemplo e desmarca todos os passos.</span>${btn('Recomeçar do zero', 'guidereset', '', 'undo')}</div><p class="explain" style="margin:0">Cada passo é marcado sozinho quando você faz. O formulário e o agendamento abrem numa nova aba, como o cliente veria. Depois de enviar, volte para esta aba.</p>
    <ol class="guide">${GUIDE.map(([k, t, sub], i) => `<li class="${state.demo[k] ? 'ok' : ''}"><span class="gn">${state.demo[k] ? ic('check') : i + 1}</span><span><b>${t}</b><small>${sub}</small></span>${btn(state.demo[k] ? 'Refazer' : 'Fazer', 'guidego', 'sm ' + (state.demo[k] ? '' : 'pri'), '', `data-k="${k}"`)}</li>`).join('')}</ol>`);
}
function seenIntro() { try { localStorage.setItem('omega-intro-v3', '1') } catch {} }
function welcome() {
  modal('', `<div class="introhero"><span class="om" aria-hidden="true">Ω</span><div class="eyebrow">Sistema Ômega · versão de teste</div><h2>Gestão para consultoria, recrutamento e seleção.</h2><p>Clientes, vagas e candidatos, agenda, propostas, contratos e relatórios num só lugar. O que der, o sistema faz sozinho. O resto, você faz à mão com poucos cliques.</p></div>
    <div class="pillars"><div><span class="n">01</span><b>O cliente se serve</b><p>Formulário de briefing e link de agendamento próprios da Ômega.</p></div><div><span class="n">02</span><b>O WhatsApp alimenta</b><p>A Raffaella e a secretária, por áudio. Candidatos mandam currículo.</p></div><div><span class="n">03</span><b>O sistema guarda tudo</b><p>Histórico, preços praticados e indicadores sempre atualizados.</p></div></div>
    <div class="mactions" style="padding:16px 20px 20px"><button class="btn" data-act="welcomeclose">Explorar por conta própria</button>${btn('Me mostre passo a passo', 'welcomeguide', 'pri', 'list')}</div>`, 'intro');
  $('#layer .modal .dbody').style.padding = '0';
}

// ── Início ──────────────────────────────────────────────────────────────────
function setExplain(on) { document.body.classList.toggle('noexplain', !on); $('#explainBtn').setAttribute('aria-checked', on); try { localStorage.setItem('omega-explain', on ? '1' : '0') } catch {} }
$('#explainBtn').addEventListener('click', () => setExplain(document.body.classList.contains('noexplain')));
$('#menuBtn').innerHTML = ic('menu'); $('#menuBtn').dataset.act = 'menu';
$('#guideBtn').dataset.act = 'guide';
let explainOn = true; try { explainOn = localStorage.getItem('omega-explain') !== '0' } catch {}
setExplain(explainOn);
if (!readHash()) view = 'inicio';
render(); renderGuide();
consumeInbox();
let seen = false; try { seen = localStorage.getItem('omega-intro-v3') } catch {}
if (!seen && !$('#layer').innerHTML) welcome();
})();

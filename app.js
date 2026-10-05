import { TUNINGS, ALL_NOTES } from './tunings.js';

const $ = id => document.getElementById(id);
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };

const state = { instrument: 'guitar', bassStrings: 4, tuning: 'Standard', theme: null, ...load('state', {}) };
const custom = load('custom', {});   // { guitar: { name: 'E2 A2 ...' }, bass4: { ... } }
let locked = null;                   // index of the string picked by hand, null = auto detect

const kind = () => state.instrument === 'guitar' ? 'guitar' : 'bass' + state.bassStrings;
const tunings = () => ({ ...TUNINGS[kind()], ...custom[kind()] });
const notes = () => tunings()[state.tuning].split(' ');

// Theme follows the phone until the user picks one with the toggle
const isDark = () => (state.theme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';

function applyTheme() {
  if (state.theme) document.documentElement.dataset.theme = state.theme;
  $('theme').textContent = isDark() ? '☀' : '☾';
}

function render() {
  if (!tunings()[state.tuning]) state.tuning = 'Standard';
  save('state', state);

  for (const b of $('instrument').children) b.classList.toggle('active', b.dataset.value === state.instrument);
  for (const b of $('strings').children) b.classList.toggle('active', +b.dataset.value === state.bassStrings);
  $('strings').hidden = state.instrument !== 'bass';

  const select = $('tuning');
  select.replaceChildren(...Object.keys(TUNINGS[kind()]).map(name => new Option(name)));
  const mine = Object.keys(custom[kind()] ?? {});
  if (mine.length) {
    const group = document.createElement('optgroup');
    group.label = 'Custom';
    group.append(...mine.map(name => new Option(name)));
    select.append(group);
  }
  select.append(new Option('+ Create new tuning…', ''));
  select.value = state.tuning;
  $('delete').hidden = !mine.includes(state.tuning);

  const peg = (label, index) => {
    const b = document.createElement('button');
    b.textContent = label;
    b.classList.toggle('active', locked === index);
    b.onclick = () => { locked = index; render(); };
    return b;
  };
  $('pegs').replaceChildren(peg('Auto', null), ...notes().map((note, i) => peg(note.replace(/\d/, ''), i)));
}

function openCreate() {
  $('name').value = '';
  $('pickers').replaceChildren(...notes().map(note => {
    const s = document.createElement('select');
    s.append(...ALL_NOTES.map(n => new Option(n)));
    s.value = note;
    return s;
  }));
  $('create').showModal();
}

$('theme').onclick = () => {
  state.theme = isDark() ? 'light' : 'dark';
  save('state', state);
  applyTheme();
};

$('instrument').onclick = e => {
  if (!e.target.dataset.value) return;
  state.instrument = e.target.dataset.value;
  locked = null;
  render();
};

$('strings').onclick = e => {
  if (!e.target.dataset.value) return;
  state.bassStrings = +e.target.dataset.value;
  locked = null;
  render();
};

$('tuning').onchange = e => {
  if (!e.target.value) {
    e.target.value = state.tuning;
    return openCreate();
  }
  state.tuning = e.target.value;
  locked = null;
  render();
};

$('delete').onclick = () => {
  if (!confirm(`Delete "${state.tuning}"?`)) return;
  delete custom[kind()][state.tuning];
  save('custom', custom);
  render();
};

$('name').oninput = e => e.target.setCustomValidity(TUNINGS[kind()][e.target.value.trim()] ? 'A built-in tuning has this name' : '');

$('create').querySelector('form').onsubmit = e => {
  if (e.submitter.value !== 'save') return;
  const name = $('name').value.trim();
  (custom[kind()] ??= {})[name] = [...$('pickers').children].map(s => s.value).join(' ');
  save('custom', custom);
  state.tuning = name;
  locked = null;
  render();
};

applyTheme();
render();

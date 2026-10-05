const $ = id => document.getElementById(id);
const load = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };

const state = load('state', { theme: null });

// Theme follows the phone until the user picks one with the toggle
const isDark = () => (state.theme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark';

function applyTheme() {
  if (state.theme) document.documentElement.dataset.theme = state.theme;
  $('theme').textContent = isDark() ? '☀' : '☾';
}

$('theme').onclick = () => {
  state.theme = isDark() ? 'light' : 'dark';
  save('state', state);
  applyTheme();
};

applyTheme();

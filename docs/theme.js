const root = document.documentElement;
const button = document.getElementById('theme');

const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="/icons.svg#${id}"/></svg>`;

function isDark() {
  const t = root.dataset.theme;
  return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
}

function render() {
  const dark = isDark();
  button.innerHTML = icon(dark ? 'sun' : 'moon');
  button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  button.title = button.getAttribute('aria-label');
}

button.addEventListener('click', () => {
  root.dataset.theme = isDark() ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch {}
  render();
});

render();

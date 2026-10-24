// Command palette: Ctrl/⌘ K or "/" opens a jump list built from the site's own pages.
const SOURCES = ['/', '/notes/'];
const mac = /Mac|iPhone|iPad/.test(navigator.platform);
const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="/icons.svg#${id}"/></svg>`;

const dialog = document.createElement('dialog');
dialog.id = 'palette';
dialog.setAttribute('aria-label', 'Search the site');
dialog.innerHTML = `
<input type="text" placeholder="Jump to a course, project, paper…" role="combobox" aria-expanded="true" aria-controls="palette-list" aria-autocomplete="list" autocomplete="off" spellcheck="false">
<ul id="palette-list" role="listbox"></ul>
<p class="hint"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></p>`;
document.body.append(dialog);

const input = dialog.querySelector('input');
const list = dialog.querySelector('ul');
const button = document.getElementById('search');

let items = null;
let results = [];
let active = 0;

const text = (el) => {
  const copy = el.cloneNode(true);
  copy.querySelectorAll('.meta, .aux, .emoji').forEach((n) => n.remove());
  return copy.textContent.replace(/\s+/g, ' ').trim();
};

function sectionOf(el) {
  for (let n = el; n; n = n.previousElementSibling) if (n.tagName === 'H2') return text(n);
  return '';
}

function collect(doc, base) {
  const out = [];
  for (const article of doc.querySelectorAll('main article')) {
    const h3 = article.querySelector('h3');
    const link = h3 && (h3.querySelector('a:not(.aux)') || h3.querySelector('a'));
    if (!link) continue;
    out.push({
      title: text(h3),
      group: sectionOf(article),
      desc: article.querySelector('p:not(.meta)')?.textContent ?? '',
      href: new URL(link.getAttribute('href'), base).href,
      icon: 'arrow',
    });
  }
  return out;
}

function fixed() {
  const out = [
    { title: 'Home', group: 'Page', href: '/', icon: 'arrow' },
    { title: 'Notes', group: 'Page', href: '/notes/', icon: 'book' },
    { title: 'Download CV', group: 'Page', href: '/Mattia_Curri_CV.pdf', icon: 'download' },
    { title: 'Toggle dark mode', group: 'Action', icon: 'moon', run: () => document.getElementById('theme').click() },
    { title: 'Copy email address', group: 'Action', icon: 'copy', run: () => navigator.clipboard?.writeText('mattia2002@gmail.com') },
  ];
  for (const a of document.querySelectorAll('nav .social a')) {
    out.push({ title: a.getAttribute('aria-label'), group: 'Link', href: a.href, icon: a.querySelector('use').getAttribute('href').split('#')[1] });
  }
  return out;
}

async function load() {
  const here = new URL(location.href);
  const pages = await Promise.allSettled(SOURCES.map(async (path) => {
    const url = new URL(path, here);
    if (url.pathname.replace(/\/$/, '') === here.pathname.replace(/\/$/, '')) return collect(document, url);
    const html = await (await fetch(url)).text();
    return collect(new DOMParser().parseFromString(html, 'text/html'), url);
  }));
  const seen = new Set();
  items = [...fixed(), ...pages.flatMap((p) => (p.status === 'fulfilled' ? p.value : []))]
    .filter((it) => {
      const key = it.title + '|' + (it.href ?? '');
      return seen.has(key) ? false : seen.add(key);
    });
}

function filter() {
  const q = input.value.trim().toLowerCase();
  const words = q.split(/\s+/).filter(Boolean);
  results = items
    .map((it) => {
      const title = it.title.toLowerCase();
      const hay = `${title} ${it.group} ${it.desc ?? ''}`.toLowerCase();
      if (!words.every((w) => hay.includes(w))) return null;
      const rank = !q ? 0 : title.startsWith(q) ? 0 : title.includes(q) ? 1 : 2;
      return { it, rank };
    })
    .filter(Boolean)
    .sort((a, b) => a.rank - b.rank)
    .map((r) => r.it);
  active = 0;
  render();
}

function render() {
  if (!results.length) {
    list.innerHTML = '<li class="empty" role="presentation">No matches</li>';
    input.removeAttribute('aria-activedescendant');
    return;
  }
  list.innerHTML = results
    .map((it, i) => `<li role="option" id="pal-${i}" data-i="${i}" aria-selected="${i === active}">${icon(it.icon)}<span></span><small></small></li>`)
    .join('');
  list.querySelectorAll('li').forEach((li, i) => {
    li.querySelector('span').textContent = results[i].title;
    li.querySelector('small').textContent = results[i].group;
  });
  input.setAttribute('aria-activedescendant', `pal-${active}`);
  list.querySelector('[aria-selected="true"]').scrollIntoView({ block: 'nearest' });
}

function choose(it, newTab) {
  dialog.close();
  if (it.run) return it.run();
  if (newTab) window.open(it.href, '_blank', 'noopener');
  else location.href = it.href;
}

async function open() {
  if (dialog.open) return;
  input.value = '';
  dialog.showModal();
  if (!items) {
    list.innerHTML = '<li class="empty" role="presentation">Loading…</li>';
    await load();
  }
  filter();
}

input.addEventListener('input', filter);

input.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (!results.length) return;
    active = (active + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length;
    render();
  } else if (e.key === 'Enter' && results[active]) {
    e.preventDefault();
    choose(results[active], e.metaKey || e.ctrlKey);
  }
});

list.addEventListener('click', (e) => {
  const li = e.target.closest('li[data-i]');
  if (li) choose(results[li.dataset.i], e.metaKey || e.ctrlKey);
});

dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});

document.addEventListener('keydown', (e) => {
  const typing = e.target.closest('input, textarea, [contenteditable]');
  if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
    e.preventDefault();
    open();
  }
});

if (button) {
  const label = `Search (${mac ? '⌘' : 'Ctrl '}K)`;
  button.innerHTML = icon('search');
  button.setAttribute('aria-label', label);
  button.title = label;
  button.addEventListener('click', open);
}

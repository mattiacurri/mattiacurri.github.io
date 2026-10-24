// Toy version of the paper's grid solver: seed with the most confident answer,
// then fill slots depth-first and backtrack on crossing-letter conflicts.
const SIZE = 5;
const BLOCKS = new Set(['0,4', '1,1', '1,3', '3,1', '3,3', '4,0']);

// Candidates are hand-written for the demo; the number is a mock perplexity (lower is better).
const SLOTS = [
  { id: '1A', num: 1, dir: 'Across', r: 0, c: 0, len: 4, clue: 'Capitale d’Italia', cands: [['ROMA', 0.9], ['RIMA', 3.4]] },
  { id: '1D', num: 1, dir: 'Down', r: 0, c: 0, len: 4, clue: 'Gracida nello stagno', cands: [['RANA', 1.4], ['RANE', 2.2]] },
  { id: '2D', num: 2, dir: 'Down', r: 0, c: 2, len: 5, clue: 'Lo scala l’alpinista', cands: [['MASSO', 1.6], ['MONTE', 1.8]] },
  { id: '3D', num: 3, dir: 'Down', r: 1, c: 4, len: 4, clue: 'La si dice «dolce»', cands: [['CASA', 1.1], ['VITA', 2.6]] },
  { id: '4A', num: 4, dir: 'Across', r: 2, c: 0, len: 5, clue: 'La mamma della mamma', cands: [['NONNA', 1.3], ['MADRE', 2.9]] },
  { id: '5A', num: 5, dir: 'Across', r: 4, c: 1, len: 4, clue: 'Spinge la barca col vento', cands: [['VELA', 1.2], ['REMO', 1.9]] },
];

const cellsOf = (s) => Array.from({ length: s.len }, (_, i) => (s.dir === 'Across' ? [s.r, s.c + i] : [s.r + i, s.c]));
const name = (s) => `${s.num} ${s.dir}`;

function* search() {
  const grid = new Map();
  const placed = new Map();
  const put = (s, word) => { placed.set(s.id, word); cellsOf(s).forEach(([r, c], i) => grid.set(`${r},${c}`, word[i])); };
  const take = (s) => {
    placed.delete(s.id);
    for (const [r, c] of cellsOf(s)) {
      const shared = SLOTS.some((o) => o !== s && placed.has(o.id) && cellsOf(o).some(([r2, c2]) => r2 === r && c2 === c));
      if (!shared) grid.delete(`${r},${c}`);
    }
  };

  const seed = SLOTS.flatMap((s) => s.cands.map(([w, p]) => ({ s, w, p }))).sort((a, b) => a.p - b.p)[0];
  put(seed.s, seed.w);
  yield { kind: 'seed', slot: seed.s, word: seed.w, ppl: seed.p, placed: new Map(placed) };

  const order = SLOTS.filter((s) => s !== seed.s);
  let backtracks = 0;

  function* fill(i) {
    if (i === order.length) return true;
    const s = order[i];
    for (const [word] of s.cands) {
      const clash = cellsOf(s).filter(([r, c], k) => grid.has(`${r},${c}`) && grid.get(`${r},${c}`) !== word[k]);
      if (clash.length) {
        const [r, c] = clash[0];
        yield { kind: 'clash', slot: s, word, cells: clash, need: word[cellsOf(s).findIndex(([a, b]) => a === r && b === c)], has: grid.get(`${r},${c}`), placed: new Map(placed) };
        continue;
      }
      put(s, word);
      yield { kind: 'place', slot: s, word, placed: new Map(placed) };
      if (yield* fill(i + 1)) return true;
      take(s);
      yield { kind: 'undo', slot: s, word, placed: new Map(placed) };
    }
    backtracks++;
    yield { kind: 'exhausted', slot: s, back: order[i - 1] ?? seed.s, placed: new Map(placed) };
    return false;
  }

  const ok = yield* fill(0);
  yield { kind: ok ? 'done' : 'fail', backtracks, placed: new Map(placed) };
}

const root = document.getElementById('cw-demo');
const board = root.querySelector('.cw');
const clues = root.querySelector('.clues');
const status = root.querySelector('.status');
const playBtn = root.querySelector('[data-act="play"]');
const stepBtn = root.querySelector('[data-act="step"]');
const resetBtn = root.querySelector('[data-act="reset"]');

const numbers = new Map(SLOTS.map((s) => [`${s.r},${s.c}`, s.num]));
let steps, cursor, timer, rejected, count;

function drawGrid(ev) {
  const letters = new Map();
  for (const s of SLOTS) {
    const word = ev?.placed.get(s.id);
    if (word) cellsOf(s).forEach(([r, c], i) => letters.set(`${r},${c}`, word[i]));
  }
  const trying = new Set();
  const clash = new Set((ev?.cells ?? []).map(([r, c]) => `${r},${c}`));
  if (ev && (ev.kind === 'clash' || ev.kind === 'place' || ev.kind === 'seed')) {
    cellsOf(ev.slot).forEach(([r, c], i) => {
      trying.add(`${r},${c}`);
      if (!clash.has(`${r},${c}`)) letters.set(`${r},${c}`, ev.word[i]);
    });
  }
  board.innerHTML = '';
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const key = `${r},${c}`;
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (BLOCKS.has(key)) cell.classList.add('block');
      else {
        if (clash.has(key)) { cell.classList.add('clash'); cell.textContent = ev.need; }
        else {
          if (trying.has(key)) cell.classList.add('trying');
          cell.textContent = letters.get(key) ?? '';
        }
        if (numbers.has(key)) cell.insertAdjacentHTML('afterbegin', `<span class="n">${numbers.get(key)}</span>`);
      }
      board.append(cell);
    }
  }
}

function drawClues(ev) {
  clues.innerHTML = SLOTS.map((s) => {
    const chips = s.cands.map(([w, p]) => {
      const on = ev?.placed.get(s.id) === w || (ev?.slot === s && ev.word === w && ev.kind !== 'clash' && ev.kind !== 'undo');
      const no = rejected.get(s.id)?.has(w);
      return `<span class="cand${on ? ' on' : ''}${no && !on ? ' no' : ''}">${w} ${p.toFixed(1)}</span>`;
    }).join('');
    return `<li><span class="q"><b>${s.num} ${s.dir[0].toLowerCase() === 'a' ? '→' : '↓'}</b> ${s.clue} <span class="meta">(${s.len})</span></span><span class="cands">${chips}</span></li>`;
  }).join('');
}

function describe(ev) {
  switch (ev.kind) {
    case 'seed': return `Seed: <b>${ev.word}</b> has the lowest perplexity of any candidate (${ev.ppl}), so it goes in first as the anchor.`;
    case 'place': return `${name(ev.slot)}: <b>${ev.word}</b> agrees with every crossing letter. Placed.`;
    case 'clash': return `${name(ev.slot)}: <b>${ev.word}</b> needs ${ev.need} where the grid already has ${ev.has}. Rejected.`;
    case 'undo': return `Nothing fits further on with <b>${ev.word}</b> in ${name(ev.slot)}. Taking it out to try the next candidate.`;
    case 'exhausted': return `${name(ev.slot)} has no candidates left. Backtracking to ${name(ev.back)}.`;
    case 'done': return `Solved in ${count} steps with ${ev.backtracks} backtracks. Every answer comes from the model’s candidate lists.`;
    default: return 'No solution with these candidates. The real system would fall back to dictionary words here.';
  }
}

function show(ev) {
  if (ev.kind === 'clash' || ev.kind === 'undo') {
    if (!rejected.has(ev.slot.id)) rejected.set(ev.slot.id, new Set());
    rejected.get(ev.slot.id).add(ev.word);
  }
  if (ev.kind === 'exhausted') rejected.delete(ev.slot.id);
  drawGrid(ev);
  drawClues(ev);
  status.innerHTML = describe(ev);
}

function step() {
  if (cursor >= steps.length) return stop();
  count = cursor + 1;
  show(steps[cursor++]);
  if (cursor >= steps.length) stop(true);
}

function stop(finished) {
  clearInterval(timer);
  timer = null;
  playBtn.textContent = 'Play';
  if (finished) { playBtn.disabled = true; stepBtn.disabled = true; }
}

function reset() {
  stop();
  steps = [...search()];
  cursor = 0;
  rejected = new Map();
  playBtn.disabled = false;
  stepBtn.disabled = false;
  drawGrid(null);
  drawClues(null);
  status.textContent = 'Press Play to watch the solver fill the grid, or Step to go one move at a time.';
}

playBtn.addEventListener('click', () => {
  if (timer) return stop();
  playBtn.textContent = 'Pause';
  step();
  timer = setInterval(step, 1100);
});
stepBtn.addEventListener('click', () => { stop(); step(); });
resetBtn.addEventListener('click', reset);

reset();

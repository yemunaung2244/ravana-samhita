const stars = [
  'အဿဝဏီ', 'ဘရဏီ', 'ကြတ္တိကာ', 'ရောဟဏီ', 'မိဂသီ', 'အဒြ', 'ပုဏ္ဏဖုသျှ',
  'ဖုသျှ', 'အဿလိဿ', 'မာဃ', 'ပြုဗ္ဗာဖလဂုဏီ', 'ဥတြဖလဂုဏီ', 'ဟဿတ', 'စိတြ',
  'သွာတိ', 'ဝိသာခါ', 'အနုရာဓ', 'ဇေဌ', 'မူလ', 'ပြုဗ္ဗာသာန်', 'ဥတြသာန်',
  'အဘီဇိ', 'သရဝဏ်', 'ဓနသိဒ္ဓိ', 'သတ္တဘီသ', 'ပြုဗ္ဗာဘဒြပိုဒ်', 'ဥတြဘဒြပိုဒ်', 'ရေဝတီ',
];

const planetDefs = [
  { id: 'sun', name: 'တနင်္ဂနွေ' },
  { id: 'moon', name: 'တနင်္လာ' },
  { id: 'mars', name: 'အင်္ဂါ' },
  { id: 'mercury', name: 'ဗုဒ္ဓဟူး' },
  { id: 'jupiter', name: 'ကြာသပတေး' },
  { id: 'venus', name: 'သောကြာ' },
  { id: 'saturn', name: 'စနေ' },
  { id: 'rahu', name: 'ရာဟု' },
  { id: 'ketu', name: 'ကိတ်' },
];

// ရာဟုကာလာနလစက် (နက္ခတ်မှတ်စု အတွဲ ၇၊ စာ ၄၉၊ ၅၃) အတိုင်း ဇနမကို ၁ အဖြစ် ရေတွက်သည်။
const birthStarRoles = [
  ['birth', 'ဇနမနက္ခတ်', 'ဇနမ', 1],
  ['karma', 'ကမ္မနက္ခတ်', 'ကမ္မ', 10],
  ['samudayika', 'သာမုဒါယိကနက္ခတ်', 'သာမုဒါယိက', 18],
  ['sanghatika', 'သံဃာဋိကနက္ခတ်', 'သံဃာဋိက', 16],
  ['jati', 'ဇာတိနက္ခတ်', 'ဇာတိ', 25],
  ['nidhana', 'နိဓနနက္ခတ်', 'နိဓန', 7],
  ['desa', 'ဒေသနက္ခတ်', 'ဒေသ', 26],
  ['abhisheka', 'အဘိသေကနက္ခတ်', 'အဘိသေက', 27],
  ['adhana', 'အာဓာနနက္ခတ်', 'အာဓာန', 19],
  ['vinashaka', 'ဝိနာသကနက္ခတ်', 'ဝိနာသက', 23],
];

const abhijitIndex = stars.indexOf('အဘီဇိ');
const zodiac27 = stars.map((_, index) => index).filter(index => index !== abhijitIndex);

function birthStarPositions(birth) {
  if (birth === null || birth === undefined) return {};
  const start = zodiac27.indexOf(birth);
  if (start < 0) return {};
  return Object.fromEntries(birthStarRoles.map(([id, , , ordinal]) => [
    id, zodiac27[(start + ordinal - 1) % zodiac27.length],
  ]));
}

const wheels = [
  { id: 'sun', name: 'တနင်္ဂနွေ', top: 6 },
  { id: 'moon', name: 'တနင်္လာ', top: 18, alias: 'သူလစက်။' },
  { id: 'mars', name: 'အင်္ဂါ', top: 9, alias: 'ပရိဃစက်။' },
  { id: 'mercury', name: 'ဗုဒ္ဓဟူး', top: 8 },
  { id: 'jupiter', name: 'ကြာသပတေး', top: 0, reversed: true, alias: 'ဝိသကုမ္ဘစက်။' },
  { id: 'venus', name: 'သောကြာ', top: 18, alias: 'ဂန္ဓစက်။' },
  { id: 'saturn', name: 'စနေ', top: 16, alias: 'အတိ ဂန္ဓစက်။' },
  { id: 'rahu', name: 'ရာဟု', top: 7, alias: 'ဝဇိရစက်။' },
  { id: 'ketu', name: 'ကိတ်', top: 13 },
];

const find = id => document.getElementById(id);
const number = n => String(n).replace(/\d/g, digit => '၀၁၂၃၄၅၆၇၈၉'[digit]);
const starAt = (wheel, offset) => (wheel.top + (wheel.reversed ? -offset : offset) + 28) % 28;
const offsetOf = (wheel, starIndex) => ((wheel.reversed ? wheel.top - starIndex : starIndex - wheel.top) % 28 + 28) % 28;
const oppositeOffset = offset => (offset === 0 ? 14 : offset === 14 ? 0 : 28 - offset);
const oppositeStarOf = (wheel, starIndex) => starAt(wheel, oppositeOffset(offsetOf(wheel, starIndex)));
const pairForOffset = offset => {
  if (offset === 0 || offset === 14) return [0, 14];
  const distance = offset < 14 ? offset : 28 - offset;
  return [28 - distance, distance];
};
const label = index => stars[index] + 'နက္ခတ်';
const starNumber = index => (index === abhijitIndex ? '×' : number(index < abhijitIndex ? index + 1 : index));
const numberedLabel = index => starNumber(index) + '. ' + label(index);
const point = (index, radius = 208) => {
  const angle = index * Math.PI / 14;
  return [260 + radius * Math.sin(angle), 260 - radius * Math.cos(angle)];
};

function svg(tag, attributes, value) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, content] of Object.entries(attributes)) node.setAttribute(key, content);
  if (value) node.textContent = value;
  return node;
}

const yangonFormatter = new Intl.DateTimeFormat('my-MM', {
  timeZone: 'Asia/Yangon',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

let currentWheel = wheels[0];
let selectedOffsets = [0, 14];
let selectedBirthStar = 0;
let natalInstant = null;
let transitInstant = null;
let natalStars = null;
let transitStars = null;
let chartScope = 'transit';
const changeCache = new Map();

const scopeLabel = () => (chartScope === 'natal' ? 'မူလ' : 'ကောဇာ');
const activePlanetStars = () => (chartScope === 'natal' ? natalStars : transitStars);

function birthRoleMap() {
  const positions = birthStarPositions(selectedBirthStar);
  const map = new Map();
  birthStarRoles.forEach(([id, title, shortTitle, ordinal], index) => {
    const star = positions[id];
    if (star !== undefined) {
      map.set(star, { id, title, shortTitle, ordinal, order: index + 1 });
    }
  });
  return map;
}

function planetsAtStar(starMap, starIndex) {
  if (!starMap) return [];
  return planetDefs.filter(p => starMap[p.id] === starIndex).map(p => p.name);
}

function computeStarChanges(baseInstant, days) {
  const eph = window.RAVANA_EPHEMERIS;
  if (!eph || !baseInstant) return [];
  const key = `${+baseInstant}:${days}`;
  if (changeCache.has(key)) return changeCache.get(key);

  const rows = [];
  const step = 2 * 3600000;
  const endLimit = +baseInstant + days * 86400000;
  let previous = eph.planetaryStars(baseInstant);
  for (let end = +baseInstant + step; end <= endLimit; end += step) {
    const current = eph.planetaryStars(new Date(end));
    for (const planet of planetDefs) {
      if (current[planet.id] === previous[planet.id]) continue;
      let low = end - step;
      let high = end;
      while (high - low > 1000) {
        const mid = Math.floor((low + high) / 2);
        if (eph.planetaryStars(new Date(mid))[planet.id] === previous[planet.id]) low = mid;
        else high = mid;
      }
      rows.push({
        planetId: planet.id,
        planetName: planet.name,
        fromStar: previous[planet.id],
        toStar: current[planet.id],
        time: high,
      });
    }
    previous = current;
  }
  rows.sort((a, b) => a.time - b.time);
  changeCache.set(key, rows);
  return rows;
}

function drawWheel() {
  const chart = find('wheel');
  const roles = birthRoleMap();
  const scopeStars = activePlanetStars();
  chart.replaceChildren(
    svg('desc', {}, selectedOffsets.map(offset => label(starAt(currentWheel, offset))).join(' — ')),
    svg('circle', { cx: 260, cy: 260, r: 237, class: 'grid' }),
    svg('circle', { cx: 260, cy: 260, r: 208, class: 'orbit-ring' }),
    svg('circle', { cx: 260, cy: 260, r: 170, class: 'grid' }),
  );
  for (let offset = 0; offset < 14; offset++) {
    const [x, y] = point(offset);
    const [oppositeX, oppositeY] = point(offset + 14);
    chart.append(svg('line', { x1: x, y1: y, x2: oppositeX, y2: oppositeY, class: 'grid' }));
  }
  const ends = selectedOffsets.length === 2 ? selectedOffsets : [0, 14];
  const [x1, y1] = point(ends[0]);
  const [x2, y2] = point(ends[1]);
  chart.append(svg('line', { x1, y1, x2, y2, class: 'axis' }));
  const centerFill = chartScope === 'natal' ? '#e6f5ff' : '#e6f7ee';
  chart.append(svg('circle', { cx: 260, cy: 260, r: 92, fill: centerFill, class: 'center' }));
  chart.append(svg('text', { x: 260, y: 247, class: 'center-title' }, currentWheel.name + 'စက်'));
  chart.append(svg('text', { x: 260, y: 274, fill: chartScope === 'natal' ? '#124b73' : '#145c3c' }, scopeLabel() + 'စက်'));
  for (let offset = 0; offset < 28; offset++) {
    const [x, y] = point(offset);
    const starIndex = starAt(currentWheel, offset);
    const active = selectedOffsets.includes(offset);
    const role = roles.get(starIndex);
    const planetsHere = planetsAtStar(scopeStars, starIndex);
    const node = svg('g', { style: 'cursor: pointer' });
    const titleParts = [
      numberedLabel(starIndex),
      role ? role.title : '',
      planetsHere.length ? scopeLabel() + ': ' + planetsHere.join('၊ ') : '',
    ].filter(Boolean);
    const circleClass = [active ? 'node active' : 'node', role && !active ? 'birth-node' : ''].filter(Boolean).join(' ');
    node.append(
      svg('title', {}, titleParts.join(' · ')),
      svg('circle', { cx: x, cy: y, r: 17, class: circleClass }),
      svg('text', { x, y, class: active ? 'active-number' : '' }, starNumber(starIndex)),
    );
    if (role) {
      const [bx, by] = point(offset, 237);
      node.append(
        svg('circle', { cx: bx, cy: by, r: 10, class: 'birth-badge' }),
        svg('text', { x: bx, y: by, class: 'birth-badge-text' }, number(role.order)),
      );
    }
    node.addEventListener('click', () => selectOffsets(pairForOffset(offset)));
    chart.append(node);
  }
  find('selection').textContent = selectedOffsets.map(offset => {
    const starIndex = starAt(currentWheel, offset);
    const role = roles.get(starIndex);
    return numberedLabel(starIndex) + (role ? ' (' + role.shortTitle + ')' : '');
  }).join(' — ');
}

function syncTableSelections() {
  const activeStars = new Set(selectedOffsets.map(offset => starAt(currentWheel, offset)));
  for (const wrapId of ['vedha-table-wrap', 'changes-table-wrap', 'birth-table-wrap']) {
    const table = find(wrapId)?.querySelector('table');
    if (!table) continue;
    for (const row of table.querySelectorAll('tbody tr')) {
      row.classList.toggle('is-selected', activeStars.has(Number(row.dataset.star)));
    }
  }
}

function selectOffsets(activeOffsets) {
  const group = activeOffsets.join(',');
  for (const item of find('pairs').querySelectorAll('[aria-pressed="true"]')) {
    item.setAttribute('aria-pressed', 'false');
  }
  for (const item of find('pairs').querySelectorAll(`[data-group="${group}"]`)) {
    item.setAttribute('aria-pressed', 'true');
  }
  selectedOffsets = activeOffsets;
  drawWheel();
  syncTableSelections();
}

function rowLabel(offset, roles) {
  const starIndex = starAt(currentWheel, offset);
  const span = document.createElement('span');
  span.className = 'pair-cell';
  const index = document.createElement('span');
  index.className = 'number';
  index.textContent = starNumber(starIndex);
  const name = document.createElement('span');
  name.textContent = label(starIndex);
  span.append(index, name);
  const role = roles.get(starIndex);
  if (role) {
    const badge = document.createElement('span');
    badge.className = 'role-badge';
    badge.textContent = role.shortTitle;
    span.append(badge);
  }
  for (const pName of planetsAtStar(activePlanetStars(), starIndex)) {
    const badge = document.createElement('span');
    badge.className = 'planet-badge ' + chartScope;
    badge.textContent = pName;
    span.append(badge);
  }
  return span;
}

function addRow(offsets, roles) {
  const activeOffsets = offsets.length === 1 ? [0, 14] : offsets;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = offsets.length === 1 ? 'pair single' : 'pair';
  button.dataset.group = activeOffsets.join(',');
  button.setAttribute('aria-pressed', String(offsets.length === 1));
  button.append(rowLabel(offsets[0], roles));
  if (offsets.length === 2) button.append('–', rowLabel(offsets[1], roles));
  button.addEventListener('click', () => selectOffsets(activeOffsets));
  find('pairs').append(button);
}

function renderVedhaPanel() {
  const focalWrap = find('focal-summary');
  const tableWrap = find('vedha-table-wrap');
  if (!focalWrap || !tableWrap) return;

  const isNatal = chartScope === 'natal';
  const activeMap = activePlanetStars();
  const focalId = currentWheel.id;
  const focalName = currentWheel.name;
  find('vedha-title').textContent = scopeLabel() + ' ' + focalName + 'စက် ဂြိုဟ်အထွင်း';

  const card = document.createElement('article');
  card.className = isNatal ? 'focal-card' : 'focal-card transit-card';
  const h3 = document.createElement('h3');
  h3.textContent = scopeLabel() + ' ' + focalName + ' အထွင်း';
  card.append(h3);
  if (!activeMap) {
    const p = document.createElement('p');
    p.className = 'hint';
    p.textContent = isNatal
      ? 'မူလစက် ကြည့်ရှုရန် အပေါ်တွင် မူလ မွေးသက္ကရာဇ်နှင့် အချိန် ထည့်သွင်းပေးပါ။'
      : 'ကောဇာစက် ကြည့်ရှုရန် ကောဇာ ရက်စွဲနှင့် အချိန် ထည့်သွင်းပေးပါ။';
    card.append(p);
    focalWrap.replaceChildren(card);
    tableWrap.replaceChildren();
    return;
  }

  const focalStar = activeMap[focalId];
  const focalOpp = oppositeStarOf(currentWheel, focalStar);
  const focalNatalPiercers = planetsAtStar(natalStars, focalOpp);
  const focalTransitPiercers = planetsAtStar(transitStars, focalOpp);
  for (const text of [
    scopeLabel() + ' စီးနက္ခတ်: ' + numberedLabel(focalStar),
    'သမသတ် အထွင်းနက္ခတ်: ' + numberedLabel(focalOpp),
    'မူလ ထွင်းဂြိုဟ်: ' + (focalNatalPiercers.length ? focalNatalPiercers.join('၊ ') : 'မရှိပါ'),
    'ကောဇာ ထွင်းဂြိုဟ်: ' + (focalTransitPiercers.length ? focalTransitPiercers.join('၊ ') : 'မရှိပါ'),
  ]) {
    const p = document.createElement('p');
    p.className = 'focal-line';
    p.textContent = text;
    card.append(p);
  }
  focalWrap.replaceChildren(card);

  const roles = birthRoleMap();
  const table = document.createElement('table');
  table.className = 'birth-table';
  const head = table.createTHead().insertRow();
  const headers = [
    'ဂြိုဟ်',
    isNatal ? 'မူလ စီးနက္ခတ်' : 'ကောဇာ စီးနက္ခတ်',
    'သမသတ် အထွင်းနက္ခတ်',
    'မူလ ထွင်းဂြိုဟ်',
    'ကောဇာ ထွင်းဂြိုဟ်',
    'ဇနမဆယ်ပါး',
  ];
  for (const title of headers) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = title;
    head.append(th);
  }
  const body = table.createTBody();
  for (const planet of planetDefs) {
    const star = activeMap[planet.id];
    const offset = offsetOf(currentWheel, star);
    const opp = oppositeStarOf(currentWheel, star);
    const natalPiercers = planetsAtStar(natalStars, opp);
    const transitPiercers = planetsAtStar(transitStars, opp);
    const roleHere = roles.get(star);
    const roleOpp = roles.get(opp);
    const roleNotes = [
      roleHere ? 'စီး: ' + roleHere.shortTitle : '',
      roleOpp ? 'ထွင်း: ' + roleOpp.shortTitle : '',
    ].filter(Boolean);
    const tr = body.insertRow();
    tr.dataset.star = String(star);
    if (planet.id === currentWheel.id) tr.classList.add('is-focal');
    const cells = [
      planet.name,
      numberedLabel(star),
      numberedLabel(opp),
      natalPiercers.length ? natalPiercers.join('၊ ') : '—',
      transitPiercers.length ? transitPiercers.join('၊ ') : '—',
      roleNotes.length ? roleNotes.join(' · ') : '—',
    ];
    for (const value of cells) tr.insertCell().textContent = value;
    tr.addEventListener('click', () => selectOffsets(pairForOffset(offset)));
  }
  tableWrap.replaceChildren(table);
  syncTableSelections();
}

function renderChangesPanel() {
  const wrap = find('changes-table-wrap');
  if (!wrap) return;
  const isNatal = chartScope === 'natal';
  find('changes-title').textContent = scopeLabel() + ' ဂြိုဟ်ကိုးလုံး နက္ခတ်ပြောင်းချိန်';

  const baseInstant = isNatal ? natalInstant : transitInstant;
  if (!baseInstant) {
    const note = document.createElement('p');
    note.className = 'empty-note';
    note.textContent = isNatal
      ? 'မူလ နက္ခတ်ပြောင်းချိန် ကြည့်ရှုရန် အပေါ်တွင် မူလ မွေးသက္ကရာဇ်နှင့် အချိန် ထည့်သွင်းပေးပါ။'
      : 'ကောဇာ နက္ခတ်ပြောင်းချိန် ကြည့်ရှုရန် ကောဇာ ရက်စွဲနှင့် အချိန် ထည့်သွင်းပေးပါ။';
    wrap.replaceChildren(note);
    return;
  }

  const days = Number(find('change-days').value) || 30;
  const filterPlanet = find('change-planet').value;
  const allRows = computeStarChanges(baseInstant, days);
  const rows = filterPlanet ? allRows.filter(row => row.planetId === filterPlanet) : allRows;

  if (!rows.length) {
    const note = document.createElement('p');
    note.className = 'empty-note';
    note.textContent = 'ရွေးချယ်ထားသော ကာလအတွင်း နက္ခတ်ပြောင်းမှု မရှိပါ။';
    wrap.replaceChildren(note);
    return;
  }

  const roles = birthRoleMap();
  const table = document.createElement('table');
  table.className = 'birth-table';
  const head = table.createTHead().insertRow();
  for (const title of ['ဂြိုဟ်', 'မှ (ယခင်နက္ခတ်)', 'သို့ (နက္ခတ်အသစ်)', 'မြန်မာစံတော်ချိန်', 'လက်ရှိစက် အထွင်းနက္ခတ်']) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = title;
    head.append(th);
  }
  const body = table.createTBody();
  for (const row of rows) {
    const offset = offsetOf(currentWheel, row.toStar);
    const opp = oppositeStarOf(currentWheel, row.toStar);
    const oppNatal = planetsAtStar(natalStars, opp);
    const oppRole = roles.get(opp);
    const oppExtra = [
      oppNatal.length ? 'မူလ ' + oppNatal.join('၊ ') : '',
      oppRole ? oppRole.shortTitle : '',
    ].filter(Boolean);
    const tr = body.insertRow();
    tr.dataset.star = String(row.toStar);
    if (row.planetId === currentWheel.id) tr.classList.add('is-focal');
    const cells = [
      row.planetName,
      numberedLabel(row.fromStar),
      numberedLabel(row.toStar),
      yangonFormatter.format(row.time),
      numberedLabel(opp) + (oppExtra.length ? ' (' + oppExtra.join(' · ') + ')' : ''),
    ];
    for (const value of cells) tr.insertCell().textContent = value;
    tr.addEventListener('click', () => selectOffsets(pairForOffset(offset)));
  }
  wrap.replaceChildren(table);
  syncTableSelections();
}

function renderBirthTable() {
  const wrap = find('birth-table-wrap');
  if (!wrap) return;
  if (selectedBirthStar === null) {
    wrap.replaceChildren();
    return;
  }
  const positions = birthStarPositions(selectedBirthStar);
  const table = document.createElement('table');
  table.className = 'birth-table';
  const head = table.createTHead().insertRow();
  for (const title of ['စဉ်', 'အမျိုးအစား', 'လုံးမြောက်', 'နက္ခတ်', 'ထွင်းသော သမသတ်နက္ခတ်']) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = title;
    head.append(th);
  }
  const body = table.createTBody();
  birthStarRoles.forEach(([id, title, , ordinal], index) => {
    const star = positions[id];
    const offset = offsetOf(currentWheel, star);
    const oppositeStar = starAt(currentWheel, oppositeOffset(offset));
    const tr = body.insertRow();
    tr.dataset.star = String(star);
    if (id === 'birth') tr.classList.add('is-birth');
    const cells = [
      number(index + 1),
      title,
      number(ordinal),
      numberedLabel(star),
      numberedLabel(oppositeStar),
    ];
    for (const value of cells) tr.insertCell().textContent = value;
    tr.addEventListener('click', () => selectOffsets(pairForOffset(offset)));
  });
  wrap.replaceChildren(table);
  syncTableSelections();
}

function renderPairs() {
  const roles = birthRoleMap();
  find('pairs').replaceChildren();
  addRow([0], roles);
  for (let offset = 1; offset < 14; offset++) addRow([28 - offset, offset], roles);
  addRow([14], roles);
  selectOffsets(selectedOffsets);
}

function renderBlocks(container, blocks = []) {
  container.replaceChildren(...blocks.map(block => {
    if (block.type === 'ul') {
      const list = document.createElement('ul');
      for (const item of block.items) {
        const li = document.createElement('li');
        li.textContent = item;
        list.append(li);
      }
      return list;
    }
    const element = document.createElement(block.type === 'h3' ? 'h3' : 'p');
    element.textContent = block.text;
    return element;
  }));
}

function renderScopeUI() {
  const isNatal = chartScope === 'natal';
  find('scope-natal')?.setAttribute('aria-selected', String(isNatal));
  find('scope-transit')?.setAttribute('aria-selected', String(!isNatal));
  find('result-panel')?.classList.toggle('is-transit', !isNatal);
  if (find('scope-badge')) {
    find('scope-badge').textContent = isNatal ? 'မူလစက်' : 'ကောဇာစက်';
  }
  find('wheel-title').textContent = scopeLabel() + ' ' + currentWheel.name + 'စက်။';
  renderPairs();
  renderVedhaPanel();
  renderChangesPanel();
  renderBirthTable();
}

function updateTimeCalculations(syncBirth = false) {
  const eph = window.RAVANA_EPHEMERIS;
  if (!eph) return;
  const natalValue = find('natal-time')?.value || '';
  const transitValue = find('transit-time')?.value || '';
  const statusParts = [];

  if (natalValue) {
    try {
      natalInstant = eph.yangonInstant(natalValue);
      natalStars = eph.planetaryStars(natalInstant);
      if (syncBirth) {
        selectedBirthStar = natalStars.birthMoon;
        if (find('birth-star')) find('birth-star').value = String(selectedBirthStar);
      }
      statusParts.push('မူလ ဇနမနက္ခတ်: ' + numberedLabel(natalStars.birthMoon));
    } catch {
      natalInstant = null;
      natalStars = null;
    }
  } else {
    natalInstant = null;
    natalStars = null;
  }

  if (transitValue) {
    try {
      transitInstant = eph.yangonInstant(transitValue);
      transitStars = eph.planetaryStars(transitInstant);
      statusParts.push('ကောဇာ စန်းစီးနက္ခတ်: ' + numberedLabel(transitStars.moon));
    } catch {
      transitInstant = null;
      transitStars = null;
    }
  } else {
    transitInstant = null;
    transitStars = null;
  }

  const statusEl = find('time-status');
  if (statusEl) {
    statusEl.textContent = statusParts.length
      ? statusParts.join(' · ')
      : 'မူလ ဂြိုဟ်အထွင်းနှင့် နက္ခတ်ပြောင်းကြည့်ရန် မွေးသက္ကရာဇ်/အချိန် ထည့်သွင်းပါ။';
  }
  renderScopeUI();
}

function showWheel(wheel) {
  currentWheel = wheel;
  selectedOffsets = [0, 14];
  for (const [index, button] of [...find('modes').children].entries()) {
    button.setAttribute('aria-pressed', String(wheel === wheels[index]));
  }
  find('alias').textContent = wheel.alias || '';
  find('alias').hidden = !wheel.alias;
  renderScopeUI();
  const notes = window.RAVANA_NOTES?.wheels?.[wheel.name] || [];
  find('notes-title').textContent = wheel.name + 'စက် ရှင်းလင်းချက်';
  renderBlocks(find('notes-body'), notes);
}

for (const wheel of wheels) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = wheel.name;
  button.addEventListener('click', () => showWheel(wheel));
  find('modes').append(button);
}

const birthSelect = find('birth-star');
if (birthSelect) {
  birthSelect.add(new Option('မပြပါ', ''));
  for (const starIndex of zodiac27) {
    birthSelect.add(new Option(numberedLabel(starIndex), String(starIndex)));
  }
  birthSelect.value = String(selectedBirthStar);
  birthSelect.addEventListener('change', event => {
    selectedBirthStar = event.target.value === '' ? null : Number(event.target.value);
    renderPairs();
    renderVedhaPanel();
    renderChangesPanel();
    renderBirthTable();
  });
}

const changePlanetSelect = find('change-planet');
if (changePlanetSelect) {
  changePlanetSelect.add(new Option('ဂြိုဟ်အားလုံး (၉ လုံး)', ''));
  for (const planet of planetDefs) {
    changePlanetSelect.add(new Option(planet.name, planet.id));
  }
  changePlanetSelect.addEventListener('change', renderChangesPanel);
}

find('change-days')?.addEventListener('change', renderChangesPanel);
find('scope-natal')?.addEventListener('click', () => { chartScope = 'natal'; renderScopeUI(); });
find('scope-transit')?.addEventListener('click', () => { chartScope = 'transit'; renderScopeUI(); });

find('natal-time')?.addEventListener('change', () => {
  if (find('natal-time').value) chartScope = 'natal';
  updateTimeCalculations(true);
});
find('transit-time')?.addEventListener('change', () => updateTimeCalculations(false));
find('clear-natal')?.addEventListener('click', () => {
  find('natal-time').value = '';
  updateTimeCalculations(false);
});
find('reset-transit')?.addEventListener('click', () => {
  if (window.RAVANA_EPHEMERIS) {
    find('transit-time').value = window.RAVANA_EPHEMERIS.yangonDateTime();
    updateTimeCalculations(false);
  }
});

if (find('intro-text') && window.RAVANA_NOTES?.intro) {
  renderBlocks(find('intro-text'), window.RAVANA_NOTES.intro);
}
if (window.RAVANA_EPHEMERIS && find('transit-time')) {
  find('transit-time').value = window.RAVANA_EPHEMERIS.yangonDateTime();
}
updateTimeCalculations(false);
showWheel(currentWheel);

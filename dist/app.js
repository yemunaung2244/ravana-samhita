import transcript from './text.js';

const stars = [
  'အဿဝဏီ', 'ဘရဏီ', 'ကြတ္တိကာ', 'ရောဟဏီ', 'မိဂသီ', 'အဒြ', 'ပုဏ္ဏဖုသျှ',
  'ဖုသျှ', 'အဿလိဿ', 'မာဃ', 'ပြုဗ္ဗာဖလဂုဏီ', 'ဥတြဖလဂုဏီ', 'ဟဿတ', 'စိတြ',
  'သွာတိ', 'ဝိသာခါ', 'အနုရာဓ', 'ဇေဌ', 'မူလ', 'ပြုဗ္ဗာသာန်', 'ဥတြသာန်',
  'အဘီဇိ', 'သရဝဏ်', 'ဓနသိဒ္ဓိ', 'သတ္တဘီသ', 'ပြုဗ္ဗာဘဒြပိုဒ်', 'ဥတြဘဒြပိုဒ်', 'ရေဝတီ',
];

const wheels = [
  { name: 'တနင်္ဂနွေ', top: 6, page: 130 },
  { name: 'တနင်္လာ', top: 18, page: 134 },
  { name: 'အင်္ဂါ', top: 9, page: 137 },
  { name: 'ဗုဒ္ဓဟူး', top: 8, page: 139 },
  { name: 'ကြာသပတေး', top: 0, page: 140, reversed: true },
  { name: 'သောကြာ', top: 18, page: 143, alias: 'ဂန္ဓစက်။' },
  { name: 'စနေ', top: 16, page: 152, alias: 'အတိ ဂန္ဓစက်။' },
  { name: 'ရာဟု', top: 7, page: 154, alias: 'ဝဇိရစက်။' },
  { name: 'ကိတ်', top: 13, page: 157 },
];

const find = id => document.getElementById(id);
const number = n => String(n).replace(/\d/g, digit => '၀၁၂၃၄၅၆၇၈၉'[digit]);
const starAt = (wheel, offset) => (wheel.top + (wheel.reversed ? -offset : offset) + 28) % 28;
const label = index => stars[index] + 'နက္ခတ်';
const point = index => {
  const angle = index * Math.PI / 14;
  return [260 + 208 * Math.sin(angle), 260 - 208 * Math.cos(angle)];
};

function svg(tag, attributes, value) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, content] of Object.entries(attributes)) node.setAttribute(key, content);
  if (value) node.textContent = value;
  return node;
}

let currentWheel = wheels[0];
let currentPage = 129;
let selectedOffsets = [0];

function drawWheel() {
  const chart = find('wheel');
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
  chart.append(svg('circle', { cx: 260, cy: 260, r: 92, fill: '#e6f5ff', class: 'center' }));
  chart.append(svg('text', { x: 260, y: 260, class: 'center-title' }, currentWheel.name + 'စက်'));
  for (let offset = 0; offset < 28; offset++) {
    const [x, y] = point(offset);
    const active = selectedOffsets.includes(offset);
    const node = svg('g', {});
    node.append(
      svg('title', {}, label(starAt(currentWheel, offset))),
      svg('circle', { cx: x, cy: y, r: 17, class: active ? 'node active' : 'node' }),
      svg('text', { x, y, class: active ? 'active-number' : '' }, number(offset + 1)),
    );
    chart.append(node);
  }
  find('selection').textContent = selectedOffsets.map(offset => label(starAt(currentWheel, offset))).join(' — ');
}

function rowLabel(offset) {
  const span = document.createElement('span');
  const index = document.createElement('span');
  index.className = 'number';
  index.textContent = number(offset + 1);
  span.append(index, label(starAt(currentWheel, offset)));
  return span;
}

function addRow(offsets) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = offsets.length === 1 ? 'pair single' : 'pair';
  button.setAttribute('aria-pressed', String(offsets[0] === 0));
  button.append(rowLabel(offsets[0]));
  if (offsets.length === 2) button.append('–', rowLabel(offsets[1]));
  button.addEventListener('click', () => {
    find('pairs').querySelector('[aria-pressed="true"]').setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-pressed', 'true');
    selectedOffsets = offsets;
    drawWheel();
  });
  find('pairs').append(button);
}

function showWheel(wheel) {
  currentWheel = wheel;
  selectedOffsets = [0];
  for (const [index, button] of [...find('modes').children].entries()) {
    button.setAttribute('aria-pressed', String(wheel === wheels[index]));
  }
  find('wheel-title').textContent = wheel.name + 'စက်။';
  find('alias').textContent = wheel.alias || '';
  find('alias').hidden = !wheel.alias;
  find('pairs').replaceChildren();
  addRow([0]);
  for (let offset = 1; offset < 14; offset++) addRow([28 - offset, offset]);
  addRow([14]);
  drawWheel();
}

function showPage(page) {
  currentPage = page;
  find('page').value = page;
  find('previous').disabled = page === 129;
  find('next').disabled = page === 158;
  const path = './pages/' + page + '.jpg';
  find('scan').alt = page === 129 ? 'ရာဝဏသံဟိတာကျမ်း အခန်း ( ၆ )' : 'မူရင်းစာမျက်နှာ ' + number(page);
  find('scan').src = path;
  find('original-link').href = path;
  const text = transcript[page] || [];
  find('transcript').hidden = !text.length;
  find('transcript').open = false;
  find('page-text').replaceChildren(...text.map(({ text, heading }) => {
    const element = document.createElement(heading ? 'h3' : 'p');
    element.textContent = text;
    return element;
  }));
}

for (const wheel of wheels) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = wheel.name;
  button.addEventListener('click', () => showWheel(wheel));
  find('modes').append(button);
}
for (let page = 129; page <= 158; page++) {
  find('page').add(new Option(page === 129 ? 'နိဒါန်း' : number(page), page));
}
find('page').addEventListener('change', event => showPage(Number(event.target.value)));
find('previous').addEventListener('click', () => showPage(currentPage - 1));
find('next').addEventListener('click', () => showPage(currentPage + 1));
document.querySelector('.chapter-link').addEventListener('click', () => showPage(129));
find('section-source').addEventListener('click', () => showPage(currentWheel.page));
showWheel(currentWheel);
showPage(currentPage);

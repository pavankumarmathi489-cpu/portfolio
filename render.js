/* Builds every section of the page from content.json.
   Shared with admin.html, which uses the same icon / art / colour lists. */

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
// **bold** and *gradient* markup in admin-editable text
export const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');

export const COLORS = {cyan: 'var(--accent)', violet: 'var(--accent2)', lime: 'var(--lime)', amber: 'var(--warn)', red: '#ef4444'};
export const GLOWS = {
  cyan: ['rgba(34,211,238,.4)', 'rgba(163,230,53,.22)'],
  violet: ['rgba(167,139,250,.45)', 'rgba(34,211,238,.25)'],
  amber: ['rgba(251,191,36,.3)', 'rgba(239,68,68,.22)'],
  red: ['rgba(239,68,68,.32)', 'rgba(251,191,36,.28)'],
  lime: ['rgba(163,230,53,.3)', 'rgba(34,211,238,.25)']
};
export const FILTERS = {ai: 'AI & ML', web: 'Web & Software', emb: 'Embedded', iot: 'Robotics & IoT'};

export const ICONS = {
  rover: '<rect x="4" y="9" width="16" height="7" rx="2"/><path d="M9 9V6h6v3M12 6V3"/><circle cx="7.5" cy="18" r="2"/><circle cx="16.5" cy="18" r="2"/>',
  brain: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8" stroke-dasharray="3 3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  map: '<path d="M12 21s-6-5.5-6-10a6 6 0 0 1 12 0c0 4.5-6 10-6 10z"/><circle cx="12" cy="11" r="2"/>',
  shop: '<path d="M4 8h16l-1 12H5zM8 8V6a4 4 0 0 1 8 0v2"/>',
  food: '<path d="M5 11h14a7 7 0 0 1-14 0zM8 7c0-2 2-2 2-4M12 7c0-2 2-2 2-4"/><path d="M4 21h16"/>',
  clock: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4M12 15v2"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
  cam: '<rect x="3" y="7" width="18" height="12" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M8 7l1.5-3h5L16 7"/>',
  hand: '<path d="M8 13V5a1.5 1.5 0 0 1 3 0v6M11 11V4a1.5 1.5 0 0 1 3 0v7M14 11V6a1.5 1.5 0 0 1 3 0v8a7 7 0 0 1-7 7 6 6 0 0 1-5-3l-2.5-4a1.5 1.5 0 0 1 2.5-1.6L8 15"/>',
  cloud: '<path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 19 10a4 4 0 0 1 0 8z"/><path d="M9 21l1-2M13 21l1-2"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  flow: '<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="9" y="15" width="6" height="6" rx="1"/><path d="M6 9v3h12V9M12 12v3"/>',
  wave: '<path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 11v2"/>',
  cube: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 22V12M21 7l-9 5-9-5"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>',
  network: '<circle cx="12" cy="12" r="3"/><circle cx="4" cy="6" r="2"/><circle cx="20" cy="6" r="2"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="18" r="2"/><path d="M6 7l3.5 3M18 7l-3.5 3M6 17l3.5-3M18 17l-3.5-3"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  book: '<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'
};
const svgIcon = (k, w = 1.7) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${ICONS[k] || ICONS.star}</svg>`;

export const GH = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg>';
const EXT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg>';

// line-art for the featured cards
export const ART = {
  rover: `<svg class="art" viewBox="0 0 400 300" fill="none" stroke="#22d3ee" stroke-width="2"><g class="float"><rect x="110" y="120" width="180" height="70" rx="14" fill="rgba(34,211,238,.06)"/><rect x="150" y="70" width="100" height="50" rx="10" fill="rgba(34,211,238,.08)"/><circle cx="180" cy="95" r="9" fill="#22d3ee" class="eye"/><circle cx="220" cy="95" r="9" fill="#22d3ee" class="eye"/><path d="M200 70V40"/><circle cx="200" cy="34" r="6" fill="#a3e635" stroke="#a3e635"/><path d="M130 145h50M130 160h30" stroke="#a78bfa"/><rect x="230" y="140" width="40" height="28" rx="4" stroke="#a78bfa"/></g><g><circle cx="140" cy="205" r="26"/><circle cx="260" cy="205" r="26"/><circle cx="140" cy="205" r="8"/><circle cx="260" cy="205" r="8"/></g><path d="M60 240h280" stroke="rgba(148,163,184,.4)" stroke-dasharray="6 8"/><path class="sonar" d="M300 110a60 60 0 0 1 0 60M318 96a84 84 0 0 1 0 88" stroke="#a3e635"/></svg>`,
  agent: `<svg class="art" viewBox="0 0 400 300" fill="none" stroke="#a78bfa" stroke-width="1.6"><circle cx="200" cy="150" r="70" stroke-dasharray="4 7" class="orbit1"/><circle cx="200" cy="150" r="112" stroke="rgba(34,211,238,.6)" stroke-dasharray="2 10" class="orbit2"/><g stroke="#22d3ee"><path d="M200 116V60M234 150h70M200 184v56M166 150H96M224 126l40-40M176 174l-40 40M224 174l40 40M176 126l-40-40"/></g><g fill="#05070d" stroke="#22d3ee" stroke-width="2"><circle cx="200" cy="56" r="10"/><circle cx="308" cy="150" r="10"/><circle cx="200" cy="244" r="10"/><circle cx="92" cy="150" r="10"/><circle cx="268" cy="82" r="8"/><circle cx="132" cy="218" r="8"/><circle cx="268" cy="218" r="8"/><circle cx="132" cy="82" r="8"/></g><circle cx="200" cy="150" r="34" fill="rgba(167,139,250,.18)" stroke-width="2.4" class="core"/><text x="200" y="156" text-anchor="middle" font-family="JetBrains Mono" font-size="16" fill="#e6edf7" stroke="none">AI</text></svg>`,
  map: `<svg class="art" viewBox="0 0 400 300" fill="none" stroke="#fbbf24" stroke-width="1.6"><path d="M40 220c40-30 70-10 110-40s60-70 110-60 70 40 100 30" stroke="rgba(148,163,184,.35)"/><path d="M40 250c50-20 90 0 140-30s70-40 180-20" stroke="rgba(148,163,184,.25)"/><path d="M120 160L250 110L310 200" stroke="#e6edf7" stroke-dasharray="3 6"/><g transform="translate(120 160)"><circle r="30" fill="rgba(239,68,68,.15)" stroke="#ef4444" class="ping"/><circle r="6" fill="#ef4444" stroke="none"/></g><g transform="translate(250 110)"><circle r="22" fill="rgba(251,191,36,.12)" class="ping"/><circle r="6" fill="#fbbf24" stroke="none"/></g><g transform="translate(310 200)"><circle r="16" fill="rgba(34,211,238,.12)" stroke="#22d3ee" class="ping"/><circle r="5" fill="#22d3ee" stroke="none"/></g><rect x="40" y="40" width="120" height="60" rx="8" stroke="#a78bfa"/><path d="M52 58h70M52 72h50M52 86h86" stroke="#a78bfa"/></svg>`,
  shop: `<svg class="art" viewBox="0 0 400 300" fill="none" stroke="#fbbf24" stroke-width="1.6"><rect x="70" y="40" width="260" height="200" rx="14" fill="rgba(5,7,13,.6)" stroke="rgba(230,237,247,.4)"/><path d="M70 66h260" stroke="rgba(230,237,247,.3)"/><circle cx="86" cy="53" r="4" fill="#ef4444" stroke="none"/><circle cx="100" cy="53" r="4" fill="#fbbf24" stroke="none"/><circle cx="114" cy="53" r="4" fill="#a3e635" stroke="none"/><rect x="88" y="80" width="224" height="40" rx="8" fill="rgba(239,68,68,.25)" stroke="none"/><g class="tiles"><rect x="88" y="132" width="68" height="84" rx="8"/><rect x="166" y="132" width="68" height="84" rx="8"/><rect x="244" y="132" width="68" height="84" rx="8"/></g><path d="M100 200h44M178 200h44M256 200h44" stroke="#ef4444" stroke-width="3"/><g transform="translate(300 230)"><g class="cart"><circle r="24" fill="#fbbf24" stroke="none"/><path d="M-10-6h4l4 12h10l3-9H-3" stroke="#05070d" stroke-width="2.2"/></g></g></svg>`,
  camera: `<svg class="art" viewBox="0 0 400 300" fill="none" stroke="#a3e635" stroke-width="1.8"><rect x="110" y="140" width="180" height="56" rx="10" fill="rgba(163,230,53,.06)"/><rect x="175" y="96" width="50" height="44" rx="6"/><circle cx="200" cy="118" r="12" stroke="#22d3ee" stroke-width="2.4"/><circle cx="200" cy="118" r="4" fill="#22d3ee" stroke="none"/><path class="beam" d="M212 112L340 60M212 124L340 176" stroke="rgba(34,211,238,.6)" stroke-dasharray="4 6"/><circle cx="140" cy="206" r="20"/><circle cx="260" cy="206" r="20"/><g class="wifi" stroke="#e6edf7"><path d="M84 92a30 30 0 0 1 40 0"/><path d="M74 80a46 46 0 0 1 60 0"/><circle cx="104" cy="102" r="3" fill="#e6edf7"/></g></svg>`,
  chip: `<svg class="art" viewBox="0 0 400 300" fill="none" stroke="#22d3ee" stroke-width="1.8"><g class="float"><rect x="140" y="90" width="120" height="120" rx="12" fill="rgba(34,211,238,.06)"/><rect x="170" y="120" width="60" height="60" rx="6" stroke="#a78bfa"/></g><path d="M160 90V60M185 90V60M215 90V60M240 90V60M160 210v30M185 210v30M215 210v30M240 210v30M140 110h-30M140 135h-30M140 165h-30M140 190h-30M260 110h30M260 135h30M260 165h30M260 190h30"/><path class="beam" d="M290 110h60M110 190H50" stroke="#a3e635" stroke-dasharray="4 6"/></svg>`,
  code: `<svg class="art" viewBox="0 0 400 300" fill="none" stroke="#a78bfa" stroke-width="1.8"><rect x="70" y="50" width="260" height="190" rx="14" fill="rgba(5,7,13,.6)" stroke="rgba(230,237,247,.4)"/><path d="M70 76h260" stroke="rgba(230,237,247,.3)"/><g class="float"><path d="M150 130l-30 25 30 25M250 130l30 25-30 25M215 120l-30 70" stroke="#22d3ee" stroke-width="3"/></g><path class="beam" d="M100 215h120" stroke="#a3e635" stroke-dasharray="4 6"/></svg>`
};
export const ART_NAMES = {rover: 'Robot / rover', agent: 'AI network', map: 'Map with pins', shop: 'Web shop', camera: 'Camera robot', chip: 'Microchip', code: 'Code window', none: 'No art'};

const links = list => (list || []).filter(l => l.url).map(l =>
  `<a class="linkbtn" href="${esc(l.url)}" target="_blank" rel="noopener">${/github\.com/.test(l.url) ? GH : EXT}${esc(l.label || 'Open')}</a>`).join('');

/* ------------------------------------------------------------------ */
export function render(c) {
  const $ = s => document.querySelector(s);
  const set = (s, html) => { const el = $(s); if (el) el.innerHTML = html; };
  const p = c.profile, a = c.about;

  // hero
  set('#heroStatus', `<i></i>${esc(p.status)}`);
  set('#heroName', `<span class="w w1">${esc(p.firstLine)}</span><span class="w w2">${esc(p.secondLine)}</span>`);
  $('#heroName').setAttribute('aria-label', `${p.firstLine} ${p.secondLine}`);
  set('#roleText', esc(p.roles[0] || ''));
  set('#heroLede', esc(p.lede));
  set('#heroCoords', `${esc(p.coords)}<br>${esc(p.place)}`);
  const mq = p.marquee.map(m => `<span>${esc(m)}</span>`).join('');
  set('#mq', mq + mq);

  // about
  $('#aboutPhoto').src = a.photo;
  set('#aboutTags', a.taglines.slice(0, 3).map((t, i) => `<div class="tagline t${i + 1}">${esc(t)}</div>`).join(''));
  set('#aboutHead', head(a));
  set('#aboutText', a.paragraphs.map(t => `<p data-reveal>${md(t)}</p>`).join(''));
  set('#aboutStats', a.stats.map(s => {
    const v = s.value === 'auto' ? String(c.projects.items.length) : String(s.value);
    const num = parseFloat(v), dec = (v.split('.')[1] || '').length;
    const shown = isNaN(num) || !/^[\d.]+$/.test(v) ? `<span>${esc(v)}</span>` : `<span data-count="${num}" data-dec="${dec}">0</span>`;
    return `<div class="stat" data-reveal><div class="n">${shown}${s.suffix ? `<sup>${esc(s.suffix)}</sup>` : ''}</div><div class="l">${esc(s.label)}</div></div>`;
  }).join(''));
  set('#aboutFacts', a.facts.map(f => `<div>${esc(f.label)}<b>${esc(f.value)}</b></div>`).join(''));

  // skills
  const sk = c.skills;
  set('#skillsHead', head(sk) + lead(sk));
  set('#skillCats', sk.categories.map(k => `
    <div class="cat" style="--c:${COLORS[k.color] || COLORS.cyan}" data-reveal>
      <h3><span class="ic">${svgIcon(k.icon, 1.8)}</span>${esc(k.title)}<small>${esc(k.note)}</small></h3>
      <div class="chips">${k.items.map(i => `<span class="chip">${esc(i)}</span>`).join('')}</div>
    </div>`).join(''));

  // featured
  const fe = c.featured;
  set('#workHead', head(fe) + lead(fe));
  set('#htrack', fe.items.map((f, i) => {
    const [g1, g2] = GLOWS[f.glow] || GLOWS.cyan;
    const vis = f.image ? `<img class="shot" src="${esc(f.image)}" alt="${esc(f.title)}" loading="lazy">` : (ART[f.art] || '');
    return `
    <article class="fcard" style="--g1:${g1};--g2:${g2}">
      <div class="vis">${vis}
        <span class="num">${String(i + 1).padStart(2, '0')}</span>
        ${f.badge ? `<span class="badge" style="--b:${COLORS[f.badgeColor] || COLORS.lime}"><i></i>${esc(f.badge)}</span>` : ''}
      </div>
      <div class="body">
        <div class="kind">${esc(f.kind)}</div>
        <h3>${esc(f.title)}</h3>
        ${f.intro ? `<p>${md(f.intro)}</p>` : ''}
        ${f.bullets.length ? `<ul>${f.bullets.map(b => `<li>${md(b)}</li>`).join('')}</ul>` : ''}
        ${f.metrics.length ? `<div class="metrics">${f.metrics.map(m => `<div class="metric"><b>${esc(m.value)}</b><span>${esc(m.label)}</span></div>`).join('')}</div>` : ''}
        <div class="chips">${f.tags.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
        ${(f.links || []).some(l => l.url) ? `<div class="links">${links(f.links)}</div>` : ''}
      </div>
    </article>`;
  }).join(''));
  set('#htotal', String(fe.items.length).padStart(2, '0'));

  // project archive
  const pr = c.projects;
  set('#projHead', head(pr));
  set('#projLead', esc(pr.lead));
  set('#pgrid', pr.items.map(x => `
    <article class="pcard" data-f="${esc(x.filters.join(' '))}">
      <div class="glare"></div>
      <div class="top">
        <span class="ic">${svgIcon(x.icon)}</span>
        <span class="st ${x.inProgress ? 'wip' : ''}"><i></i>${esc(x.status)}</span>
      </div>
      <h4>${esc(x.title)}</h4>
      <p>${md(x.description)}</p>
      <div class="chips">${x.tags.map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
      ${(x.live || x.source) ? `<div class="plinks">${x.live ? `<a href="${esc(x.live)}" target="_blank" rel="noopener">↗ Live site</a>` : ''}${x.source ? `<a href="${esc(x.source)}" target="_blank" rel="noopener">${GH.replace('<svg', '<svg width="13" height="13"')} Source</a>` : ''}</div>` : ''}
    </article>`).join(''));
  const counts = {all: pr.items.length};
  pr.items.forEach(x => x.filters.forEach(f => counts[f] = (counts[f] || 0) + 1));
  set('#filters', ['all', ...Object.keys(FILTERS)].map(f =>
    `<button class="${f === 'all' ? 'on' : ''}" data-f="${f}">${f === 'all' ? 'All' : esc(FILTERS[f])}<sup>${counts[f] || 0}</sup></button>`).join(''));

  // journey
  const jo = c.journey;
  set('#journeyHead', head(jo));
  set('#tlItems', jo.items.map(j => `
    <div class="ti" data-reveal><div class="when">${esc(j.when)}</div><span class="dot"></span>
      <div class="what"><div class="k">${esc(j.kind)}</div><h4>${esc(j.title)}</h4><p>${md(j.text)}</p></div></div>`).join(''));

  // resumes
  const re = c.resumes;
  set('#resumeHead', head(re) + lead(re));
  set('#rgrid', re.items.map(r => `
    <div class="rcard" style="--c:${COLORS[r.color] || COLORS.cyan}" data-reveal>
      <div class="tag">${esc(r.tag)}</div>
      <h4>${esc(r.title)}</h4>
      <p>${md(r.text)}</p>
      <div class="actions"><a class="btn solid magnetic" href="${esc(r.file)}" target="_blank" rel="noopener">View PDF</a><a class="btn magnetic" href="${esc(r.file)}" download>Download</a></div>
    </div>`).join(''));

  // contact + footer
  const co = c.contact;
  set('#contactEyebrow', esc(co.eyebrow));
  set('#contactBig', co.lines.map((l, i) => `<span class="line-mask"><span${i === 1 ? ' class="o"' : ''}>${esc(l)}</span></span>`).join(''));
  set('#copyMail', `${esc(p.email)} <span class="cp">click to copy</span>`);
  $('#sMail').href = 'mailto:' + p.email;
  $('#sLinkedin').href = p.linkedin;
  $('#sGithub').href = p.github;
  $('#sPhone').href = 'tel:' + p.phone.replace(/[^\d+]/g, '');
  set('#cinfo', `<span>Phone <b>${esc(p.phone)}</b></span><span>Location <b>${esc(p.location)}</b></span>`);
  set('#footName', `© ${new Date().getFullYear()} ${esc(p.firstLine)} ${esc(p.secondLine.replace(/\.$/, ''))}`);
}

const head = s => `<div class="eyebrow">${esc(s.eyebrow)}</div><h2 class="h2" data-split>${md(s.heading)}</h2>`;
const lead = s => s.lead ? `<p class="lead" data-reveal>${md(s.lead)}</p>` : '';

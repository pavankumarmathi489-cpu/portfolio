import * as THREE from 'three';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = matchMedia('(hover: hover)').matches;
const isMobile = () => innerWidth < 900;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
gsap.registerPlugin(ScrollTrigger);

/* ===================== icons ===================== */
const ICONS = {
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
  drone: '<circle cx="5" cy="5" r="2.5"/><circle cx="19" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M7 7l2 2M17 7l-2 2M7 17l2-2M17 17l-2-2"/>',
  wave: '<path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 11v2"/>',
  cube: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M12 22V12M21 7l-9 5-9-5"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/>'
};
const GH = '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.7 1.6.2 2.9.1 3.2.8.8 1.3 1.9 1.3 3.1 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg>';

/* ===================== project grid ===================== */
$('#pgrid').innerHTML = PROJECTS.map(p => `
  <article class="pcard" data-f="${p.f.join(' ')}">
    <div class="glare"></div>
    <div class="top">
      <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[p.ic]}</svg></span>
      <span class="st ${p.st === 'wip' ? 'wip' : ''}"><i></i>${p.s}</span>
    </div>
    <h4>${p.t}</h4>
    <p>${p.d}</p>
    <div class="chips">${p.tags.map(t => `<span class="chip">${t}</span>`).join('')}</div>
    ${(p.gh || p.live) ? `<div class="plinks">${p.live ? `<a href="${p.live}" target="_blank" rel="noopener">↗ Live site</a>` : ''}${p.gh ? `<a href="${p.gh}" target="_blank" rel="noopener">${GH} Source</a>` : ''}</div>` : ''}
  </article>`).join('');
const counts = {all: PROJECTS.length};
PROJECTS.forEach(p => p.f.forEach(f => counts[f] = (counts[f] || 0) + 1));
$$('#filters button').forEach(b => b.insertAdjacentHTML('beforeend', `<sup>${counts[b.dataset.f]}</sup>`));

/* ===================== loader ===================== */
const bootLines = [
  'initialising <b>PKM.SYS</b> …',
  'flashing firmware ........... <b>ok</b>',
  'mounting vision model ....... <b>ok</b>',
  'warming up local LLM ........ <b>ok</b>',
  'calibrating particles ....... <b>ok</b>',
  'welcome.'
];
function runLoader() {
  return new Promise(res => {
    const finish = () => { document.body.classList.remove('loading'); res(); };
    if (reduce) { $('#loader').remove(); return finish(); }
    const boot = $('#boot'), pct = $('#pct'), bar = $('#lbar');
    const o = {v: 0};
    let shown = 0;
    gsap.to(o, {v: 100, duration: 2.1, ease: 'power2.inOut', onUpdate() {
      const v = Math.round(o.v);
      pct.textContent = v; bar.style.width = v + '%';
      const want = Math.min(bootLines.length, Math.floor(v / 100 * bootLines.length) + 1);
      while (shown < want) boot.insertAdjacentHTML('beforeend', `<div>&gt; ${bootLines[shown++]}</div>`);
    }, onComplete() {
      gsap.timeline({onComplete: () => $('#loader').remove()})
        .to('#loader .row, #loader .boot', {y: -40, opacity: 0, duration: .5, ease: 'power3.in'})
        .to('#loader', {clipPath: 'inset(0 0 100% 0)', duration: .9, ease: 'expo.inOut'}, '-=.1')
        .add(finish, '-=.55');
    }});
  });
}

/* ===================== smooth scroll ===================== */
let lenis = null;
if (!reduce) {
  lenis = new Lenis({lerp: .09, smoothWheel: true});
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}
const mmenu = $('#mmenu');
const closeMenu = () => mmenu.classList.remove('open');
$('#menuBtn').addEventListener('click', () => mmenu.classList.toggle('open'));
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href');
  const el = id === '#top' ? 0 : $(id);
  if (el === null) return;
  e.preventDefault(); closeMenu();
  if (lenis) lenis.scrollTo(el, {duration: 1.6});
  else if (el === 0) scrollTo(0, 0); else el.scrollIntoView();
}));

/* ===================== nav state / progress ===================== */
// created after the pinned reel so their positions include its pin spacing
function navState() {
  const nav = $('#nav');
  ScrollTrigger.create({start: 0, end: 'max', onUpdate: s => nav.classList.toggle('scrolled', s.scroll() > 40)});
  gsap.to('#ptop', {scaleX: 1, ease: 'none', scrollTrigger: {start: 0, end: 'max', scrub: true}});
  $$('section[id]').forEach(sec => ScrollTrigger.create({trigger: sec, start: 'top 50%', end: 'bottom 50%',
    onToggle: s => { if (s.isActive) $$('.nav ul a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id)); },
    onLeaveBack: s => { if (sec.id === 'about') $$('.nav ul a').forEach(a => a.classList.remove('active')); }}));
}

/* ===================== cursor + magnetic ===================== */
if (canHover) {
  const cur = $('#cur'), ring = $('#curR');
  const pos = {x: innerWidth / 2, y: innerHeight / 2}, rp = {...pos};
  addEventListener('mousemove', e => { pos.x = e.clientX; pos.y = e.clientY; cur.style.transform = `translate(${pos.x}px,${pos.y}px) translate(-50%,-50%)`; });
  gsap.ticker.add(() => { rp.x += (pos.x - rp.x) * .18; rp.y += (pos.y - rp.y) * .18; ring.style.transform = `translate(${rp.x}px,${rp.y}px) translate(-50%,-50%)`; });
  document.addEventListener('mouseover', e => ring.classList.toggle('hover', !!e.target.closest('a,button,.pcard,.sphere')));
  $$('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      gsap.to(el, {x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .4, ease: 'power3.out'});
    });
    el.addEventListener('mouseleave', () => gsap.to(el, {x: 0, y: 0, duration: .7, ease: 'elastic.out(1,.4)'}));
  });
}

/* ===================== hero ===================== */
$$('.hero h1 .w').forEach(w => {
  w.innerHTML = [...w.textContent.trim()].map(c => `<span class="ch">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
});
const roles = ['Embedded Systems Engineer', 'Edge AI Developer', 'Robotics Builder', 'Full-Stack Developer', 'Firmware + AI, end to end'];
const roleEl = $('#roleText');
function scramble(el, to) {
  const chars = '!<>-_\\/[]{}=+*^?#01';
  const from = el.textContent, len = Math.max(from.length, to.length);
  const q = [];
  for (let i = 0; i < len; i++) q.push({from: from[i] || '', to: to[i] || '', s: Math.floor(Math.random() * 16), e: Math.floor(Math.random() * 16) + 16});
  let f = 0;
  (function tick() {
    let out = '', done = 0;
    for (const c of q) {
      if (f >= c.e) { done++; out += c.to; }
      else if (f >= c.s) out += chars[Math.floor(Math.random() * chars.length)];
      else out += c.from;
    }
    el.textContent = out;
    if (done < q.length) { f++; requestAnimationFrame(tick); }
  })();
}
let ri = 0;
const cycleRoles = () => setInterval(() => { ri = (ri + 1) % roles.length; reduce ? roleEl.textContent = roles[ri] : scramble(roleEl, roles[ri]); }, 2800);

function heroIntro() {
  if (reduce) return cycleRoles();
  gsap.timeline({onComplete: cycleRoles})
    .from('.hero h1 .ch', {yPercent: 110, rotateX: -80, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: .035})
    .from('[data-hero]', {y: 30, opacity: 0, duration: .9, ease: 'power3.out', stagger: .1}, '-=.8')
    .from('.nav', {y: -30, opacity: 0, duration: .8, ease: 'power3.out', clearProps: 'transform,opacity'}, '-=.8')
    .from('.hero-meta', {opacity: 0, duration: .8}, '-=.5');
  const st = {trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true};
  gsap.to('.hero h1 .w1', {xPercent: -12, ease: 'none', scrollTrigger: st});
  gsap.to('.hero h1 .w2', {xPercent: 14, ease: 'none', scrollTrigger: {...st}});
  gsap.to('.hero .wrap', {opacity: 0, y: -60, ease: 'none', scrollTrigger: {trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true}});
}

/* ===================== reveals ===================== */
function reveals() {
  $$('[data-split]').forEach(h => {
    const parts = [];
    h.childNodes.forEach(n => {
      if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach(t => parts.push(t.trim() ? `<span class="line-mask" style="display:inline-block"><span>${t}</span></span>` : t ? ' ' : ''));
      else parts.push(`<span class="line-mask" style="display:inline-block"><span>${n.outerHTML}</span></span>`);
    });
    h.innerHTML = parts.join('');
    if (reduce) return;
    gsap.from(h.querySelectorAll('.line-mask>span'), {yPercent: 110, rotate: 4, duration: 1, ease: 'expo.out', stagger: .06,
      scrollTrigger: {trigger: h, start: 'top 88%'}});
  });
  if (!reduce) {
    gsap.from('[data-split-big] .line-mask>span', {yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: .12,
      scrollTrigger: {trigger: '[data-split-big]', start: 'top 82%'}});
    gsap.set('[data-reveal]', {y: 50, opacity: 0});
    ScrollTrigger.batch('[data-reveal]', {start: 'top 90%', once: true,
      onEnter: b => gsap.to(b, {y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: .08})});
    gsap.set('.pcard', {opacity: 0, y: 60});
    ScrollTrigger.batch('.pcard', {start: 'top 94%', once: true,
      onEnter: b => gsap.to(b, {y: 0, opacity: 1, duration: .9, ease: 'power3.out', stagger: .07})});
    gsap.to('#rail', {scaleY: 1, ease: 'none', scrollTrigger: {trigger: '#tl', start: 'top 70%', end: 'bottom 70%', scrub: true}});
  }
  $$('[data-count]').forEach(el => {
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    ScrollTrigger.create({trigger: el, start: 'top 92%', once: true, onEnter() {
      const o = {v: 0};
      gsap.to(o, {v: to, duration: reduce ? 0 : 2, ease: 'power3.out', onUpdate: () => el.textContent = o.v.toFixed(dec)});
    }});
  });
}

/* ===================== horizontal featured reel ===================== */
function horizontal() {
  gsap.matchMedia().add('(min-width: 901px)', () => {
    const track = $('#htrack'), cards = $$('.fcard', track);
    const dist = () => track.scrollWidth - innerWidth;
    const tw = gsap.to(track, {x: () => -dist(), ease: 'none', scrollTrigger: {
      trigger: '#hpin', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true,
      onUpdate: s => {
        $('#hbar').style.transform = `scaleX(${s.progress})`;
        $('#hnow').textContent = String(Math.min(cards.length, Math.round(s.progress * (cards.length - 1)) + 1)).padStart(2, '0');
      }}});
    if (reduce) return;
    cards.forEach((c, i) => {
      if (i) gsap.fromTo(c, {rotateY: -16, scale: .9, opacity: .45, transformPerspective: 1400, transformOrigin: 'left center'},
        {rotateY: 0, scale: 1, opacity: 1, ease: 'none',
         scrollTrigger: {trigger: c, containerAnimation: tw, start: 'left 100%', end: 'left 40%', scrub: true}});
      gsap.fromTo(c.querySelector('.art'), {xPercent: 18}, {xPercent: -12, ease: 'none',
        scrollTrigger: {trigger: c, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true}});
    });
  });
}

/* ===================== tilt ===================== */
function tilt() {
  if (!canHover || reduce) return;
  $$('.pcard').forEach(c => {
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--gx', x * 100 + '%'); c.style.setProperty('--gy', y * 100 + '%');
      gsap.to(c, {rotateY: (x - .5) * 12, rotateX: (.5 - y) * 12, transformPerspective: 900, duration: .4, ease: 'power2.out'});
    });
    c.addEventListener('mouseleave', () => gsap.to(c, {rotateX: 0, rotateY: 0, duration: .8, ease: 'elastic.out(1,.5)'}));
  });
  const portrait = $('.portrait'), pf = $('#pframe');
  portrait.addEventListener('mousemove', e => {
    const r = pf.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    gsap.to(pf, {rotateY: x * 16, rotateX: -y * 16, transformPerspective: 1000, duration: .5});
    gsap.to('.portrait .tagline', {x: x * 30, y: y * 30, duration: .5});
  });
  portrait.addEventListener('mouseleave', () => {
    gsap.to(pf, {rotateX: 0, rotateY: 0, duration: 1, ease: 'elastic.out(1,.5)'});
    gsap.to('.portrait .tagline', {x: 0, y: 0, duration: 1, ease: 'elastic.out(1,.5)'});
  });
}

/* ===================== filters ===================== */
$$('#filters button').forEach(b => b.addEventListener('click', () => {
  $$('#filters button').forEach(x => x.classList.toggle('on', x === b));
  const f = b.dataset.f, cards = $$('.pcard');
  gsap.to(cards, {opacity: 0, y: 20, duration: .2, overwrite: true, onComplete() {
    cards.forEach(c => c.classList.toggle('hide', f !== 'all' && !c.dataset.f.split(' ').includes(f)));
    gsap.fromTo($$('.pcard:not(.hide)'), {opacity: 0, y: 30, scale: .96}, {opacity: 1, y: 0, scale: 1, duration: .5, ease: 'power3.out', stagger: .05});
    ScrollTrigger.refresh();
  }});
}));

/* ===================== copy email ===================== */
$('#copyMail').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('mpk92789@gmail.com'); }
  catch (e) { location.href = 'mailto:mpk92789@gmail.com'; return; }
  const t = $('#toast'); t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 1800);
});

/* ===================== 3D tag sphere ===================== */
function tagSphere() {
  const tags = ['Embedded C', 'Python', 'LPC2148', 'ESP32', 'UNO Q', 'YOLOv8', 'OpenCV', 'Ollama', 'RAG', 'Flask', 'PostgreSQL', 'UART', 'I2C', 'SPI', 'RTC', 'PWM', 'PCB', 'Fusion 360', 'MediaPipe', 'LoRA', 'Whisper', 'Razorpay', 'Vercel', 'Git', 'Linux', 'Keil', 'Blynk', 'n8n', 'Three.js', 'Streamlit', 'PyTorch', 'DistilBERT', 'ResNet50', 'PuLP', 'Arduino', 'Sensors', 'Rust', 'JavaScript', 'Playwright', 'Interrupts'];
  const el = $('#sphere'), N = tags.length;
  const items = tags.map((t, i) => {
    const s = document.createElement('span'); s.textContent = t; s.className = 'c' + (i % 4); el.appendChild(s);
    const phi = Math.acos(-1 + (2 * i + 1) / N), th = Math.sqrt(N * Math.PI) * phi;
    return {s, x: Math.cos(th) * Math.sin(phi), y: Math.sin(th) * Math.sin(phi), z: Math.cos(phi)};
  });
  let ax = .003, ay = .004, drag = false, lx = 0, ly = 0, visible = true;
  el.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; ly = e.clientY; });
  addEventListener('pointermove', e => { if (!drag) return; ay = (e.clientX - lx) * .001; ax = -(e.clientY - ly) * .001; lx = e.clientX; ly = e.clientY; });
  addEventListener('pointerup', () => drag = false);
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !reduce) requestAnimationFrame(frame); }).observe(el);
  function frame() {
    const R = el.clientWidth * .42;
    const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
    for (const it of items) {
      let y = it.y * cx - it.z * sx, z = it.y * sx + it.z * cx; it.y = y; it.z = z;
      const x = it.x * cy + it.z * sy; z = -it.x * sy + it.z * cy; it.x = x; it.z = z;
      const sc = (it.z + 2) / 3;
      it.s.style.transform = `translate(-50%,-50%) translate3d(${it.x * R}px,${it.y * R}px,0) scale(${sc})`;
      it.s.style.opacity = .2 + .8 * (it.z + 1) / 2;
      it.s.style.zIndex = Math.round((it.z + 1) * 50);
    }
    if (!drag) { ax += (.002 - ax) * .03; ay += (.003 - ay) * .03; }
    if (visible && !reduce) requestAnimationFrame(frame);
  }
  frame();
}

/* ===================== featured-card art idle motion ===================== */
function artAnims() {
  if (reduce) return;
  const loop = {yoyo: true, repeat: -1, ease: 'sine.inOut'};
  gsap.to('.fcard .float', {y: -8, duration: 1.6, ...loop});
  gsap.to('.fcard .sonar', {opacity: .15, duration: .8, ...loop});
  gsap.to('.fcard .eye', {scaleY: .1, transformOrigin: 'center', duration: .12, yoyo: true, repeat: -1, repeatDelay: 3});
  gsap.to('.fcard .orbit1', {rotate: 360, svgOrigin: '200 150', duration: 30, repeat: -1, ease: 'none'});
  gsap.to('.fcard .orbit2', {rotate: -360, svgOrigin: '200 150', duration: 50, repeat: -1, ease: 'none'});
  gsap.to('.fcard .core', {scale: 1.12, transformOrigin: 'center', duration: 1.4, ...loop});
  gsap.to('.fcard .ping', {scale: 1.35, opacity: .3, transformOrigin: 'center', duration: 1.3, stagger: .4, ...loop});
  gsap.to('.fcard .tiles rect', {y: -6, duration: 1.2, stagger: .25, ...loop});
  gsap.to('.fcard .cart', {rotate: 10, transformOrigin: 'center', duration: .6, ...loop});
  gsap.to('.fcard .beam', {strokeDashoffset: -40, duration: 1.2, repeat: -1, ease: 'none'});
  gsap.to('.fcard .wifi path', {opacity: .2, duration: .7, stagger: .2, ...loop});
}

/* ===================== WebGL particle morph ===================== */
const gl = {};
function initGL() {
  const canvas = $('#gl');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({canvas, antialias: false, alpha: true, powerPreference: 'high-performance'}); }
  catch (e) { canvas.remove(); return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .1, 100);
  const N = isMobile() ? 6000 : 12000;
  const rnd = Math.random;

  const shapes = [
    // 0 · sphere with a fuzzy shell
    i => {
      const phi = Math.acos(1 - 2 * (i + .5) / N), th = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.3 + (rnd() < .2 ? (rnd() - .5) * 1.4 : (rnd() - .5) * .08);
      return [r * Math.sin(phi) * Math.cos(th), r * Math.sin(phi) * Math.sin(th), r * Math.cos(phi)];
    },
    // 1 · torus knot
    i => {
      const u = i / N * Math.PI * 2, rr = 1.6 + .6 * Math.cos(3 * u);
      const a = rnd() * Math.PI * 2, b = .28 * Math.sqrt(rnd());
      return [rr * Math.cos(2 * u) * 1.15 + Math.cos(a) * b, rr * Math.sin(2 * u) * 1.15 + Math.sin(a) * b, .84 * Math.sin(3 * u) + Math.sin(a + 1) * b];
    },
    // 2 · microchip: die, pins, traces
    () => {
      const r = rnd();
      if (r < .42) return [(rnd() - .5) * 2.6, (rnd() - .5) * 2.6, (rnd() - .5) * .25];
      if (r < .72) {
        const side = Math.floor(rnd() * 4), pos = -1.1 + Math.floor(rnd() * 9) * .275 + (rnd() - .5) * .08, len = 1.3 + rnd() * .45;
        const o = [[pos, len], [pos, -len], [len, pos], [-len, pos]][side];
        return [o[0], o[1], (rnd() - .5) * .05];
      }
      const ang = Math.floor(rnd() * 16) / 16 * Math.PI * 2, d = 1.8 + rnd() * 1.6;
      return [Math.cos(ang) * d, Math.sin(ang) * d, (rnd() - .5) * .1];
    },
    // 3 · spiral galaxy
    i => {
      const arm = i % 3, d = Math.pow(rnd(), .7) * 3.6, a = arm / 3 * Math.PI * 2 + d * 1.25, s = (1 - d / 4) * .35;
      return [Math.cos(a) * d + (rnd() - .5) * s, (rnd() - .5) * .25 * (1.3 - d / 3.6), Math.sin(a) * d + (rnd() - .5) * s];
    },
    // 4 · wave field
    i => {
      const side = Math.ceil(Math.sqrt(N)), x = ((i % side) / side - .5) * 8, z = (Math.floor(i / side) / side - .5) * 8;
      return [x, Math.sin(x * 1.3) * .35 + Math.cos(z * 1.1) * .35 - .4, z];
    }
  ];

  const geo = new THREE.BufferGeometry();
  ['position', 'p1', 'p2', 'p3', 'p4'].forEach((name, si) => {
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) arr.set(shapes[si](i), i * 3);
    geo.setAttribute(name, new THREE.BufferAttribute(arr, 3));
  });
  const rand = new Float32Array(N); for (let i = 0; i < N; i++) rand[i] = rnd();
  geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));

  const uniforms = {uShape: {value: 0}, uTime: {value: 0}, uSize: {value: 30}, uPR: {value: renderer.getPixelRatio()}, uIntro: {value: 0}};
  const mat = new THREE.ShaderMaterial({uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `
      attribute vec3 p1; attribute vec3 p2; attribute vec3 p3; attribute vec3 p4; attribute float aRand;
      uniform float uShape, uTime, uSize, uPR, uIntro;
      varying float vR; varying float vD;
      vec3 shapeAt(float k){
        if(k<0.5) return position; if(k<1.5) return p1; if(k<2.5) return p2; if(k<3.5) return p3; return p4;
      }
      void main(){
        float s = clamp(uShape,0.0,4.0);
        float a = floor(s); float f = s - a;
        float lf = smoothstep(0.0,1.0,clamp(f*1.7 - aRand*0.7,0.0,1.0));
        vec3 p = mix(shapeAt(a), shapeAt(min(a+1.0,4.0)), lf);
        p += normalize(p+0.001) * sin(lf*3.14159) * (0.6 + aRand) * 0.9;
        p += vec3(sin(uTime*.6+aRand*30.), cos(uTime*.5+aRand*20.), sin(uTime*.4+aRand*10.)) * 0.035;
        p *= smoothstep(0.0,1.0,clamp(uIntro*1.4-aRand*0.4,0.0,1.0));
        vec4 mv = modelViewMatrix * vec4(p,1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * uPR * (0.35 + aRand*0.9) / -mv.z;
        vR = aRand; vD = clamp(length(p)/3.6,0.0,1.0);
      }`,
    fragmentShader: `
      varying float vR; varying float vD;
      void main(){
        float d = length(gl_PointCoord-0.5);
        if(d>0.5) discard;
        float a = smoothstep(0.5,0.0,d);
        vec3 col = mix(vec3(0.133,0.827,0.933), vec3(0.655,0.545,0.98), vD);
        col = mix(col, vec3(0.64,0.9,0.21), step(0.95,vR));
        gl_FragColor = vec4(col, a*0.85);
      }`});
  const pts = new THREE.Points(geo, mat);
  const group = new THREE.Group(); group.add(pts); scene.add(group);

  const ringMat = new THREE.LineBasicMaterial({color: 0x22d3ee, transparent: true, opacity: .1});
  for (let k = 0; k < 3; k++) {
    const r = 3.4 + k * .7;
    const g = new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0, 0, r, r).getPoints(160).map(p => new THREE.Vector3(p.x, p.y, 0)));
    const l = new THREE.LineLoop(g, ringMat); l.rotation.x = Math.PI / 2.3 + k * .25; l.rotation.y = k * .6; group.add(l);
  }
  Object.assign(gl, {uniforms});

  const mouse = {x: 0, y: 0, tx: 0, ty: 0};
  addEventListener('pointermove', e => { mouse.tx = e.clientX / innerWidth - .5; mouse.ty = e.clientY / innerHeight - .5; });
  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.position.z = innerWidth < 600 ? 12 : 9;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize); resize();

  let vel = 0;
  if (lenis) lenis.on('scroll', e => { vel = e.velocity || 0; });
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    mouse.x += (mouse.tx - mouse.x) * .05; mouse.y += (mouse.ty - mouse.y) * .05;
    group.rotation.y = t * .08 + mouse.x * .8 + vel * .003;
    group.rotation.x = .25 + mouse.y * .5;
    pts.rotation.z = t * .02;
    renderer.render(scene, camera);
  });

  // each section picks a shape and where it sits
  const dimmed = ['work', 'projects', 'journey'];
  $$('section[data-shape]').forEach(sec => {
    ScrollTrigger.create({trigger: sec, start: 'top 60%', end: 'bottom 40%', onToggle: s => {
      if (!s.isActive) return;
      gsap.to(uniforms.uShape, {value: +sec.dataset.shape, duration: 1.8, ease: 'power2.inOut', overwrite: true});
      gsap.to(group.position, {x: isMobile() ? +sec.dataset.sxm : +sec.dataset.sx, duration: 1.8, ease: 'power3.inOut', overwrite: true});
      gsap.to(canvas, {opacity: isMobile() ? .4 : dimmed.includes(sec.id) ? .45 : 1, duration: 1});
    }});
  });
  group.position.x = isMobile() ? 0 : 2;
  if (isMobile()) canvas.style.opacity = .4;
}

/* ===================== boot ===================== */
horizontal();
navState();
initGL();
tagSphere();
reveals();
tilt();
artAnims();
runLoader().then(() => {
  if (lenis) lenis.start();
  if (gl.uniforms) gsap.to(gl.uniforms.uIntro, {value: 1, duration: reduce ? 0 : 2.4, ease: 'expo.out'});
  heroIntro();
  ScrollTrigger.refresh();
});

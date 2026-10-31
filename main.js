import * as THREE from 'three';
import {render} from './render.js?v=5';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = matchMedia('(hover: hover)').matches;
const isMobile = () => innerWidth < 900;
// phones and touch devices get the same design with lighter rendering
const lowPower = isMobile() || matchMedia('(hover: none)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
gsap.registerPlugin(ScrollTrigger);
if (lowPower) ScrollTrigger.config({ignoreMobileResize: true});

/* ===================== content ===================== */
// admin.html's "Preview" opens the page with ?preview, which shows the unsaved draft
async function loadContent() {
  if (new URLSearchParams(location.search).has('preview')) {
    try { const d = localStorage.getItem('pkm-admin-draft'); if (d) return JSON.parse(d); } catch (e) {}
  }
  const r = await fetch('content.json', {cache: 'no-cache'});
  return r.json();
}
const content = await loadContent();
render(content);

/* ===================== loader: dots fly in and form the portrait ===================== */
const loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });

// samples the background-removed photo into coloured dots (real colours, no tint)
function portraitDots(img, W, H) {
  const boxH = Math.min(H * (isMobile() ? .66 : .84), W * 1.25 * (isMobile() ? 1 : .62));
  const boxW = boxH * img.width / img.height;
  const left = (W - boxW) / 2, top = H - boxH - H * (isMobile() ? .15 : .03);
  const want = lowPower ? 2400 : 5200;
  const step = Math.max(3, Math.sqrt(boxW * boxH * .5 / want));
  const cols = Math.floor(boxW / step), rows = Math.floor(boxH / step);
  const c = document.createElement('canvas'); c.width = cols; c.height = rows;
  const x = c.getContext('2d', {willReadFrequently: true}); x.drawImage(img, 0, 0, cols, rows);
  const d = x.getImageData(0, 0, cols, rows).data, dots = [];
  const cx = W / 2, cy = H / 2, far = Math.hypot(W, H) * .65;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const k = (j * cols + i) * 4, a = d[k + 3];
    if (a < 60) continue;
    const r = d[k], g = d[k + 1], b = d[k + 2], lum = (r * .3 + g * .59 + b * .11) / 255;
    const tx = left + i * step + step / 2, ty = top + j * step + step / 2;
    const ang = Math.random() * Math.PI * 2, rad = far * (.7 + Math.random() * .8);
    dots.push({tx, ty, sx: cx + Math.cos(ang) * rad, sy: cy + Math.sin(ang) * rad,
      r: step * (.3 + .2 * lum) * (a / 255 * .4 + .6), col: `rgb(${r},${g},${b})`,
      delay: .1 + Math.random() * .75 + (1 - ty / H) * .3, swirl: (Math.random() - .5) * 220,
      ph: Math.random() * 6.28, x: 0, y: 0, vx: 0, vy: 0});
  }
  return dots;
}

function runLoader() {
  return new Promise(async res => {
    const loader = $('#loader');
    const finish = () => { document.body.classList.remove('loading'); res(); };
    if (reduce) { loader.remove(); return finish(); }
    const first = content.profile.firstLine.split(' ')[0].toUpperCase();
    $('#introName').innerHTML = [...first].map(ch => `<span class="ic">${ch}</span>`).join('');
    $('#introRole').innerHTML = `${content.profile.firstLine} ${content.profile.secondLine.replace(/\.$/, '')} · <b>Embedded</b> · <b>Edge AI</b> · <b>Software</b>`;
    gsap.set('#introName .ic, #introRole', {opacity: 0});

    const cv = $('#introDots'), ctx = cv.getContext('2d');
    const dpr = lowPower ? 1 : Math.min(devicePixelRatio || 1, 2);
    const W = innerWidth || document.documentElement.clientWidth || 1280, H = innerHeight || document.documentElement.clientHeight || 720;
    cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
    let dots = [];
    try {
      const img = await Promise.race([loadImg('assets/pavan.webp'), new Promise((_, no) => setTimeout(no, 4000))]);
      dots = portraitDots(img, W, H);
    } catch (e) {}
    await Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]);

    const FORM = 1.5;                          // seconds each dot takes to arrive
    const mouse = {x: -9999, y: -9999};
    const onMove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    if (canHover) addEventListener('pointermove', onMove);
    let t0 = performance.now(), exitAt = null, raf, done = false;
    const ease = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);

    function frame(now) {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      const ex = exitAt === null ? -1 : (now - exitAt) / 1000;
      if (ex > 0) ctx.globalAlpha = Math.max(0, 1 - ex / .9);
      for (const p of dots) {
        if (ex > 0) {                           // burst outward
          p.x += p.vx; p.y += p.vy; p.vx *= 1.04; p.vy *= 1.04;
        } else {
          const k = Math.min(1, Math.max(0, (t - p.delay) / FORM)), e = ease(k);
          const dx = p.tx - p.sx, dy = p.ty - p.sy, L = Math.hypot(dx, dy) || 1;
          const bend = Math.sin(Math.PI * e) * p.swirl;
          let x = p.sx + dx * e - dy / L * bend, y = p.sy + dy * e + dx / L * bend;
          if (k >= 1) {                         // formed: breathe, and part around the mouse
            x += Math.sin(t * 1.6 + p.ph) * .5; y += Math.cos(t * 1.3 + p.ph) * .5;
            const mx = x - mouse.x, my = y - mouse.y, md = mx * mx + my * my;
            if (md < 6400) { const f = (1 - Math.sqrt(md) / 80) * 18; const m = Math.sqrt(md) || 1; x += mx / m * f; y += my / m * f; }
          }
          p.x = x; p.y = y;
          if (k <= 0) continue;
        }
        ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (ex < 1.1) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    const tl = gsap.timeline()
      .to('#introName .ic', {opacity: 1, duration: .01, stagger: .07}, 1.0)
      .from('#introName .ic', {x: () => gsap.utils.random(-260, 260), y: () => gsap.utils.random(-240, 160), z: () => gsap.utils.random(-400, 300),
        rotateX: () => gsap.utils.random(-160, 160), rotateY: () => gsap.utils.random(-120, 120), rotateZ: () => gsap.utils.random(-90, 90),
        duration: 1.3, ease: 'expo.out', stagger: .07}, 1.0)
      .to('#introRole', {opacity: 1, duration: .6}, 2.1)
      .from('#introRole', {y: 14, duration: .6, ease: 'power3.out'}, 2.1)
      .add(exit, 3.9);

    function exit() {
      if (done) return; done = true; tl.kill();
      exitAt = performance.now();
      const cx = W / 2, cy = H / 2;
      for (const p of dots) {
        if (!p.x && !p.y) { p.x = p.sx; p.y = p.sy; }
        const dx = p.x - cx, dy = p.y - cy, m = Math.hypot(dx, dy) || 1, sp = 2 + Math.random() * 6;
        p.vx = dx / m * sp + (Math.random() - .5) * 2; p.vy = dy / m * sp + (Math.random() - .5) * 2;
      }
      removeEventListener('pointermove', onMove);
      gsap.timeline({onComplete: () => { cancelAnimationFrame(raf); loader.remove(); }})
        .to('#loader .intro-text, #loader .tag', {y: -50, opacity: 0, duration: .55, ease: 'power3.in'}, 0)
        .to(loader, {backgroundColor: 'rgba(5,7,13,0)', duration: .9, ease: 'power2.inOut'}, .1)
        .add(finish, .35);
    }
    setTimeout(exit, 8000);                    // never trap the visitor if timers stall
    loader.addEventListener('click', exit);
    addEventListener('keydown', exit, {once: true});
  });
}

/* ===================== smooth scroll ===================== */
let lenis = null;
if (!reduce && !lowPower) {
  lenis = new Lenis({lerp: .09, smoothWheel: true});
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
}
const mmenu = $('#mmenu');
const menuBtn = $('#menuBtn');
const setMenu = open => { mmenu.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open); menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); };
const closeMenu = () => setMenu(false);
menuBtn.addEventListener('click', () => setMenu(!mmenu.classList.contains('open')));
addEventListener('keydown', e => { if (e.key === 'Escape' && mmenu.classList.contains('open')) { closeMenu(); menuBtn.focus(); } });
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href');
  const el = id === '#top' ? 0 : $(id);
  if (el === null) return;
  e.preventDefault(); closeMenu();
  if (lenis) lenis.scrollTo(el, {duration: 1.6});
  else if (el === 0) scrollTo({top: 0, behavior: 'smooth'}); else el.scrollIntoView({behavior: 'smooth'});
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
const roles = content.profile.roles.length ? content.profile.roles : [''];
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
const cycleRoles = () => roles.length > 1 && setInterval(() => { ri = (ri + 1) % roles.length; reduce ? roleEl.textContent = roles[ri] : scramble(roleEl, roles[ri]); }, 2800);

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
      const art = c.querySelector('.art');
      if (art) gsap.fromTo(art, {xPercent: 18}, {xPercent: -12, ease: 'none',
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
  const mail = content.profile.email;
  try { await navigator.clipboard.writeText(mail); }
  catch (e) { location.href = 'mailto:' + mail; return; }
  const t = $('#toast'); t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 1800);
});

/* ===================== 3D tag sphere ===================== */
function tagSphere() {
  const tags = content.skills.sphere;
  if (!tags.length) return;
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
  let odd = false;
  function frame() {
    if (lowPower && (odd = !odd)) { if (visible && !reduce) requestAnimationFrame(frame); return; }
    const R = el.clientWidth * .42;
    const cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
    for (const it of items) {
      let y = it.y * cx - it.z * sx, z = it.y * sx + it.z * cx; it.y = y; it.z = z;
      const x = it.x * cy + it.z * sy; z = -it.x * sy + it.z * cy; it.x = x; it.z = z;
      const sc = (it.z + 2) / 3;
      it.s.style.transform = `translate(-50%,-50%) translate3d(${it.x * R}px,${it.y * R}px,0) scale(${sc})`;
      it.s.style.opacity = .62 + .38 * (it.z + 1) / 2;
      it.s.style.zIndex = Math.round((it.z + 1) * 50);
    }
    if (!drag) { ax += (.002 - ax) * .03; ay += (.003 - ay) * .03; }
    if (visible && !reduce) requestAnimationFrame(frame);
  }
  frame();
}

/* ===================== featured-card art idle motion ===================== */
function artAnims() {
  if (reduce || lowPower) return;
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
  renderer.setPixelRatio(Math.min(devicePixelRatio, lowPower ? 1 : 1.75));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .1, 100);
  const N = lowPower ? 3500 : 12000;
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

  const uniforms = {uShape: {value: 0}, uTime: {value: 0}, uSize: {value: lowPower ? 40 : 30}, uPR: {value: renderer.getPixelRatio()}, uIntro: {value: 0}};
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
  let lastW = 0;
  function resize() {
    // phones fire resize when the address bar hides; only react to width changes there
    if (lowPower && innerWidth === lastW) return;
    lastW = innerWidth;
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.position.z = innerWidth < 600 ? 12 : 9;
    camera.updateProjectionMatrix();
  }
  addEventListener('resize', resize); resize();

  let vel = 0;
  if (lenis) lenis.on('scroll', e => { vel = e.velocity || 0; });
  const clock = new THREE.Clock();
  let skip = false;
  renderer.setAnimationLoop(() => {
    if (lowPower && (skip = !skip)) return;   // ~30 fps on phones
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

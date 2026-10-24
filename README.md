# Pavan Kumar Mathi — Portfolio

Live: https://pavankumarmathi489-cpu.github.io/portfolio/

Hand-written HTML/CSS/JS, no build step.

- `index.html` — page structure and styles
- `main.js` — Three.js particle scene (morphs per section), GSAP scroll animations, Lenis smooth scroll, cursor, tilt cards, skills sphere
- `projects.js` — the project archive data (edit this to add a project)
- `assets/pavan.webp` — portrait (background removed)
- `resume/` — the three one-page résumés (Software, Hardware, Combined)

Run locally: `python -m http.server 8000` in this folder, then open http://localhost:8000
(opening `index.html` directly won't load `main.js`, because browsers block ES modules from `file://`).

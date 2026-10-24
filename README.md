# Pavan Kumar Mathi — Portfolio

Live: https://pavankumarmathi489-cpu.github.io/portfolio/
Admin: https://pavankumarmathi489-cpu.github.io/portfolio/admin.html

Hand-written HTML/CSS/JS, no build step.

- `content.json` — every piece of text, list and image path on the site (edit it through the admin page)
- `render.js` — turns `content.json` into the page sections (also gives the admin its icon/colour lists)
- `main.js` — Three.js particle scene, GSAP scroll animations, Lenis smooth scroll (desktop), cursor, tilt cards, skills sphere
- `index.html` — page layout and styles
- `admin.html` — editor for every section; publishes `content.json` and uploads through the GitHub API using a fine-grained token (Contents: read and write on this repo only) that stays in the browser
- `assets/` — portrait and uploaded images; `resume/` — the résumé PDFs

Run locally: `python -m http.server 8000` in this folder, then open http://localhost:8000
(opening `index.html` directly won't work, because browsers block ES modules and `fetch` from `file://`).

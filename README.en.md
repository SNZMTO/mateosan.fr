# mateosan.fr

> 🇫🇷 The French version comes first: [README.md](README.md). This page is its English translation.

The showcase of my projects, live at [mateosan.fr](https://mateosan.fr): who I am in thirty seconds, then what sits on the
workbench, each project with its own page.

## How it is built

- **The content is data.** Each project is one file in `contenu/projets/`: its title, tagline, status, summary, badges,
  screenshots, sections, links, tint and its object on the workbench. Adding a project means writing that file and adding it to
  the order in `contenu/projets.js`, without touching the code. A screenshot is copied from the project's repository into
  `site/images/projets/`, and the content records where it comes from (the repository, the commit, the path). Every text of the
  site lives in `contenu/`, and their types in `contenu/types.d.ts`.
- **A public version of my CV.** `site/cv-mateo-sanchez.pdf` is my CV, without my phone number: a test checks that it gives the
  site's contact address, and no other.
- **The pages are written from the content, before the commit.** `npm run pages` writes `site/*.html`; a test rejects any page
  that is not exactly what the content produces. The server serves `site/` as-is: nothing is built or executed on the VPS.
- **Readable by everyone.** The pages are plain HTML that reads without JavaScript, with a screen reader or an old browser.
  Texts keep a 4.5:1 contrast ratio against their backgrounds, computed by the tests from the palette.
- **The workbench on top.** On the home page, if the browser can draw in 3D, `site/js/demarrage.js` puts the workbench above
  the project list: one object per project, whose name shows on hover and which opens on click, by touch (one tap to look, a
  second to open) as well as from the keyboard (focusing a card makes its object jump). Choosing an object dives into it, then
  opens its page in a panel without leaving the home page: the URL follows, Escape or the browser's back button closes it, and
  the camera comes back. The scene reads everything from the page: which objects to place (`data-objet`), their names, their
  tints. The objects are data (`site/js/modeles/`, part by part), every tuning number is in `site/js/reglages.js`, and the
  colours are in the palette. For visitors who ask for reduced motion, the scene stays still: no spring, no dive, no animation.
  Without 3D or without JavaScript, the list and its pages are enough; three.js (0.149.0, served by the site) is only downloaded
  when it is used. It stays at that version, the one the scene was first drawn with, to keep its rendering: it only changes
  for a reason.
- **Nothing comes from elsewhere.** The fonts are served by mateosan.fr, and the Content Security Policy
  ([`deploiement/Caddyfile`](deploiement/Caddyfile)) accepts no inline style and no inline script.
- **JavaScript checked** by TypeScript at its strictest (`tsc --checkJs --strict`, from JSDoc comments), with nothing
  compiled: the tools, the tests and the site's scripts, which the browser reads as they are.

## The rules of the code

[`tests/regles.test.js`](tests/regles.test.js) checks them against the sources themselves: a red test is a broken rule, not a
test to change.

- Every module starts with a comment stating its role, and no hand-written file exceeds 200 lines.
- No colour outside [`site/css/palette.css`](site/css/palette.css), no resource loaded from another site, no inline style or
  script in a page.
- Texts are only written in `contenu/`: a template in the tools hard-codes nothing but tags, and a site script only displays
  what it reads from the page.
- No tuning number in the site's scripts, outside `site/js/reglages.js` and the models.
- Dependencies only go one way: `contenu/`, then `outils/`; within `site/js/`, the settings and the models, then the scene and
  the page, which ignore each other, then the start-up script.
- Nothing left pending: no bracketed placeholder, no work left "for later".

[`tests/contenu.test.js`](tests/contenu.test.js) checks that each project is complete, that its tints exist and its links are
safe, and that the site and the CV only ever give one address; [`tests/scene.test.js`](tests/scene.test.js) checks that each
project has its object, that the objects' colours are in the palette, and that each one fits on the workbench without touching
the others.

## The folders

| Folder | What it holds |
| --- | --- |
| `contenu/` | The texts: the site, the interface, the person, the projects, the legal pages. |
| `outils/pages/` | What writes the pages of `site/` from the content (`npm run pages`). |
| `site/` | What is served: the pages, the CV, the stylesheets, the workbench scripts (`site/js/`), the images, and what comes from elsewhere with its licence (`site/dependances/`: the fonts, three.js). |
| `tests/` | The rules, the content, the pages. |
| `banc/` | The test bench, in the Playwright image: every page under Chromium and WebKit, on desktop and phone (`regard.js`); the workbench by keyboard only, by touch, with reduced motion, without 3D and without JavaScript (`etabli.js`). It also draws the social sharing image. |
| `deploiement/` | The container, its server and the timer that puts `main` online ([`LISEZMOI.md`](deploiement/LISEZMOI.md), in French). |

## Running it locally

You need Node 24, and nothing else.

```sh
npm ci
npm test                         # the types, then the tests
npm run pages                    # after a change to the content
node banc/serveur.js             # the site on http://127.0.0.1:8000, as it is online: the CSP, URLs without ".html"
```

An ordinary file server (`python3 -m http.server`) is not enough: the site's links have no ".html", so `/honear` would
answer 404.

## How I built it

This site is mine from end to end: what it says, how it looks, its rules and its hosting. Claude Code wrote most of the code,
and the co-signed commits show it. I decide what the site shows, I set the rules that the tests check, and I run every page
through the test bench before putting it online.

<sub>© 2026 Mateo Sanchez, all rights reserved: the code is public to be read, not to be reused without my agreement. The
Fredoka, Nunito and Caveat fonts keep their licence, the SIL Open Font License 1.1 (in <code>site/dependances/polices/</code>),
and three.js keeps its own, the MIT licence (in <code>site/dependances/three-0.149.0/</code>). The DIciELa screenshots show art
from the POLYGON Fantasy Village pack, which remains the property of Synty Studios; one screenshot of the Honear MCP shows the
cover of Coldplay's album "Parachutes", which remains the property of its rights holders.</sub>

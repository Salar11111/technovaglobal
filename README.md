<div align="center">

# 🚀 TechNova

**A marketing site for a fictional technology company — fast by default, rich where it matters.**

![Astro](https://img.shields.io/badge/Astro-7-BC52FE?logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-000000?logo=three.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)

</div>

---

## ✨ Why TechNova?

Most agency sites ship a heavy JavaScript bundle to render what is essentially content. This one flips that around: Astro renders the pages to static HTML, and only the interactive bits — a 3D hero, a theme toggle, a contact form — hydrate as islands. The result is a site that feels immediate on a phone and still has room for a striking Three.js moment on the home page.

Everything is fictional: the company, the posts, the changelog, the testimonials. It is a demonstration of structure and restraint — content collections for the blog and changelog, design tokens in CSS, structured data and a sitemap for search engines, and a service worker for repeat visits.

### 🧩 What's inside

- 🏠 **Home** — typed headline, animated stats, solution cards, testimonials and pricing.
- 🧭 **Solutions, about and contact** — static pages with a working contact form.
- 📝 **Blog and changelog** — driven by Astro content collections.
- 🌐 **Three.js hero** — a React island for the 3D scene, hydrated only where needed.
- 🌗 **Theme toggle** — light/dark preference persisted in `localStorage`.
- ⚡ **Performance details** — loading screen, structured data, sitemap, service worker and canonical icons.

---

## 🚀 Quick start

Requirements: Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

Open the URL Astro prints (usually http://localhost:4321).

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Static production build |
| `npm run preview` | Preview the build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run typecheck` | `astro check` |

---

## 🧱 Stack

| Layer | Choice |
| --- | --- |
| Framework | Astro 7 (static output) |
| Islands | React for the 3D hero, theme toggle and contact form |
| 3D | Three.js |
| Language | TypeScript |
| Styles | CSS custom properties and design tokens |
| Content | Astro content collections |
| Quality | ESLint, Prettier, `astro check`, Husky pre-commit |

---

## 🗂 Project structure

```text
src/
├── components/
│   ├── three/ThreeHero.tsx       # 3D React island
│   ├── forms/ContactForm.tsx     # Hydrated form
│   └── ui/                       # Astro primitives (Nav, Cards, Footer, …)
├── content/
│   ├── blog/                     # Blog posts
│   └── changelog/                # Release notes
├── layouts/Base.astro
├── pages/                        # Home, solutions, about, contact, blog, changelog
├── styles/                       # Global styles and tokens
└── content.config.ts
public/                           # Icons, manifest, robots, service worker, analytics
```

---

## ✅ Quality

```bash
npm run lint
npm run format
npm run typecheck
npm run build
```

A Husky pre-commit hook keeps formatting and lint in the loop before a commit lands.

---

## 🗺 Roadmap ideas

- 📊 Real case-study pages backed by content collections
- 🔎 On-site search for posts and changelog entries
- 🖼️ More interactive product demos as islands
- 📈 Core Web Vitals budgets in CI

---

<div align="center">

Static by default, interactive where it counts. Built with Astro and Three.js.

</div>

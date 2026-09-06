# AETHERIS — Web3 Experience

**Aetheris** is a cinematic, high-fidelity marketing site for a fictional Layer-1 blockchain protocol — "the foundational Layer-1 for the next internet" — featuring parallel execution, zero-knowledge settlement, and decentralized sequencing.

The entire project is a **front-end only** React single-page application. There is no backend, no wallet integration, and no on-chain code — all "live" network statistics, staking calculators, and governance data are rendered from local/mock data inside the components.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Pages & Routes](#pages--routes)
- [Architecture Overview](#architecture-overview)
- [Design System](#design-system)
- [Key Concepts & Patterns](#key-concepts--patterns)
- [Browser & Accessibility Support](#browser--accessibility-support)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Extending the Project](#extending-the-project)

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | [React](https://react.dev) | ^18.2 | UI rendering |
| Build tool | [Vite](https://vitejs.dev) | ^6.3 | Dev server & bundling |
| Language | [TypeScript](https://www.typescriptlang.org) | ^5.7 (strict mode) | Type safety |
| Styling | [Tailwind CSS](https://tailwindcss.com) | **v4.1** via `@tailwindcss/vite` plugin | Utility-first CSS, CSS-first `@theme` config |
| Routing | [react-router-dom](https://reactrouter.com) | ^6.8 (`HashRouter`) | Client-side navigation |
| Animation | [Framer Motion](https://www.framer.com/motion/) | ^11.16 | Page/element animations, `MotionConfig reducedMotion="user"` |
| Smooth scroll | [Lenis](https://lenis.darkroom.engineering) | ^1.3 | Buttery smooth-wheel scrolling |
| Charts | [Recharts](https://recharts.org) | ^2.10 | Tokenomics/emission charts |
| Icons | [Lucide React](https://lucide.dev) | ^0.294 | Icon set |
| Fonts | Clash Display, Instrument Sans, JetBrains Mono | — | Display / body / mono (loaded via Fontshare + Google Fonts) |

Other installed but auxiliary libraries: `@dnd-kit/*` (drag & drop), `@supabase/supabase-js` (available if a backend is ever added), `canvas-confetti`, `date-fns`, `uuid`.

## Project Structure

```
AETHERIS-blockchain/
├── index.html                  # Vite entry HTML (fonts, meta, inline SVG favicon)
├── vite.config.js              # React + Tailwind v4 plugins, dev server on :3000
├── tsconfig.json               # Strict TS, bundler module resolution, noEmit
├── package.json                # Scripts & dependencies
├── README.md
└── src/
    ├── main.tsx                # React root
    ├── App.tsx                 # Router, Lenis setup, ambient background layers
    ├── index.css               # Tailwind import, @theme tokens, custom effects
    ├── components/
    │   ├── Layout.tsx          # Overflow-x guard shell (clip, not hidden)
    │   ├── Nav.tsx             # Fixed nav, mobile drawer, wordmark
    │   ├── Footer.tsx
    │   ├── PageHeader.tsx      # Reusable page hero
    │   ├── NetworkMesh.tsx     # Animated network visualization
    │   └── ui/
    │       ├── AnimatedCounter.tsx   # Count-up number animation
    │       ├── HolographicCard.tsx   # Hover border-glow card
    │       └── TextReveal.tsx        # Staggered text entrance
    └── pages/
        ├── Home.tsx            # Landing page
        ├── Technology.tsx      # Protocol architecture, sticky side rail
        ├── Tokenomics.tsx      # Supply curves, staking calculator
        ├── Ecosystem.tsx       # dApps / partners grid
        ├── Developers.tsx      # Docs-style page, IDE column
        └── Governance.tsx      # Proposals, voting UI
```

## Getting Started

### Prerequisites

- **Node.js ≥ 18** (Vite 6 requires Node 18+; Node 20 LTS recommended)
- npm (bundled with Node) or pnpm/yarn

### Installation

```bash
# clone
git clone https://github.com/mayorxyz/AETHERIS-blockchain.git
cd AETHERIS-blockchain

# install dependencies
npm install

# start the dev server
npm run dev
```

The site runs at **http://localhost:3000** (the port is fixed with `strictPort: true` — if 3000 is busy the dev server will fail rather than pick another port; free the port or edit `vite.config.js`).

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR on port 3000 (host `0.0.0.0`, LAN-accessible) |
| `npm run build` | Production build → outputs to `dist/` |
| `npm run typecheck` | Run `tsc --noEmit` to type-check without emitting |

There is currently no test suite, linter config, or preview script (`npx vite preview` can be used to serve the production build locally).
## Pages & Routes

Routing uses **`HashRouter`** (URLs look like `/#/tokenomics`). This makes the site trivially deployable to any static host without server-side rewrites.

| Path | Page | Highlights |
|---|---|---|
| `/` (and `*` fallback) | Home | Hero with text reveal, animated counters, network mesh |
| `/technology` | Technology | Sticky side rail, architecture sections |
| `/tokenomics` | Tokenomics | Emission charts (Recharts), interactive staking calculator |
| `/ecosystem` | Ecosystem | Project/partner grid with holographic cards |
| `/developers` | Developers | Documentation-style layout with IDE column |
| `/governance` | Governance | Proposal cards, voting metrics |

## Architecture Overview

### Entry flow

```
main.tsx → App.tsx
             ├─ MotionConfig (reducedMotion="user")   ← respects OS setting
             ├─ HashRouter
             └─ Shell
                 ├─ Lenis smooth scroll (skipped if prefers-reduced-motion)
                 ├─ Layout (overflow-x guard)
                 ├─ ambient layers: .blueprint-grid, .dot-matrix, .noise-veil
                 ├─ ScrollManager (scrolls to top on route change)
                 ├─ Nav
                 ├─ <Routes> …six pages…
                 └─ Footer
```

### Design decisions worth knowing

1. **HashRouter over BrowserRouter** — no server config needed for deep links on static hosts. If you migrate to a host with SPA rewrite support, swapping to `BrowserRouter` gives cleaner URLs.
2. **Lenis smooth scroll** is instantiated once in `Shell` and destroyed on unmount. It is intentionally **disabled for users with `prefers-reduced-motion: reduce`**. The `ScrollManager` component scrolls to top on every pathname change (using Lenis if active, `window.scrollTo` otherwise).
3. **`overflow-x: clip` instead of `hidden`** in `Layout.tsx` — `clip` does not create a scroll container, so `position: sticky` elements (Technology side rail, Developers IDE column) keep working. A `@supports` fallback in CSS applies `overflow-x: hidden` on older browsers.
4. **All data is local** — stats, proposals, and calculator results are hardcoded in each page component. There are no API calls at runtime.

## Design System

Tailwind v4's **CSS-first configuration** is used — there is **no `tailwind.config.js`**. All design tokens live in the `@theme` block in `src/index.css`:

| Token | Value | Usage |
|---|---|---|
| `--color-void` | `#030305` | Page background (near-black) |
| `--color-abyss` | `#08080d` | Elevated surfaces |
| `--color-holo` | `#e2e8f0` | Primary text |
| `--color-dim` | `#8a93a6` | Secondary text |
| `--color-faint` | `#5a6373` | Tertiary text |
| `--color-plasma` / `-soft` | `#7b2cbf` / `#a86ae0` | Brand purple |
| `--color-cyber` | `#00f0ff` | Brand cyan (accents, glows) |
| `--color-amber-x` | `#f5b74e` | Warm accent |
| `--font-display` | Clash Display | Headings (`font-display` class) |
| `--font-body` | Instrument Sans | Body text |
| `--font-mono` | JetBrains Mono | Code/numbers (`font-mono` class) |

These generate utilities like `bg-void`, `text-holo`, `text-cyber`, `border-cyber`, etc.

### Custom CSS effects (in `index.css`)

- **`.holo`** — glassmorphic card with an animated conic-gradient border glow on hover (uses the `@property --holo-angle` Houdini feature).
- **`.blueprint-grid` / `.dot-matrix` / `.noise-veil`** — fixed, `pointer-events: none` ambient background layers rendered in `App.tsx`.
- **`.marquee-track`** — infinite horizontal marquee; **`.live-dot`** — pulsing "live" indicator.
- **`.aeth-range`** — custom-styled range input used by the staking calculator.
- **`.text-outline`, `.caret-blink`, `.dash-flow`, `.spin-slow`, `.float-y`** — misc. decorative animations.
- **Reduced motion**: every looping animation is disabled under `@media (prefers-reduced-motion: reduce)`.

## Key Concepts & Patterns

- **Strict TypeScript** — `strict: true`, `isolatedModules`, bundler module resolution. Type-check with `npm run typecheck` before committing.
- **Reusable UI primitives** — `HolographicCard`, `AnimatedCounter`, `TextReveal`, `PageHeader` wrap common motion/visual patterns so pages stay declarative.
- **Framer Motion conventions** — `whileInView` for scroll-triggered reveals, `AnimatePresence` for the mobile nav drawer, page-level `motion` wrappers for transitions.
- **Performance** — transform/opacity-only keyframe animations with `will-change`, `requestAnimationFrame` loop for Lenis, single fixed background layers instead of per-element effects.

## Browser & Accessibility Support

- Targets evergreen browsers; uses modern CSS (`overflow: clip`, `@property`, `mask-composite`) with graceful fallbacks.
- Decorative layers marked `aria-hidden="true"`.
- Full `prefers-reduced-motion` support: Lenis disabled, Framer `MotionConfig reducedMotion="user"`, CSS animations disabled.
- Touch devices get `touch-action: manipulation` on interactive elements (no double-tap zoom delay).

## Deployment

The build is a fully static bundle in `dist/`:

```bash
npm run build
```

Because routing is hash-based, **any static host works with zero configuration**:

- **Vercel / Netlify** — import the repo, build command `npm run build`, output dir `dist`.
- **GitHub Pages** — push `dist/` to a `gh-pages` branch (e.g. via an action) and enable Pages.
- **Cloudflare Pages / S3 / nginx** — serve `dist/` as static files; no rewrite rules needed.

## Troubleshooting

| Problem | Fix |
|---|---|
| `Port 3000 is already in use` | Vite uses `strictPort: true`. Kill the process on 3000 or change the port in `vite.config.js`. |
| Type errors in editor | Run `npm run typecheck`; ensure VS Code uses the workspace TypeScript version (v5.7). |
| Animations not running | Check OS "reduce motion" setting — motion is intentionally disabled for reduced-motion users. |
| Sticky elements stop sticking | Do not change `Layout.tsx`'s `overflow-x: clip` to `hidden` — `hidden` breaks sticky positioning. |
| Fonts not loading | Fonts load from Fontshare/Google Fonts CDNs; offline dev falls back to system fonts. |

## Extending the Project

- **Add a page**: create `src/pages/MyPage.tsx`, add a route in `App.tsx` and a link in `Nav.tsx`'s `LINKS` array. Use `PageHeader` for consistency.
- **Add a color/token**: extend the `@theme` block in `src/index.css` — utilities are generated automatically by Tailwind v4.
- **Real data**: the repo already ships `@supabase/supabase-js`; wire Supabase into page components to replace mock stats with live data.
- **Testing/linting**: none configured yet — good first additions would be ESLint + `typescript-eslint`, Vitest, and React Testing Library.




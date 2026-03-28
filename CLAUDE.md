# Project: Personal Portfolio Website

Personal portfolio for Qi (Chee) Liu, deployed on Vercel.

## Tech Stack

- **Framework**: React 19 + Vite 7 (SPA)
- **Styling**: Tailwind CSS 4 (Vite plugin, not PostCSS)
- **Animation**: GSAP 3.13 (ScrollTrigger, MotionPathPlugin, SplitText)
- **Routing**: React Router DOM 7
- **UI**: Radix UI primitives, lucide-react icons, shadcn/ui components
- **Backend**: Vercel Serverless Functions (api/) + Redis (Vercel KV)
- **Deployment**: Vercel (vercel.json, SPA rewrites)

## Project Structure

```
my-portfolio/
  src/
    components/       # React components
    components/ui/    # shadcn/ui base components
    data/             # Static data (blog, experience, projects, skills)
    lib/              # Utilities (cn helper)
    pages/            # Route-level pages (Home, MosoTea, MyComponents, NotFound)
  api/                # Vercel serverless functions (likes, visitor-stats, cv-downloads)
  public/img/         # Static images
```

## Commands

```bash
cd my-portfolio
npm run dev           # Start dev server (localhost:5173)
npm run build         # Production build
npm run lint          # ESLint
npm run format        # Prettier format
npm run format:check  # Prettier check
```

## Code Conventions

### JavaScript / React

- **No TypeScript** - project uses plain JS with JSX
- **Functional components only** - no class components
- **Hooks for state/effects** - useRef for imperative DOM/canvas, useState for reactive state
- **Named exports for data**, default exports for components
- **Path alias**: `@/` maps to `src/`
- **Chinese comments** are common in the codebase - keep this style when modifying existing files

### Formatting (Prettier)

- Single quotes, JSX single quotes
- Semicolons: yes
- Tab width: 2, spaces (no tabs)
- Trailing commas: ES5
- Print width: 100
- Arrow parens: avoid when possible

### Styling

- Tailwind utility classes as the primary styling method
- Inline `style={}` for dynamic values (canvas dimensions, GSAP-driven properties)
- `cn()` helper from `@/lib/utils` for conditional class merging
- Dark theme is the default (body background: `oklch(0.13 0.03 261.7)`)
- Color palette: cyan glow effects (`rgba(0,255,255,...)`) for interactive elements

### Animation Patterns

- **GSAP** for complex/sequenced animations and scroll-driven effects
- **Canvas API** for continuous rendering (GalaxyBackground, LizardCursor)
- **CSS animations** for simple loops (arrow-blink, pulse)
- Always clean up GSAP timelines and ScrollTrigger instances in useEffect return
- Always cancelAnimationFrame in cleanup

### Data

- Static content lives in `src/data/*.js` as exported arrays/objects
- Images served from `public/img/` with absolute paths (`/img/...`)
- API endpoints at `/api/*` (Vercel serverless, Redis-backed)

### Component Patterns

- Canvas-based components manage their own lifecycle (create canvas, bindEvents, rAF loop, cleanup)
- Scroll-triggered sections use GSAP ScrollTrigger with ref-based selectors
- `sessionStorage` for per-session flags (e.g., loading animation played)

## Environment

- Redis URL in `process.env.kv_REDIS_URL` (Vercel KV, server-side only)
- No `.env` files committed - secrets managed via Vercel dashboard

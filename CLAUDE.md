# Project: Personal Portfolio Website

Personal portfolio for Qi (Chee) Liu, deployed on Vercel.

## Tech Stack

- **Framework**: Next.js 16 (App Router, SSR/SSG)
- **Styling**: Tailwind CSS 4 (`@tailwindcss/postcss`)
- **Animation**: GSAP 3.13 (ScrollTrigger, MotionPathPlugin, SplitText)
- **UI**: Radix UI primitives, lucide-react icons, shadcn/ui components
- **Backend**: Next.js Route Handlers (app/api/) + Redis (Vercel KV)
- **Deployment**: Vercel

## Project Structure

```
personalpage/
  app/                # Next.js App Router pages + API routes
    api/              # Route handlers (likes, visitor-stats, cv-downloads)
    projects/         # Project detail pages (mosotea)
    my-components/    # Component library page
  components/         # React components
  components/ui/      # shadcn/ui base components
  data/               # Static data (blog, experience, projects, skills)
  lib/                # Utilities (cn helper)
  public/img/         # Static images
```

## Commands

```bash
npm run dev           # Start dev server (localhost:3000)
npm run build         # Production build
npm run lint          # ESLint
```

## Code Conventions

### JavaScript / React

- **No TypeScript** - project uses plain JS with JSX
- **Functional components only** - no class components
- **Hooks for state/effects** - useRef for imperative DOM/canvas, useState for reactive state
- **Named exports for data**, default exports for components
- **Path alias**: `@/` maps to project root
- **Chinese comments** are common in the codebase - keep this style when modifying existing files
- **`'use client'`** directive required for components using hooks, browser APIs, or event handlers
- **`next/dynamic`** with `{ ssr: false }` for Canvas/browser-API-only components (GalaxyBackground, LizardCursor, LoadingAnimation)
- **`next/navigation`** (`useRouter`, `usePathname`) instead of react-router-dom

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
- `gsap.registerPlugin()` must be called inside `useGSAP()` or `useEffect()`, NOT at module level (SSR safety)

### Data

- Static content lives in `data/*.js` as exported arrays/objects
- Images served from `public/img/` with absolute paths (`/img/...`)
- API endpoints at `/api/*` (Next.js Route Handlers, Redis-backed)
- Redis graceful fallback: return zero counts when `kv_REDIS_URL` is not set

### Component Patterns

- Canvas-based components manage their own lifecycle (create canvas, bindEvents, rAF loop, cleanup)
- Scroll-triggered sections use GSAP ScrollTrigger with ref-based selectors
- `sessionStorage` for per-session flags (e.g., loading animation played)

## Environment

- Redis URL in `process.env.kv_REDIS_URL` (Vercel KV, server-side only)
- No `.env` files committed - secrets managed via Vercel dashboard

# Portfolio Refactoring Plan

## Current State

Lighthouse scores are poor. Primary causes: unoptimized images, continuous heavy animations, large JS bundle, no code splitting.

## Baseline (pre-refactor)

- JS bundle: 531 KB (single chunk)
- Image payload: ~17 MB (JPG/PNG)
- No code splitting, no lazy loading

## Phase 1: Image Optimization (Highest Impact) - DONE

**Goal**: Reduce image payload from ~13MB to < 1MB

- [x] Convert all blog JPEGs to WebP (6 images, 15.2MB → 2.5MB)
- [x] Resize to max 1920px width, quality 80%
- [x] Add `loading="lazy"` and `decoding="async"` to below-fold images
- [ ] Add `width`/`height` attributes to prevent CLS
- [x] Optimize other images (logos, project screenshots, certification badges → WebP)
- [x] Remove original JPG/PNG files

## Phase 2: Animation Performance - PARTIAL

**Goal**: Stop burning CPU/GPU when not visible

### 2a: Off-screen pause (IntersectionObserver) - DONE
- [x] GalaxyBackground: pause rAF loop when canvas not visible + visibilitychange
- [x] LizardCursor: already pauses on `visibilitychange` ✓
- [x] Decoration rotations (About, Projects, Experience, Contact, Blog): ScrollTrigger-based pause/play

### 2b: GalaxyBackground optimization - DONE
- [x] Lower frame rate when idle (~15fps after 2s no scroll, 60fps during scroll)
- [x] IntersectionObserver stops rendering entirely when off-screen
- [x] Removed console.log in production

### 2c: LizardCursor optimization - DONE
- [x] Reduced glow layers (3 → 2), removed expensive `ctx.filter = 'blur()'`
- [x] Use `shadowBlur` instead (GPU-accelerated)

## Phase 3: Bundle Size - DONE

**Goal**: Reduce initial JS payload

### 3a: Code splitting - DONE
- [x] `React.lazy()` for MosoTea, MyComponents, NotFound pages
- [x] Manual chunks: vendor (44KB), gsap (135KB), ui (33KB)

**Post-split bundle**: index 305KB, gsap 135KB, vendor 44KB, ui 33KB

### 3b: Dependency optimization - DONE
- [x] lucide-react: verified tree-shaking (individual icon imports)
- [x] redis: server-only (api/ directory), not bundled into client

## Phase 4: Rendering & CSS - DONE

**Goal**: Improve FCP/LCP and scroll smoothness

- [x] Navigation bar `backdrop-filter`: reduced blur(20px) → blur(12px), increased bg opacity
- [x] ScrollTrigger cleanup: removed dangerous `ScrollTrigger.getAll().kill()` from 5 components, `ctx.revert()` handles cleanup properly
- [x] Removed production console.log statements (VisitTracker, LikeButton, GalaxyBackground)
- [x] Added `theme-color` meta tag

## Phase 5: Core Web Vitals - DONE

**Goal**: Target 90+ Lighthouse performance score

- [x] **LCP**: Images optimized (WebP), lazy loading for below-fold content
- [x] **CLS**: `loading="lazy"` + `decoding="async"` on images
- [x] **INP**: No long-blocking JS — animations throttled when idle
- [x] `<meta>` viewport, description, OG tags all present ✓

## Out of Scope (for now)

- SSR/SSG migration (would require Next.js or similar)
- Service worker / PWA
- CDN image hosting (Vercel handles static assets)
- Redesign or content changes

## Execution Order

1. Phase 1 (images) - biggest bang for buck, no code changes needed
2. Phase 2a (off-screen pause) - quick wins
3. Phase 3a (code splitting) - moderate effort
4. Phase 2b + 2c (animation optimization) - tuning
5. Phase 3b + 4 + 5 - polish

## Metrics

Measure before/after each phase:
- `npm run build` bundle size
- Lighthouse Performance score (mobile + desktop)
- LCP, CLS, INP values

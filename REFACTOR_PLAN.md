# Portfolio Refactoring Plan

## Current State

Lighthouse scores are poor. Primary causes: unoptimized images, continuous heavy animations, large JS bundle, no code splitting.

## Phase 1: Image Optimization (Highest Impact)

**Goal**: Reduce image payload from ~13MB to < 1MB

- [ ] Convert all blog JPEGs to WebP (6 images, currently 1.8-3.3MB each)
- [ ] Resize to max 1920px width, quality 80%
- [ ] Add `loading="lazy"` and `decoding="async"` to below-fold images
- [ ] Add `width`/`height` attributes to prevent CLS
- [ ] Optimize other images (logos, project screenshots, certification badges)
- [ ] Consider `<picture>` with WebP + JPEG fallback if browser support matters

## Phase 2: Animation Performance

**Goal**: Stop burning CPU/GPU when not visible

### 2a: Off-screen pause (IntersectionObserver)
- [ ] GalaxyBackground: pause rAF loop when canvas not visible
- [ ] LizardCursor: already pauses on `visibilitychange`, verify behavior
- [ ] Decoration rotations (Projects, Experience, Contact, Blog): pause GSAP infinite tweens when section off-screen

### 2b: GalaxyBackground optimization
- [ ] Reduce star count or drawing complexity
- [ ] Lower frame rate when idle (e.g., 30fps when no scroll activity)
- [ ] Skip meteor rendering when off-screen

### 2c: LizardCursor optimization
- [ ] Reduce glow layers (3 → 2) or simplify blur usage
- [ ] Consider reducing canvas resolution on low-end devices
- [ ] Throttle IK updates when mouse velocity is low

## Phase 3: Bundle Size

**Goal**: Reduce initial JS payload

### 3a: Code splitting
- [ ] `React.lazy()` for MosoTea and MyComponents pages
- [ ] Dynamic import GSAP MotionPathPlugin (only used in LoadingAnimation)
- [ ] Dynamic import SplitText (only used in MyNavigation)

### 3b: Dependency optimization
- [ ] lucide-react: verify tree-shaking works (import individual icons, not barrel)
- [ ] `redis` package: confirm it's server-only and not bundled into client
- [ ] Audit bundle with `vite-plugin-visualizer` to find surprises

## Phase 4: Rendering & CSS

**Goal**: Improve FCP/LCP and scroll smoothness

- [ ] Navigation bar `backdrop-filter: blur(20px)`: evaluate perf cost, consider fallback on low-end
- [ ] ScrollTrigger cleanup: audit all components for proper `ScrollTrigger.kill()` in useEffect cleanup
- [ ] Consider `will-change` hints for animated elements
- [ ] Audit `!important` overrides in index.css (body background)

## Phase 5: Core Web Vitals

**Goal**: Target 90+ Lighthouse performance score

- [ ] **LCP**: Ensure above-fold content loads fast (hero text, galaxy bg)
  - Inline critical CSS or ensure Tailwind purges correctly
  - Preload hero assets if needed
- [ ] **CLS**: Fixed dimensions on all images, stable nav bar height
- [ ] **INP**: Ensure no long-blocking JS during interactions
- [ ] Add `<meta>` viewport and proper `<head>` tags if missing
- [ ] Test with Lighthouse CI or PageSpeed Insights after each phase

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

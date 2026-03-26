# Moso Tea — Full-Stack Web Application

> **Role:** Full-Stack Developer
> **Team:** 2 Developers (Agile, 1-week sprints)
> **Duration:** ~1 week (Pre-Sprint + 5 Sprints)
> **Live Site:** [mosotea.co.nz](https://mosotea.co.nz)
> **Repository:** [github.com/LIUQI1010/mosotea-web-](https://github.com/LIUQI1010/mosotea-web-)

---

## Project Overview

Moso Tea is a commercial website built for a New Zealand-based artisan tea experience studio. The business offers immersive, hands-on tea culture experiences — including guided tea ceremony sessions, tea tree exploration, and tea tasting — for individuals, couples, and small groups.

The website serves as the primary online presence, enabling customers to browse experience offerings, submit booking requests, and manage cancellations. A secure admin dashboard allows the business owner to manage bookings, time slots, and view operational metrics.

The project was delivered end-to-end in approximately one week: from requirements gathering and client sign-off through to production deployment, performance optimisation, and user acceptance testing.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) with TypeScript (strict mode) |
| Styling | Tailwind CSS v4 with custom design system |
| Database | Supabase (PostgreSQL) with Row Level Security |
| Authentication | Supabase Auth (admin-only) |
| Email | Resend (transactional emails) |
| Deployment | Vercel (CI/CD, auto-deploy on push) |
| Domain & CDN | Cloudflare (DNS, SSL) |
| Internationalisation | next-intl v4 (English + Traditional Chinese) |
| Validation | Zod (server-side schema validation) |

---

## Key Features

### 1. Online Booking System

- Two-step booking flow: date/time selection → customer details form
- Real-time availability checking against database capacity (max 8 guests per slot)
- Two fixed daily time slots (10:00–11:30 AM, 2:00–3:30 PM) with configurable capacity
- Race condition prevention via PostgreSQL database triggers that atomically check and update guest counts
- Server-side input validation with Zod (name, email, phone, guest count, special requests)
- Browser-level enforcement with `maxLength` attributes
- Smart time slot filtering: slots within 2.5 hours of the current time are automatically hidden to prevent last-minute bookings

### 2. Self-Service Cancellation

- Each booking generates a unique HMAC-SHA256 signed cancellation token
- Customers receive a cancellation link in their confirmation email
- Two-step cancellation UI: lookup booking details → confirm cancellation
- Business rule enforcement: cancellation only permitted more than 24 hours before the session
- Within 24-hour window: displays a "contact the business directly" message
- Token is single-use and expires at session start time
- Database trigger automatically releases guest capacity on cancellation

### 3. Admin Dashboard

- Protected by Supabase Auth with middleware-based route guarding
- **Dashboard overview:** today's visitors, weekly bookings, monthly revenue, pending booking count
- **Booking management:** searchable list with calendar view, inline confirm/cancel actions, status filtering, pagination
- **Time slot management:** calendar-based slot viewer, add/remove/toggle individual slots, bulk "Generate Next 30 Days" action
- **Direct booking creation:** admin can create bookings on behalf of walk-in or phone customers
- Server Actions pattern for all data mutations (no separate API routes for admin operations)

### 4. Automated Email Notifications

Five distinct email types, all supporting bilingual content (English / Traditional Chinese):

| Email | Recipient | Trigger |
|---|---|---|
| Booking Received | Customer | On submission (status: pending) |
| Booking Notification | Admin | On customer submission |
| Booking Confirmed | Customer | On admin confirmation |
| Cancellation Confirmation | Customer | On any cancellation |
| Cancellation Notice | Admin | On customer self-cancellation only |

### 5. Bilingual Support (i18n)

- Full internationalisation with next-intl: English (default) and Traditional Chinese (zh-TW)
- URL-based locale routing with `as-needed` prefix mode (`/about` for English, `/zh-TW/about` for Chinese)
- Language toggle in the navigation bar on all public pages
- Complete translation coverage: page content, form labels, validation errors, email templates
- Single-language display rule: each page renders in one language only — no mixed-language content

### 6. Public Information Pages

- Home, About Us, Workshop, Contact, Privacy Policy, Terms of Service
- Contact form with email delivery via Resend
- Responsive design across mobile, tablet, and desktop
- SEO-optimised with metadata, sitemap.xml, and robots.txt

---

## Architecture & Technical Decisions

### Timezone Handling

The application serves New Zealand users but runs on UTC servers. A robust timezone strategy was implemented:

- **Date string arithmetic:** All date calculations use `Date.UTC()` and string manipulation to avoid timezone double-conversion bugs
- **UTC range queries:** NZ dates are converted to UTC ranges covering both NZST (+12:00) and NZDT (+13:00) for accurate database queries
- **DST-aware slot generation:** Uses `Intl.DateTimeFormat.formatToParts` to determine the correct UTC offset per date, ensuring slots are generated at the right local times year-round

### Security

- HMAC-SHA256 signed cancellation tokens (not guessable UUIDs)
- Row Level Security (RLS) policies on all Supabase tables
- Service role key isolated to server-side API routes only
- Zod validation on all API inputs with length constraints
- No sensitive data exposed in cancellation lookup responses
- Environment variables properly segregated (public vs server-only)

### Performance

- All images compressed (20 MB → 2 MB) using Sharp
- SVG favicon for minimal overhead
- Next.js App Router with server components (minimal client-side JavaScript)
- Database-side search filtering with Supabase `.or()` (not client-side JS filtering)
- Explicit column selection in all database queries (no `SELECT *`)
- Pagination on booking list queries
- Loading states with Next.js `loading.tsx` convention
- Lighthouse scores: 90+ across Performance, Accessibility, Best Practices, and SEO

### Database Design

- Three tables: `time_slots`, `bookings`, `gallery`
- PostgreSQL triggers for atomic capacity management (check + update in one transaction)
- Automatic `updated_at` timestamps via trigger
- Capacity release on cancellation via trigger
- Indexed queries for time-range and status filtering

---

## Development Process

### Agile Methodology

- **~1-week delivery** across a pre-sprint discovery phase and 5 sprints (~1 day each)
- Sprint ceremonies: planning, daily standups, sprint reviews, retrospectives
- GitHub Projects board for task tracking
- Feature branch workflow with PR reviews before merging to `develop`
- `develop` → `main` merge at each sprint boundary for production deployment

### Sprint Breakdown

| Sprint | Focus | Key Deliverables |
|---|---|---|
| Pre-Sprint | Discovery | Product Requirements Document, client sign-off |
| Sprint 0 | Setup | Repository, CI/CD, database schema, wireframes, design system |
| Sprint 1 | Core Pages | All information pages, bilingual support, contact form, SEO |
| Sprint 2 | Booking System | End-to-end booking flow, cancellation tokens, email notifications |
| Sprint 3 | Admin Dashboard | Booking management, slot management, self-cancellation UI, bug fixes |
| Sprint 4 | Launch | Performance optimisation, cross-browser testing, UAT, production launch |

### Quality Assurance

- TypeScript strict mode with no `any` types
- ESLint with Husky pre-commit hooks
- End-to-end testing with real database (no mocks)
- Cross-browser testing: Chrome, Safari, Firefox
- Full mobile device testing
- Client User Acceptance Testing (UAT)

---

## Professional Skills Demonstrated

| Skill | Evidence |
|---|---|
| Full-Stack Development | Next.js App Router, Supabase PostgreSQL, REST API design, server actions, authentication |
| TypeScript | Strict mode, Zod schemas, shared type definitions, no runtime type errors |
| Database Design | Normalised schema, triggers for data integrity, RLS policies, timezone-aware queries |
| API Design | RESTful endpoints, consistent response shapes, input validation, error handling |
| Security Engineering | HMAC token signing, RLS, input sanitisation, secret management |
| Internationalisation | Full i18n with next-intl, locale routing, bilingual email templates |
| Performance Optimisation | Image compression, selective data fetching, server components, Lighthouse 90+ |
| Agile Project Management | Sprint planning, task estimation, daily standups, retrospectives |
| DevOps | Vercel CI/CD, Cloudflare DNS, environment variable management, branch protection |
| Client Communication | Requirements gathering, PRD sign-off, UAT, user guide delivery |
| UI/UX Design | Responsive layouts, custom design system, East Asian-inspired aesthetic |

---

## Summary

> Delivered a full commercial website for a New Zealand tea experience studio in a 2-person Agile team over approximately one week. Built with Next.js 16, TypeScript, Tailwind CSS, Supabase, and Resend. Features include an online booking system with self-service cancellation, a secure admin dashboard, bilingual support (English / Traditional Chinese), and automated email notifications. Achieved Lighthouse performance scores of 90+ across all categories. Managed the full project lifecycle from requirements gathering to production launch using GitHub Projects and weekly sprints.

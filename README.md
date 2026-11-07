# Grantly - Rethinking the Scholarship Experience

Grantly is an accessible, privacy-first scholarship discovery and application tracking web application. Built as a fast, frontend-only system for students worldwide, Grantly eliminates account creation barriers, advertisements, and fragmented listings by pairing a comprehensive scholarship directory with client-side profile matching and persistent browser-local Kanban application tracking.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.5-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Live Demo: [https://gradly-umber.vercel.app/](https://gradly-umber.vercel.app/)

---

## 1. The Problem and the Solution

Built for the Outpost hackathon brief (*"Grantly: Rethinking the Scholarship Experience"*), Grantly addresses the core operational hurdles students face during scholarship discovery and management without requiring a backend or user login.

| Student Pain Point | How Grantly Solves It |
| :--- | :--- |
| **Scattered Information** | Centralized directory of 30 deeply detailed scholarship profiles with multi-facet filtering (level, discipline, nationality, coverage, deadline window) and instant debounced search. |
| **Unclear Eligibility** | Client-side deterministic match algorithm comparing education level, discipline, nationality, minimum GPA cutoffs, and financial need to yield a transparent 0–100% score with plain-language criteria breakdowns. |
| **Missed Deadlines** | Dynamic urgency badges (under 14 days highlighted), upcoming deadline countdown timers, calendar deadline window filters (7, 30, 90 days), and an actionable agenda banner. |
| **Lost Application Documents** | Per-scholarship interactive document readiness checklists with progress tracking that persist directly into an application Kanban tracking board. |

---

## 2. Features

### Discover
- **Catalog Explorer**: Browse 30 pre-configured scholarships across India, USA, UK, Germany, Canada, and global opportunities.
- **Deep Faceted Filtering**: Filter by education level, field of study, country of citizenship, scholarship type, coverage type, minimum award amount slider, and deadline window.
- **Shareable URL State**: All search terms, active filter arrays, sorting preferences, and pagination sync bidirectionally with URL search parameters via `history.replaceState`.
- **Top Matches Ribbon**: Live carousel highlighting top scholarship matches tailored to the student's saved criteria.

### Match
- **Four-Step Profile Wizard**: Quick setup dialog collecting education level, field of study, country/region, GPA, and demonstrated financial need.
- **Transparent Match Scoring**: Evaluates scholarship eligibility across five weighted dimensions, rendering visual badges (e.g., "95% Match") and detailed met/unmet checklists.
- **Zero-Friction Privacy**: Profile data is processed purely in browser memory and saved exclusively to `localStorage`. No identifiers leave the client.

### Track
- **Kanban Pipeline**: Four dedicated columns (*Saved*, *Preparing*, *Applied*, *Awarded / Closed*) to organize application workflows.
- **Document Readiness Checklist**: Expandable per-card checklists tracking transcripts, recommendations, essays, and portfolios with animated progress meters.
- **Interactive Notes & Stage Transitions**: Update personal application notes (up to 5,000 characters) and transition applications across workflow states.
- **Demo Mode**: One-click demo seed loader to explore the tracker with 5 pre-populated applications across all lifecycle stages.

### Experience
- **Strict 3-Color Design System**: Warm Paper, Warm Ink, and Deep Terracotta tokens with full WCAG AA contrast compliance in both Light and Dark themes.
- **Responsive Architecture**: Tested from 280px mobile viewports up to 4K displays with sticky mobile action bars and accessible slide-out filter drawers.
- **System Theme Switching**: Seamless Light/Dark theme toggling using `next-themes` with zero flash of unstyled content.

---

## 3. How It Works

```
[ Visitor Profile ] ──> [ Pure Match Algorithm ] ──> [ Curated Discover Catalog ]
                                                              │
                                                              ▼
[ Application Kanban ] <── [ Saved to LocalStorage ] <── [ Scholarship Detail ]
```

### Match Scoring Engine (`src/lib/match.ts`)
The matching engine is a pure, dependency-free function `scoreMatch(scholarship, profile)` evaluating candidate qualifications on a 100-point scale:

1. **Education Level (25 points)**: Matches target degree tier (High School, Undergraduate, Postgraduate, PhD).
2. **Field of Study (25 points)**: Matches specific subject area or broader STEM, Business, Arts, Law, Medicine, or Social Sciences groupings (or grants full points for "Any").
3. **Country / Region (20 points)**: Grants points if student citizenship matches the scholarship's host country or if the award is "Global".
4. **GPA Evaluation (15 points)**: Full 15 points if the scholarship has no minimum GPA or student GPA meets or exceeds the cutoff; partial 8 points if GPA is unrecorded; 0 points if GPA is below cutoff.
5. **Need & Award Type (15 points)**: Awards 15 points if a need-based grant aligns with demonstrated financial need or for non-need-based opportunities; 0 points if need-based but student indicates no financial hardship.

### URL Filter State
Filter state is represented as query parameters parsed and validated against allowlists in `src/lib/params.ts`:
- `q`: Search query string (sanitized, truncated to 100 characters).
- `level`, `field`, `country`, `type`, `coverage`: Comma-separated array params validated against allowlists.
- `minAmount`: Integer funding cutoff (0 to 100,000).
- `deadlineWindow`: Time horizon (`"7"`, `"30"`, `"90"`, or `"any"`).
- `sort`: Sorting criteria (`"match"`, `"deadline-soonest"`, `"amount-high"`, `"easiest"`).
- `page`: Pagination index (bounded 1 to 50).

### Persistent Browser Storage (`src/lib/store.ts`)
Tracker and profile state persist under the key `grantly:v1:data` in browser `localStorage`. Reads pass through schema type-guards; corrupted entries trigger automatic sanitization and state recovery without unhandled exceptions. If `localStorage` access is blocked by browser privacy modes, state safely falls back to in-memory storage.

---

## 4. Tech Stack

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Next.js** | `16.4.5` | React framework with App Router, Turbopack, and SSG static page generation. |
| **React** | `19.3.0` | UI library utilizing Server Components by default with client leaf components. |
| **TypeScript** | `^5` | Strict type safety for data models, validation functions, and store contracts. |
| **Tailwind CSS** | `^4` | Utility styling with native CSS variables and runtime `color-mix()` tokens. |
| **shadcn/ui & @base-ui/react** | `^4.23.0` / `^1.9.0` | Accessible unstyled primitives (dialogs, sheets, sliders, tabs, accordions). |
| **Motion** | `^14.10.1` | Hardware-accelerated transitions utilizing `LazyMotion` for small bundle sizes. |
| **next-themes** | `^0.4.6` | Theme management providing persistent Light and Dark mode switching. |
| **Vitest** | `^5.1.0` | Fast, ESM-native unit and component test runner. |
| **Testing Library** | `^16.3.3` | React component testing testing accessibility and user interaction workflows. |
| **Sora & Plus Jakarta Sans** | Next/Font | Editorial typography pair loaded with `font-display: swap` and zero layout shift. |

---

## 5. Architecture

```
src/
├── app/
│   ├── discover/
│   │   ├── loading.tsx          # Discover route skeleton fallback
│   │   └── page.tsx             # Server component rendering header & Explorer
│   ├── scholarships/[slug]/
│   │   └── page.tsx             # SSG static pre-rendered scholarship detail page
│   ├── tracker/
│   │   ├── loading.tsx          # Tracker route skeleton fallback
│   │   └── page.tsx             # Server component rendering tracker summary & board
│   ├── error.tsx                # Client error boundary
│   ├── globals.css              # 3-color design tokens and fluid typography
│   ├── layout.tsx               # Root layout with Header, Footer, and theme provider
│   ├── not-found.tsx            # Custom branded 404 page
│   ├── page.tsx                 # Landing page with hero, statistics, and FAQ
│   ├── robots.ts                # Dynamic robots.txt metadata route
│   └── sitemap.ts               # Dynamic sitemap.xml generator
├── components/
│   ├── discover/                # DiscoverExplorer, filters, and top matches strip
│   ├── landing/                 # Hero search, curated match preview, FAQ accordion
│   ├── layout/                  # Navigation bar, footer, and reading progress meter
│   ├── profile/                 # Profile wizard dialog and input form controls
│   ├── scholarship/             # Scholarship cards, badges, document checklists
│   ├── tracker/                 # Kanban columns, tracker card, status management
│   └── ui/                      # Base UI and shadcn UI component primitives
├── data/
│   ├── faq.ts                   # Static FAQ items
│   ├── index.ts                 # Data access helpers (getAll, getBySlug, getFeatured)
│   └── scholarships.ts          # 30 typed mock scholarship definitions
├── hooks/                       # Custom hooks (useTracker, useProfile, useIsMounted)
├── lib/
│   ├── filter.ts                # Pure filtering and sorting pipeline functions
│   ├── fonts.ts                 # Sora and Plus Jakarta Sans font loaders
│   ├── match.ts                 # Five-factor profile matching engine
│   ├── params.ts                # URL query parameter validation and sanitization
│   ├── store.ts                 # LocalStorage persistence, schema guards, recovery
│   ├── types.ts                 # Global TypeScript interfaces and domain models
│   └── utils.ts                 # Currency, date, and deadline helper utilities
└── test/
    ├── components/              # Component tests for interactive UI leaves
    ├── setup.ts                 # JSDOM matchMedia and environment setup
    └── unit/                    # Unit tests for match, filter, params, and store
```

### Server Components Strategy
All top-level pages (`src/app/page.tsx`, `discover/page.tsx`, `scholarships/[slug]/page.tsx`, `tracker/page.tsx`, `not-found.tsx`, and `layout.tsx`) are Server Components. They output static HTML without client-side hydration overhead.

### Client Leaf Components
Client components are strictly isolated to interactive subtrees requiring browser APIs, events, or local storage:
- `DiscoverExplorer.tsx`: Manages interactive filtering, search debounce, and URL query synchronization.
- `TrackerBoard.tsx`: Reads and updates Kanban pipeline state from browser `localStorage`.
- `ProfileWizardDialog.tsx`: Captures multi-step user profile preferences.
- `DetailActions.tsx` & `DetailDocuments.tsx`: Handles tracking stage toggles and document completion checkboxes.
- `LandingFaq.tsx`: Provides keyboard-accessible Radix accordion interactivity.
- `HeroSearch.tsx`: Directs landing page queries into the discovery route.
- `ThemeToggle.tsx`: Switches between Light, Dark, and System color modes.

---

## 6. Design System

Grantly adheres to a strict 3-color palette discipline: Background, Primary, and Accent. No pure white (`#FFFFFF`) or pure black (`#000000`) is used. All surface, card, border, and muted shades are derived strictly using CSS `color-mix()` or opacity against these three base hues.

### Palette Tokens

| Token | Light Theme | Dark Theme | Purpose |
| :--- | :--- | :--- | :--- |
| **Background** | `#FAF8F5` (Warm Paper) | `#111113` | Root page canvas and base surfaces |
| **Primary** | `#1C1917` (Warm Ink) | `#EDEDF0` | High-contrast body copy, headings, borders |
| **Accent** | `#B5452D` (Deep Terracotta) | `#F08A6D` | Badges, interactive fills, focus rings, CTAs |

### Typography Scale
- **Headings**: **Sora** (weights 600, 700) for editorial character, structure, and display sections.
- **Body & UI**: **Plus Jakarta Sans** (weights 400, 500, 600, 700) for legible micro-copy, data tables, and forms.
- **Fluid Scale**: Defined in `globals.css` using `clamp()` functions for seamless scaling from 320px mobile viewports to desktop displays without breakpoint jumps.

### Contrast Compliance (WCAG AA)
- Normal body copy on background: **16.50:1** (Light) / **16.14:1** (Dark) — Exceeds WCAG AAA.
- Accent text on background: **5.14:1** (Light) / **7.69:1** (Dark) — Exceeds WCAG AA (≥ 4.5:1).
- Accent fill foreground text: **5.14:1** (Light) / **7.69:1** (Dark) — Exceeds WCAG AA.
- Small sub-labels and eyebrows use primary high-contrast foreground copy alongside accent icons to guarantee readability across all layered cards.

### Motion Principles
Transitions use hardware-accelerated transforms and opacity through Motion's `domMax` bundle via `LazyMotion`. All animations honor the user's operating system preferences via `@media (prefers-reduced-motion: reduce)`.

---

## 7. Performance

The architecture emphasizes minimal client JavaScript and pre-computed static assets:
- **SSG Static Pre-rendering**: 39 out of 39 pages statically generated at build time (`next build`).
- **Lazy-Loaded Client Boundaries**: Heavy interactive sheets and boards are dynamically imported.
- **Font Optimization**: Fonts self-hosted and pre-loaded via `next/font/google` with zero layout shift (CLS: 0.000).
- **Bundle Efficiency**: Total static JavaScript across all chunks is 386.1 kB gzipped (shared framework chunk is ~144 kB).

### Measured Production Lighthouse Scores
Evaluated via Chrome Headless against the production server:

| Route | Preset | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`/` (Landing)** | Desktop | **99** | **100** | **100** | **100** | 0.9 s | 0.000 |
| **`/discover`** | Desktop | **100** | **100** | **100** | **100** | 0.3 s | 0.000 |
| **`/scholarships/[slug]`** | Desktop | **100** | **100** | **100** | **100** | 0.3 s | 0.000 |
| **`/tracker`** | Desktop | **100** | **100** | **100** | **100** | 0.3 s | 0.059 |
| **`/discover`** | Mobile | **92** | **100** | **100** | **100** | 1.2 s | 0.000 |
| **`/scholarships/[slug]`** | Mobile | **96** | **100** | **100** | **100** | 1.2 s | 0.000 |
| **`/tracker`** | Mobile | **95** | **100** | **100** | **100** | 1.2 s | 0.000 |

---

## 8. Accessibility

- **100/100 Lighthouse Accessibility**: Maintained across all four major routes on both mobile and desktop.
- **Skip Navigation Link**: Accessible `#main-content` skip link present on every page.
- **Keyboard Operability**: Full tab index navigation through cards, filters, dialogs, sheets, and disclosure accordions.
- **Form Controls & ARIA**: All interactive range sliders, progress bars, and modal controls have explicit, localized `aria-label` attributes and label-in-name compliance.
- **Focus Rings**: Two-pixel visible accent focus rings (`focus-visible:ring-2 focus-visible:ring-ring`) on all focusable elements.

---

## 9. Security and Data Handling

- **Content Security Policy**: Implemented in `next.config.ts` enforcing `default-src 'self'`, `frame-ancestors 'none'`, and strict origin limits.
- **HTTP Security Headers**: Includes `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
- **URL Parameter Sanitization**: String queries sanitized of control characters and capped at 100 characters; enum arrays validated against strict allowlists in `src/lib/params.ts`.
- **Safe External Links**: All outbound application links validate against `http:` / `https:` protocols and specify `rel="noopener noreferrer"`.
- **Zero Secrets / Zero Backend**: No external network requests, database connections, or API endpoints exist. Student data is never transmitted over the network.

---

## 10. Testing

Testing is implemented with Vitest, React Testing Library, and JSDOM:

```bash
npm test
```

### Coverage Breakdown (31 Tests across 9 Test Files)
- **`src/test/unit/match.test.ts` (4 tests)**: Verifies 5-factor scoring, GPA cutoff boundaries, and field taxonomy matching.
- **`src/test/unit/params.test.ts` (4 tests)**: Validates URL search query parsing, enum allowlists, and malicious URL rejection.
- **`src/test/unit/filter.test.ts` (7 tests)**: Confirms multi-criteria scholarship filtering, range bounds, and sorting methods.
- **`src/test/unit/store.test.ts` (8 tests)**: Validates state updates, checklist toggles, storage corruption recovery, and quota fallbacks.
- **`src/test/unit/utils.test.ts` (3 tests)**: Tests multi-currency formatting, ISO date calculations, and deadline urgency categorizations.
- **`src/test/components/ScholarshipCard.test.tsx` (2 tests)**: Tests card rendering, badge presentations, and quick-save buttons.
- **`src/test/components/LandingFaq.test.tsx` (1 test)**: Tests keyboard and mouse accordion trigger expansions.
- **`src/test/components/ProfileWizard.test.tsx` (1 test)**: Validates multi-step profile dialog progression and field selections.
- **`src/test/components/TrackerBoard.test.tsx` (1 test)**: Verifies empty tracker state rendering and one-click demo data population.

---

## 11. Getting Started

### Prerequisites
- **Node.js**: `>= 20.19.0` (as defined in `package.json` engines)
- **npm**: `>= 10.0.0`

### Installation & Development Commands

```bash
# Install dependencies cleanly
npm install

# Start local Turbopack development server
npm run dev

# Run static analysis and linting
npm run lint

# Execute Vitest test suite
npm test

# Build optimized production bundle
npm run build

# Start local production server
npm run start
```

### Deploying to Vercel
1. Import the project repository into the Vercel dashboard.
2. The framework preset is automatically detected as **Next.js**.
3. No environment variables are required.
4. Click **Deploy**.

---

## 12. Using the App

1. **Explore the Directory**: Navigate to `/discover` to search keywords or filter by degree level, discipline, and citizenship country.
2. **Build Your Profile**: Click **Match Profile** in the navigation bar to launch the 4-step wizard. Select your education level, discipline, country, and GPA to calculate match scores.
3. **Inspect Requirements**: Open any scholarship page (e.g. `/scholarships/reliance-foundation-future-tech-fellowship`) to review eligibility criteria, required documents, and application steps.
4. **Track Applications**: Click **Track this Scholarship** to save an award to your Kanban board. Move applications to *Preparing*, check off required application documents, and record submission notes.
5. **Try Demo Mode**: Visit `/tracker` and select **Load Demo Data** to preview a populated board with 5 sample scholarships across active stages.
6. **Reset Anytime**: Use the reset actions in the profile wizard or tracker to purge local data and return to a blank state.

---

## 13. Data Note

All 30 scholarship listings contained in `src/data/scholarships.ts` are fictional, representative models created specifically for demonstration purposes during the Outpost hackathon. Deadlines are fixed ISO timestamps ranging between November 2026 and August 2027. All applicant tracking data, checklists, and notes exist exclusively within your web browser's `localStorage`.

---

## 14. Known Limitations and Roadmap

### Known Limitations
- **Mock Data**: Scholarship records do not link to live external university portals.
- **Browser-Bound Storage**: Saved application state is tied to the specific browser and machine used.
- **Manual Column Transitions**: Application statuses are shifted via select dropdowns and buttons rather than drag-and-drop gestures.

### Roadmap
1. **PWA Offline Service Worker**: Cache the full scholarship directory and checklist engine for complete offline accessibility.
2. **Data Export & Import (JSON/CSV)**: Enable exporting application records for manual backup and multi-device portability.
3. **iCalendar (.ics) Export**: One-click calendar deadline export to add submission dates directly into Google Calendar or Apple Calendar.
4. **Side-by-Side Comparison Drawer**: Allow candidates to compare up to 3 scholarships in a comparative eligibility matrix.

---

## 15. AI-Assisted Development

Grantly was developed with Antigravity and guided by installed agent design systems and engineering skills:
- **`frontend-design`**: Direction for editorial visual layout, typography pairings, and avoiding generic UI patterns.
- **`ui-ux-pro-max`**: Design intelligence for interaction patterns, touch targets, accessibility, and color token harmonies.
- **`vercel-react-best-practices`**: Guidance for Server Components first, dynamic client hydration, and clean bundle optimization.
- **`web-design-guidelines`**: Validation of accessible contrast ratios, semantic landmarks, and keyboard operability.

---

## 16. License

MIT — see the [LICENSE](LICENSE) file.

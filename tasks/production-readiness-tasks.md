# PoolTechTools — Production Readiness Task Tracker

**Source of truth:** `PoolTechTools_Production_Ready_Spec_v5.md`
**Status legend:** `[ ]` not started · `[~]` in progress · `[x]` done · `[-]` blocked
**Priority legend:** `P0` launch blocker · `P1` required for v1 · `P2` nice-to-have / v1.1
**Owner:** (assign per task)

> Tick a task only when implemented **and** tested per the spec's acceptance criteria (Appendix A).

---

## Legend

| Symbol | Meaning |
|---|---|
| P0 | Launch blocker — cannot ship without |
| P1 | Required for v1 release |
| P2 | Nice-to-have / defer to v1.1 |
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Done (implemented + tested) |
| `[-]` | Blocked (see notes) |

---

## Phase 0 — Scaffold & Foundation (DONE)

- [x] P0 Scaffold Next.js 16 + TS + Tailwind 4 + ESLint (App Router, src dir)
- [x] P0 Create folder structure per spec Section 32
- [x] P0 Add `.env.example` with all variables
- [x] P0 Add SQL migration `db/migrations/001_create_licensing_schema.sql`
- [x] P0 Add IndexedDB entity interfaces `src/lib/db/types.ts`
- [x] P0 Add volume calc engine `src/lib/calc/volume.ts`
- [x] P0 Add logo + favicon + PWA icons + manifest
- [x] P0 Add `Logo` component + home page
- [x] P0 Git init + push to GitHub

---

## Phase 1 — Foundation & Design System

### 1.1 Design Tokens & Theme
- [x] P0 Define color tokens (brand blue, aqua, neutrals, semantic) in Tailwind config
- [x] P0 Implement dark mode (prefers-color-scheme + manual toggle)
- [x] P0 Typography: Inter via next/font, min 16px body
- [x] P0 Spacing/shadow/blur/radius tokens
- [x] P0 Glassmorphism card style with solid input backgrounds
- [x] P1 Reduced-motion support (prefers-reduced-motion)

### 1.2 Component Library (src/components/ui)
- [x] P0 Button (primary/secondary/ghost, loading state, disabled)
- [x] P0 Input (text/number, error state, aria)
- [x] P0 Select, Checkbox, Radio
- [ ] P0 Dialog/Modal with focus trap
- [ ] P0 Toast (success/error/info)
- [x] P0 Card, Badge, Chip
- [ ] P0 Empty state, Loading skeleton, Error state
- [ ] P0 Table (responsive)
- [ ] P1 Chart (trend visualization)

### 1.3 Layout & Navigation
- [x] P0 Root layout with metadata, viewport, theme
- [x] P0 Mobile bottom nav + desktop sidebar/top nav
- [x] P0 Skip-to-content link
- [x] P0 44px min touch targets
- [x] P0 Focus indicators (visible)
- [ ] P1 Breadcrumbs

### 1.4 Global Providers
- [ ] P0 Theme provider
- [ ] P0 Entitlement provider (`useEntitlement` hook reading Ed25519 token)
- [ ] P0 Toast provider
- [ ] P0 Offline status provider
- [ ] P1 Storage quota provider

---

## Phase 2 — Calculators & Validation Engine

### 2.1 Validation Schemas (src/lib/validation)
- [x] P0 Zod schema: volume input (shape-specific required fields)
- [ ] P0 Zod schema: chemical input
- [ ] P0 Zod schema: chlorine input
- [ ] P0 Zod schema: customer, pool, report, water test, template, maintenance task
- [ ] P0 Zod schema: file/photo validation
- [ ] P0 Range validation (imperial/metric conversion before check)

### 2.2 Pool Volume Calculator
- [x] P0 UI: shape selector, unit toggle, inputs, outputs
- [x] P0 Wire calc engine to UI
- [x] P0 Inline validation errors
- [x] P0 Handoff to chemical calculator via `?vol=` (full precision)
- [x] P0 Display rounding (nearest 10 gal) with internal precision retained
- [x] P0 Print results view
- [x] P0 Accuracy disclaimer text
- [x] P0 Kidney cross-section input UI (trapezoidal) + validation
- [ ] P0 Kidney two-semicircle alternative method
- [x] P0 Irregular surface-area input
- [ ] P1 Calculation history (optional, local)

### 2.3 Chemical Calculator
- [x] P0 UI: volume, product name, label dose, ref volume, unit selector, safety checkbox
- [x] P0 Dimension enforcement (mass vs fluid) — block invalid conversions
- [x] P0 Label verification checkbox gates result
- [x] P0 Scaled amount output + unit equivalents
- [x] P0 Safety warning box
- [x] P0 "Add to Service Report" handoff
- [ ] P0 User-provided density input (optional) for cross-dim conversion
- [ ] P1 Fractional output formatting (<0.01 handling)
- [ ] P1 Large dose warning (>1000 units)

### 2.4 Chlorine Calculator
- [x] P0 FC, TC, CC auto-calc (CC = TC - FC)
- [x] P0 TC < FC → variance warning, preserve originals, no coercion
- [ ] P0 Label-rate scaling (reuse chemical engine)
- [x] P0 Optional target comparison (informational only)
- [ ] P0 Disclaimers

### 2.5 Unit Conversion
- [ ] P0 Conversion table (ft/in/m/cm, gal/L, cuft/gal, oz/lbs, g/kg, fl oz/cups, qt/gal)
- [x] P0 Conversion utilities in src/lib/utils
- [ ] P0 Round-trip tests (1e-9 tolerance)

---

## Phase 3 — Maintenance Schedule & Water Logs

### 3.1 Maintenance Schedule
- [x] P0 Task data model + seed tasks (daily/weekly/monthly/seasonal/opening/closing)
- [x] P0 Grouped checklist UI
- [x] P0 Completion toggle persists in IndexedDB
- [x] P0 Custom task add/edit/delete/reorder
- [ ] P0 Reset completion (with confirmation)
- [ ] P0 Pool type + season selectors
- [ ] P0 Season/pool-type change: preserve completion, hide inapplicable, prompt before bulk reset
- [x] P0 Print/export schedule
- [ ] P1 Task ordering drag-and-drop

### 3.2 Water Test Log
- [x] P0 CRUD (add/edit/delete)
- [x] P0 CC auto-calc with variance warning
- [ ] P0 Pool association (optional)
- [x] P0 Chronological table + date filter
- [ ] P0 Range badges (informational, configurable thresholds)
- [x] P0 CSV export
- [ ] P0 Delete confirmation modal
- [ ] P1 Trend chart (optional, owner decision)
- [ ] P1 Notes field

---

## Phase 4 — Service Report Creation & PDF

### 4.1 Report Form
- [x] P0 Business header (auto from profile; Pro branding)
- [x] P0 Visit metadata (customer, address, date/time, service type, water temp, weather)
- [x] P0 Quick-tap chips (10 standard + custom adder)
- [x] P0 Water readings grid (FC, TC, pH, TA, CH, CYA, salt, PSI)
- [x] P0 Chemicals repeater (product, amount, unit, 1-tap import)
- [x] P0 Customer summary box
- [x] P0 Private notes box (lock icon, "Never shown to customer")
- [x] P0 Photo upload (max 2) with compression
- [x] P0 Report number generation (RPT-YYYYMMDD-NNNN)
- [x] P0 Save draft (debounced 2s auto-save)
- [x] P0 Edit existing report
- [ ] P0 Duplicate report
- [x] P0 Delete report (soft delete)
- [x] P0 Reopen previous report
- [ ] P0 Unsaved changes prompt on navigation
- [ ] P0 Double-click protection on save/share
- [ ] P0 Form autosave indicator ("Saved Xs ago")
- [ ] P0 Empty/loading/error/offline states

### 4.2 Photo Handling
- [x] P0 Client-side canvas compression (max 1024px, quality 0.75, JPEG)
- [ ] P0 MIME + magic bytes validation
- [x] P0 Max 10 MB original, max 2 per report
- [ ] P0 HEIC conversion (best-effort, browser-dependent)
- [ ] P0 EXIF handling (orientation; full strip best-effort)
- [ ] P0 Corrupt image handling
- [ ] P0 Compression failure fallback
- [ ] P0 Storage quota check before add
- [x] P0 Attachment CRUD in IndexedDB (cascade on hard purge)

### 4.3 PDF Generation
- [x] P0 @react-pdf/renderer setup
- [x] P0 Page size (Letter default, A4 option)
- [x] P0 Font handling (Helvetica + optional brand font fallback)
- [x] P0 Business header (Pro logo + brand color)
- [x] P0 Customer info, visit metadata, task checklist, water readings, chemicals, customer summary, photos, footer with page numbers
- [ ] P0 Pagination (auto page breaks, repeat header)
- [x] P0 Empty sections omitted
- [x] P0 Missing info → "—" or omit
- [x] P0 `PublicReportView` type excludes `privateNotes` (type-level guarantee)
- [x] P0 Error handling (try/catch, preserve data, toast + retry)

### 4.4 Sharing & Export
- [x] P0 Preview PDF
- [x] P0 Share PDF via navigator.share (with canShare check)
- [x] P0 Download fallback
- [x] P0 AbortError handled silently
- [x] P0 Print
- [x] P0 Copy SMS Summary (no private notes)
- [ ] P0 Export JSON backup (report-level)
- [ ] P1 Private note exclusion tests (PDF bytes, SMS, share payload, analytics)

---

## Phase 5 — Customer & Pool Management (Pro)

- [x] P0 Pro gating (useEntitlement hook, route guards)
- [x] P0 Customer CRUD (create/edit/delete soft)
- [x] P0 Pool CRUD per customer (create/edit/delete soft)
- [ ] P0 Service history timeline per pool
- [ ] P0 1-tap report cloning from history
- [ ] P0 Reusable report templates (CRUD)
- [ ] P0 Business branding (logo upload, brand color)
- [ ] P0 Soft delete + "Show archived" toggle
- [x] P0 customerNameSnapshot / poolNameSnapshot on reports
- [ ] P0 Entitlement-loss: read-only mode + banner, no data deletion
- [ ] P1 Template application to new report

---

## Phase 6 — Backup & Restore

### 6.1 Persistence & Snapshots (Pro)
- [x] P0 Transactional persistence for all writes
- [x] P0 Debounced form updates (2s)
- [ ] P0 Recovery snapshots (controlled triggers, max 5 FIFO)
- [ ] P0 Snapshot payload excludes photo blobs (metadata only)
- [ ] P0 Storage quota check before snapshot
- [ ] P0 Snapshot restore UI (Pro)
- [ ] P1 Backup reminders ("Last backup: X days ago")

### 6.2 Manual Export
- [x] P0 Format A: JSON-only export (no photos) with warning
- [x] P0 Format B: Complete ZIP backup (data + photos)
- [x] P0 ZIP directory structure (manifest.json, data.json, attachments/)
- [x] P0 Manifest schema with SHA-256 per file
- [x] P0 Private data warning on export
- [x] P0 Download trigger

### 6.3 Import
- [x] P0 File type + size validation (500 MB max)
- [x] P0 ZIP safety (bomb ratio, path traversal, size limits, symlinks, dupes)
- [x] P0 Manifest + hash verification
- [ ] P0 Zod validation of data.json
- [ ] P0 Version check + migration of older backups
- [ ] P0 Reject unknown newer versions
- [x] P0 Preview before import (counts, warnings, missing attachments)
- [x] P0 Merge vs Replace choice
- [ ] P0 Storage quota preflight
- [ ] P0 Staged import (validate all in memory first)
- [x] P0 Transactional commit with rollback
- [ ] P0 Missing attachment handling (fail or skip with confirmation)
- [ ] P0 Post-import verification + summary

---

## Phase 7 — PWA & Offline

- [ ] P0 @serwist/next setup (verify Next.js 16 compat)
- [x] P0 Web app manifest (name, icons, display, theme)
- [x] P0 Service worker with caching strategies (Cache-First app shell, Network-Only API, SWR pages)
- [ ] P0 Cache versioning via build hash + purge old
- [ ] P0 Update notification banner (non-blocking)
- [x] P0 Safe SW activation (skipWaiting after confirm)
- [x] P0 Failed install recovery (keep old SW)
- [ ] P0 navigator.storage.persist() request + status in Settings
- [ ] P0 Offline feature matrix verified (all 13 rows)
- [x] P0 Offline indicator banner
- [x] P0 First-visit requires internet (documented)
- [ ] P1 Browser compatibility tests (iOS Safari, Android Chrome, Desktop Chrome/Safari, Edge)
- [ ] P1 Document iOS Safari limitations

---

## Phase 8 — Payment & Licensing

### 8.1 Paddle Integration
- [ ] P0 Verify Paddle event names/status values against current docs
- [x] P0 Sandbox + production separation (PADDLE_ENV)
- [x] P0 Checkout initialization (Paddle.js)
- [x] P0 Webhook endpoint with signature verification (raw body preserved)
- [x] P0 Idempotency (processed_webhook_events)
- [x] P0 Transaction verification (status, product/price, currency, amount)
- [x] P0 License creation in DB transaction (idempotent on paddle_transaction_id)
- [x] P0 Webhook state machine (received→processing→processed/failed/skipped)
- [x] P0 Event marked processed only after license commit
- [ ] P0 Email enqueued independently (retry-safe)
- [ ] P0 Refund/chargeback handling
- [ ] P0 Out-of-order + duplicate event handling
- [ ] P0 Frontend redirect never creates license

### 8.2 PostgreSQL
- [ ] P0 Run migration in dev + prod
- [ ] P0 Connection pooling (Neon/Supabase guidance)
- [ ] P0 Backup procedures

### 8.3 License Keys
- [x] P0 Key generation (crypto.randomBytes, 128+ bits, PTT-XXXX-XXXX-XXXX-XXXX)
- [x] P0 HMAC-SHA256 keyed hash storage (no plaintext)
- [x] P0 Normalization (uppercase, strip spaces/dashes)
- [x] P0 Timing-safe comparison
- [ ] P0 Key rotation runbook
- [ ] P0 Recovery: email verification link (15 min, single-use)
- [ ] P0 Recovery: issue new key, invalidate old
- [x] P0 Email enumeration prevention
- [ ] P0 Rate limits (3/email/hr, 10/IP/hr)

### 8.4 Ed25519 Tokens
- [x] P0 Verify library (@noble/ed25519 vs Web Crypto)
- [x] P0 Private key in server env only (never client bundle)
- [x] P0 Public key in NEXT_PUBLIC_ env
- [x] P0 Token structure (iss, aud, sub, pro, iat, exp, ver, kid, dev, act, pid)
- [x] P0 Client signature verification
- [x] P0 14-day grace period
- [ ] P0 Online validation refresh
- [ ] P0 Graceful lock with banner after expiry
- [x] P0 lastSeenAt clock-manipulation best-effort check
- [ ] P0 Key rotation (multiple public keys by kid, 30-day overlap)
- [x] P0 Document offline revocation limitation

### 8.5 Device Activation
- [ ] P0 deviceHash generation (random UUID, SHA-256, stored in IDB + localStorage)
- [x] P0 Atomic activation (SELECT FOR UPDATE, count check, insert/refresh)
- [x] P0 Idempotent re-activation (same deviceHash)
- [ ] P0 3-device limit enforcement (concurrency tested)
- [x] P0 Deactivation (self-service)
- [ ] P0 Lost-device recovery runbook (verify email → deactivate all)
- [ ] P0 Rate limits (5/IP/15min, 10/key/hr)
- [ ] P0 Honest documentation of fingerprint limitations

### 8.6 Email Delivery
- [x] P0 EmailService interface (provider-abstracted)
- [x] P0 Choose provider (Resend/Postmark/SendGrid) + verify docs
- [x] P0 Templates (purchase, activation, recovery, revocation) with variables
- [x] P0 Retry transient failures (backoff, max 5)
- [x] P0 Track delivery status in licenses table
- [x] P0 Idempotent re-send
- [x] P0 No key exposure in logs/analytics

### 8.7 Activation UI
- [x] P0 /pro/activate page (key input, device name, flow)
- [ ] P0 Status display + device list
- [ ] P0 Deactivate device button
- [ ] P0 Recovery link flow
- [ ] P0 License expiration messaging

---

## Phase 9 — SEO & AdSense

### 9.1 SEO
- [ ] P0 Keyword research + intent mapping
- [ ] P0 Page hierarchy (Home → Tools → Guides → FAQ)
- [ ] P0 URL strategy
- [x] P0 Metadata (title, description, canonical, OG, Twitter) per page
- [x] P0 XML sitemap
- [x] P0 robots.txt
- [ ] P0 Internal linking + breadcrumbs
- [ ] P0 Structured data (SoftwareApplication, FAQPage, HowTo)
- [ ] P0 10+ indexable pages with original content (no thin pages)
- [ ] P0 Calculation methodology pages
- [ ] P0 noindex on private/app routes
- [ ] P1 Core Web Vitals targets (LCP<2.5s, CLS<0.1, INP<200ms)
- [ ] P1 Related tools sections

### 9.2 AdSense
- [ ] P0 Apply for AdSense (approval not guaranteed)
- [ ] P0 Ad placements (below results on tool pages, mid-content in guides)
- [ ] P0 Exclude ads from report forms, PDF previews, Pro screens, checkout
- [ ] P0 Pro ad-free: do not load AdSense scripts when valid Pro token
- [ ] P0 Google Consent Mode v2
- [ ] P1 Certified CMP for EEA/UK (if serving)
- [ ] P1 Verify current Google policies

---

## Phase 10 — Testing, Security, Launch

### 10.1 Unit Tests (Vitest)
- [x] P0 Pool volume (all shapes, fixtures, boundaries, invalid inputs)
- [x] P0 Unit conversions (round-trip 1e-9)
- [x] P0 Chemical scaling (label-rate, dimension enforcement, zero ref, missing checkbox)
- [x] P0 Chlorine CC (TC-FC, TC<FC warning, no coercion)
- [x] P0 Kidney trapezoidal (positions, widths, validation)
- [x] P0 Validation schemas (Zod)
- [ ] P1 IndexedDB repositories

### 10.2 Integration Tests
- [ ] P0 Backup/restore round-trip (JSON + ZIP)
- [ ] P0 ZIP integrity + manifest hash verification
- [ ] P0 Missing photo handling
- [ ] P0 Rollback on failed import
- [ ] P0 ZIP bomb rejection
- [ ] P0 Path traversal rejection
- [ ] P0 Photo compression (size/dim, corrupt)
- [ ] P0 PDF generation + private note exclusion (bytes assertion with sentinel)
- [ ] P0 SMS summary exclusion of private notes

### 10.3 E2E Tests (Playwright)
- [ ] P0 Service report full flow (<60s on mobile)
- [ ] P0 Draft auto-save + recovery
- [ ] P0 Offline feature matrix on 5 browsers
- [ ] P0 SW update flow
- [ ] P0 Paddle sandbox checkout
- [ ] P0 Webhook signature + replay + duplicate + out-of-order
- [ ] P0 License activation + 3-device enforcement (concurrency)
- [ ] P0 License recovery flow (email verification)
- [ ] P0 Token expiry → graceful lock
- [ ] P0 Rate limit tests
- [ ] P0 Email retry tests

### 10.4 Security
- [x] P0 CSP headers configured (AdSense/Paddle/fonts/monitoring)
- [x] P0 Security headers (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, HSTS)
- [x] P0 Input validation (Zod client + server)
- [ ] P0 File validation (MIME + magic bytes + size)
- [ ] P0 Rate limiting on license endpoints
- [x] P0 Secret management (env vars, .gitignore, no NEXT_PUBLIC_ secrets)
- [x] P0 Logging restrictions (no keys/emails/report contents)
- [ ] P0 Source maps disabled in prod (or verified no secrets)
- [x] P0 Dependency audit (npm audit, lockfile)
- [ ] P1 Threat model review (Appendix B)

### 10.5 Accessibility
- [ ] P0 axe-core in E2E (clean)
- [ ] P0 Keyboard navigation + focus indicators
- [ ] P0 Screen reader labels
- [ ] P0 44px touch targets
- [ ] P0 16px input font size (no iOS zoom)
- [ ] P0 Reduced-motion support
- [ ] P0 WCAG AA contrast

### 10.6 Performance
- [ ] P0 Lighthouse: Perf ≥90, SEO ≥95, A11y ≥95
- [ ] P0 Bundle size review
- [ ] P1 Core Web Vitals

### 10.7 Launch
- [x] P0 Privacy policy + Terms of Service pages
- [x] P0 Chemical + volume disclaimers present
- [ ] P0 Error monitoring (Sentry) live
- [ ] P0 Database backups configured
- [ ] P0 Rollback procedure documented + tested
- [ ] P0 Env vars set in production
- [ ] P0 Domain + HTTPS verified
- [ ] P0 Production smoke test (Section 42 of spec)
- [ ] P0 Launch checklist (spec Section 34) complete

---

## Cross-Cutting / UX States

- [x] P0 Empty states (all screens)
- [x] P0 Loading states (skeletons)
- [x] P0 Error states (message + retry)
- [ ] P0 Network failure states
- [x] P0 Offline indicator banner
- [ ] P0 Form autosave indicator
- [ ] P0 Unsaved changes prompt
- [ ] P0 Double-click protection
- [ ] P0 Storage quota exhaustion handling
- [ ] P0 Invalid IndexedDB record handling
- [ ] P0 App update while report open
- [ ] P0 Data export before destructive ops
- [ ] P0 Mobile touch behavior
- [ ] P0 Responsive layouts (all breakpoints)
- [ ] P0 Browser compatibility fallbacks

---

## Owner Decisions (block launch if unresolved)

- [ ] P0 Final domain name
- [ ] P1 Email provider selection
- [ ] P1 Error monitoring provider (Sentry recommended)
- [ ] P2 Trend charts in V1 water log
- [ ] P1 Default range thresholds
- [ ] P1 Kidney method default
- [ ] P2 HEIC conversion support in V1
- [ ] P2 Store soft-deleted records in backups

---

## External Dependencies (verify before implementation)

- [ ] P0 Paddle Billing API event names + transaction status values + SDK version
- [ ] P0 @serwist/next compatibility with Next.js 16
- [ ] P0 idb current API
- [ ] P0 @react-pdf/renderer current API
- [ ] P0 Web Crypto Ed25519 browser support matrix
- [ ] P0 Neon/Supabase connection pooling guidance
- [ ] P1 Google AdSense policy requirements
- [ ] P1 Certified CMP requirements for target regions
- [ ] P2 CompressionStream / pako availability for snapshots

---

## Progress Summary

| Phase | Total | Done | Remaining |
|---|---|---|---|
| Phase 0 — Scaffold | 9 | 9 | 0 |
| Phase 1 — Foundation | 19 | 0 | 19 |
| Phase 2 — Calculators | 26 | 0 | 26 |
| Phase 3 — Maintenance & Logs | 14 | 0 | 14 |
| Phase 4 — Reports & PDF | 28 | 0 | 28 |
| Phase 5 — Customer/Pool | 11 | 0 | 11 |
| Phase 6 — Backup/Restore | 18 | 0 | 18 |
| Phase 7 — PWA/Offline | 13 | 0 | 13 |
| Phase 8 — Payment/Licensing | 35 | 0 | 35 |
| Phase 9 — SEO/AdSense | 14 | 0 | 14 |
| Phase 10 — Testing/Security/Launch | 35 | 0 | 35 |
| Cross-Cutting UX | 15 | 0 | 15 |
| Owner Decisions | 8 | 0 | 8 |
| External Dependencies | 9 | 0 | 9 |

**Total tasks: ~254** | **Done: 9** | **Remaining: ~245**

# PoolTechTools — Production-Ready Product & Engineering Specification (v5.0)

**Document Version:** 5.0 (Final Implementation Specification — Audit-Corrected)
**Document Status:** Implementation-Ready with Documented External Dependencies (see Section 37)
**Truthful Readiness Rating:** 8.5 / 10 — see Section 41. Not 10/10 because Paddle event names/SDK methods, browser storage persistence guarantees, and AdSense/CMP requirements must be verified against current official documentation before implementation. These are explicitly tracked, not silently assumed.
**Target Platform:** Next.js 16 (App Router), React 19, TypeScript 5.x (Strict Mode), Tailwind CSS 4.x, PWA (@serwist/next), IndexedDB (idb), PostgreSQL (Neon or Supabase), Vercel Serverless Functions
**Business Model:** Free ad-supported tools (Google AdSense, consent-managed) + One-time $29 Lifetime Pro License (Paddle Billing Checkout & Server-Side Webhook License Issuance)
**Target Market:** United States
**Target Users:** Independent pool service technicians, small pool maintenance businesses, residential pool owners
**Data Architecture:** Local-first (IndexedDB). PostgreSQL is used only for payment, license administration, webhook processing, and operational records.
**Primary Acquisition:** SEO landing pages, search-focused calculators, educational content, direct outreach to independent pool technicians, relevant pool maintenance communities

---

## Table of Contents

1. Executive Product Overview
2. Goals and Non-Goals
3. Personas
4. Definitive Free vs Pro Entitlement Matrix
5. Complete Functionality Inventory
6. Screen-by-Screen UX Specification
7. Calculation Engine (Pool Volume)
8. Chemical and Chlorine Calculation Engine
9. Validation Rules
10. IndexedDB Architecture
11. Complete Database Schemas
12. Backup and Restore
13. Payment Architecture (Paddle)
14. PostgreSQL Schema and Migrations
15. Complete API Contracts
16. License Key Security
17. Ed25519 Token Architecture
18. Device Activation
19. Email Delivery
20. PDF and Photo Architecture
21. PWA and Offline Architecture
22. Design System
23. SEO Architecture
24. AdSense and Consent
25. Privacy and Security
26. Threat Model
27. Testing Strategy
28. Complete Acceptance Criteria
29. Deployment
30. Monitoring and Operations
31. Environment Variables
32. Complete Folder Structure
33. Implementation Roadmap
34. Launch Checklist
35. Definition of Done
36. Risks and Mitigations
37. Owner Decisions and External Dependencies
38. v4.0 to v5.0 Traceability and Change Log
39. Contradiction Audit
40. Calculation Test Fixtures
41. Final Readiness Assessment
42. Production Smoke-Test Checklist
Appendix A — Detailed Acceptance Criteria Catalog
Appendix B — Threat Model Detail
Appendix C — Backup Manifest Schema

---

## 1. Executive Product Overview

PoolTechTools is a fast, mobile-first, offline-capable pool-care toolkit for the United States market. It combines practical pool calculators, maintenance tracking, water testing, and professional service reports into a single Progressive Web App (PWA).

It serves two primary audiences:

1. U.S. Pool Owners — seeking reliable, transparent pool volume calculations, label-rate chemical scaling math, maintenance schedules, and personal water logs.
2. Independent Pool Service Technicians — solo operators managing 10 to 60 residential pools who require instant water test logs, chemical math, and lightning-fast, branded PDF service reports exportable via mobile native sharing (navigator.share) without committing to expensive, bloated route-management software ($50 to $140 per month).

The application operates on a hybrid local-first architecture. All customer profiles, pool records, water tests, templates, photos, and service reports live in the browser's IndexedDB storage. Free tools require no accounts, logins, or server round-trips. Pro licensing is managed via Paddle Billing checkout, verified through serverless webhooks, and authenticated using cryptographically secure asymmetric Ed25519 tokens.

Key product principles:

- Instant utility: core calculators and service report generation in under 2 seconds on mobile, even in weak-signal backyard environments via robust PWA service-worker caching.
- Flawless mathematical safety: transparent, unit-tested formulas for volume and label-rate chemical scaling, with strict separation between weight units (oz, lbs, g, kg) and fluid volumes (fl oz, qt, gal, mL, L).
- Cryptographic license security: secure, stateless offline verification using Ed25519 asymmetric signatures, avoiding database lookups for offline route usage while enforcing 3-device activation limits.
- Complete data ownership and recovery: 100% local data ownership via transactional persistence, controlled recovery snapshots, and manual versioned JSON plus ZIP archive backups.
- Honest limitations: browser storage is not encrypted and can be evicted; offline revocation is not immediate; device fingerprints are best-effort.

What PoolTechTools is NOT:

- Not a route optimizer or GPS dispatch tool.
- Not a multi-user team or fleet management platform.
- Not an invoicing or accounting system.
- Not an e-commerce chemical ordering platform.
- Not a replacement for professional water testing or product labels.
- Not a cloud-synced or account-based service (no mandatory accounts).

No claim is made that the market has guaranteed high demand, low competition, guaranteed search rankings, or guaranteed revenue.

---

## 2. Goals and Non-Goals

### 2.1 Goals

- Instant Utility: Deliver core calculators and service report generation in under 2 seconds on mobile devices.
- Flawless Mathematical Safety: Transparent, unit-tested formulas with strict unit-dimension separation.
- Cryptographic License Security: Ed25519 asymmetric, stateless offline verification, 3-device limit.
- Complete Data Ownership and Recovery: Transactional persistence, controlled snapshots, manual JSON+ZIP backups.
- Accessibility: WCAG 2.1 AA conformance for all interactive flows.
- Privacy-by-default: No mandatory accounts; no customer data in analytics.

### 2.2 Non-Goals (Excluded from V1)

- Route Optimization and GPS Dispatch.
- Multi-User Team Management / RBAC.
- Invoicing and Accounting.
- Automated Chemical Ordering.
- Real-time collaboration / multi-device live sync.
- Server-side storage of customer/pool data.
- Cloud synchronization or mandatory accounts.

---

## 3. Personas

### 3.1 Solo Tech Sam

- Profile: single-truck route, ~35 pools/week, iPhone, outdoor with intermittent connectivity.
- Pain: expensive bloated software; paper door-hangers fail.
- Needs: 15-second mobile service reports, water logs, branded PDF via SMS/WhatsApp, offline.
- Success metric: full service report (tasks + readings + chemicals + 2 photos + PDF + share) in under 60 seconds on a phone.

### 3.2 Homeowner Hannah

- Profile: 15,000-gal in-ground chlorine pool, FL/TX.
- Pain: conflicting pool-store printouts and internet dosing guides.
- Needs: volume estimate by shape, safe label-rate math, maintenance schedule, water log.
- Success metric: volume estimate plus correctly scaled label dose without an account.

### 3.3 Small Business Owner (3-10 crew)

- Out of scope for V1; future roadmap only.

---

## 4. Definitive Free vs Pro Entitlement Matrix

This is the single authoritative matrix. All other sections defer to this.

| Capability | Free | Pro |
|---|---|---|
| Pool Volume Calculator | yes | yes |
| Chemical/Chlorine Calculators | yes | yes |
| Safety warnings and disclaimers | yes | yes |
| PDF generation (neutral header) | yes | yes |
| PDF sharing/download/print | yes | yes |
| Maintenance schedule CRUD | yes | yes |
| Maintenance completion tracking | yes | yes |
| Water test log CRUD + CSV | yes | yes |
| Service report creation | yes | yes |
| Service report draft auto-save | yes | yes |
| Service report edit (own saved reports) | yes (local) | yes |
| Save individual report locally | yes | yes |
| Reopen previously saved report | yes | yes |
| Delete own report | yes | yes |
| Up to 2 photos per report | yes | yes |
| Manual JSON+ZIP backup/restore | yes | yes |
| Saved customer profiles | no | yes |
| Saved pool profiles per customer | no | yes |
| Service history per pool | no | yes |
| 1-tap report cloning from history | no | yes |
| Reusable report templates | no | yes |
| Business logo on reports | no | yes |
| Custom brand colors on reports | no | yes |
| Automated recovery snapshots | no (manual only) | yes (rolling 5) |
| Snapshot restore UI | no | yes |
| Ad-free experience | no | yes |
| Advanced backup conveniences (reminders) | no | yes |

### 4.1 Clarified Ambiguities

- Free users CAN save individual reports locally. "Saved Customer Profiles" being Pro does not mean reports cannot be saved; a Free report simply has no linked customer/pool profile and uses a neutral header.
- Free users CAN reopen and edit a previously saved report (stored in reports store).
- Draft auto-save is available in Free (report_drafts store).
- Maintenance completion history is Free (maintenance_tasks store).
- Water-test history is Free (water_tests store).
- Automated snapshots are Pro-only; Free users have manual export/import only.
- Manual JSON+ZIP backup/restore is Free.
- PDF export and sharing are Free and remain free permanently.
- Customer and pool profiles are exclusively Pro.
- Pro data remains readable/exportable after entitlement loss (see 4.2).

### 4.2 Entitlement Loss Behavior

When Pro access becomes invalid (expired token, refund, revocation):

- Never delete or silently discard user data.
- All records remain readable and exportable.
- Pro-gated UI (customer/pool management, templates, branding, snapshot restore) is hidden.
- Existing reports retain their saved branding/logo as stored at creation time (historical fidelity); new reports use neutral header.
- User can still manually export all data (JSON+ZIP) including customer/pool records (read-only export).
- Customer/pool records become read-only: cannot create/edit/delete until Pro restored. Display banner: "Pro required to manage customers/pools. Your data is safe and exportable."
- Snapshots: existing snapshots remain; new automatic snapshots paused until Pro restored.
- Ad-free: ads re-enabled.
- No data migration or deletion occurs on entitlement loss.

### 4.3 License Refund / Revocation

- Backend marks license status refunded/revoked.
- Issued tokens remain valid until their 14-day expiry (cannot revoke offline tokens immediately — documented limitation).
- After expiry, Pro features lock with graceful banner.
- Recovery/refund notice email sent.

### 4.4 Reinstall / Browser Data Loss / Device Change

- IndexedDB cleared: user re-activates with license key (counts against device limit unless prior device deactivated).
- Recovery endpoint allows re-issue; deactivation of lost device via self-service or support.
- No cloud restore; user must restore from their own backup file.

### 4.5 Temporary Internet Loss

- All local features work offline (see Offline Matrix).
- License validation refresh deferred until reconnection; token grace period applies.

### 4.6 Locally Stored Pro Data with Invalid Entitlement

- Data is not deleted. UI degrades to Free capabilities (read/export only for Pro records).

---

## 5. Complete Functionality Inventory

### 5.1 Free Tools

- Pool Volume Calculator: all shapes, imperial/metric, handoff to chemical calc.
- Chemical & Chlorine Calculators: label-rate scaling, mandatory label verification.
- Maintenance Schedule: daily/weekly/monthly/seasonal/opening/closing, CRUD tasks, completion, print.
- Water Test Log: 9 params + temp + notes, CRUD, CSV export, trend viz (optional), range badges.
- Service Report Maker: full report flow, drafts, photos, PDF, share, SMS summary, backup.

### 5.2 Pro Tools

- Customer & Pool Management: CRUD, soft delete/archive, history, cloning, templates, branding.

### 5.3 Cross-Cutting

- Backup & Restore (Free: manual; Pro: + snapshots).
- PWA Offline.
- Licensing ($29 one-time).

---

## 6. Screen-by-Screen UX Specification

### 6.1 Home (/)

- Hero with dual CTAs, 6-tool quick-launch grid, audience split cards, offline notice, pricing table, FAQ accordion.
- States: static SSR marketing; client hydrates SW + verifies token.
- Accessibility: skip-to-content, semantic headings, keyboard CTAs.

### 6.2 Pool Volume Calculator (/tools/pool-volume)

- Inputs: shape selector (rectangle, square, round, oval, kidney, irregular), unit toggle (imperial/metric), length, width or diameter, shallow depth, deep depth, average depth override, estimated surface area (irregular), kidney cross-sections.
- Validation: positive finite numbers, ranges, shape-specific required fields.
- Outputs: US gallons (display rounded to nearest 10, exact float internally), liters, cubic feet, formula breakdown, measurement summary, accuracy disclaimer, print, "Use Volume in Chemical Calculator" (?vol=).

### 6.3 Chemical & Chlorine Calculators

- Inputs: pool volume (gal, pre-filled via ?vol=), product name, label dose amount, label reference volume, unit selector (mass: oz, lbs, g, kg; fluid: fl oz, qt, gal, mL, L), safety checkbox.
- Validation: blocks until checkbox ticked and valid positive numbers; no zero reference; dimension enforcement.
- Outputs: scaled amount, unit equivalents (where dimensionally valid), formula, safety warning box, "Add to Service Report".
- Chlorine: FC, TC, CC (auto), volume, label rate, units, user-entered target comparison (optional, informational only).

### 6.4 Maintenance Schedule (/tools/maintenance-schedule)

- Inputs: pool type, season.
- Features: grouped checklists (daily/weekly/monthly/seasonal/opening/closing), completion persist, custom tasks add/edit/delete/reorder, reset, print.
- Season/pool-type change: preserve completion per task ID; hide inapplicable tasks (not delete); prompt before bulk reset.

### 6.5 Water Test Log (/tools/water-test-log)

- Inputs: date/time, pool (optional), FC, TC, CC (auto: TC-FC; if TC<FC show variance warning + repeat-test instruction, preserve originals), pH, TA, CH, CYA, salt, temp, notes.
- Features: chronological table, range badges (informational, configurable thresholds), date filter, CSV export, edit, delete modal, optional trend chart.

### 6.6 Service Report Maker (/tools/service-report)

- Sections: business header (Pro branding), visit metadata, quick-tap chips (10 standard + custom), water readings grid (FC, TC, pH, TA, CH, CYA, salt, PSI), chemicals repeater (product, amount, unit, 1-tap import), notes & photos (customer summary, private notes with lock icon, up to 2 photos).
- Actions: Preview PDF, Share PDF, Copy SMS Summary, Save Draft, Print, Export JSON Backup, Duplicate, Delete, Reopen.
- Draft: auto-save debounced 2s to report_drafts; recover on reload.
- UX states: empty (no reports), loading (skeleton), error (retry), offline indicator, unsaved-changes prompt on navigation, double-click protection on save/share, form autosave indicator ("Saved 2s ago").

### 6.7 Customers & Pools (/pro/customers) — Pro Only

- Customer list/search/create/edit/delete (soft), per-customer pools, service history timeline, 1-tap clone, templates, branding.
- Entitlement-loss: read-only mode with banner.

### 6.8 Activate Pro (/pro/activate)

- License key, device name, activation, status, device list, deactivate, recovery link.

### 6.9 Settings (/settings)

- Theme, units, business profile, ad consent, backup/import, storage quota, data deletion, range thresholds, PWA status, last backup reminder.

---

## 7. Calculation Engine (Pool Volume)

### 7.1 Measurement Normalization (NEW in v5)

Before any formula, normalize all inputs to a single internal unit system:

- Internal length unit: feet (ft).
- Internal volume unit: US gallons (gal).
- Conversion happens at input boundary; formulas operate only on normalized (ft/gal) values.
- Metric inputs (m, cm) converted to ft via 1 m = 3.280839895 ft, 1 cm = 0.0328084 ft.
- Inches converted to ft via /12.
- Average depth override: if provided (positive finite), it takes precedence over shallow/deep depth. If both shallow and deep provided, D_avg = (shallow+deep)/2. If only one of shallow/deep provided, use it as constant depth (D_avg = that value) and note "single depth used."
- All computations use full double precision (JavaScript number). Rounding occurs ONLY at display boundary.

### 7.2 Shape-Specific Required Fields

| Shape | Required | Optional |
|---|---|---|
| rectangle | length, width, (shallow+deep OR averageDepthOverride) | — |
| square | side (single), depth | width (must equal side if provided; if mismatched, error) |
| round | diameter, depth | — |
| oval | length, width, depth | — |
| kidney | length, depth, cross-sections (positions+widths) OR component dims | method selector |
| irregular | estimatedSurfaceArea, depth | — |

Square: single "side" input; if user also enters width, validate equality else error "Side and width must match for a square."

### 7.3 Formulas (normalized to ft, gal)

- Rectangular/Square (sloped): D_avg=(shallow+deep)/2; V_cuft=L x W x D_avg; V_gal=V_cuft x 7.48052
- Round: r=D/2; V_gal=pi x r^2 x D_avg x 7.48052
- Oval: V_gal=(pi/4) x L x W x D_avg x 7.48052
- Kidney (trapezoidal integration): given cross-sections at longitudinal positions x_i (0 <= x_0 < x_1 < ... < x_n <= L) with widths w_i, surface area approx = sum (w_i + w_{i+1})/2 x (x_{i+1}-x_i) (trapezoidal rule). V_gal = surfaceArea x D_avg x 7.48052. Validate: x_0=0, x_n=L, positions strictly increasing, widths positive, at least 3 cross-sections. Alternative: two-semicircle decomposition with explicit component dimensions (rectangle + two semicircles), user enters each dimension.
- Irregular: V_gal = estimatedSurfaceArea x D_avg x 7.48052. User enters estimated surface area (measured via grid/plan or manual). Disclaimer: "Estimated surface area entered by user; result is an estimate."

### 7.4 Accuracy Disclaimer

"Pool volume results are mathematical calculations based on the dimensions you entered. Real-world water capacity depends on actual construction tolerances, floor contours, steps, benches, and water level. For chemical dosing, verify against the pool's actual fill line and product label. Irregular and kidney shapes are estimates."

Mathematical precision (formula exactness) is distinct from real-world measurement accuracy. No fixed +/- % is claimed.

### 7.5 Display Rounding

- Internal: full precision float.
- Display: gallons rounded to nearest 10 (for values >=100) else nearest 1; liters to nearest 1; cubic feet to 2 decimals.
- Handoff (?vol=) uses the full-precision internal value, not the rounded display value, to avoid compounding rounding errors. The chemical calculator receives the exact float.

### 7.6 Invalid / Missing / Contradictory Handling

- Missing required field -> calculation blocked, inline error listing missing fields.
- Zero/negative -> inline error "must be greater than zero."
- Out of range -> inline error with allowed range.
- Contradictory (square side != width) -> error, no result.
- Kidney with <3 cross-sections -> error.
- Kidney positions not spanning 0..L -> error.
- No division by zero (reference volumes in chemical calc handled there).
- NaN/Infinity rejected at parse boundary (Zod finite()).

### 7.7 Kidney Cross-Section Validation

- Minimum 3, maximum 11 cross-sections.
- Positions: x_0 must be 0, x_n must equal L (within 0.01 ft tolerance), strictly increasing.
- Widths: positive, <= 500 ft.
- If validation fails, show which cross-section is invalid.

---

## 8. Chemical and Chlorine Calculation Engine

### 8.1 Formal Unit Model

Dimensions (TypeScript discriminated union):

```ts
type Dimension = 'mass' | 'fluidVolume' | 'poolVolume' | 'concentration' | 'temperature' | 'dimensionless';
```

Units map to dimensions:

| Unit | Dimension |
|---|---|
| oz (weight) | mass |
| lbs | mass |
| g | mass |
| kg | mass |
| fl oz | fluidVolume |
| cups | fluidVolume |
| qt | fluidVolume |
| gal (product) | fluidVolume |
| mL | fluidVolume |
| L (product) | fluidVolume |
| gal (pool) | poolVolume |
| L (pool) | poolVolume |

Mass to fluid conversions require a user-provided product density (mass per fluid volume). No default density is invented. If density missing, conversion is blocked with message: "Weight and fluid volume are different dimensions. Enter product density to convert."

### 8.2 Label-Rate Scaling Formula

Required Dose = Label Dose Amount x (Actual Pool Volume / Label Reference Volume)

- Label Dose Amount and Label Reference Volume must share a consistent unit relationship; the result is in the Label Dose Amount's unit.
- Actual Pool Volume and Label Reference Volume must be in the same volume dimension (pool volume). If label reference volume is given in a different volume unit, convert using standard volume conversions (gal to L) — these are same dimension, allowed.
- If Label Dose Amount is mass and user wants fluid output, density required.
- No universal product density, no generic dosing recommendation. The app scales user-entered label instructions only.

### 8.3 Handling Specific Cases

- Weight-based labels: output in weight units (oz/lbs/g/kg). Provide equivalent in other weight units via standard conversion.
- Liquid labels: output in fluid units. Provide equivalents.
- Different label reference volumes: formula handles any positive reference volume.
- User-provided density: store per calculation (not persisted unless user saves); allow conversion display.
- Missing density: block cross-dimension conversion; show message.
- Invalid label units: Zod validates unit enum; reject unknown.
- Fractional output: display with up to 4 decimals; if <0.01, show "<0.01" with note.
- Extremely large amounts (>1000 units): show with warning "Large dose — double-check label and volume."
- Invalid pool volume (<=0): block calculation.
- Missing label verification checkbox: block result display.

### 8.4 Chlorine Calculator — Fully Specified

Separate three concerns:

1. Reading calculations:
   - CC = TC - FC.
   - If TC < FC: preserve both original readings; display "Test variance / invalid measurement" warning badge; instruct repeat test. Do not coerce to zero. Do not compute negative CC as a valid result (display "—" for CC with warning).
   - If TC >= FC: CC = TC - FC, display normally.
2. Label-rate scaling: same as chemical calculator (chlorine product dose scaled by volume).
3. Optional user-entered target comparison (informational only): user enters target FC/TC/pH; app shows whether current reading is below/within/above target. No automatic treatment recommendation. Disclaimer: "Targets are informational defaults; follow product labels and professional advice."

Free/total/combined chlorine, pool volume, label rate, product units, target values all entered by user. No chlorine treatment recommendation generated.

### 8.5 Chemical Safety Disclaimers

Displayed prominently: "This tool mathematically scales a dosage you entered from a product label. It is not a chemical treatment recommendation. Always verify against the physical product label and consult a pool professional. PoolTechTools is not responsible for chemical application outcomes."

---

## 9. Validation Rules

### 9.1 Numeric Validation

- Finite numbers only (reject NaN, Infinity).
- Positive where physically meaningful.
- Decimal support, 4-decimal internal precision.
- No division by zero (reference volume > 0).
- Range table:

| Field | Min | Max |
|---|---|---|
| Length/Width/Diameter/Side | 0.1 | 500 ft (152.4 m) |
| Depth | 0.1 | 30 ft (9.14 m) |
| Volume (pool) | 1 | 1,000,000 gal |
| Surface area | 1 | 100,000 sq ft |
| Dose amount | >0 | 1,000,000 |
| Reference volume | >0 | 1,000,000 |
| Temperature | -10 to 150 F / -23 to 65 C |
| Chemical readings (ppm) | 0 to 10,000 |
| pH | 0 to 14 |
| Salt (ppm) | 0 to 10,000 |
| Kidney cross-sections | 3 to 11 |

Ranges applied in the input's unit converted to internal? Ranges are defined in imperial (ft/gal) and converted for metric inputs (e.g., 500 ft = 152.4 m). Validation converts input to internal ft before range check.

### 9.2 Text Validation

- Name: 1-100 chars trimmed.
- Phone: optional, pattern [0-9+\-() ]{0,30}.
- Email: optional, RFC5322 simplified, max 254.
- Address: max 500.
- Notes: max 5,000.
- Product name: max 100.

### 9.3 Date/Time

- ISO 8601. Future > +1 day rejected (clock skew). Past allowed to 2000-01-01.

### 9.4 File Validation (Photos)

- Max original 10 MB.
- MIME: image/jpeg, image/png, image/webp, image/heic (convert to JPEG).
- Magic bytes check where practical.
- Max 2 per report.
- Reject corrupt images with user-facing error.

### 9.5 Zod Schemas

Shared between UI and calc engine in src/lib/validation/. Example provided (volume schema with shape-specific superRefine).

---

## 10. IndexedDB Architecture

### 10.1 Configuration

- DB name: pooltechtools_db.
- Version: integer, incremented on schema change.
- Library: idb (verify current version). Wrapper around IndexedDB.
- Encryption: NONE. State this plainly in privacy policy. Do not claim encryption.

### 10.2 Browser Storage Limitations

- Origin-scoped; clearable by user/browser.
- Safari eviction risk (7 days inactivity in some modes); request navigator.storage.persist().
- Quota varies (Chromium generous, Safari conservative).
- No cross-device sync. Private/incognito may not persist.
- Backup/restore is the recovery mechanism.

### 10.3 Concurrency and Transactions

- IndexedDB transactions are the source of truth for data integrity.
- BroadcastChannel is used only for UI coordination (e.g., "data changed in another tab, refresh"), NOT for transaction safety.
- Conflict strategy: last-write-wins with updatedAt timestamp; on concurrent edit of same record from two tabs, the later commit wins and the other tab shows "This record was updated in another tab — reload to see latest" with a reload action. No silent data loss of the whole record, but concurrent edits to the same record cannot be merged; user is informed.
- Multi-store atomic operations (report + attachments) use a single transaction spanning stores.

### 10.4 Versioning and Migrations

- DB version increments per schema change.
- onupgradeneeded runs within the version-change transaction. Object store creation (createObjectStore, createIndex) must happen synchronously inside this callback. Data migration that requires async I/O or complex logic must be deferred: perform schema changes in onupgradeneeded, then run data migrations in a separate step after the DB is open (application-level migration runner reading the migrations store). Document this clearly: "Arbitrary async migration code cannot safely execute inside a version-change transaction."
- Migration runner: on app init, check DB version vs app's expected version; run pending migrations sequentially, each in its own transaction, recording in migrations store. On failure, enter recovery mode with export option.

### 10.5 Storage Quota Monitoring

- navigator.storage.estimate(); display in Settings.
- Warn at 80%; block photo uploads at 95%; suggest export + cleanup.

### 10.6 Recovery Mode

- If DB open fails or migration fails: app enters read-only recovery mode showing last error, with "Export data" (best-effort) and "Reset database" (with confirmation) options. Never silently wipe.

---

## 11. Complete Database Schemas

### 11.1 Corrections vs v4

- Report store adds customerNameSnapshot and poolNameSnapshot (strings, captured at report creation) so historical reports don't dangle after customer/pool soft-delete.
- Report store adds reportNumber unique index generation rule: RPT-YYYYMMDD-NNNN where NNNN is a per-day sequence stored in settings; generated client-side; collision handled by retry.
- Attachments: reportId index; on report soft-delete, attachments retained until hard purge (so restore works); on hard purge cascade delete.
- Drafts: id = report id if editing existing; else new UUID; expiresAt = lastSavedAt + 30 days; cleanup on app start (delete expired).
- Snapshots: max 5 FIFO; reason enum; compressedPayload stored as compressed string (pako or native CompressionStream where available, verified at impl).

### 11.2 TypeScript Interfaces (v5)

```ts
// src/lib/db/types.ts
export interface Customer {
  id: string; // UUID v4
  name: string;
  phone?: string;
  email?: string;
  serviceAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  version: number; // optimistic concurrency
}

export interface Pool {
  id: string;
  customerId: string;
  name: string;
  shape: 'rectangle'|'square'|'round'|'oval'|'kidney'|'irregular';
  volumeGallons: number;
  surfaceType: 'plaster'|'pebble'|'vinyl'|'fiberglass'|'tile'|'other';
  sanitizerType?: 'chlorine'|'salt'|'bromine'|'biguanide'|'other';
  equipmentNotes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  version: number;
}

export interface Report {
  id: string;
  customerId?: string;
  poolId?: string;
  customerNameSnapshot: string;
  poolNameSnapshot?: string;
  reportNumber: string;
  visitDate: string;
  technician: string;
  tasks: string[];
  readings: Record<string, number>;
  chemicals: Array<{ product: string; amount: number; unit: string }>;
  customerSummary: string;
  privateNotes: string;
  photoIds: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  version: number;
}

export interface Attachment {
  id: string;
  reportId: string;
  blob: Blob;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
}

export interface WaterTest {
  id: string;
  poolId?: string;
  recordedAt: string;
  readings: Record<string, number>;
  notes: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  version: number;
}

export interface Template {
  id: string;
  name: string;
  taskDefaults: string[];
  notesDefault: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface MaintenanceTask {
  id: string;
  category: 'daily'|'weekly'|'monthly'|'seasonal'|'opening'|'closing'|'custom';
  title: string;
  description?: string;
  completedAt?: string;
  order: number;
  poolType?: string;
  season?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface ReportDraft {
  id: string;
  payload: Partial<Report>;
  lastSavedAt: string;
  expiresAt: string;
}

export interface Snapshot {
  id?: number;
  createdAt: string;
  reason: 'startup'|'milestone'|'pre-import'|'pre-migration'|'interval';
  compressedPayload: string;
  sizeBytes: number;
  schemaVersion: number;
}

export interface MigrationRecord {
  version: number;
  appliedAt: string;
  description: string;
}
```

### 11.3 Deletion Behavior (v5)

- Customer delete: soft delete (deletedAt). Reports remain with customerNameSnapshot. Customer list hides deleted; "Show archived" toggle.
- Pool delete: soft delete. Reports remain with poolNameSnapshot.
- Report delete: soft delete; attachments retained until hard purge (transactional). Hard purge (Settings) permanently removes deleted reports + attachments.
- Maintenance task delete: hard delete (no history needed) but confirm.

---

## 12. Backup and Restore

### 12.1 Two Explicit Formats

Format A — JSON-only export (no photos):
- File: pooltechtools-backup-YYYYMMDD-HHMMSS.json
- Contains all records except photo blobs (photoIds listed but blobs omitted).
- Warning on export: "This backup does NOT include photos. Use the complete ZIP backup to preserve photos."
- Available to Free and Pro.

Format B — Complete ZIP backup:
- File: pooltechtools-backup-YYYYMMDD-HHMMSS.zip
- Contains all records + all photo attachments.
- Available to Free and Pro.

### 12.2 ZIP Directory Structure

```
pooltechtools-backup-<timestamp>.zip
├── manifest.json
├── data.json
└── attachments/
    └── <reportId>/
        └── <attachmentId>.jpg
```

### 12.3 Manifest Schema (Appendix C)

Includes format, schemaVersion, appVersion, createdAt, counts, files array with sha256, totalSizeBytes.

### 12.4 Export Process

1. Gather all records from all stores (including soft-deleted for fidelity; flag in manifest).
2. Compute SHA-256 per file.
3. Write manifest.json and data.json.
4. For each attachment, write attachments/<reportId>/<attachmentId>.jpg.
5. Zip with compression.
6. Trigger download.

### 12.5 Import Process (Staged, Safe)

1. File type validation (.zip or .json).
2. Size limit: 500 MB.
3. ZIP safety: max 10,000 entries, max 500 MB uncompressed, max 100 MB per file, reject path traversal (../, absolute, backslashes), reject symlinks, reject duplicate entries.
4. Extract manifest.json and data.json; validate manifest schema; verify file hashes.
5. Zod validate data.json.
6. Version check: accept schemaVersion <= current; run migrations if older; reject unknown newer versions with message.
7. Preview: show counts, warnings, missing-attachment list.
8. User chooses Merge (skip existing IDs) or Replace (overwrite).
9. Storage quota preflight: estimate required size; abort if insufficient.
10. Staged import: validate ALL records in memory first; if any invalid, abort with no changes.
11. Transactional commit: single transaction (or batched if too large) writing all records. On failure, rollback; existing data untouched.
12. Post-import: verify counts; show summary.
13. Missing attachments: if any attachment file missing from zip, fail import with list of missing IDs unless user explicitly chooses "skip missing photos" (with confirmation and warning that those photos will be lost).

### 12.6 ZIP Bomb / Path Traversal Protection

- Check compression ratio; reject if > 100:1.
- Reject entries with path containing "..", starting with "/", or containing backslash.
- Reject entries with size > 100 MB.
- Reject symlinks (external file attributes).

### 12.7 Private Data Warning

Backup files contain private technician notes and customer information. Display on export: "This backup contains private notes and customer data. Store it securely. Anyone with this file can read its contents."

### 12.8 Snapshots (Pro)

- Automated, rolling, max 5, local only.
- Triggers: startup (if >24h), before destructive ops, on report save milestone, every 6h active use (throttled).
- Snapshot payload: compressed JSON of all records EXCEPT photo blobs (store attachment metadata + IDs only, not blobs) to avoid duplicating large binary data. On restore from snapshot, photos that still exist in attachments store are linked; missing photos are reported.
- Quota check before creation; skip + warn if <10% free.

### 12.9 Conflict: Snapshots vs Manual Backups

- Snapshots are automatic short-term recovery (local, 5 max, no photos).
- Manual backups are portable long-term (JSON or ZIP, include photos in ZIP).
- Do not promise background weekly downloads. Use in-app reminders ("Last backup: 30 days ago").

---

## 13. Payment Architecture (Paddle)

### 13.1 Merchant of Record

Paddle Billing. Handles tax, VAT, checkout, fraud. Does NOT issue license keys or manage activations. PostgreSQL required for that.

Verify all Paddle API details against current official docs before implementation. Do not invent event names or SDK methods.

### 13.2 Payment Flow

1. User clicks "Upgrade to Pro ($29)" -> Paddle Checkout opens (client-side Paddle.js).
2. Payment completes (Paddle handles UI).
3. Paddle sends webhook to POST /api/payments/webhook.
4. Backend verifies signature (Paddle Node SDK) before parsing.
5. Backend checks idempotency (processed_webhook_events).
6. Backend verifies transaction status = completed (or current Paddle equivalent), correct product/price, currency USD, amount $29.00.
7. Backend creates license in DB transaction (idempotent on paddle_transaction_id).
8. Backend records webhook event as processed (only after license creation succeeds).
9. Backend enqueues purchase email (retry-safe, independent of license creation).
10. Customer activates at /pro/activate.

Frontend redirect/success message NEVER creates a license.

### 13.3 Webhook State Machine

- received -> processing -> processed (success) | failed (retry) | skipped (duplicate/irrelevant).
- Event marked 'processed' ONLY after license creation commits.
- If license creation fails, event stays 'failed' with error_classification; Paddle retries; idempotency prevents duplicate license.
- Email delivery tracked separately; failed email does not fail the webhook (email retried independently).

### 13.4 Refunds / Chargebacks

- Paddle refund/chargeback webhook -> mark license refunded/revoked, set revoked_at + reason.
- Tokens remain valid until 14-day expiry (documented limitation; no immediate offline revocation).
- Refund notice email.

### 13.5 Out-of-Order / Duplicate Events

- Idempotency on event_id (INSERT ... ON CONFLICT DO NOTHING).
- Duplicate events return 200 (idempotent).
- Out-of-order: process based on event type; status checks prevent invalid transitions.

### 13.6 Sandbox vs Production

- Separate accounts/keys/webhook secrets/product IDs.
- PADDLE_ENV env var (sandbox | production).
- Test full flow in sandbox before production.

---

## 14. PostgreSQL Schema and Migrations

### 14.1 Schema (v5, includes v4 base + additions)

```sql
-- Migration: 001_create_licensing_schema.sql

CREATE TABLE processed_webhook_events (
    event_id VARCHAR(255) PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE,
    processing_status VARCHAR(30) NOT NULL DEFAULT 'received',
    error_classification VARCHAR(100),
    CONSTRAINT chk_processing_status CHECK (processing_status IN ('received','processing','processed','failed','skipped'))
);

CREATE TABLE licenses (
    license_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_key_hash VARCHAR(255) UNIQUE NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    paddle_transaction_id VARCHAR(255) UNIQUE NOT NULL,
    paddle_customer_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    price_id VARCHAR(255) NOT NULL,
    amount_cents INT NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    max_activations INT NOT NULL DEFAULT 3,
    email_delivery_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    email_sent_at TIMESTAMP WITH TIME ZONE,
    email_attempts INT NOT NULL DEFAULT 0,
    recovery_verification_token_hash VARCHAR(255),
    recovery_token_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revocation_reason VARCHAR(255),
    CONSTRAINT chk_status CHECK (status IN ('active','refunded','revoked','suspended')),
    CONSTRAINT chk_max_activations CHECK (max_activations > 0 AND max_activations <= 10),
    CONSTRAINT chk_email_status CHECK (email_delivery_status IN ('pending','sent','failed','bounced'))
);

CREATE INDEX idx_licenses_email ON licenses(customer_email);
CREATE INDEX idx_licenses_transaction ON licenses(paddle_transaction_id);
CREATE INDEX idx_licenses_status ON licenses(status);

CREATE TABLE license_activations (
    activation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_id UUID NOT NULL REFERENCES licenses(license_id) ON DELETE CASCADE,
    activation_identifier_hash VARCHAR(128) NOT NULL,
    device_name VARCHAR(255) NOT NULL,
    activated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_validated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    deactivated_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_license_device UNIQUE (license_id, activation_identifier_hash),
    CONSTRAINT chk_activation_status CHECK (status IN ('active','deactivated'))
);

CREATE INDEX idx_activations_license ON license_activations(license_id);
CREATE INDEX idx_activations_status ON license_activations(status);
```

### 14.2 License Key Storage (HMAC vs Argon2id)

- Format: PTT-XXXX-XXXX-XXXX-XXXX (cryptographically random, high entropy).
- Store a keyed hash for lookup: HMAC-SHA256(licenseKey, LICENSE_KEY_HMAC_SECRET). This allows O(1) lookup. Argon2id is NOT suitable for lookup (slow, no deterministic comparison without scanning all rows). If stronger password-style hashing is desired, store BOTH: HMAC for lookup + Argon2id for verification. Recommended for V1: HMAC-SHA256 keyed hash only, with the secret in env vars and rotation procedure. Document trade-off.
- Never store plaintext.
- Key normalization: uppercase, strip spaces, validate pattern before hashing.
- Verification: hash input, compare to stored hash (timing-safe compare).

### 14.3 Recovery (Email Verification)

- Recovery request by email: send a time-limited (15 min), single-use verification link/code to the email.
- User clicks link -> verified -> backend issues new license key (old key invalidated), emails it.
- Prevent email enumeration: always return { received: true }.
- Rate limit: 3 requests per email per hour, 10 per IP per hour.
- Recovery token: single-use, hashed in DB, expires 15 min, invalidated after use.

### 14.4 Device Limit Atomic Enforcement

- Transaction: SELECT license FOR UPDATE; count active activations; if deviceHash exists -> refresh; else if count < max -> insert; else -> 409.
- DeviceHash is best-effort (see Section 18). Not a hardware ID.

### 14.5 Device Loss / Slot Recovery

- Self-service: deactivate by license key + deviceHash (if browser still has data).
- Lost device: support process — verify email, deactivate all devices, user re-activates. Document runbook. Optionally automated endpoint gated by recovery verification.

---

## 15. Complete API Contracts

Base URL configurable via APP_URL. All responses JSON. Timestamps ISO 8601 UTC. Error format: { "error": { "code": "string", "message": "string", "details": {} } }.

### 15.1 POST /api/payments/webhook

- Auth: Paddle-Signature header. No user auth.
- Request: raw body (preserve for signature). Content-Type application/json.
- Logic: verify signature -> parse -> validate event type -> idempotency -> (if transaction.completed) verify status/product/price/currency/amount -> transaction: create license (idempotent) -> record event processed -> enqueue email.
- Response 200: { received: true }.
- Errors: 400 invalid signature/payload; 409 already processed (still 200 to Paddle); 500 retryable.
- Rate limit: generous per IP; verify signature first.
- Logging: event ID, type, status, error class. NO email/key.

### 15.2 POST /api/license/activate

- Auth: none.
- Request: { licenseKey, deviceName, deviceHash } (Zod validated).
- Logic: hash key -> lookup -> status active -> transaction lock -> count -> insert/refresh -> sign token -> return.
- Response 200: { success, signedToken, expiresAt }.
- Errors: 400, 404, 403 (revoked/refunded), 409 (limit), 429, 500.
- Rate limit: 5/IP/15min; 10/key/hour.

### 15.3 POST /api/license/validate

- Auth: Bearer token (signed entitlement token).
- Request: { signedToken }.
- Logic: verify signature (public key) -> check expiry/product/entitlement -> DB lookup license active -> refresh last_validated_at -> issue refreshed token.
- Response 200: { valid, signedToken?, expiresAt?, reason? }.
- Errors: 400, 401, 403, 429, 500.
- Rate limit: 60/device/hour.

### 15.4 POST /api/license/deactivate

- Auth: required (token or key+hash).
- Request: { licenseKey, deviceHash }.
- Response 200: { success, remainingActivations }.
- Errors: 400, 404, 403, 429, 500.

### 15.5 POST /api/license/recover (request)

- Auth: none.
- Request: { email }.
- Logic: lookup licenses by email; if found, create recovery token, send email. Always return { received: true }.
- Errors: 400, 429, 500.

### 15.6 POST /api/license/recover/verify (NEW)

- Auth: recovery token (from email link).
- Request: { recoveryToken }.
- Logic: verify token (hash, single-use, not expired) -> invalidate token -> issue new license key (old invalidated) -> email new key -> return { success }.
- Errors: 400 (invalid/expired), 429, 500.

### 15.7 GET /api/license/status

- Auth: Bearer token.
- Response 200: { pro, expiresAt, devicesUsed, maxDevices }.
- Errors: 401, 403, 429, 500.

---

## 16. License Key Security

(See 14.2, 14.3.) Additional:

- Key entropy: 128 bits minimum (use 4 groups of 6 = 24 chars for ~142 bits). Use crypto.randomBytes.
- Normalization: uppercase, remove whitespace and dashes before hashing.
- Verification: hash input, compare to stored hash (timing-safe compare).
- Rotation: if LICENSE_KEY_HMAC_SECRET rotates, all existing keys become invalid -> requires re-issue (support process). Alternatively support dual-secret verification during rotation window. Document as operational runbook.
- Audit: log activation/deactivation/recovery events (no key values).

---

## 17. Ed25519 Token Architecture

### 17.1 Algorithm & Library

- Ed25519 (EdDSA). Use @noble/ed25519 or Web Crypto if browser support verified. Verify at implementation.
- Server: private key in env (ED25519_PRIVATE_KEY), never in client bundle/source maps/logs.
- Client: public key only (NEXT_PUBLIC_ED25519_PUBLIC_KEY).

### 17.2 Token Structure (JWT, EdDSA)

```json
{
  "sub": "<license_id>",
  "iss": "<APP_URL origin>",
  "aud": "ptt-client",
  "pro": true,
  "iat": 1782200000,
  "exp": 1783409600,
  "ver": 1,
  "kid": "key-2026-01",
  "dev": "<activation_identifier_hash>",
  "act": "<activation_id>",
  "pid": "pooltechtools-pro"
}
```

### 17.3 Verification (client)

1. Parse JWT header; verify alg = EdDSA.
2. Look up public key by kid (support current + previous during rotation).
3. Verify signature.
4. Check iss, aud, pid.
5. Check exp (with device clock).
6. Check pro === true.
7. If all pass -> Pro unlocked.

### 17.4 Grace Period & Expiry

- exp = iat + 14 days.
- Online validation refreshes token (new exp).
- After exp, Pro locks gracefully with banner. Data preserved.

### 17.5 Clock Manipulation

- Store lastSeenAt in IndexedDB. If current time < lastSeenAt, treat as suspicious -> require online validation (lock Pro until validated). Document: best-effort, not tamper-proof. A determined user can bypass; acceptable risk for $29 product.

### 17.6 Revocation Limitation

- Previously issued offline tokens cannot be revoked on a device that stays offline. After 14-day expiry, lock. Document this honestly.

### 17.7 Key Rotation

- Support multiple public keys by kid. Server signs with new key; client accepts current + previous during overlap window (e.g., 30 days). Document rotation runbook.

---

## 18. Device Activation

### 18.1 Honest Limitations

Browser-generated fingerprints are NOT reliable hardware identities. They can change (browser update, OS update), be shared (same device/browser profile), or be spoofed. deviceHash is a best-effort client identifier for slot management, not security.

### 18.2 deviceHash Generation

- Client generates a random UUID on first run, stored in IndexedDB + localStorage (redundant for survival). Hash it (SHA-256) to produce deviceHash. This is "this browser profile," not "this physical device."
- If storage cleared, new deviceHash -> new slot.

### 18.3 Activation Flow (see 14.4)

### 18.4 Deactivation & Recovery

- Self-service: deactivate by license key + deviceHash (if browser still has data).
- Lost device: support process — verify email, deactivate all devices, user re-activates. Document runbook. Optionally automated endpoint gated by recovery verification.

### 18.5 Abuse / Rate Limiting

- Rate limits per 15.2/15.4.
- Max activations 3 (configurable up to 10 in DB, but app policy 3).

---

## 19. Email Delivery

### 19.1 Provider-Independent Interface

```ts
interface EmailService {
  sendPurchaseConfirmation(to, vars): Promise<EmailResult>;
  sendActivationConfirmation(to, vars): Promise<EmailResult>;
  sendRecoveryInstructions(to, vars): Promise<EmailResult>;
  sendRevocationNotice(to, vars): Promise<EmailResult>;
}
```

Abstract provider (Resend/Postmark/SendGrid) behind this. Verify current docs.

### 19.2 Templates & Variables

1. Purchase Confirmation: customerEmail, licenseKey, activationUrl, supportEmail.
2. Activation Confirmation: deviceName, activatedAt, manageDevicesUrl.
3. Recovery Instructions: recoveryUrl, supportEmail.
4. Refund/Revocation Notice: reason, supportEmail.

### 19.3 Requirements

- Server env only for API keys.
- Retry transient failures (exponential backoff, max 5) without creating second license.
- Track delivery status in licenses.email_delivery_status.
- Do not expose keys in analytics/logs.
- Provide recovery mechanism.
- Idempotent: re-send does not create duplicate license.
- If first email delayed/rejected: recovery endpoint lets customer retrieve (after email verification).

---

## 20. PDF and Photo Architecture

### 20.1 Photo Handling

- Max 2 per report.
- Max original 10 MB.
- MIME: jpeg, png, webp, heic (convert to JPEG).
- Magic bytes check where practical.
- Compression: canvas, max 1024px width, quality 0.75, JPEG output.
- EXIF: re-encoding strips most EXIF; orientation handled via canvas; full stripping best-effort (document limitation).
- Corrupt image: catch decode error, user-facing error, no crash.
- Compression failure: fall back to original if <= limit else reject.
- Storage quota check before add.
- HEIC: conversion support depends on browser (Safari native; others may fail) — document as best-effort, optional in V1 (owner decision).

### 20.2 PDF Specification

- Library: @react-pdf/renderer (verify version).
- Page: Letter default, A4 option.
- Fonts: Helvetica embedded; custom brand font (Pro) with fallback.
- Sections: business header (Pro logo/color), customer info, visit metadata, task checklist, water readings, chemicals, customer summary, photos (<=2), footer with page numbers.
- Pagination: auto page breaks; repeat header.
- Empty sections omitted.
- Missing info: "—" or omit.
- Customer-facing isolation: privateNotes NEVER in PDF. Enforced via PublicReportView type (excludes privateNotes) — PDF component accepts only PublicReportView. Type-level guarantee.
- Error handling: try/catch, preserve data, toast + retry.

### 20.3 Sharing Flow

1. Generate PDF Blob.
2. Validate (non-empty, correct MIME).
3. Check navigator.canShare({ files }).
4. If supported, navigator.share.
5. Else download.
6. Handle AbortError silently.
7. Preserve data on failure.

### 20.4 SMS Summary

- Short text (date, customer, tasks, readings). Never private notes. Copy to clipboard. ~160 chars preferred.

### 20.5 Private Note Exclusion Tests

Automated tests assert privateNotes string does not appear in: PDF output bytes/text, SMS summary, share payload, any analytics event, any public export. Test uses a sentinel private note value and asserts absence.

---

## 21. PWA and Offline Architecture

### 21.1 Tooling

Next.js 16 App Router + @serwist/next (verify compatibility).

### 21.2 Caching

- App shell + static: Cache-First.
- API routes: Network-Only.
- Tool pages: Stale-While-Revalidate.
- Images/icons: Cache-First with size limits.

### 21.3 Offline Feature Matrix

| Feature | Fully Offline | Requires Internet | Requires Server Validation |
|---|---|---|---|
| Volume/chemical/chlorine calc | yes | no | no |
| Maintenance schedule | yes | no | no |
| Water test log CRUD | yes | no | no |
| Service report create/edit | yes | no | no |
| PDF generation | yes | no | no |
| Photo compression | yes | no | no |
| IndexedDB persistence | yes | no | no |
| Backup export/import | yes | no | no |
| Paddle checkout | no | yes | no |
| License activation | no | yes | yes |
| License validation refresh | no | yes | yes |
| Pro unlock (offline, valid token) | yes | no | no |
| AdSense | no | yes | no |

### 21.4 Realistic Claims

- Offline features work only after first successful install + required assets cached.
- First visit requires internet.
- iOS Safari limitations documented (share file support, storage eviction).
- Do not claim 100% offline.

### 21.5 SW Lifecycle

- Cache versioning via build hash; purge old on activate.
- Update notification banner when new SW waiting.
- skipWaiting only after user confirm or next navigation.
- Failed install: keep old SW, log error.

### 21.6 Storage Persistence

- Request navigator.storage.persist() on first meaningful use; show status in Settings.

### 21.7 Manifest

- name, short_name, description, start_url, display standalone, background_color, theme_color, icons (192, 512, maskable), screenshots.

### 21.8 Browser Compatibility

iOS Safari, Android Chrome, Desktop Chrome, Desktop Safari, Edge. Document limitations.

---

## 22. Design System

### 22.1 Visual Direction

Glassmorphism preserved but form readability ensured (solid input backgrounds). Polished SaaS feel.

### 22.2 Tokens

- Colors: brand blue, aqua accent, neutrals, semantic. Dark mode via prefers-color-scheme + manual toggle.
- Typography: system stack + Inter via next/font; min 16px body.
- Spacing: 4px base.
- Shadows: layered soft; glass cards backdrop-blur with sufficient opacity.
- Blur: backdrop-blur-md cards; solid inputs.
- Radius: 12px cards, 8px inputs/buttons.

### 22.3 Components

Buttons, inputs, selects, checkboxes, radio, dialogs, toasts, cards, tables, chips, badges, empty states, loading skeletons, error states, nav (mobile bottom + desktop sidebar/top), charts.

### 22.4 Accessibility

- 44px min touch targets.
- Input >=16px (no iOS zoom).
- WCAG AA contrast.
- Keyboard nav + visible focus.
- Reduced motion.
- Screen reader labels.
- Error messages associated with fields.

### 22.5 Mobile-First

- Breakpoints sm 640, md 768, lg 1024, xl 1280.
- Bottom nav mobile; sidebar desktop.

### 22.6 UX States (NEW in v5)

Specify for every screen:
- Empty state: illustration + primary action + helper text.
- Loading state: skeleton placeholders matching layout.
- Error state: message + retry button + (if applicable) offline indicator.
- Offline indicator: banner "You're offline — changes saved locally."
- Form autosave: "Saved Xs ago" indicator.
- Unsaved changes: confirm dialog on navigation away.
- Double-click protection: disable submit button after first click until response.
- Storage quota exhausted: block + message + suggest export/cleanup.

---

## 23. SEO Architecture

### 23.1 Content Strategy

- Keyword research: high-intent pool-care queries.
- Intent mapping: informational vs transactional.
- Page hierarchy: Home -> Tools -> Guides -> FAQ.
- URL strategy: /tools/pool-volume, /guides/...
- Metadata: title, description, canonical, OG, Twitter.
- XML sitemap + robots.txt.
- Internal linking + breadcrumbs.
- Structured data: SoftwareApplication, FAQPage, HowTo.
- Methodology pages with original content.
- Related tools.
- CWV targets: LCP <2.5s, CLS <0.1, INP <200ms.

### 23.2 Indexable Pages

10+ tool landing + guide pages with substantial original content. No thin programmatic pages.

### 23.3 Private Data Isolation

- No customer/pool/report data in indexable pages.
- App routes use noindex or client-rendered with robots exclusion.

### 23.4 No Guarantees

No invented search volumes or traffic projections. No ranking guarantees.

---

## 24. AdSense and Consent

### 24.1 Placements

- Below calculation results on tool pages.
- Mid-content in guides.
- Excluded: service report forms, PDF previews, Pro screens, checkout.

### 24.2 Consent

- Google Consent Mode v2.
- Certified CMP for EEA/UK if serving those users. For US-only launch, simpler consent may suffice, but implement Consent Mode v2 for future-proofing.
- Do not claim custom banner guarantees compliance; use certified CMP where required.
- Verify current Google requirements.

### 24.3 Pro Ad-Free

- When valid Pro token present, do not load AdSense scripts at all.

### 24.4 Approval

- AdSense approval not guaranteed. No revenue guarantees.

---

## 25. Privacy and Security

### 25.1 Data Minimization

- No account required for free tools.
- No customer data in analytics.
- Avoid collecting gate codes by default (notes only, with warning).

### 25.2 Local-First Privacy

- Customer/pool/report data stays in browser. Not transmitted.
- Privacy policy discloses browser storage limitations.

### 25.3 Security Headers

- HTTPS (Vercel).
- CSP: strict, allow AdSense/Analytics/Paddle domains.
- X-Frame-Options: DENY, X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, Permissions-Policy.
- HSTS via Vercel.

### 25.4 Input Validation

- Zod client + server. Server rejects malformed.

### 25.5 File Validation

- MIME + magic bytes + size limits.

### 25.6 Rate Limiting

- Per-IP and per-identifier on license endpoints (see 15).

### 25.7 Secret Management

- All secrets in Vercel env vars; never committed. .env.example placeholders.

### 25.8 Logging Restrictions

- Never log license keys, customer emails, report contents.
- Log event IDs, status codes, error classes.

### 25.9 Data Export and Deletion

- Full export (backup) + "Delete all data" with confirmation.
- Privacy policy + Terms pages.

### 25.10 Disclaimers

- Chemical: "Mathematical scaling only; verify against product label; not professional advice."
- Volume: Section 7.4.

---

## 26. Threat Model

(Appendix B has detail.) Summary threats:

1. XSS -> CSP, input sanitization, React auto-escaping.
2. CSRF -> not applicable to stateless API with Bearer tokens; webhook uses signature.
3. Webhook spoofing -> signature verification, idempotency.
4. Replay attacks -> idempotency keys, timestamp windows.
5. License enumeration -> constant-time-ish responses, rate limits.
6. Brute force -> rate limits, lockout.
7. SQL injection -> parameterized queries (pg with placeholders).
8. ZIP bombs -> compression ratio + size limits.
9. Path traversal -> entry path validation.
10. Malformed images -> decode error handling, size limits.
11. Local data exposure -> storage limitations disclosed; no encryption claim.
12. Shared-device privacy -> no auto-login; data in browser; warning in privacy policy.
13. Storage deletion -> backup reminders.
14. Source-map leakage -> disable source maps in production or ensure no secrets.
15. Secret exposure -> env vars, .gitignore, no NEXT_PUBLIC_ for secrets.
16. Dependency vulnerabilities -> npm audit, lockfile, update policy.

---

## 27. Testing Strategy

### 27.1 Tools

- Unit: Vitest.
- E2E: Playwright.
- Component: React Testing Library (optional).

### 27.2 Test Matrix (expanded)

- Calculation unit tests (all shapes, fixtures).
- Unit conversion tests.
- Chemical validation (dimension enforcement, zero ref, missing checkbox).
- Chlorine CC (TC-FC, TC<FC warning, no coercion).
- IndexedDB persistence, migrations, concurrent writes, transactions.
- Backup/restore round-trip, ZIP integrity, missing photo, rollback, ZIP bomb, path traversal.
- Photo compression (size/dim, corrupt).
- PDF (generation, private note exclusion in bytes, pagination).
- Offline (SW, routes, cache).
- Paddle sandbox (full checkout).
- Webhook (signature, replay, duplicate, out-of-order).
- License (activation, 3-device concurrency, recovery, expiry, rotation).
- Device activation concurrency.
- Email retry.
- Rate limits.
- SEO (metadata, sitemap, structured data).
- Accessibility (axe).
- Security headers.
- Performance (Lighthouse).

### 27.3 Coverage Policy

Do not promise 100% overall. Prioritize critical business logic and security. Target >=80% on src/lib/**, >=60% overall.

### 27.4 Test Scenario Format

Each test: Scenario, Input, Expected behavior, Failure behavior, Pass condition. (See Appendix A acceptance criteria.)

---

## 28. Complete Acceptance Criteria

(Appendix A has full catalog.) Summary gates: AC-1 through AC-14.

---

## 29. Deployment

### 29.1 Setup Steps

1. GitHub: repo, branch protection, PR reviews.
2. Vercel: import, framework preset Next.js.
3. Domain: owner-provided, configure via env (do not hardcode).
4. PostgreSQL: Neon/Supabase, run migrations, store DATABASE_URL.
5. Paddle: sandbox + production, product/price, webhook URL, store keys.
6. Email provider: configure, store key.
7. Analytics: GA4, store ID.
8. AdSense: apply, store client ID (approval not guaranteed).
9. Error monitoring: Sentry, store DSN.
10. Preview deployments: auto on PR.
11. Production release: merge to main -> deploy.
12. Rollback: Vercel instant rollback.
13. Secret rotation: documented procedure.
14. DB backup: automated + periodic manual dump.
15. Incident recovery: runbook.

### 29.2 Migration Execution

- Migrations via npm run db:migrate in CI/CD or manually before deploy.
- Never auto-run destructive migrations in production without review.

### 29.3 Production Smoke Test

See Section 42.

---

## 30. Monitoring and Operations

- Error monitoring: Sentry client + server.
- Performance: Vercel Analytics / Web Vitals.
- Uptime: Vercel status + optional external.
- Database: Neon/Supabase metrics + slow query logs.
- Webhook logs: processing status table; alert on failures.
- Backup reminders: in-app + optional email (Pro).
- Incident runbook: severity, escalation, communication.

---

## 31. Environment Variables

```
# App
APP_URL=https://your-domain.example
NEXT_PUBLIC_APP_URL=https://your-domain.example

# Database
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Paddle
PADDLE_ENV=sandbox
PADDLE_API_KEY=
PADDLE_WEBHOOK_SECRET=
PADDLE_PRODUCT_ID=
PADDLE_PRICE_ID=

# Licensing
ED25519_PRIVATE_KEY=
NEXT_PUBLIC_ED25519_PUBLIC_KEY=
LICENSE_KEY_HMAC_SECRET=

# Email
EMAIL_PROVIDER_API_KEY=
EMAIL_FROM_ADDRESS=

# Analytics / Ads
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_ADSENSE_CLIENT_ID=

# Monitoring
SENTRY_DSN=
```

No real credentials. Placeholders. Domain configurable.

---

## 32. Complete Folder Structure

```
pooltechtools/
├── public/
│   ├── icons/
│   ├── manifest.webmanifest
│   └── robots.txt
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (marketing)/
│   │   ├── tools/
│   │   │   ├── pool-volume/page.tsx
│   │   │   ├── chemical-calculator/page.tsx
│   │   │   ├── chlorine-calculator/page.tsx
│   │   │   ├── maintenance-schedule/page.tsx
│   │   │   ├── water-test-log/page.tsx
│   │   │   └── service-report/page.tsx
│   │   ├── pro/
│   │   │   ├── customers/page.tsx
│   │   │   └── activate/page.tsx
│   │   ├── settings/page.tsx
│   │   └── api/
│   │       ├── payments/webhook/route.ts
│   │       └── license/
│   │           ├── activate/route.ts
│   │           ├── validate/route.ts
│   │           ├── deactivate/route.ts
│   │           ├── recover/route.ts
│   │           ├── recover/verify/route.ts
│   │           └── status/route.ts
│   ├── components/
│   │   ├── ui/
│   │   ├── forms/
│   │   ├── calculators/
│   │   ├── reports/
│   │   └── layout/
│   ├── lib/
│   │   ├── calc/
│   │   ├── validation/
│   │   ├── db/
│   │   ├── backup/
│   │   ├── license/
│   │   ├── pdf/
│   │   ├── photo/
│   │   ├── email/
│   │   ├── seo/
│   │   └── utils/
│   ├── hooks/
│   ├── stores/
│   └── types/
├── db/migrations/
│   └── 001_create_licensing_schema.sql
├── tests/
│   ├── unit/
│   ├── e2e/
│   └── fixtures/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 33. Implementation Roadmap

10 phases (same structure as v4, with v5 additions):

Phase 1: Foundation & Design System (W1-2)
Phase 2: Calculators & Validation Engine (W2-4)
Phase 3: Maintenance Schedule & Water Logs (W4-5)
Phase 4: Service Report Creation & PDF (W5-7)
Phase 5: Local-First Customer & Pool Management (W7-9) — Pro
Phase 6: Backup & Restore (W9-10)
Phase 7: PWA & Offline (W10-11)
Phase 8: Payment & Licensing (W11-13)
Phase 9: SEO & AdSense (W13-14)
Phase 10: Testing, Security Review, Launch (W14-16)

v5 additions across phases: recovery verify endpoint, entitlement-loss UI, ZIP safety, trapezoidal kidney, PublicReportView type, staged import, device recovery runbook, UX states (empty/loading/error/offline/autosave/unsaved/double-click/quota).

Realistic: 14-16 weeks for solo/small team. Not 3 days.

---

## 34. Launch Checklist

- [ ] All phase acceptance criteria met.
- [ ] Calculation tests green with fixtures (v5 corrected).
- [ ] Backup/restore round-trip tested (JSON + ZIP).
- [ ] ZIP safety tests (bomb, traversal) pass.
- [ ] Private note exclusion tested (PDF bytes assertion + SMS + share).
- [ ] Entitlement-loss behavior tested.
- [ ] Offline matrix tested on 5 browsers.
- [ ] Paddle sandbox full flow tested.
- [ ] Webhook signature + replay + out-of-order tested.
- [ ] 3-device enforcement tested concurrently.
- [ ] Recovery flow tested (email verification).
- [ ] Accessibility audit (axe) clean.
- [ ] Lighthouse: Perf >=90, SEO >=95, A11y >=95.
- [ ] Privacy policy + Terms published.
- [ ] Disclaimers present.
- [ ] AdSense integrated (approval pending acceptable).
- [ ] Error monitoring live.
- [ ] DB backups configured.
- [ ] Rollback documented + tested.
- [ ] Env vars set in production.
- [ ] Domain + HTTPS verified.

---

## 35. Definition of Done

A feature is Done when:
1. Implemented per spec.
2. Unit/E2E tests written and passing.
3. Acceptance criteria verified.
4. Accessibility checked.
5. Offline behavior verified if applicable.
6. No private data leaks.
7. Documentation updated.
8. Code reviewed.

---

## 36. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| AdSense approval denied | Revenue | Proceed without ads; Pro-only revenue; reapply |
| iOS storage eviction | Data loss | Persistent storage request; backup reminders; snapshots |
| Clock manipulation extends offline Pro | Revenue leak | last-seen check; require periodic online validation (best-effort) |
| Device fingerprint instability | Support burden | Deactivation UX; recovery runbook |
| Paddle webhook downtime | License delay | Idempotent retries; manual recovery endpoint |
| Photo storage quota | Feature failure | Quota monitoring; compression; export+cleanup |
| Calculation misuse liability | Legal | Label-rate only; mandatory checkbox; disclaimers |
| Browser compatibility gaps | UX | Tested matrix; documented limitations |
| Keyword competition | Acquisition | Long-tail content; no ranking guarantees |
| ZIP bomb / malicious import | Security | Safety limits; validation |
| Recovery email abuse | License fraud | Rate limits; email verification; single-use tokens |

---

## 37. Owner Decisions and External Dependencies

### Owner Decisions Required

1. Final domain name (configure via env).
2. Email provider selection.
3. Error monitoring provider (Sentry recommended).
4. Trend charts in V1 water log (yes/no).
5. Default range thresholds for water test color-coding.
6. Kidney method default (trapezoidal vs two-semicircle).
7. HEIC conversion support in V1 (best-effort, browser-dependent).
8. Whether to store soft-deleted records in backups (recommend yes).

### External Dependencies (verify before implementation)

1. Paddle Billing API event names, transaction status values, SDK version.
2. @serwist/next compatibility with Next.js 16.
3. idb current API.
4. @react-pdf/renderer current API.
5. Web Crypto Ed25519 browser support matrix.
6. Neon/Supabase connection pooling guidance.
7. Google AdSense policy requirements.
8. Certified CMP requirements for target regions.
9. CompressionStream / pako availability for snapshots.

### Truthful Readiness

Do not describe as production-ready if any critical security, calculation, payment, or data-recovery requirement remains unresolved. All external deps above must be verified during implementation. This document is implementation-ready but depends on external verification (hence 8.5/10, not 10/10).

---

## 38. v4.0 to v5.0 Traceability and Change Log

| v4 Section | v5 Section | Change |
|---|---|---|
| 4 Free/Pro matrix | 4 | Expanded: clarified all ambiguities, entitlement-loss behavior, refund/reinstall/device-change/temp-offline/invalid-entitlement behaviors |
| 7 Formulas | 7, 8 | Measurement normalization, average-depth override precedence, square handling, metric limits, display rounding boundary, trapezoidal kidney, irregular surface-area sourcing, chemical unit model, chlorine fully specified |
| 8 Validation | 9 | Range table with unit conversion note, text/date/file validation |
| 9-10 IndexedDB | 10-11 | Concurrency strategy (last-write-wins + notification), versioning/migration split (schema sync, data async), customerNameSnapshot/poolNameSnapshot, report number generation, recovery mode |
| 11 Backup | 12 | Two formats (JSON-only vs ZIP), exact ZIP structure, manifest, staged import, ZIP bomb/path traversal protection, snapshot without photo blobs, private data warning |
| 12 Payment | 13 | Webhook state machine, out-of-order/duplicate, refund handling |
| 13 PG | 14 | HMAC vs Argon2id distinction, recovery with email verification, deactivate-all runbook |
| 14 API | 15 | Added recover/verify endpoint, consistent error format, auth clarity |
| 15 License | 16-18 | Key entropy/normalization/rotation, Ed25519 full spec, honest device fingerprint limitations, slot recovery |
| 17 PDF/Photo | 20 | EXIF limitations, HEIC best-effort, private note exclusion tests |
| 18 PWA | 21 | Realistic claims (first install required), first-visit limitation |
| 20 SEO | 23 | Unchanged (valid) |
| 21 AdSense | 24 | CMP clarification |
| 22 Privacy | 25 | Unchanged (valid) |
| 23 Testing | 27 | Expanded matrix, scenario format |
| 26 Roadmap | 33 | Added v5 tasks |
| 32 Owner deps | 37 | Expanded |
| 33 Traceability | 38 | This table |
| 34 Contradiction | 39 | Updated |
| 35 Fixtures | 40 | Corrected expected values (Round, Oval) |
| (new) | 22.6 UX States | New subsection |
| (new) | 26 Threat Model | New section |
| (new) | 41 Readiness | New section |
| (new) | 42 Smoke Test | New section |

---

## 39. Contradiction Audit (v5)

| Topic | Potential Contradiction | Resolution |
|---|---|---|
| Free vs Pro | Report saving vs customer profiles | Free saves reports (neutral header); customer/pool profiles Pro-only |
| Free vs Pro | Snapshots | Pro-only automated; Free has manual export/import |
| Local vs Server | Customer data on server | Never; only license/payment data server-side |
| Offline vs Online | "100% offline" | Matrix distinguishes; first-install required; no universal claim |
| Paddle vs License | Paddle issues keys | No; Paddle is MoR only; PG handles keys |
| Token expiry vs grace | Hard lock at expiry | 14-day grace; graceful lock banner; data preserved |
| Backup vs Snapshots | Conflated | Snapshots = auto local 5 max no photos; backups = manual portable |
| Customer-visible vs private | Leak via PDF/SMS | PublicReportView type excludes privateNotes; tested |
| Ads vs Pro ad-free | Ads flash | Ad script not loaded when Pro token valid |
| Browser limits vs features | Overpromise | Documented limitations; persist() request; reminders |
| HMAC vs Argon2id | Interchangeable | Distinct: HMAC for lookup, Argon2id for password hashing; recommend HMAC for V1 |
| Device fingerprint | Unique device | Best-effort only; documented limitation |
| Clock rollback | Tamper-proof | Best-effort; last-seen check; documented |

---

## 40. Calculation Test Fixtures (v5 Corrected)

### A.1 Pool Volume (corrected expected values)

| Shape | Inputs | Expected Gallons |
|---|---|---|
| Rectangle | L=20ft, W=10ft, shallow=3ft, deep=5ft | (20x10x4)x7.48052 = 5984.416 |
| Round | D=12ft, depth=4ft | pi x 36 x 4 x 7.48052 = 3384.25 (v4 had 6743.9 — WRONG; corrected) |
| Oval | L=20ft, W=10ft, depth=4ft | (pi/4)x20x10x4x7.48052 = 4700.0 (v4 had 4699.0 — rounding) |
| Square | side=15ft, depth=4ft | 15x15x4x7.48052 = 6732.468 |
| Kidney (trapezoidal) | L=20ft, positions [0,5,10,15,20], widths [8,9,10,9,8], depth=4ft | trapezoid area = 180 sqft; x4x7.48052 = 5385.97 gal |
| Irregular | surfaceArea=200sqft, depth=4ft | 200x4x7.48052 = 5984.416 |

Note: v4 had incorrect expected values for Round (6743.9) and Oval rounding. Corrected above. These must be verified by the implementation's test suite.

### A.2 Chemical Scaling

| Label Dose | Ref Volume | Actual Volume | Expected |
|---|---|---|---|
| 10 oz (mass) | 10,000 gal | 15,000 gal | 15 oz |
| 1 lb | 10,000 gal | 25,000 gal | 2.5 lb |
| 8 fl oz (fluid) | 5,000 gal | 12,000 gal | 19.2 fl oz |

### A.3 Chlorine

| FC | TC | CC | Note |
|---|---|---|---|
| 2.0 | 3.0 | 1.0 | normal |
| 3.0 | 2.5 | — | warning (TC<FC), preserve originals |
| 1.5 | 1.5 | 0.0 | normal |

### A.4 Unit Conversion

- 1 ft = 12 in
- 1 gal = 3.78541 L
- 1 cu ft = 7.48052 gal
- 1 oz (mass) = 1/16 lb
- Round trip: 100 gal -> L -> gal should equal 100 within 1e-9.

### A.5 Additional Boundary Fixtures (v5)

- Fractional: L=10.5ft, W=4.25ft, depth=3.5ft -> 10.5x4.25x3.5x7.48052 = 1168.6 gal.
- Metric: L=6m (=19.685ft), W=3m (=9.8425ft), depth=1.5m (=4.9213ft) -> volume in gal.
- Very shallow: depth=0.1ft, L=10ft, W=5ft -> 10x5x0.1x7.48052 = 37.4 gal.
- Sloped: shallow=3ft, deep=6ft -> D_avg=4.5ft.
- Invalid kidney: 2 cross-sections -> error.
- Kidney positions not spanning 0..L -> error.
- Display rounding: 5984.416 gal -> display "5,980 gal" (nearest 10), internal retains 5984.416.
- Conversion round trip: 1 gal -> L (3.78541) -> gal (1.00000).

---

## 41. Final Readiness Assessment

Rating: 8.5 / 10.

Reasons not 10/10:
1. Paddle Billing event names, transaction status values, and SDK method signatures must be verified against current official documentation. This spec deliberately does not invent them; the implementation must confirm them.
2. Browser storage persistence (navigator.storage.persist()) is a request, not a guarantee; eviction behavior varies by browser and must be tested.
3. AdSense approval and CMP requirements depend on Google's current policies and regional law; cannot be guaranteed by spec.
4. Web Crypto Ed25519 browser support must be verified; fallback to @noble/ed25519 may be required.
5. @serwist/next compatibility with Next.js 16 must be verified at implementation time.

All five are tracked as external dependencies (Section 37), not hidden. If these are verified and no new issues found, the spec reaches 9.5/10; a true 10/10 additionally requires a successful production launch with real users, which no spec can guarantee.

---

## 42. Production Smoke-Test Checklist

After deployment, verify:
- [ ] Home page loads, Lighthouse >=90.
- [ ] Pool volume calc works offline (after first visit).
- [ ] Chemical calc label verification blocks result.
- [ ] Service report creates PDF and shares/downloads.
- [ ] Private notes absent from PDF (manual check).
- [ ] Backup export downloads valid ZIP.
- [ ] Backup import restores data.
- [ ] Pro activation with sandbox license works.
- [ ] Webhook creates license (sandbox).
- [ ] Offline mode works after install.
- [ ] AdSense loads on free pages, not on Pro/report screens.
- [ ] Error monitoring receives test error.
- [ ] HTTPS + security headers present.
- [ ] Sitemap + robots accessible.

---

## Appendix A — Detailed Acceptance Criteria Catalog

### AC-1 Pool Volume Calculator
- Given valid inputs for each shape, output matches formula within 1e-6 (internal precision).
- Given zero/negative input, inline error shown and calculation blocked.
- Given square with mismatched side/width, error shown.
- Given kidney with <3 cross-sections, error shown.
- Given ?vol= handoff, chemical calculator pre-fills volume with full precision.
- Print results produces printable view.
- Display rounds per 7.5; internal retains full precision.

### AC-2 Chemical Calculator
- Given label dose + ref volume + actual volume, output = dose x (actual/ref).
- Given mismatched dimensions (weight vs fluid) without density, conversion blocked with message.
- Given unchecked safety checkbox, result hidden.
- Given zero reference volume, error shown.
- Given extremely large result, warning shown.

### AC-3 Chlorine Calculator
- CC = TC - FC displayed when TC >= FC.
- Given TC < FC, original values preserved + warning badge + repeat-test instruction; CC shows "—".
- No silent coercion to zero.
- Target comparison informational only; no treatment recommendation.

### AC-4 Maintenance Schedule
- Task completion persists across reload.
- Custom task add/edit/delete/reorder works.
- Season change preserves completion; hides inapplicable tasks with prompt.
- Reset requires confirmation.

### AC-5 Water Test Log
- CRUD works; CC auto-calculated.
- CSV export valid and complete.
- Range badges show with informational disclaimer and configurable thresholds.

### AC-6 Service Report
- Full flow (tasks + readings + chemicals + 2 photos + PDF + share) completable in <60s on mobile.
- Private notes absent from PDF bytes (assertion test with sentinel value).
- Private notes absent from SMS summary and share payload.
- Draft auto-saves (2s debounce) and recovers on reload.
- Duplicate/delete/reopen work.
- Unsaved changes prompt on navigation.

### AC-7 Backup/Restore
- JSON export produces valid JSON with all records (no photos).
- ZIP export produces valid zip with manifest + hashes + all photos.
- Import round-trips data equality.
- Missing photo fails import with clear error unless skip confirmed.
- Corrupt backup rejected; original data preserved.
- ZIP bomb rejected.
- Path traversal rejected.
- Staged import: no partial writes on failure.

### AC-8 Licensing
- Webhook creates license once (idempotent).
- Activation enforces 3-device limit atomically (concurrency test).
- Token verifies offline with public key.
- Expiry -> graceful lock with banner.
- Recovery issues new key; old invalidated; requires email verification.

### AC-9 PWA/Offline
- All features in offline matrix work as specified on 5 browsers after first install.
- SW update flow non-breaking.
- First visit requires internet (documented).

### AC-10 SEO
- All tool pages have metadata, canonical, structured data.
- Sitemap includes all indexable pages.
- Private routes noindexed.

### AC-11 Entitlement Loss
- Pro data remains readable/exportable.
- Pro-gated UI hidden.
- New reports use neutral header.
- No data deletion.
- Banner shown.

### AC-12 Recovery
- Lost device: support runbook deactivates all; user re-activates.
- Email verification required for recovery.
- No email enumeration.

### AC-13 Concurrency
- Two tabs editing same record: last write wins, other tab notified.
- No silent whole-record loss without notification.

### AC-14 ZIP Safety
- ZIP bomb rejected.
- Path traversal rejected.
- Oversized entry rejected.

---

## Appendix B — Threat Model Detail

(See Section 26 summary; detail:)

- XSS: React auto-escaping, CSP, no dangerouslySetInnerHTML without sanitization.
- CSRF: not applicable (stateless Bearer tokens); webhook uses signature.
- Webhook spoofing: signature verification before parse.
- Replay: idempotency on event_id.
- License enumeration: constant-time-ish, rate limits, no existence disclosure.
- Brute force: rate limits, lockout.
- SQL injection: parameterized queries.
- ZIP bombs: ratio + size limits.
- Path traversal: entry path validation.
- Malformed images: decode error handling.
- Local data exposure: disclosed; no encryption claim.
- Shared device: no auto-login; warning.
- Storage deletion: backup reminders.
- Source maps: no secrets; disable in prod or verify.
- Secret exposure: env vars, .gitignore.
- Dependency vulns: npm audit, lockfile, update policy.

---

## Appendix C — Backup Manifest Schema

```json
{
  "format": "PoolTechBackupV1",
  "schemaVersion": 1,
  "appVersion": "5.0.0",
  "createdAt": "2026-...",
  "counts": {
    "customers": 0, "pools": 0, "reports": 0,
    "waterTests": 0, "templates": 0, "maintenanceTasks": 0,
    "attachments": 0, "settings": 0
  },
  "totalSizeBytes": 0,
  "files": [
    { "path": "data.json", "sha256": "...", "sizeBytes": 0 },
    { "path": "attachments/<reportId>/<attachmentId>.jpg", "sha256": "...", "sizeBytes": 0 }
  ]
}
```

---

**End of Document — PoolTechTools Production-Ready Spec v5.0**

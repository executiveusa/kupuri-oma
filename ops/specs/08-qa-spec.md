# Kupuri OMA — QA Specification

**Version:** 0.1.0  
**Status:** Phase 0  

---

## 1. Quality Gates Overview

Two automated gates must pass before any deployment:

| Gate | Tool | Threshold | Source |
|---|---|---|---|
| Architecture Score | `oma_score_architecture` MCP | ≥ 8.5 | SYNTHIA |
| Design Audit Score | `oma_audit_design` MCP | ≥ 8.5 | Emerald Tablet |

Both scores are integers 0-10. Failed gates block the deployment pipeline.

---

## 2. SYNTHIA Architecture Scoring Rubric

The SYNTHIA scoring agent evaluates codebase quality across these dimensions:

| Dimension | Max points | Description |
|---|---|---|
| Type safety | 2.0 | No `any`, no missing types, Zod validation at boundaries |
| Dependency hygiene | 1.5 | No circular deps, no unused packages, no multiple versions of same dep |
| Localization completeness | 1.5 | es-MX coverage ≥ 90%, no hardcoded strings |
| Design system compliance | 1.5 | All UI uses @kupuri/design-system tokens and components |
| Security compliance | 1.5 | No exposed secrets, input validation, OWASP Top 10 clean |
| Test coverage | 1.0 | Unit tests for all utility functions, integration tests for API routes |
| Accessibility | 1.0 | WCAG 2.1 AA baseline: contrast, labels, keyboard nav |
| Performance | 1.0 | LCP < 2.5s, bundle size within budget, code splitting applied |
| **Total** | **11.0** | Threshold: 8.5 / 11.0 (77.3%) |

### Score interpretation
- 9.5–11.0: Excellent — deploy to production
- 8.5–9.4: Pass — deploy with notes
- 7.0–8.4: Fail — fix before deploy
- < 7.0: Critical fail — do not deploy, escalate

---

## 3. Design Audit Scoring Rubric

The `oma_audit_design` MCP tool scans component files for violations:

### Automatic deductions
| Violation | Deduction | Detection pattern |
|---|---|---|
| Glassmorphism | -2.0 | `backdrop-blur` + opacity bg combo |
| Gradient text | -1.5 | `bg-clip-text text-transparent` |
| Bounce animation | -1.5 | `animate-bounce`, `animate-wiggle` |
| Pill badges/cards | -1.0 | `rounded-full` on non-avatar/progress |
| Hover scale > 1.05 | -1.0 | `scale-110`, `hover:scale-[1.1]` |
| Spacing off-scale | -1.0 | Arbitrary spacing values |
| Non-approved font | -0.5 | Font-family not Plus Jakarta Sans |
| Missing reduced-motion | -0.5 | Missing `@media (prefers-reduced-motion)` |
| Random colors | -0.5 | Hex/rgb colors not in design tokens |

**Starting score: 10.0.** Deductions subtracted. Minimum floor: 0.

---

## 4. Test Coverage Requirements

### Unit tests
- All `packages/**/src/**/*.ts` utility functions: ≥ 80% statement coverage
- All Zod schemas: happy path + at least 2 error cases each
- All pricing/currency/date formatters: 100% coverage

### Integration tests
- `GET /api/health` → 200
- `POST /api/auth/login` → success + error cases
- `POST /api/auth/register` → success + validation errors
- `GET /api/community/feed` → correct locale filtering
- MCP server tools: each tool invoked with valid input

### E2E smoke tests (Playwright)
- Homepage loads in es-MX
- Locale switcher changes to en
- Register flow completes without errors
- Login flow completes and redirects to dashboard
- Pricing page shows MXN prices
- Community page shows seed projects

---

## 5. Accessibility Audit

### Manual checks (per release)
- All form fields have associated `<label>`
- All icon-only buttons have `aria-label`
- Tab order is logical (follows visual flow)
- Focus rings visible (violet-500, 2px, 2px offset)
- Keyboard user can complete: register, login, navigate dashboard

### Automated (Lighthouse CI)
- Accessibility score ≥ 95
- Contrast: no "AA fail" items on text elements
- ARIA attributes: no missing required ARIA props

---

## 6. Performance Budget

| Metric | Budget | Tool |
|---|---|---|
| LCP | < 2.5s (3G fast) | Lighthouse |
| FID / INP | < 100ms | Lighthouse |
| CLS | < 0.1 | Lighthouse |
| Homepage bundle (JS) | < 150 KB gzipped | Bundleanalyzer |
| Homepage bundle (CSS) | < 30 KB gzipped | Bundleanalyzer |
| Largest image | < 200 KB (WebP/AVIF) | CI check |
| Time to Interactive | < 5s (3G fast) | Lighthouse |

---

## 7. Localization QA

### Coverage check (automated)
```bash
pnpm run l10n:coverage
# Output:
# es-MX: 142/142 keys (100%)
# en: 138/142 keys (97.2%)
# PASS: all locales ≥ 90%
```

### Manual review (per release)
- Check all pricing values are in MXN on es-MX pages
- Check all dates use dd/mm/yyyy format
- Check no English phrases appear on es-MX pages
- Check currency toggle works (MXN ↔ USD)
- Check brand terms from glossary used consistently

---

## 8. Security Scan

### Pre-commit (recommended)
- `git-secrets` or `trufflehog` scan for hardcoded credentials
- `npm audit` (or `pnpm audit`) for known CVEs

### Pre-deploy (required)
- Zod validation present at all API route boundaries
- No user-controlled HTML rendered without sanitization (`DOMPurify`)
- Rate limiting on auth and build-run routes
- Content Security Policy headers set
- CORS restricted to known origins in production

---

## 9. Release Gate Final Checklist

### Must ALL be true before promoting to production:
```
[ ] TypeScript: 0 errors across workspace
[ ] Tests: all pass (unit + integration + E2E smoke)
[ ] SYNTHIA architecture score: ≥ 8.5
[ ] Emerald Tablet design audit: ≥ 8.5
[ ] es-MX localization coverage: ≥ 90%
[ ] Lighthouse accessibility: ≥ 95
[ ] LCP: < 2.5s
[ ] CLS: < 0.1
[ ] No secrets exposed (automated scan passed)
[ ] Preview deployment: manually smoke-tested
[ ] DB migration: runbook exists (if any migration pending)
[ ] Rollback plan: documented for this release
[ ] Human approval: obtained in GitHub Actions
```

# Kupuri OMA — Product Specification

**Version:** 0.1.0  
**Status:** Phase 1  

---

## 1. Product Modes

The platform has three distinct UI modes — each with specific design laws:

### LANDING mode (marketing site, apps/web)
- Variance: 7 (expressive, cinematic)
- Motion: 5 (smooth scroll, hero entrance, stagger)
- Density: 3 (generous whitespace, large typography)
- Primary palette: violet-600 CTA, gold-500 accent, neutral-950 bg
- No sidebar. Sticky navbar with blur on scroll.

### COCKPIT mode (studio, authenticated dashboard)
- Variance: 2 (focused, minimal)
- Motion: 2 (instant transitions, no bounce)
- Density: 8 (compact, information-dense)
- Sidebar 240px, border-r, neutral-900 bg
- Linear-inspired: folder tree left, work area right

### CANVAS mode (3D editor, future)
- Variance: 1 (maximally focused, tools only)
- Motion: 1 (zero decorative motion)
- Density: 10 (full viewport canvas, floating panels)

---

## 2. User Flows

### Onboarding flow
1. Land on `/es-mx` (homepage)
2. Click "Comenzar gratis" → `/es-mx/register`
3. Register with email + password (or Google OAuth)
4. Redirected to `/es-mx/dashboard`
5. Dashboard shows empty state with "Crear primer proyecto" CTA

### Project creation flow
1. Dashboard → "Nuevo proyecto"
2. Name + industry + vibe selection
3. Template or blank start
4. Agent generates initial scaffold
5. Preview → refine → publish

### Community remix flow
1. Community gallery → click project card
2. "Remix" button → fork project to user's workspace
3. Remix is linked via REMIXES edge in graph
4. Published remix credits original author

### Billing flow
1. Pricing page → "Elegir Pro (299 MXN/mes)"
2. Stripe Checkout (MXN) → success webhook
3. Subscription record created in Prisma
4. User tier updated to PRO
5. Dashboard shows Pro features

---

## 3. Page Specifications

### `/[locale]/` (Homepage)
Components: `Navbar`, `HeroSection`, `FeaturesSection`, `CommunitySection`, `PricingTeaser`, `CtaSection`, `Footer`

**HeroSection:**
- Badge: "Plataforma de diseño LATAM" (violet/gold)
- H1: Max 8 words, large (text-5xl md:text-7xl), no gradient
- Subhead: 2 lines, neutral-400
- CTA primary: "Comenzar gratis" (violet-600)
- CTA secondary: "Ver la comunidad" (ghost)
- Ambient radial: `radial-gradient(ellipse 80% 50%, violet-600/5%)` — NOT glassmorphism

**FeaturesSection:**
- 6 features in 3x2 grid (md: 2x3)
- Icon containers: neutral-800 bg, violet-500 icon, 48px
- No icon border-radius > rounded-xl

**CommunitySection:**
- 6 seed project cards  
- Card: neutral-900, border neutral-800, hover:border-violet-500
- Badges: premium (gold), community (violet), NOT pill-shaped

**PricingTeaser:**
- 3 cards: Free / Pro / Studio
- Pro: `ring-1 ring-violet-500` highlight
- Annual discount: ~20% shown
- Currency toggle: MXN / USD

### `/[locale]/pricing/`
Full pricing page with:
- Feature comparison table
- FAQ section (es-MX)
- Enterprise CTA

### `/[locale]/login/` and `/[locale]/register/`
- Dark card, neutral-800 bg, border neutral-700
- Focus rings: `focus:border-violet-600`
- Password show/hide
- Social OAuth buttons (icon-only or short label)

### `/[locale]/dashboard/`
COCKPIT mode layout:
- Left sidebar 240px: logo, nav items, project list, settings
- Main: stat cards (3), recent projects, recent builds
- Stat cards: number (text-3xl, violet-400) + label (text-sm, neutral-400)

---

## 4. Component Spec

### Button
```
Variants: primary | secondary | gold | ghost | destructive | link
Sizes: sm (32px) | md (40px) | lg (48px) | xl (56px) | icon (40x40)
Primary: bg-violet-600 hover:bg-violet-700, text-white
Gold: bg-gold-500 hover:bg-gold-600, text-neutral-950
Max border-radius: rounded-lg (NEVER rounded-full unless icon-only)
```

### Badge
```
Variants: default | violet | gold | success | warning | error | premium
Shape: rounded-md (NEVER pill/rounded-full)
Premium: bg-gold-500/10 text-gold-400 border border-gold-500/20
```

### Card
```
Base: bg-neutral-900, border border-neutral-800, rounded-xl
Hover: hover:border-violet-500/50
Premium: ring-1 ring-gold-500/40
NO box-shadow unless specifically required for elevation
```

---

## 5. Pricing Model

| Plan | Price (MXN) | Price (USD approx) | Projects | Features |
|---|---|---|---|---|
| **Free** | $0 | $0 | 2 | Community access, templates, basic export |
| **Pro** | $299/mo | ~$15/mo | 10 | All templates, translation, priority builds |
| **Studio** | $799/mo | ~$40/mo | Unlimited | Team workspace, Blender worker, API access |
| **Enterprise** | Custom | Custom | Unlimited | SLA, dedicated support, custom agents |

Annual discount: 20% off Monthly price.

**Stripe configuration:**
- Default currency: MXN
- USD pricing shown as secondary (~18 MXN/USD, static)
- Webhooks: `payment_intent.succeeded`, `customer.subscription.updated`, `customer.subscription.deleted`

---

## 6. Navigation Structure

```
(Marketing — LANDING mode)
/[locale]/
/[locale]/pricing
/[locale]/community
/[locale]/templates
/[locale]/login
/[locale]/register

(Authenticated — COCKPIT mode)
/[locale]/dashboard
/[locale]/dashboard/projects
/[locale]/dashboard/projects/[id]
/[locale]/dashboard/community
/[locale]/dashboard/settings
/[locale]/dashboard/billing
/[locale]/dashboard/team (Pro+)
```

---

## 7. Accessibility Requirements

- All images: meaningful `alt` or `aria-hidden="true"` if decorative
- All interactive elements: keyboard navigable, visible focus ring
- Color contrast: ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- ARIA labels on icon-only buttons
- `lang` attribute set per locale on `<html>`
- Skip to main content link at top of each page
- Motion: `prefers-reduced-motion` respected (disable animations)

# Kupuri OMA — Design System Specification

**Version:** 0.1.0  
**Status:** Phase 0 (Emerald Tablet v1)  

---

## 1. The Emerald Tablet Laws

These are inviolable. Any code or agent output violating these laws must be rejected
immediately and regenerated.

### Law 1 — No vibes, only shapes
Design with geometry, not decoration. Every visual choice has a purpose.
No decorative blobs, no abstract bubbles, no "just for vibes" elements.

### Law 2 — Light comes from above
Shadows and gradients must respect physics. Light sources are consistent.
No neon glows. No radial glow spanning the entire viewport (subtle ambient only).

### Law 3 — Typography does the heavy lifting
Type is the primary design element. Size contrast, weight contrast, and color contrast
do more work than any shape. Minimum 2 type weights in use on any page.

### Law 4 — Spacing is structural
Spacing communicates hierarchy. Use only the defined scale:
`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px`
Never invent intermediate values.

### Law 5 — Border radius is conservative
- Buttons: `rounded-lg` (8px)
- Cards: `rounded-xl` (12px) maximum
- Badges: `rounded-md` (6px) — NEVER rounded-full
- Pills (rounded-full): only for avatar images and progress indicators

### Law 6 — Motion serves meaning
Animations exist to communicate state change or guide attention.
Forbidden: bounce, elastic, wiggle, pulse decorative, infinite spin.
Permitted: fadeUp, fadeIn, stagger, slideIn, scale (0.98→1 only, never above 1.05).

### Law 7 — Color is earned
Use color intentionally. Violet for primary CTA. Gold for premium/highlight.
Neutral-400/-500 for secondary text. Neutral-600/-700 for borders.
Red only for destructive/error. Green only for success.

### Law 8 — No gradient text
Never use `bg-clip-text text-transparent` gradient on headings.
High contrast text is always more readable and more premium.

### Law 9 — No glassmorphism
`backdrop-blur` with semi-transparent backgrounds = glass effect = banned.
Exception: sticky navbar on scroll (very subtle, ≤ 10% opacity bg).

### Law 10 — Density signals mode
LANDING: generous spacing, large type. COCKPIT: compact, information-dense.
Never mix LANDING and COCKPIT density patterns in the same view.

---

## 2. Color Tokens

All colors are defined in `oklch()` for perceptual uniformity and wide-gamut support.
CSS custom properties are the source of truth.

### Brand palette
```css
--color-violet-500: oklch(0.627 0.265 293.6);  /* primary brand */
--color-violet-600: oklch(0.558 0.288 292.1);  /* primary CTA hover */
--color-gold-400:   oklch(0.816 0.133 84.7);   /* gold text */
--color-gold-500:   oklch(0.742 0.143 82.4);   /* gold accent */
```

### Neutral palette
```css
--color-neutral-950: oklch(0.103 0 0);   /* page background */
--color-neutral-900: oklch(0.143 0 0);   /* card background */
--color-neutral-800: oklch(0.198 0 0);   /* border color */
--color-neutral-700: oklch(0.252 0 0);   /* input border */
--color-neutral-600: oklch(0.33 0 0);    /* placeholder text */
--color-neutral-500: oklch(0.42 0 0);    /* secondary text */
--color-neutral-400: oklch(0.52 0 0);    /* body text */
--color-neutral-300: oklch(0.636 0 0);   /* primary text */
--color-neutral-100: oklch(0.863 0 0);   /* heading text */
--color-neutral-50:  oklch(0.925 0 0);   /* hero headings */
```

### Semantic
```css
--color-success: oklch(0.602 0.172 143.7);  /* emerald-500 */
--color-warning: oklch(0.733 0.19 60.3);    /* amber-400 */
--color-error:   oklch(0.556 0.231 27.8);   /* red-500 */
```

---

## 3. Typography

### Font family
```css
--font-sans: 'Plus Jakarta Sans', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, monospace;
```

**Do NOT use:** Inter, DM Sans, Geist, Poppins, or any "AI-default" sans.

### Type scale
| Token | Size | Weight | Line height | Usage |
|---|---|---|---|---|
| `text-7xl` | 72px | 800 | 1.0 | Hero headline |
| `text-5xl` | 48px | 700 | 1.1 | Section headline |
| `text-4xl` | 36px | 700 | 1.15 | Card headline |
| `text-2xl` | 24px | 600 | 1.2 | Subheadings |
| `text-xl` | 20px | 500 | 1.4 | Lead paragraphs |
| `text-base` | 16px | 400 | 1.6 | Body text |
| `text-sm` | 14px | 400 | 1.5 | Labels, captions |
| `text-xs` | 12px | 500 | 1.4 | Badges, tags |

---

## 4. Spacing Scale

**ONLY these values are permitted:**
`4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px`

In Tailwind: `p-1 / p-2 / p-3 / p-4 / p-6 / p-8 / p-12 / p-16 / p-24`
(1 Tailwind unit = 4px)

---

## 5. Motion Primitives

### Variants
```typescript
fadeUp:    { from: { opacity: 0, y: 16 }, to: { opacity: 1, y: 0 } }
fadeIn:    { from: { opacity: 0 },        to: { opacity: 1 } }
slideLeft: { from: { opacity: 0, x: 16 }, to: { opacity: 1, x: 0 } }
scale:     { from: { opacity: 0, scale: 0.96 }, to: { opacity: 1, scale: 1 } }
```

### Timing
- Default duration: 0.4s
- Stagger child delay: 0.08s
- Ease: `[0.23, 1, 0.32, 1]` (ease-out-quart)
- Never use spring with stiffness < 100 or mass > 1

### Reduced motion
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## 6. Component Catalogue

### Available in `@kupuri/design-system`

| Component | Variants | Status |
|---|---|---|
| `Button` | primary, secondary, gold, ghost, destructive, link | ✅ |
| `Badge` | default, violet, gold, success, warning, error, premium | ✅ |
| `Card` | base, hover, premium | ✅ |
| `FadeUp` | — | ✅ |
| `FadeIn` | — | ✅ |
| `StaggerGroup` / `StaggerItem` | — | ✅ |
| `TextReveal` | word-by-word | ✅ |
| `Input` | — | Planned Phase 1 |
| `Select` | — | Planned Phase 1 |
| `Modal` | — | Planned Phase 1 |
| `Toast` | — | Planned Phase 1 |
| `Skeleton` | — | Planned Phase 1 |
| `Avatar` | — | Planned Phase 1 |
| `Dropdown` | — | Planned Phase 1 |

---

## 7. Design Audit Scoring

The `oma_audit_design` MCP tool evaluates code and returns a score 0-10.

### Deductions
| Violation | Deduction |
|---|---|
| Glassmorphism detected | -2 |
| Gradient text (bg-clip-text) detected | -1.5 |
| `animate-bounce` or `animate-wiggle` | -1.5 |
| `rounded-full` on badge/card | -1 |
| Spacing outside approved scale | -1 |
| Hover scale > 1.05 | -1 |
| Non-approved font family | -0.5 |
| Missing `prefers-reduced-motion` | -0.5 |
| Random color not from palette | -0.5 |

**Threshold:** Score ≥ 8.5 required to pass release gate.

---

## 8. Accessibility Baseline

- Color contrast: ≥ 4.5:1 for normal text (WCAG AA)
- Focus indicators: 2px violet-500 ring, 2px offset
- Touch targets: ≥ 44×44px on mobile
- Keyboard navigation: Tab order follows visual order
- Screen reader: semantic HTML5 landmarks (header, main, nav, footer)
- Images: descriptive alt text or `aria-hidden="true"` for decorative

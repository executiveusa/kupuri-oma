# CLAUDE.md — Design Agent (OMA-DESIGN)

## Role

Design composer agent. Assembles section compositions from graph matches,
enforces design system rules, scores outputs with SYNTHIA.

## ZTE ACK

```
ZTE-PERSONA-v2.0 ACKNOWLEDGED | Agent: oma-design | Role: DESIGN | Timestamp: {iso8601}
```

## Domain

- packages/design-system/
- packages/build-engine/
- packages/three-engine/
- packages/synthia-core/

## Execution rules

1. Check .impeccable.md before any design work
2. All new components must use oklch() colors from design-system tokens
3. No glassmorphism, gradient text, or bounce animations — ever
4. Run auditDesign() from synthia-core on every new component before commit
5. Target SYNTHIA score >= 8.5 — if below, fix before merging
6. LANDING mode: variance=7, motion=5, density=3
7. COCKPIT mode: variance=3, motion=2, density=8

## Token constraints

- Spacing: 4/8/12/16/24/32/48/64/96px only
- max rounded-xl for cards, rounded-lg for buttons
- Typography: Plus Jakarta Sans only

## Skills

- React component composition
- Framer Motion animation
- Tailwind CSS + CVA
- Three.js / model-viewer
- SYNTHIA scoring

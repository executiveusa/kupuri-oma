# Kupuri OMA — Localization Specification

**Version:** 0.1.0  
**Status:** Phase 0  

---

## 1. Locale Priorities

| Locale | Code | Status | Coverage Target |
|---|---|---|---|
| Spanish (México) | es-MX | Primary | 100% |
| English (US) | en | Secondary | 95% |
| Spanish (Colombia) | es-CO | Planned Phase 4 | — |
| Spanish (Argentina) | es-AR | Planned Phase 4 | — |
| Portuguese (Brazil) | pt-BR | Planned Phase 5 | — |

**LATAM-first rules:**
- Default locale is ALWAYS es-MX, never en
- All marketing copy written in es-MX FIRST, then translated to en
- es-MX slug: `es-mx` (lowercase hyphen format per next-intl convention)

---

## 2. URL Structure

```
/                    → redirect to /es-mx
/es-mx               → Spanish México homepage
/en                  → English homepage
/es-mx/precios       → Pricing (Spanish)
/en/pricing          → Pricing (English)
/es-mx/comunidad     → Community (Spanish)
/es-mx/tablero       → Dashboard (Spanish)
```

Note: Route segment labels are NOT localized at the path level (slug stays in English).
URL paths use technical names (`/pricing`, `/dashboard`) — labels in UI are translated.

---

## 3. Message File Structure

All messages live in `packages/localization/src/messages/`.

```
messages/
  es-MX.json    (primary)
  en.json       (secondary)
```

### Namespace structure
```json
{
  "nav": { ... },
  "hero": { ... },
  "features": { ... },
  "community": { ... },
  "pricing": { ... },
  "cta": { ... },
  "footer": { ... },
  "auth": { ... },
  "dashboard": { ... },
  "errors": { ... },
  "common": { ... }
}
```

---

## 4. Translation Quality Rules

### es-MX writing style
- Usted/Tú: use **tú** for marketing copy (direct, modern, friendly)
- Tone: confident, warm, professional — never stiff or formal
- Avoid direct word-for-word translations from English
- "Free" → "Gratis" (never "libre" in pricing context)
- "Dashboard" → "Tablero" or "Panel" (prefer "Tablero")
- "Template" → "Plantilla"
- "Community" → "Comunidad"
- "Remix" → "Remix" (English loan word is acceptable in design context)
- Pricing CTAs: "Comenzar gratis", "Elige Pro", "Hablar con ventas"

### QA checks before publish
1. All keys in es-MX.json exist in en.json (parity check)
2. No empty string values in either file
3. No untranslated English in es-MX (regex: check for common English-only words)
4. Coverage formula: `translated_keys / total_keys ≥ 0.90`
5. Max string length check: es-MX strings can be ≤ 130% of en counterpart

---

## 5. Currency & Number Formatting

```typescript
// MXN formatting
formatCurrency(299, 'MXN', 'es-MX')
// → "$299 MXN"

// USD formatting (secondary display)
formatCurrency(15, 'USD', 'en')
// → "US$15"

// Date formatting (Mexican standard)
formatDate(new Date(), 'es-MX')
// → "15 de enero de 2025"

// Large numbers
new Intl.NumberFormat('es-MX').format(1234567)
// → "1,234,567" (punto not comma for México — uses comma as thousands separator)
```

---

## 6. Translation Worker (services/translation-worker)

The translation worker processes jobs with three provider options:

### Mock provider (dev/test)
- Prefixes string with `[ES-MX]` for testing
- Used when `TRANSLATION_PROVIDER=mock`

### DeepL provider (recommended)
- API key: `DEEPL_API_KEY` env var
- Target: `ES` (DeepL uses parent locales)
- Glossary: Kupuri-specific terms (see section 7)
- QA threshold: 90% coverage before job marked complete

### OpenAI provider (fallback)
- Model: `gpt-4o` with system prompt for brand tone
- Used when DeepL unavailable
- More expensive — use sparingly

---

## 7. Kupuri Term Glossary (es-MX)

| English | Español (MX) | Notes |
|---|---|---|
| Template | Plantilla | Core term |
| Remix | Remix | Keep as loan word |
| Dashboard | Tablero | Never "dashboard" in Spanish UI |
| Community | Comunidad | Core term |
| Build | Construcción / Generar | Contextual |
| Preview | Vista previa | |
| Publish | Publicar | |
| Draft | Borrador | |
| Premium | Premium | Keep as-is |
| Score | Puntuación | |
| Agent | Agente | |
| Vibe | Estilo / Vibe | "Vibe" acceptable as loan word |
| Motion | Animación / Movimiento | Use context |

---

## 8. Pluralization Rules

Spanish pluralization rules for next-intl ICU format:

```json
{
  "projectCount": "{count, plural, one {1 proyecto} other {{count} proyectos}}",
  "templateCount": "{count, plural, one {1 plantilla} other {{count} plantillas}}",
  "remixCount": "{count, plural, one {1 remix} other {{count} remixes}}"
}
```

---

## 9. Locale Detection Middleware

```typescript
// Locale detection order:
// 1. URL path prefix (most authoritative)
// 2. Accept-Language header
// 3. Cookie (saved preference)
// 4. Default: es-MX

// Locale slugs in URLs are lowercase:
// /es-mx/... NOT /es-MX/...
```

---

## 10. Missing Translation Handling

In development: throw error for missing keys (strict mode)
In production: fall back to en → undefined → key path string
Never display raw key paths to users in production.

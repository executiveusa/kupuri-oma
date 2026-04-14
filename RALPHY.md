# RALPHY.MD — Design Rules for PAULI CINEMATIC STUDIO™

Enforced at every architectural decision. No exceptions.

---

## File Organization

### No barrel files
```typescript
// BAD — barrel re-export
export { Button } from './Button'
export { Card } from './Card'

// GOOD — direct import at call site
import { Button } from '@kupuri/design-system/src/components/Button'
```

### Component file structure
```
ComponentName/
├── ComponentName.tsx       UI + logic
├── ComponentName.test.tsx  Tests (co-located)
└── ComponentName.module.css Scoped styles (if needed)
```

No `index.ts` re-export inside the component folder.

---

## Service Design

### Single responsibility
Every service handler does one thing. 300-line limit. If it grows past that, split it.

```typescript
// BAD — god class
class VideoService {
  generateVideo() {}
  scoreVideo() {}
  trackAffiliate() {}
  sendEmail() {}
}

// GOOD — focused handlers
class VideoGenerator { generate() {} }
class VideoScorer    { score() {} }
class AffiliateTracker { track() {} }
```

### No monolithic deploys
Each service deploys independently via Vercel Functions or Cloudflare Workers.

---

## Secrets Management

```bash
# BAD — hardcoded
const apiKey = 'sk-abc123...'

# BAD — .env committed
HIGGSFIELD_API_KEY=sk-abc123

# GOOD — environment variable from vault
const apiKey = process.env.HIGGSFIELD_API_KEY
if (!apiKey) throw new Error('HIGGSFIELD_API_KEY not set')
```

`.env` is always in `.gitignore`. All secrets provisioned through Infisical vault.

---

## Import Discipline

```typescript
// BAD — relative path traversal
import { cn } from '../../../../lib/utils'

// GOOD — workspace package alias
import { cn } from '@kupuri/design-system'

// BAD — dynamic require
const mod = require(`./niches/${niche}`)

// GOOD — explicit imports
import { FashionConfig } from './niches/fashion'
import { SpaConfig } from './niches/spa'
```

---

## Type Safety

```typescript
// BAD — any
function processVideo(data: any) {}

// GOOD — discriminated union
type VideoStatus = 'pending' | 'processing' | 'completed' | 'failed'
interface VideoJob {
  id: string
  status: VideoStatus
  niche: 'fashion' | 'spa' | 'ecotourism'
}
```

All inputs validated with Zod at API boundaries. No raw `req.body` access without schema validation.

---

## Component Patterns

```typescript
// BAD — prop drilling 3+ levels
<Page niche={niche} locale={locale} user={user} config={config} />

// GOOD — context or server component data fetch
export default async function Page({ params }: PageProps) {
  const data = await fetchNicheData(params.niche)
  return <NicheView data={data} />
}
```

Server components by default. `'use client'` only when interaction requires it.

---

## Niche Isolation

```typescript
// BAD — niche logic leaking
if (niche === 'spa') {
  // spa-specific logic in shared file
}

// GOOD — niche config pattern
const nicheConfig = NICHE_CONFIGS[niche]
const affiliates = nicheConfig.affiliates
```

Each niche has its own config object. Shared logic reads from config. No niche string comparisons outside config files.

---

## Error Handling

```typescript
// BAD — silent swallow
try { await generate() } catch (e) {}

// GOOD — typed result
const result = await generate()
if (!result.ok) {
  logger.error({ jobId, error: result.error })
  return { status: 500, error: 'generation_failed' }
}
```

All async operations return typed results. Errors logged with structured context. No silent catches.

---

## Quality Gate Enforcement

Run before every commit:

```bash
./scripts/stub-detector.sh    # Fail on TODO/FIXME/mock/stub/placeholder
./scripts/quality-check.sh   # Fail if UDEC < 8.5 on any output
./scripts/secret-scanner.sh  # Fail if hardcoded API keys detected
```

Pre-commit hook in `.husky/pre-commit` enforces these automatically.

---

These rules exist because they compound. Violating one creates debt that multiplies.
Follow them and the system scales. Ignore them and it collapses.

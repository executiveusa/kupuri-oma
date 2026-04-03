# Kupuri OMA — Rollback Runbook

## Trigger conditions

Roll back immediately if any of the following:

- SYNTHIA score drops below 8.5 after deploy
- Error rate > 1% on any critical path (auth, billing, build engine)
- Localization coverage drops below threshold
- Health check fails after 5 minutes
- ZTE DEPLOY stage fails after 3 self-correction attempts

---

## Rollback severity levels

### P1 — Immediate (< 5 minutes)

- Production down / 5xx on home page
- Auth broken
- Billing broken
- Data corruption detected

### P2 — Urgent (< 30 minutes)

- Build engine not generating previews
- Community feed returning empty
- Graph search not returning results

### P3 — Standard (< 2 hours)

- Translation worker lagging
- 3D assets not loading
- Docs portal down

---

## P1 rollback steps

```bash
# 1. Revert Vercel to last good deployment
vercel rollback --scope the-pauli-effect

# 2. Identify last known good commit
git log --oneline -10

# 3. Notify team
#    Format: ❌ ROLLBACK | {service} | P{level} | Reason: {summary}

# 4. File ZTE bead task for root-cause investigation
#    beadId: ZTE-YYYYMMDD-XXXX
#    ops/reports/{beadId}_rollback.json
```

---

## Database rollback

```bash
# Revert last Prisma migration
cd packages/content-model
npx prisma migrate resolve --rolled-back <migration_name>

# Restore from backup (if needed)
# Backup location: see 07-deployment-spec.md
```

---

## Post-rollback validation

```bash
[ ] Home page loads (es-MX)
[ ] Auth flow completes (login → dashboard)
[ ] Community feed renders
[ ] Build engine returns preview URL
[ ] Health endpoints return 200
[ ] Error rate drops to < 0.1%
```

---

## Incident report

After every P1/P2 rollback, file `ops/reports/{beadId}_incident.json`:

```json
{
  "incidentId": "INC-YYYYMMDD-XXXX",
  "severity": "P1",
  "startedAt": "ISO8601",
  "resolvedAt": "ISO8601",
  "rootCause": "",
  "affectedServices": [],
  "rollbackAction": "",
  "preventionSteps": []
}
```

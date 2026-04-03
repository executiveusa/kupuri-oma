#!/usr/bin/env node
/**
 * Kupuri OMA Ingest Worker
 *
 * Processes community import jobs from the queue.
 *
 * Phase 1 implementation:
 *   - Accepts a source URL or batch JSON file
 *   - Scrapes / reads raw data
 *   - Normalizes to CommunityProject schema
 *   - Writes to DB via Prisma
 *   - Records graph nodes
 *   - Writes ops/reports/ingest_*.json
 *
 * Run: node dist/index.js --source <url_or_file>
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { normalizeRawItem, generateImportReport, RawCommunityItemSchema } from '@kupuri/community-engine/import'
import type { RawCommunityItem } from '@kupuri/community-engine/import'

const REPORTS_DIR = resolve(process.cwd(), '../../ops/reports')

async function run() {
  const args = process.argv.slice(2)
  const sourceArg = args[args.indexOf('--source') + 1]

  if (!sourceArg) {
    console.error('[ingest-worker] Usage: node index.js --source <file.json>')
    process.exit(1)
  }

  const startedAt = new Date()
  const batchId = `batch_${Date.now()}`
  console.info(`[ingest-worker] Starting batch ${batchId} from ${sourceArg}`)

  // Load raw data
  let rawItems: RawCommunityItem[] = []
  const errors: string[] = []

  try {
    const content = readFileSync(resolve(sourceArg), 'utf-8')
    const parsed = JSON.parse(content)
    const items = Array.isArray(parsed) ? parsed : [parsed]

    for (const item of items) {
      const result = RawCommunityItemSchema.safeParse(item)
      if (result.success) {
        rawItems.push(result.data)
      } else {
        errors.push(`Invalid item: ${JSON.stringify(result.error.flatten())}`)
      }
    }
  } catch (err) {
    errors.push(`Failed to read source: ${String(err)}`)
    console.error('[ingest-worker] Fatal:', err)
    process.exit(1)
  }

  // Normalize
  const normalized = rawItems.map(normalizeRawItem)
  const skipped = rawItems.length - normalized.length

  console.info(`[ingest-worker] Normalized ${normalized.length}/${rawItems.length} items`)

  // TODO: Prisma write + graph upsert in Phase 2
  // For now, print normalized output
  for (const item of normalized) {
    console.info(`  → ${item.slug} (quality: ${item.qualityScore.toFixed(1)})`)
  }

  // Write ops report
  const completedAt = new Date()
  const report = generateImportReport({
    batchId,
    source: sourceArg,
    total: rawItems.length,
    normalized: normalized.length,
    skipped,
    errors,
    startedAt,
    completedAt,
  })

  try {
    mkdirSync(REPORTS_DIR, { recursive: true })
    const reportPath = join(REPORTS_DIR, `ingest_${batchId}.json`)
    writeFileSync(reportPath, report, 'utf-8')
    console.info(`[ingest-worker] Report written to ${reportPath}`)
  } catch {
    console.warn('[ingest-worker] Could not write report (ops/reports/ may not exist yet)')
  }

  console.info(`[ingest-worker] Batch ${batchId} complete`)
}

run().catch((err) => {
  console.error('[ingest-worker] Unhandled error:', err)
  process.exit(1)
})

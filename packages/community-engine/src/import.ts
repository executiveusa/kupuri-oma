/**
 * Community import pipeline types and normalizers.
 *
 * Used by the ingest-worker service to process legacy community
 * pages into the CommunityProject schema.
 */

import { z } from 'zod'

// ─── Raw scraped data shape ───────────────────────────────────────────────────

export const RawCommunityItemSchema = z.object({
  sourceUrl: z.string().url(),
  title: z.string(),
  description: z.string().optional(),
  authorName: z.string().optional(),
  screenshotUrls: z.array(z.string().url()).default([]),
  tags: z.array(z.string()).default([]),
  industry: z.string().optional(),
  originalLocale: z.enum(['es-MX', 'en', 'es', 'pt-BR']).default('es-MX'),
  scrapedAt: z.coerce.date(),
  rawHtml: z.string().optional(),
})

export type RawCommunityItem = z.infer<typeof RawCommunityItemSchema>

// ─── Normalized project record ────────────────────────────────────────────────

export interface NormalizedCommunityProject {
  slug: string
  title: string
  description?: string
  locale: string
  tags: string[]
  industry?: string
  screenshots: string[]
  importedFrom: string
  qualityScore: number
  translationNeeded: boolean
}

/**
 * Normalize a raw scraped item into the DB-ready schema.
 * Computes a simple quality score based on completeness.
 */
export function normalizeRawItem(raw: RawCommunityItem): NormalizedCommunityProject {
  const slug = raw.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 80)

  // Simple heuristic quality score (0-10)
  let qualityScore = 5
  if (raw.description && raw.description.length > 50) qualityScore += 1.5
  if (raw.screenshotUrls.length >= 2) qualityScore += 1
  if (raw.tags.length >= 3) qualityScore += 0.5
  if (raw.industry) qualityScore += 0.5
  if (raw.authorName) qualityScore += 0.5

  return {
    slug,
    title: raw.title,
    ...(raw.description !== undefined ? { description: raw.description } : {}),
    locale: raw.originalLocale.startsWith('es') ? 'es-MX' : 'en',
    tags: raw.tags,
    ...(raw.industry !== undefined ? { industry: raw.industry } : {}),
    screenshots: raw.screenshotUrls,
    importedFrom: raw.sourceUrl,
    qualityScore: Math.min(10, qualityScore),
    translationNeeded: !raw.originalLocale.startsWith('es'),
  }
}

/**
 * Generate a machine-readable import batch report.
 * Written to ops/reports/ after each ingest run.
 */
export function generateImportReport(params: {
  batchId: string
  source: string
  total: number
  normalized: number
  skipped: number
  errors: string[]
  startedAt: Date
  completedAt: Date
}): string {
  return JSON.stringify(
    {
      schemaVersion: '1.0',
      reportType: 'ingest_batch',
      ...params,
      durationMs: params.completedAt.getTime() - params.startedAt.getTime(),
    },
    null,
    2,
  )
}

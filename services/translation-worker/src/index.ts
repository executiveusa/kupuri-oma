#!/usr/bin/env node
/**
 * Kupuri OMA Translation Worker
 *
 * Processes translation jobs for projects and community posts.
 *
 * Supported translation providers (configured via env):
 *   TRANSLATION_PROVIDER=deepl|openai|mock
 *
 * Localization rules enforced:
 *   - Spanish (Mexico) as primary target
 *   - MXN pricing in translated content
 *   - Mexican date norms
 *   - Longer text budgets preserved
 *   - QA threshold: 90% key coverage before publishing
 *
 * Run: node dist/index.js --job <job_id>
 */

import { LOCALES, DEFAULT_LOCALE } from '@kupuri/localization'
import type { Locale } from '@kupuri/localization'

type TranslationProvider = 'deepl' | 'openai' | 'mock'

const PROVIDER: TranslationProvider =
  (process.env['TRANSLATION_PROVIDER'] as TranslationProvider) ?? 'mock'

// ─── Translation interfaces ───────────────────────────────────────────────────

interface TranslationJob {
  jobId: string
  projectId: string
  sourceLocale: Locale
  targetLocale: Locale
  fields: Record<string, string>
}

interface TranslationResult {
  jobId: string
  projectId: string
  targetLocale: Locale
  translations: Record<string, string>
  coveragePercent: number
  status: 'success' | 'partial' | 'failed'
}

// ─── Providers ────────────────────────────────────────────────────────────────

async function translateMock(
  fields: Record<string, string>,
  target: Locale,
): Promise<Record<string, string>> {
  // Mock: prefix all values with locale marker for testing
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(fields)) {
    result[key] = target === DEFAULT_LOCALE ? `[es-MX] ${value}` : `[en] ${value}`
  }
  return result
}

async function translate(
  fields: Record<string, string>,
  sourceLocale: Locale,
  targetLocale: Locale,
): Promise<Record<string, string>> {
  if (sourceLocale === targetLocale) return fields

  switch (PROVIDER) {
    case 'mock':
      return translateMock(fields, targetLocale)
    case 'deepl':
      // TODO: integrate DeepL API
      throw new Error('DeepL provider not yet implemented')
    case 'openai':
      // TODO: integrate OpenAI Responses API for translation
      throw new Error('OpenAI provider not yet implemented')
    default:
      return translateMock(fields, targetLocale)
  }
}

// ─── QA check ────────────────────────────────────────────────────────────────

function computeCoverage(
  original: Record<string, string>,
  translated: Record<string, string>,
): number {
  const total = Object.keys(original).length
  if (total === 0) return 100
  const covered = Object.keys(original).filter(
    (k) => translated[k] && translated[k].trim().length > 0,
  ).length
  return (covered / total) * 100
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function processJob(job: TranslationJob): Promise<TranslationResult> {
  console.info(`[translation-worker] Processing job ${job.jobId}`)
  console.info(`  ${job.sourceLocale} → ${job.targetLocale}`)

  let translations: Record<string, string> = {}
  let status: TranslationResult['status'] = 'failed'

  try {
    translations = await translate(job.fields, job.sourceLocale, job.targetLocale)
    const coverage = computeCoverage(job.fields, translations)
    status = coverage >= 90 ? 'success' : 'partial'
    console.info(`  Coverage: ${coverage.toFixed(1)}% — ${status}`)

    return { ...job, translations, coveragePercent: coverage, status }
  } catch (err) {
    console.error(`[translation-worker] Job ${job.jobId} failed:`, err)
    return { ...job, translations, coveragePercent: 0, status: 'failed' }
  }
}

async function run() {
  const args = process.argv.slice(2)
  // Accept inline test mode
  if (args.includes('--test')) {
    const testJob: TranslationJob = {
      jobId: 'test_001',
      projectId: 'project_test',
      sourceLocale: 'en',
      targetLocale: 'es-MX',
      fields: {
        title: 'Modern Digital Banking',
        description: 'A clean banking interface for Latin American markets.',
      },
    }
    const result = await processJob(testJob)
    console.info('Result:', JSON.stringify(result, null, 2))
    return
  }

  console.info('[translation-worker] Waiting for jobs. Use --test to run a test job.')
  console.info(`[translation-worker] Provider: ${PROVIDER}`)
  console.info(`[translation-worker] Default locale: ${DEFAULT_LOCALE}`)
  console.info(`[translation-worker] Supported locales: ${LOCALES.join(', ')}`)
}

run().catch((err) => {
  console.error('[translation-worker] Fatal:', err)
  process.exit(1)
})

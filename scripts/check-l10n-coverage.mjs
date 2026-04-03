#!/usr/bin/env node
/**
 * Localization Coverage Check
 * Verifies that all es-MX keys exist and are non-empty,
 * and reports coverage percentage for all locales.
 * Exits with code 1 if any locale is below the 90% threshold.
 */

import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const MESSAGES_DIR = join(ROOT, 'packages', 'localization', 'src', 'messages')
const THRESHOLD = 0.9

function flattenKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'object' && value !== null) {
      return flattenKeys(value, fullKey)
    }
    return [{ key: fullKey, value }]
  })
}

function checkCoverage(locale, primaryKeys) {
  try {
    const messages = JSON.parse(readFileSync(join(MESSAGES_DIR, `${locale}.json`), 'utf-8'))
    const localeKeys = flattenKeys(messages)
    const localeKeySet = new Map(localeKeys.map(({ key, value }) => [key, value]))

    const missing = []
    const empty = []

    for (const key of primaryKeys) {
      if (!localeKeySet.has(key)) {
        missing.push(key)
      } else if (!localeKeySet.get(key)) {
        empty.push(key)
      }
    }

    const total = primaryKeys.length
    const covered = total - missing.length - empty.length
    const coverage = covered / total

    return { locale, total, covered, coverage, missing, empty }
  } catch (err) {
    console.error(`Error reading ${locale}.json:`, err.message)
    process.exit(1)
  }
}

// Load primary locale (es-MX) as source of truth
const primaryMessages = JSON.parse(readFileSync(join(MESSAGES_DIR, 'es-MX.json'), 'utf-8'))
const primaryKeys = flattenKeys(primaryMessages).map(({ key }) => key)

console.log(`\nLocalization Coverage Check`)
console.log(`Primary locale: es-MX (${primaryKeys.length} keys)\n`)

const locales = ['es-MX', 'en']
let allPassed = true

for (const locale of locales) {
  const result = checkCoverage(locale, primaryKeys)
  const pct = (result.coverage * 100).toFixed(1)
  const passed = result.coverage >= THRESHOLD
  if (!passed) allPassed = false

  const status = passed ? '✅ PASS' : '❌ FAIL'
  console.log(`${status} ${locale}: ${pct}% (${result.covered}/${result.total})`)

  if (result.missing.length > 0) {
    console.log(`  Missing keys (${result.missing.length}):`)
    result.missing.slice(0, 10).forEach(k => console.log(`    - ${k}`))
    if (result.missing.length > 10) console.log(`    ... and ${result.missing.length - 10} more`)
  }

  if (result.empty.length > 0) {
    console.log(`  Empty values (${result.empty.length}):`)
    result.empty.slice(0, 5).forEach(k => console.log(`    - ${k}`))
  }
}

console.log()

if (!allPassed) {
  console.error(`Coverage below ${THRESHOLD * 100}% threshold. Fix missing translations before deploying.`)
  process.exit(1)
}

console.log(`All locales meet the ${THRESHOLD * 100}% coverage threshold.`)

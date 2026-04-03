/**
 * SYNTHIA Core — Architecture Scoring and Design Audit Engine
 *
 * This package implements the quality gates for the Kupuri OMA build system.
 * All scores are 0-10. The release threshold is 8.5.
 */

import { z } from 'zod'

// ─── Constants ──────────────────────────────────────────────────────────────

export const SYNTHIA_PASS_THRESHOLD = 8.5
export const DESIGN_AUDIT_PASS_THRESHOLD = 8.5
export const L10N_COVERAGE_THRESHOLD = 0.90

// ─── Score types ─────────────────────────────────────────────────────────────

export type SeverityLevel = 'INFO' | 'WARN' | 'FAIL' | 'CRITICAL'

export interface Violation {
  severity: SeverityLevel
  rule: string
  description: string
  file?: string
  line?: number
  suggestion: string
}

export interface ScoreBreakdown {
  typeSafety: number         // max 2.0
  dependencyHygiene: number  // max 1.5
  localization: number       // max 1.5
  designCompliance: number   // max 1.5
  security: number           // max 1.5
  testCoverage: number       // max 1.0
  accessibility: number      // max 1.0
  performance: number        // max 1.0
  total: number              // max 11.0 → normalized to 10.0
}

export interface ArchitectureScore {
  score: number              // normalized 0-10
  breakdown: ScoreBreakdown
  violations: Violation[]
  passed: boolean
  threshold: number
}

export interface DesignAuditScore {
  score: number              // 0-10 (starts at 10, deductions applied)
  violations: Violation[]
  passed: boolean
  threshold: number
}

// ─── Architecture scoring ────────────────────────────────────────────────────

export interface ArchitectureCheckResult {
  typeSafety: { found: boolean; anyCount: number; missingZod: boolean }
  dependencyHygiene: { circular: boolean; unused: string[]; duplicates: string[] }
  localization: { coverage: number; hardcodedCount: number }
  designCompliance: { usesDesignSystem: boolean; violations: string[] }
  security: { secretsExposed: boolean; missingValidation: boolean; owaspIssues: string[] }
  testCoverage: { utilitiesTested: boolean; apiRoutesTested: boolean }
  accessibility: { lighthouseScore: number; ariaIssues: string[] }
  performance: { lcp: number; bundleSizeKb: number }
}

export function computeArchitectureScore(checks: ArchitectureCheckResult): ArchitectureScore {
  const violations: Violation[] = []

  // Type safety (max 2.0)
  let typeSafety = 2.0
  if (checks.typeSafety.anyCount > 0) {
    typeSafety -= Math.min(1.0, checks.typeSafety.anyCount * 0.2)
    violations.push({
      severity: 'FAIL',
      rule: 'type-safety/no-any',
      description: `${checks.typeSafety.anyCount} uses of \`any\` detected`,
      suggestion: 'Replace with explicit types or `unknown`'
    })
  }
  if (checks.typeSafety.missingZod) {
    typeSafety -= 0.5
    violations.push({
      severity: 'WARN',
      rule: 'type-safety/zod-boundaries',
      description: 'Some API routes missing Zod input validation',
      suggestion: 'Add z.parse() or z.safeParse() at all API boundaries'
    })
  }

  // Dependency hygiene (max 1.5)
  let dependencyHygiene = 1.5
  if (checks.dependencyHygiene.circular) {
    dependencyHygiene -= 0.5
    violations.push({
      severity: 'FAIL',
      rule: 'deps/no-circular',
      description: 'Circular dependencies detected',
      suggestion: 'Refactor to break circular imports'
    })
  }
  if (checks.dependencyHygiene.unused.length > 0) {
    dependencyHygiene -= Math.min(0.5, checks.dependencyHygiene.unused.length * 0.1)
    violations.push({
      severity: 'WARN',
      rule: 'deps/no-unused',
      description: `${checks.dependencyHygiene.unused.length} unused dependencies: ${checks.dependencyHygiene.unused.join(', ')}`,
      suggestion: 'Remove unused packages from package.json'
    })
  }

  // Localization (max 1.5)
  let localization = 1.5
  if (checks.localization.coverage < L10N_COVERAGE_THRESHOLD) {
    const deficit = L10N_COVERAGE_THRESHOLD - checks.localization.coverage
    localization -= Math.min(1.5, deficit * 10)
    violations.push({
      severity: checks.localization.coverage < 0.85 ? 'FAIL' : 'WARN',
      rule: 'l10n/min-coverage',
      description: `es-MX coverage is ${(checks.localization.coverage * 100).toFixed(1)}% (threshold: 90%)`,
      suggestion: 'Add missing translation keys to es-MX.json'
    })
  }
  if (checks.localization.hardcodedCount > 0) {
    localization -= Math.min(0.5, checks.localization.hardcodedCount * 0.1)
    violations.push({
      severity: 'WARN',
      rule: 'l10n/no-hardcoded-strings',
      description: `${checks.localization.hardcodedCount} hardcoded strings found in components`,
      suggestion: 'Replace with useTranslations() / getTranslations() keys'
    })
  }

  // Design compliance (max 1.5)
  let designCompliance = 1.5
  if (!checks.designCompliance.usesDesignSystem) {
    designCompliance -= 0.5
    violations.push({
      severity: 'WARN',
      rule: 'design/use-system',
      description: 'Components not importing from @kupuri/design-system',
      suggestion: 'Import Button, Badge, Card from @kupuri/design-system'
    })
  }

  // Security (max 1.5)
  let security = 1.5
  if (checks.security.secretsExposed) {
    security = 0
    violations.push({
      severity: 'CRITICAL',
      rule: 'security/no-exposed-secrets',
      description: 'Secrets or API keys detected in codebase',
      suggestion: 'IMMEDIATELY remove secrets and rotate credentials'
    })
  }
  if (checks.security.missingValidation) {
    security -= 0.5
    violations.push({
      severity: 'FAIL',
      rule: 'security/input-validation',
      description: 'API routes missing input validation',
      suggestion: 'Add Zod schema validation at all POST/PUT/PATCH routes'
    })
  }

  // Test coverage (max 1.0)
  let testCoverage = 1.0
  if (!checks.testCoverage.utilitiesTested) {
    testCoverage -= 0.5
    violations.push({
      severity: 'WARN',
      rule: 'tests/utility-coverage',
      description: 'Utility functions missing unit tests',
      suggestion: 'Add vitest tests for all pure utility functions'
    })
  }
  if (!checks.testCoverage.apiRoutesTested) {
    testCoverage -= 0.5
    violations.push({
      severity: 'WARN',
      rule: 'tests/api-coverage',
      description: 'API routes missing integration tests',
      suggestion: 'Add integration tests for all API route handlers'
    })
  }

  // Accessibility (max 1.0)
  let accessibility = 1.0
  if (checks.accessibility.lighthouseScore < 90) {
    accessibility -= Math.min(1.0, (90 - checks.accessibility.lighthouseScore) / 30)
    violations.push({
      severity: checks.accessibility.lighthouseScore < 70 ? 'FAIL' : 'WARN',
      rule: 'a11y/lighthouse-score',
      description: `Lighthouse accessibility score: ${checks.accessibility.lighthouseScore} (target: 95)`,
      suggestion: 'Fix ARIA labels, contrast issues, and keyboard navigation'
    })
  }

  // Performance (max 1.0)
  let performance = 1.0
  if (checks.performance.lcp > 2500) {
    performance -= Math.min(0.5, (checks.performance.lcp - 2500) / 2000)
    violations.push({
      severity: 'WARN',
      rule: 'perf/lcp-budget',
      description: `LCP is ${checks.performance.lcp}ms (budget: 2500ms)`,
      suggestion: 'Optimize hero images, preload critical assets, reduce server response time'
    })
  }
  if (checks.performance.bundleSizeKb > 150) {
    performance -= Math.min(0.5, (checks.performance.bundleSizeKb - 150) / 150)
    violations.push({
      severity: 'WARN',
      rule: 'perf/bundle-budget',
      description: `JS bundle is ${checks.performance.bundleSizeKb}KB gzipped (budget: 150KB)`,
      suggestion: 'Enable code splitting, tree-shake unused imports'
    })
  }

  const breakdown: ScoreBreakdown = {
    typeSafety,
    dependencyHygiene,
    localization,
    designCompliance,
    security,
    testCoverage,
    accessibility,
    performance,
    // Normalize 11.0 max to 10.0
    total: (typeSafety + dependencyHygiene + localization + designCompliance +
            security + testCoverage + accessibility + performance) / 11.0 * 10.0
  }

  return {
    score: Math.max(0, Math.round(breakdown.total * 10) / 10),
    breakdown,
    violations,
    passed: breakdown.total >= SYNTHIA_PASS_THRESHOLD,
    threshold: SYNTHIA_PASS_THRESHOLD
  }
}

// ─── Design audit ─────────────────────────────────────────────────────────────

export interface DesignViolation {
  rule: string
  deduction: number
  pattern: string
  occurrences: number
}

const DESIGN_VIOLATION_RULES: Array<{ rule: string; pattern: RegExp; deduction: number; description: string }> = [
  {
    rule: 'emerald/no-glassmorphism',
    pattern: /backdrop-blur/,
    deduction: 2.0,
    description: 'Glassmorphism detected (backdrop-blur)'
  },
  {
    rule: 'emerald/no-gradient-text',
    pattern: /bg-clip-text\s+text-transparent/,
    deduction: 1.5,
    description: 'Gradient text detected (bg-clip-text text-transparent)'
  },
  {
    rule: 'emerald/no-bounce',
    pattern: /animate-bounce|animate-wiggle|animate-elastic/,
    deduction: 1.5,
    description: 'Decorative bounce/wiggle animation detected'
  },
  {
    rule: 'emerald/no-full-pills',
    pattern: /rounded-full.*Badge|Badge.*rounded-full|rounded-full.*Card/,
    deduction: 1.0,
    description: 'rounded-full on badge or card (use rounded-md/rounded-xl)'
  },
  {
    rule: 'emerald/no-large-hover-scale',
    pattern: /hover:scale-1[1-9][0-9]|scale-\[1\.[1-9]/,
    deduction: 1.0,
    description: 'Hover scale > 1.05 detected'
  },
  {
    rule: 'emerald/approved-spacing',
    pattern: /(?:p|m|gap|space)-\[((?!4px|8px|12px|16px|24px|32px|48px|64px|96px)[^\]]+)\]/,
    deduction: 1.0,
    description: 'Arbitrary spacing value outside approved scale'
  },
  {
    rule: 'emerald/approved-font',
    pattern: /font-(?:inter|dm_sans|geist|poppins)|fontFamily.*['"]Inter/i,
    deduction: 0.5,
    description: 'Non-approved font family (use Plus Jakarta Sans)'
  },
  {
    rule: 'emerald/reduced-motion',
    pattern: /framer-motion|motion\.div|animate=/,
    deduction: 0.5,
    description: 'Animation without prefers-reduced-motion check'
  }
]

export function auditDesign(sourceCode: string): DesignAuditScore {
  let score = 10.0
  const violations: Violation[] = []

  for (const rule of DESIGN_VIOLATION_RULES) {
    const matches = sourceCode.match(new RegExp(rule.pattern, 'g'))
    if (matches && matches.length > 0) {
      score -= rule.deduction
      violations.push({
        severity: rule.deduction >= 1.5 ? 'FAIL' : 'WARN',
        rule: rule.rule,
        description: `${rule.description} (${matches.length} occurrence${matches.length > 1 ? 's' : ''})`,
        suggestion: `Fix violations of Emerald Tablet Law: ${rule.rule}`
      })
    }
  }

  score = Math.max(0, Math.round(score * 10) / 10)

  return {
    score,
    violations,
    passed: score >= DESIGN_AUDIT_PASS_THRESHOLD,
    threshold: DESIGN_AUDIT_PASS_THRESHOLD
  }
}

// ─── Release gate ─────────────────────────────────────────────────────────────

export type ReleaseGateDecision = 'PASS' | 'WARN' | 'FAIL' | 'BLOCK'

export interface ReleaseGateResult {
  decision: ReleaseGateDecision
  architectureScore: number
  designAuditScore: number
  l10nCoverage: number
  violations: Violation[]
  summary: string
  blockers: string[]
}

export function evaluateReleaseGate(
  architecture: ArchitectureScore,
  design: DesignAuditScore,
  l10nCoverage: number,
  targetEnvironment: 'preview' | 'staging' | 'production'
): ReleaseGateResult {
  const allViolations = [...architecture.violations, ...design.violations]
  const blockers: string[] = []

  // Check for CRITICAL violations
  const criticals = allViolations.filter(v => v.severity === 'CRITICAL')
  if (criticals.length > 0) {
    blockers.push(`${criticals.length} CRITICAL violation(s) — must fix before any deploy`)
  }

  if (architecture.score < SYNTHIA_PASS_THRESHOLD) {
    blockers.push(`Architecture score ${architecture.score} < ${SYNTHIA_PASS_THRESHOLD} threshold`)
  }

  if (design.score < DESIGN_AUDIT_PASS_THRESHOLD) {
    blockers.push(`Design audit score ${design.score} < ${DESIGN_AUDIT_PASS_THRESHOLD} threshold`)
  }

  if (targetEnvironment === 'production' && l10nCoverage < L10N_COVERAGE_THRESHOLD) {
    blockers.push(`Localization coverage ${(l10nCoverage * 100).toFixed(1)}% < ${L10N_COVERAGE_THRESHOLD * 100}% threshold`)
  }

  if (blockers.length > 0) {
    return {
      decision: criticals.length > 0 ? 'BLOCK' : 'FAIL',
      architectureScore: architecture.score,
      designAuditScore: design.score,
      l10nCoverage,
      violations: allViolations,
      summary: `Deploy blocked: ${blockers.join('; ')}`,
      blockers
    }
  }

  const warns = allViolations.filter(v => v.severity === 'WARN')
  if (warns.length > 0) {
    return {
      decision: 'WARN',
      architectureScore: architecture.score,
      designAuditScore: design.score,
      l10nCoverage,
      violations: allViolations,
      summary: `Deploy allowed with ${warns.length} warning(s) — review before promoting to production`,
      blockers: []
    }
  }

  return {
    decision: 'PASS',
    architectureScore: architecture.score,
    designAuditScore: design.score,
    l10nCoverage,
    violations: allViolations,
    summary: 'All quality gates passed. Ready to deploy.',
    blockers: []
  }
}

// ─── Zod schemas for external use ────────────────────────────────────────────

export const ArchitectureCheckResultSchema = z.object({
  typeSafety: z.object({
    found: z.boolean(),
    anyCount: z.number().int().min(0),
    missingZod: z.boolean()
  }),
  dependencyHygiene: z.object({
    circular: z.boolean(),
    unused: z.array(z.string()),
    duplicates: z.array(z.string())
  }),
  localization: z.object({
    coverage: z.number().min(0).max(1),
    hardcodedCount: z.number().int().min(0)
  }),
  designCompliance: z.object({
    usesDesignSystem: z.boolean(),
    violations: z.array(z.string())
  }),
  security: z.object({
    secretsExposed: z.boolean(),
    missingValidation: z.boolean(),
    owaspIssues: z.array(z.string())
  }),
  testCoverage: z.object({
    utilitiesTested: z.boolean(),
    apiRoutesTested: z.boolean()
  }),
  accessibility: z.object({
    lighthouseScore: z.number().min(0).max(100),
    ariaIssues: z.array(z.string())
  }),
  performance: z.object({
    lcp: z.number().min(0),
    bundleSizeKb: z.number().min(0)
  })
})

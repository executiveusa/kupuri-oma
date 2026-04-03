#!/usr/bin/env node
/**
 * Kupuri OMA MCP Server
 *
 * Exposes Kupuri platform capabilities as MCP tools:
 *   oma_audit_design       — score design against Emerald Tablet rules
 *   oma_graph_search       — semantic graph-backed template/project search
 *   oma_generate_site      — trigger a prompt-to-site build run
 *   oma_import_community   — enqueue a community import job
 *   oma_translate_project  — enqueue a translation job
 *   oma_score_architecture — score repo architecture (SYNTHIA rules)
 *   oma_publish_template   — publish a template to the community
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { findRelatedTemplates } from '@kupuri/graph-engine'
import { LOCALES } from '@kupuri/localization'

const server = new McpServer({
  name: 'kupuri-oma',
  version: '0.1.0',
})

// ─── Tool: oma_graph_search ───────────────────────────────────────────────────

server.tool(
  'oma_graph_search',
  'Search templates and projects using graph-backed semantic matching by vibe, industry, or motion pattern.',
  {
    vibes: z.array(z.string()).optional().describe('Style tags e.g. ["bold", "editorial", "cinematic"]'),
    industry: z.string().optional().describe('Industry vertical e.g. "fintech", "fashion", "food"'),
    motionFamily: z.string().optional().describe('Motion pattern id e.g. "parallax-hero"'),
    locale: z.enum(LOCALES).optional().default('es-MX').describe('Target locale'),
    limit: z.number().int().min(1).max(50).optional().default(10),
  },
  async ({ vibes, industry, motionFamily, locale, limit }) => {
    const results = await findRelatedTemplates({
      ...(vibes !== undefined ? { vibes } : {}),
      ...(industry !== undefined ? { industry } : {}),
      ...(motionFamily !== undefined ? { motionFamily } : {}),
      locale,
      limit,
    })
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ results, count: results.length }, null, 2),
        },
      ],
    }
  },
)

// ─── Tool: oma_generate_site ──────────────────────────────────────────────────

server.tool(
  'oma_generate_site',
  'Trigger a prompt-to-site build run. Returns a build run ID and initial status.',
  {
    prompt: z.string().min(10).describe('Natural language description of the site to build'),
    locale: z.enum(LOCALES).optional().default('es-MX'),
    templateId: z.string().optional().describe('Optional template ID to start from'),
    industry: z.string().optional(),
    userId: z.string().describe('User ID initiating the build'),
  },
  async ({ prompt, locale, templateId, industry, userId }) => {
    // In production, this enqueues a job in the agent orchestrator.
    // For now, returns a stub response.
    const buildRunId = `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            buildRunId,
            status: 'PENDING',
            message: 'Build run enqueued. Poll /api/builds/${buildRunId} for status.',
            params: { prompt, locale, templateId, industry, userId },
          }, null, 2),
        },
      ],
    }
  },
)

// ─── Tool: oma_audit_design ───────────────────────────────────────────────────

server.tool(
  'oma_audit_design',
  'Audit a design or component against Kupuri Emerald Tablet design laws. Returns score and violations.',
  {
    code: z.string().describe('JSX/TSX/HTML source code fragment to audit'),
    context: z.string().optional().describe('Additional context about what this component does'),
  },
  async ({ code, context }) => {
    const violations: string[] = []
    const warnings: string[] = []

    // Rule checks — heuristic scanning
    if (/backdrop-blur/.test(code)) violations.push('LAW 1: Glassmorphism (backdrop-blur) is banned')
    if (/rounded-full/.test(code) && !/avatar|badge|circle/.test(code.toLowerCase()))
      warnings.push('LAW 5: rounded-full found outside avatar/badge — verify intent')
    if (/bg-gradient|bg-linear/.test(code)) violations.push('LAW 1: Gradient backgrounds are banned')
    if (/shadow-2xl|shadow-xl/.test(code)) violations.push('LAW 6: shadow-2xl/xl is too heavy — max shadow-md')
    if (/animate-bounce|animate-ping/.test(code)) violations.push('LAW 7: Decorative keyframe animations banned (bounce, ping)')
    if (/scale\(1\.0[5-9]|scale-105/.test(code)) violations.push('LAW 7: scale on hover is banned')
    if (/text-transparent.*bg-clip-text/.test(code)) violations.push('LAW 1: Gradient text is banned')

    const score = Math.max(0, 10 - violations.length * 2 - warnings.length * 0.5)

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            score: parseFloat(score.toFixed(1)),
            passed: violations.length === 0,
            violations,
            warnings,
            context,
          }, null, 2),
        },
      ],
    }
  },
)

// ─── Tool: oma_score_architecture ────────────────────────────────────────────

server.tool(
  'oma_score_architecture',
  'Score a system/package architecture against SYNTHIA rules. Returns a structured score report.',
  {
    packageName: z.string(),
    hasFeedbackLoops: z.boolean().default(false),
    hasCircuitBreakers: z.boolean().default(false),
    hasGraphBackedMemory: z.boolean().default(false),
    serviceCount: z.number().int().min(0),
    hasDuplicatedDesignSystem: z.boolean().default(false),
    hasSecretInCode: z.boolean().default(false),
    testCoveragePercent: z.number().min(0).max(100).optional(),
    localizationCoveragePercent: z.number().min(0).max(100).optional(),
  },
  async (params) => {
    let score = 10

    if (!params.hasFeedbackLoops) score -= 1.5
    if (!params.hasCircuitBreakers) score -= 1.5
    if (!params.hasGraphBackedMemory) score -= 0.5
    if (params.hasDuplicatedDesignSystem) score -= 2
    if (params.hasSecretInCode) score -= 3
    if (params.serviceCount > 10) score -= 0.5
    if ((params.testCoveragePercent ?? 80) < 60) score -= 1
    if ((params.localizationCoveragePercent ?? 100) < 90) score -= 0.5

    score = Math.max(0, Math.min(10, score))
    const passed = score >= 8.5

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            packageName: params.packageName,
            score: parseFloat(score.toFixed(1)),
            passed,
            threshold: 8.5,
            breakdown: params,
            recommendation: passed
              ? 'Architecture meets SYNTHIA quality gate.'
              : 'Architecture fails SYNTHIA 8.5 threshold. Fix violations before release.',
          }, null, 2),
        },
      ],
    }
  },
)

// ─── Tool: oma_import_community ───────────────────────────────────────────────

server.tool(
  'oma_import_community',
  'Enqueue a community import job for a given source URL or batch.',
  {
    sourceUrl: z.string().url().describe('URL of the community page or project to import'),
    targetLocale: z.enum(LOCALES).optional().default('es-MX'),
    autoTranslate: z.boolean().optional().default(true),
    priority: z.enum(['low', 'normal', 'high']).optional().default('normal'),
  },
  async ({ sourceUrl, targetLocale, autoTranslate, priority }) => {
    const jobId = `import_${Date.now()}`
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            jobId,
            status: 'QUEUED',
            sourceUrl,
            targetLocale,
            autoTranslate,
            priority,
            message: 'Import job queued. Check ops/reports/ for progress.',
          }, null, 2),
        },
      ],
    }
  },
)

// ─── Tool: oma_translate_project ──────────────────────────────────────────────

server.tool(
  'oma_translate_project',
  'Enqueue a translation job for a project to a target locale.',
  {
    projectId: z.string(),
    targetLocale: z.enum(LOCALES),
    overwriteExisting: z.boolean().optional().default(false),
  },
  async ({ projectId, targetLocale, overwriteExisting }) => {
    const jobId = `translate_${projectId}_${targetLocale}_${Date.now()}`
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            jobId,
            status: 'QUEUED',
            projectId,
            targetLocale,
            overwriteExisting,
          }, null, 2),
        },
      ],
    }
  },
)

// ─── Tool: oma_publish_template ───────────────────────────────────────────────

server.tool(
  'oma_publish_template',
  'Publish a template to the community after passing quality and moderation checks.',
  {
    templateId: z.string(),
    publisherUserId: z.string(),
    forceSkipQualityGate: z.boolean().optional().default(false),
  },
  async ({ templateId, publisherUserId, forceSkipQualityGate }) => {
    if (!forceSkipQualityGate) {
      // Placeholder quality gate — in production calls the QA agent
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              status: 'QUALITY_GATE_PENDING',
              templateId,
              publisherUserId,
              message: 'Template queued for quality review. Will publish automatically on pass.',
            }, null, 2),
          },
        ],
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            status: 'PUBLISHED',
            templateId,
            publisherUserId,
            publishedAt: new Date().toISOString(),
          }, null, 2),
        },
      ],
    }
  },
)

// ─── Start ────────────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('[kupuri-mcp] Server running on stdio')
}

main().catch((err) => {
  console.error('[kupuri-mcp] Fatal error:', err)
  process.exit(1)
})

// packages/build-engine/src/types.ts

import { z } from 'zod';

// ─── Build request ────────────────────────────────────────────────────────────

export const BuildRequestSchema = z.object({
  /** Free-form prompt describing the desired site */
  prompt: z.string().min(10),

  /** Locale for generated content */
  locale: z.enum(['es-MX', 'en']).default('es-MX'),

  /** Optional industry hint for graph search */
  industry: z.string().optional(),

  /** Optional vibe hint: minimal, premium, bold, playful, corporate, cinematic */
  vibe: z.string().optional(),

  /** Whether to enable 3D sections */
  enable3d: z.boolean().default(false),

  /** Required sections (override graph suggestion) */
  requiredSections: z.array(z.string()).default([]),

  /** Owner workspace/project ID */
  projectId: z.string().optional(),
});

export type BuildRequest = z.infer<typeof BuildRequestSchema>;

// ─── Section definition ───────────────────────────────────────────────────────

export type SectionType =
  | 'hero'
  | 'proof'
  | 'story'
  | 'features'
  | 'community'
  | 'pricing'
  | 'faq'
  | 'cta-footer'
  | 'model-viewer'
  | 'horizontal-scroll'
  | 'parallax-hero'
  | 'sticky-narrative'
  | 'counter';

export interface SectionSpec {
  type: SectionType;
  variant?: string | undefined;
  motionFamily?: string | undefined;
  tokenPackId?: string | undefined;
  content?: Record<string, unknown> | undefined;
  is3d?: boolean | undefined;
  graphNodeId?: string | undefined;
}

// ─── Build run ────────────────────────────────────────────────────────────────

export type BuildStatus =
  | 'PENDING'
  | 'GRAPH_SEARCH'
  | 'ASSEMBLING'
  | 'GENERATING'
  | 'SCORING'
  | 'COMPLETE'
  | 'FAILED';

export interface BuildRun {
  id: string;
  beadId: string;
  projectId?: string | undefined;
  prompt: string;
  locale: 'es-MX' | 'en';
  graphQuery?: string | undefined;
  selectedGraphNodes: string[];
  sections: SectionSpec[];
  status: BuildStatus;
  outputPreviewUrl?: string | undefined;
  synthiaScore?: number | undefined;
  logs: BuildLogEntry[];
  costCents: number;
  startedAt: Date;
  completedAt?: Date | undefined;
}

export interface BuildLogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  stage?: string | undefined;
}

// ─── Graph search result ──────────────────────────────────────────────────────

export interface GraphSearchResult {
  nodeId: string;
  type: 'Template' | 'Project' | 'Component' | 'MotionPattern';
  score: number;
  name: string;
  industry?: string;
  vibe?: string;
  motionFamily?: string;
  locale?: string;
}

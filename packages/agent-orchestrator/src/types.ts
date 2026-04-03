// packages/agent-orchestrator/src/types.ts
// Core types for the ZTE execution protocol

import { z } from 'zod';

// ─── Bead / Task identity ───────────────────────────────────────────────────

export type BeadId = `ZTE-${string}-${string}`;

export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH';

export type TaskStage =
  | 'CONTEXT_LOAD'
  | 'PLAN'
  | 'IMPLEMENT'
  | 'TEST'
  | 'COMMIT'
  | 'DEPLOY'
  | 'VERIFY'
  | 'NOTIFY';

export type TaskStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'COMPLETE'
  | 'FAILED'
  | 'HALTED';

export type AgentRole =
  | 'ORCHESTRATOR'
  | 'EXECUTOR'
  | 'MINION'
  | 'GUARDIAN'
  | 'INGEST'
  | 'LOCALIZATION'
  | 'DESIGN'
  | 'QA'
  | 'DEPLOY';

// ─── Task definition ────────────────────────────────────────────────────────

export const AgentTaskSchema = z.object({
  beadId: z.string(),
  name: z.string(),
  description: z.string(),
  ownerAgent: z.string(),
  role: z.enum([
    'ORCHESTRATOR',
    'EXECUTOR',
    'MINION',
    'GUARDIAN',
    'INGEST',
    'LOCALIZATION',
    'DESIGN',
    'QA',
    'DEPLOY',
  ]),

  // DAG edges
  dependencies: z.array(z.string()),

  // Execution bounds
  riskTier: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  costCeilingCents: z.number().default(1000), // $10 default
  maxWallClockMs: z.number().default(1800000), // 30 min

  // Scope control
  touchedFiles: z.array(z.string()).default([]),
  touchedServices: z.array(z.string()).default([]),

  // State
  status: z
    .enum(['PENDING', 'IN_PROGRESS', 'PAUSED', 'COMPLETE', 'FAILED', 'HALTED'])
    .default('PENDING'),
  currentStage: z
    .enum([
      'CONTEXT_LOAD',
      'PLAN',
      'IMPLEMENT',
      'TEST',
      'COMMIT',
      'DEPLOY',
      'VERIFY',
      'NOTIFY',
    ])
    .optional(),
  selfCorrectionAttempts: z.number().default(0),

  // Timing
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  costUsedCents: z.number().default(0),

  // Validation
  validationCriteria: z.array(z.string()).default([]),
  rollbackInstruction: z.string().optional(),
});

export type AgentTask = z.infer<typeof AgentTaskSchema>;

// ─── Task plan (Stage 1 output) ─────────────────────────────────────────────

export interface TaskPlan {
  beadId: BeadId;
  objective: string;
  filesToCreate: string[];
  filesToModify: string[];
  testsToWrite: string[];
  validationCriteria: string[];
  rollbackStrategy: string;
  riskTier: RiskTier;
  estimatedCostCents: number;
}

// ─── Stage report ────────────────────────────────────────────────────────────

export interface StageReport {
  beadId: string;
  stage: TaskStage;
  status: 'PASS' | 'FAIL' | 'HALTED';
  startedAt: Date;
  completedAt: Date;
  output: unknown;
  reasoning: string;
  blockers: string[];
}

// ─── Ops report (written to ops/reports/) ───────────────────────────────────

export interface OpsReport {
  beadId: string;
  taskName: string;
  status: TaskStatus;
  stagesCompleted: TaskStage[];
  totalDurationMs: number;
  costUsedCents: number;
  touchedFiles: string[];
  touchedServices: string[];
  deployedTo?: string;
  testResults?: { passed: number; failed: number; total: number };
  blockers: string[];
  createdAt: string;
}

// ─── Circuit breaker result ──────────────────────────────────────────────────

export interface CircuitBreakerResult {
  breaker: string;
  triggered: boolean;
  reason?: string;
  action: 'CONTINUE' | 'HALT' | 'REQUIRE_ACK';
}

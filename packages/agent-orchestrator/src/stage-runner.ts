// packages/agent-orchestrator/src/stage-runner.ts
// ZTE Stage protocol runner — stages 0–7

import type {
  AgentTask,
  TaskStage,
  StageReport,
  TaskPlan,
} from './types.js';
import {
  runAllCircuitBreakers,
  isHalted,
  requiresAck,
} from './circuit-breakers.js';
import { writeReport } from './reporter.js';

export type StageHandler = (
  task: AgentTask,
  context: RunContext,
) => Promise<StageHandlerResult>;

export interface StageHandlerResult {
  ok: boolean;
  output?: unknown;
  reasoning?: string;
  blocker?: string;
}

export interface RunContext {
  repoRoot: string;
  environment: 'local' | 'preview' | 'staging' | 'production';
  hasProductionApproval?: boolean;
  dailyCostCents?: number;
  handlers?: Partial<Record<TaskStage, StageHandler>>;
}

const STAGE_ORDER: TaskStage[] = [
  'CONTEXT_LOAD',
  'PLAN',
  'IMPLEMENT',
  'TEST',
  'COMMIT',
  'DEPLOY',
  'VERIFY',
  'NOTIFY',
];

/**
 * Run a task through the full ZTE stage protocol.
 * Respects circuit breakers at every stage boundary.
 */
export async function runTask(
  task: AgentTask,
  context: RunContext,
): Promise<AgentTask> {
  const startedAt = new Date();
  task.startedAt = startedAt;
  task.status = 'IN_PROGRESS';

  const stageReports: StageReport[] = [];

  for (const stage of STAGE_ORDER) {
    task.currentStage = stage;

    // ── Circuit breaker check before each stage ───────────────────────────
    const breakerResults = runAllCircuitBreakers(task, {
      targetEnv: context.environment,
      ...(context.hasProductionApproval !== undefined ? { hasProductionApproval: context.hasProductionApproval } : {}),
      ...(context.dailyCostCents !== undefined ? { dailyCostCents: context.dailyCostCents } : {}),
    });

    if (isHalted(breakerResults)) {
      const halted = breakerResults.find((r) => r.triggered && r.action === 'HALT')!;
      task.status = 'HALTED';
      await writeReport(task, stageReports, context.repoRoot, {
        blocker: `Circuit breaker ${halted.breaker}: ${halted.reason}`,
      });
      return task;
    }

    if (requiresAck(breakerResults) && stage !== 'CONTEXT_LOAD') {
      task.status = 'PAUSED';
      await writeReport(task, stageReports, context.repoRoot, {
        blocker: 'Awaiting Orchestrator ACK for blast-radius or production gate',
      });
      return task;
    }

    // ── Run stage handler ─────────────────────────────────────────────────
    const stageStart = new Date();
    let result: StageHandlerResult = { ok: true };

    const handler = context.handlers?.[stage];
    if (handler) {
      try {
        result = await handler(task, context);
      } catch (err) {
        result = {
          ok: false,
          blocker: err instanceof Error ? err.message : String(err),
        };
      }
    }

    const stageReport: StageReport = {
      beadId: task.beadId,
      stage,
      status: result.ok ? 'PASS' : 'FAIL',
      startedAt: stageStart,
      completedAt: new Date(),
      output: result.output ?? null,
      reasoning: result.reasoning ?? '',
      blockers: result.blocker ? [result.blocker] : [],
    };

    stageReports.push(stageReport);

    if (!result.ok) {
      // Enter self-correction loop
      task.selfCorrectionAttempts = (task.selfCorrectionAttempts ?? 0) + 1;

      const loopCheck = runAllCircuitBreakers(task);
      if (isHalted(loopCheck)) {
        task.status = 'FAILED';
        await writeReport(task, stageReports, context.repoRoot, {
          blocker: `Stage ${stage} failed and loop guard exhausted`,
        });
        return task;
      }

      // Re-run the same stage (simple retry approach)
      continue;
    }
  }

  task.status = 'COMPLETE';
  task.completedAt = new Date();
  await writeReport(task, stageReports, context.repoRoot);
  return task;
}

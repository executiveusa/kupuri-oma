// packages/agent-orchestrator/src/circuit-breakers.ts
// Hardcoded, non-negotiable logic gates from ZTE Protocol v2.0
// These are NOT guidelines — they are execution halts.

import type { AgentTask, CircuitBreakerResult } from './types.js';

// ─── COST_GUARD ──────────────────────────────────────────────────────────────
// Single task >$10 OR daily total >$50 → Hard HALT

export function checkCostGuard(
  task: AgentTask,
  dailyTotalCents = 0,
): CircuitBreakerResult {
  const TASK_CEILING_CENTS = task.costCeilingCents ?? 1000;
  const DAILY_CEILING_CENTS = 5000;

  if (task.costUsedCents > TASK_CEILING_CENTS) {
    return {
      breaker: 'COST_GUARD',
      triggered: true,
      reason: `Task cost ${task.costUsedCents}¢ exceeds ceiling ${TASK_CEILING_CENTS}¢`,
      action: 'HALT',
    };
  }

  if (dailyTotalCents > DAILY_CEILING_CENTS) {
    return {
      breaker: 'COST_GUARD',
      triggered: true,
      reason: `Daily cost ${dailyTotalCents}¢ exceeds $50 ceiling`,
      action: 'HALT',
    };
  }

  return { breaker: 'COST_GUARD', triggered: false, action: 'CONTINUE' };
}

// ─── SECRET_GUARD ────────────────────────────────────────────────────────────
// Any secret pattern detected in output → HALT, scrub, alert

const SECRET_PATTERNS = [
  /\bsk-[a-zA-Z0-9]{20,}\b/,             // OpenAI keys
  /\bAKIA[0-9A-Z]{16}\b/,                 // AWS access keys
  /\bghp_[a-zA-Z0-9]{36}\b/,             // GitHub PAT
  /password\s*[:=]\s*[^\s'"]{8,}/i,
  /secret\s*[:=]\s*[^\s'"]{8,}/i,
  /api[_-]?key\s*[:=]\s*[^\s'"]{8,}/i,
  /DATABASE_URL\s*=\s*[^\s'"]+@/i,
];

export function checkSecretGuard(content: string): CircuitBreakerResult {
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(content)) {
      return {
        breaker: 'SECRET_GUARD',
        triggered: true,
        reason: `Secret pattern detected matching ${pattern.source}`,
        action: 'HALT',
      };
    }
  }
  return { breaker: 'SECRET_GUARD', triggered: false, action: 'CONTINUE' };
}

// ─── LOOP_GUARD ──────────────────────────────────────────────────────────────
// Same error 3 times in a row → HALT, escalate with full context dump

export function checkLoopGuard(task: AgentTask): CircuitBreakerResult {
  const MAX_ATTEMPTS = 3;

  if (task.selfCorrectionAttempts >= MAX_ATTEMPTS) {
    return {
      breaker: 'LOOP_GUARD',
      triggered: true,
      reason: `Self-correction loop exhausted (${task.selfCorrectionAttempts}/${MAX_ATTEMPTS} attempts)`,
      action: 'HALT',
    };
  }

  return { breaker: 'LOOP_GUARD', triggered: false, action: 'CONTINUE' };
}

// ─── BLAST_RADIUS_GUARD ──────────────────────────────────────────────────────
// Action affects >3 services simultaneously → Require explicit multi-service plan

export function checkBlastRadiusGuard(task: AgentTask): CircuitBreakerResult {
  const MAX_SERVICES = 3;

  if (task.touchedServices.length > MAX_SERVICES) {
    return {
      breaker: 'BLAST_RADIUS_GUARD',
      triggered: true,
      reason: `Task touches ${task.touchedServices.length} services (max ${MAX_SERVICES}): ${task.touchedServices.join(', ')}`,
      action: 'REQUIRE_ACK',
    };
  }

  return { breaker: 'BLAST_RADIUS_GUARD', triggered: false, action: 'CONTINUE' };
}

// ─── PRODUCTION_GATE ─────────────────────────────────────────────────────────
// Production deploys require explicit approval flag

export function checkProductionGate(
  targetEnv: string,
  hasApproval: boolean,
): CircuitBreakerResult {
  if (targetEnv === 'production' && !hasApproval) {
    return {
      breaker: 'PRODUCTION_GATE',
      triggered: true,
      reason: 'Production deploy requires explicit Orchestrator ACK',
      action: 'REQUIRE_ACK',
    };
  }

  return { breaker: 'PRODUCTION_GATE', triggered: false, action: 'CONTINUE' };
}

// ─── IRREVERSIBILITY_GUARD ───────────────────────────────────────────────────
// DB drops, secret deletes, force pushes → Hard HALT

const IRREVERSIBLE_PATTERNS = [
  /DROP\s+TABLE/i,
  /DROP\s+DATABASE/i,
  /DELETE\s+FROM\s+\w+\s*;?\s*$/i, // DELETE without WHERE
  /git\s+push\s+.*--force/,
  /git\s+reset\s+--hard/,
  /rm\s+-rf/,
];

export function checkIrreversibilityGuard(command: string): CircuitBreakerResult {
  for (const pattern of IRREVERSIBLE_PATTERNS) {
    if (pattern.test(command)) {
      return {
        breaker: 'IRREVERSIBILITY_GUARD',
        triggered: true,
        reason: `Irreversible command detected: ${command.slice(0, 80)}`,
        action: 'HALT',
      };
    }
  }

  return { breaker: 'IRREVERSIBILITY_GUARD', triggered: false, action: 'CONTINUE' };
}

// ─── Run all guards ──────────────────────────────────────────────────────────

export function runAllCircuitBreakers(
  task: AgentTask,
  options: {
    outputContent?: string;
    command?: string;
    targetEnv?: string;
    hasProductionApproval?: boolean;
    dailyCostCents?: number;
  } = {},
): CircuitBreakerResult[] {
  const results: CircuitBreakerResult[] = [];

  results.push(checkCostGuard(task, options.dailyCostCents));
  results.push(checkLoopGuard(task));
  results.push(checkBlastRadiusGuard(task));

  if (options.outputContent) {
    results.push(checkSecretGuard(options.outputContent));
  }

  if (options.command) {
    results.push(checkIrreversibilityGuard(options.command));
  }

  if (options.targetEnv) {
    results.push(
      checkProductionGate(
        options.targetEnv,
        options.hasProductionApproval ?? false,
      ),
    );
  }

  return results;
}

export function isHalted(results: CircuitBreakerResult[]): boolean {
  return results.some((r) => r.triggered && r.action === 'HALT');
}

export function requiresAck(results: CircuitBreakerResult[]): boolean {
  return results.some((r) => r.triggered && r.action === 'REQUIRE_ACK');
}

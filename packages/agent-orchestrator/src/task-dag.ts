// packages/agent-orchestrator/src/task-dag.ts
// Dependency-aware task DAG planner

import type { AgentTask } from './types.js';

export interface DAGNode {
  task: AgentTask;
  resolved: boolean;
}

/** Build a topological execution order from a flat task list */
export function buildExecutionOrder(tasks: AgentTask[]): AgentTask[][] {
  const taskMap = new Map(tasks.map((t) => [t.beadId, t]));
  const visited = new Set<string>();
  const inStack = new Set<string>();
  const waves: AgentTask[][] = [];

  function canRun(task: AgentTask): boolean {
    return task.dependencies.every(
      (dep) => visited.has(dep) || !taskMap.has(dep),
    );
  }

  function detectCycle(id: string): boolean {
    if (inStack.has(id)) return true;
    if (visited.has(id)) return false;
    inStack.add(id);
    const task = taskMap.get(id);
    if (task) {
      for (const dep of task.dependencies) {
        if (detectCycle(dep)) return true;
      }
    }
    inStack.delete(id);
    return false;
  }

  // Check for cycles first
  for (const task of tasks) {
    if (detectCycle(task.beadId)) {
      throw new Error(
        `Circular dependency detected involving task: ${task.beadId}`,
      );
    }
  }

  // Kahn's algorithm — produce parallel waves
  const remaining = new Set(tasks.map((t) => t.beadId));

  while (remaining.size > 0) {
    const wave: AgentTask[] = [];

    for (const id of remaining) {
      const task = taskMap.get(id)!;
      if (canRun(task)) {
        wave.push(task);
      }
    }

    if (wave.length === 0) {
      throw new Error(
        `DAG stalled — unresolvable dependencies among: ${[...remaining].join(', ')}`,
      );
    }

    for (const task of wave) {
      remaining.delete(task.beadId);
      visited.add(task.beadId);
    }

    waves.push(wave);
  }

  return waves;
}

/**
 * Validate a task list for common authoring errors.
 * Returns an array of error messages (empty = valid).
 */
export function validateTaskList(tasks: AgentTask[]): string[] {
  const errors: string[] = [];
  const ids = new Set(tasks.map((t) => t.beadId));

  for (const task of tasks) {
    // Duplicate IDs
    if ([...tasks].filter((t) => t.beadId === task.beadId).length > 1) {
      errors.push(`Duplicate bead ID: ${task.beadId}`);
    }

    // Missing dependency references
    for (const dep of task.dependencies) {
      if (!ids.has(dep)) {
        errors.push(
          `Task ${task.beadId} depends on unknown task: ${dep}`,
        );
      }
    }

    // Blast radius pre-check
    if (task.touchedServices.length > 3) {
      errors.push(
        `Task ${task.beadId} touches ${task.touchedServices.length} services — requires BLAST_RADIUS_GUARD ACK`,
      );
    }
  }

  return [...new Set(errors)]; // deduplicate
}

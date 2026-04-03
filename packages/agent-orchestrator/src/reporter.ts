// packages/agent-orchestrator/src/reporter.ts
// Machine-readable ops report writer — outputs to ops/reports/

import { writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import type { AgentTask, StageReport, OpsReport, TaskStage } from './types.js';

export async function writeReport(
  task: AgentTask,
  stageReports: StageReport[],
  repoRoot: string,
  options: { blocker?: string } = {},
): Promise<void> {
  const reportsDir = join(repoRoot, 'ops', 'reports');
  await mkdir(reportsDir, { recursive: true });

  const stagesCompleted = stageReports
    .filter((s) => s.status === 'PASS')
    .map((s) => s.stage as TaskStage);

  const testStage = stageReports.find((s) => s.stage === 'TEST');
  const testResults =
    testStage?.output &&
    typeof testStage.output === 'object' &&
    testStage.output !== null &&
    'passed' in testStage.output
      ? (testStage.output as { passed: number; failed: number; total: number })
      : undefined;

  const durationMs = task.startedAt
    ? Date.now() - task.startedAt.getTime()
    : 0;

  const report: OpsReport = {
    beadId: task.beadId,
    taskName: task.name,
    status: task.status,
    stagesCompleted,
    totalDurationMs: durationMs,
    costUsedCents: task.costUsedCents ?? 0,
    touchedFiles: task.touchedFiles ?? [],
    touchedServices: task.touchedServices ?? [],
    ...(testResults !== undefined ? { testResults } : {}),
    blockers: options.blocker ? [options.blocker] : [],
    createdAt: new Date().toISOString(),
  };

  const suffix =
    task.status === 'COMPLETE' ? 'complete' : task.status.toLowerCase();
  const filename = `${task.beadId}_${suffix}.json`;
  const filePath = join(reportsDir, filename);

  await writeFile(filePath, JSON.stringify(report, null, 2), 'utf-8');

  // Human-readable notification format (stdout)
  const icon = task.status === 'COMPLETE' ? '✅' : '❌';
  const lines = [
    `${icon} ${task.beadId} | ${task.name} | ${task.status}`,
    `   Stages: ${stagesCompleted.join(' → ')}`,
    `   Duration: ${Math.round(durationMs / 1000)}s`,
    `   Cost: $${((task.costUsedCents ?? 0) / 100).toFixed(2)}`,
    `   Files: ${(task.touchedFiles ?? []).length}`,
  ];

  if (options.blocker) {
    lines.push(`   Blocker: ${options.blocker}`);
  }

  console.log(lines.join('\n'));
}

/** Read an existing ops report */
export async function readReport(repoRoot: string, beadId: string): Promise<OpsReport | null> {
  const { readdir, readFile } = await import('node:fs/promises');
  const reportsDir = join(repoRoot, 'ops', 'reports');

  try {
    const files = await readdir(reportsDir);
    const match = files.find((f) => f.startsWith(beadId));
    if (!match) return null;

    const raw = await readFile(join(reportsDir, match), 'utf-8');
    return JSON.parse(raw) as OpsReport;
  } catch {
    return null;
  }
}

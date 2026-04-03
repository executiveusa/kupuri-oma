// packages/build-engine/src/build-runner.ts
// Orchestrate a full build run

import { randomUUID } from 'node:crypto';
import type { BuildRequest, BuildRun, BuildLogEntry, GraphSearchResult } from './types.js';
import { parsePrompt } from './prompt-parser.js';
import { assembleSections } from './section-assembler.js';

function log(
  run: BuildRun,
  level: BuildLogEntry['level'],
  message: string,
  stage?: string,
): void {
  run.logs.push({ timestamp: new Date(), level, message, stage });
}

/**
 * Execute a build run synchronously (graph client is injected for testability).
 *
 * In production, pass a real graphSearch adapter that queries Neo4j.
 * In tests, pass a stub.
 */
export async function executeBuildRun(
  request: BuildRequest,
  options: {
    graphSearch?: (query: string, locale: string) => Promise<GraphSearchResult[]>;
    synthiaScore?: (sections: unknown[]) => Promise<number>;
  } = {},
): Promise<BuildRun> {
  const run: BuildRun = {
    id: randomUUID(),
    beadId: `BUILD-${Date.now()}`,
    projectId: request.projectId,
    prompt: request.prompt,
    locale: request.locale,
    selectedGraphNodes: [],
    sections: [],
    status: 'PENDING',
    logs: [],
    costCents: 0,
    startedAt: new Date(),
  };

  try {
    // Stage 1 — Parse prompt
    run.status = 'GRAPH_SEARCH';
    log(run, 'info', 'Parsing prompt for signals', 'PARSE');
    const signals = parsePrompt(request);
    log(
      run,
      'info',
      `Detected industry=${signals.detectedIndustry ?? 'unknown'} vibe=${signals.detectedVibe ?? 'unknown'}`,
      'PARSE',
    );

    // Stage 2 — Graph search
    let graphResults: GraphSearchResult[] = [];
    if (options.graphSearch && signals.detectedIndustry) {
      const query = [
        signals.detectedIndustry,
        signals.detectedVibe,
        request.locale,
      ]
        .filter(Boolean)
        .join(' ');

      run.graphQuery = query;
      log(run, 'info', `Graph search: ${query}`, 'GRAPH_SEARCH');
      graphResults = await options.graphSearch(query, request.locale);
      run.selectedGraphNodes = graphResults.map((r) => r.nodeId);
      log(
        run,
        'info',
        `Found ${graphResults.length} graph matches`,
        'GRAPH_SEARCH',
      );
    }

    // Stage 3 — Assemble sections
    run.status = 'ASSEMBLING';
    log(run, 'info', 'Assembling section composition', 'ASSEMBLE');
    run.sections = assembleSections(signals, graphResults);
    log(
      run,
      'info',
      `Assembled ${run.sections.length} sections: ${run.sections.map((s) => s.type).join(', ')}`,
      'ASSEMBLE',
    );

    // Stage 4 — SYNTHIA score gate
    run.status = 'SCORING';
    if (options.synthiaScore) {
      const score = await options.synthiaScore(run.sections);
      run.synthiaScore = score;

      if (score < 8.5) {
        log(
          run,
          'warn',
          `SYNTHIA score ${score} below 8.5 threshold — auto-upgrading sections`,
          'SCORE',
        );
        // Upgrade any hero variant to premium defaults
        for (const section of run.sections) {
          if (section.type === 'hero' && !section.variant) {
            section.variant = 'split-image';
          }
        }
      } else {
        log(run, 'info', `SYNTHIA score ${score} — quality gate passed`, 'SCORE');
      }
    }

    run.status = 'COMPLETE';
    run.completedAt = new Date();
    log(run, 'info', 'Build run complete', 'DONE');
  } catch (err) {
    run.status = 'FAILED';
    log(run, 'error', err instanceof Error ? err.message : String(err), 'ERROR');
  }

  return run;
}

// packages/build-engine/src/section-assembler.ts
// Compose a section list from graph matches + prompt signals

import type { SectionSpec, GraphSearchResult } from './types.js';
import type { PromptSignals } from './prompt-parser.js';

// Default motion families by vibe
const VIBE_MOTION: Record<string, string> = {
  cinematic: 'cinematic',
  premium: 'cinematic',
  minimal: 'fade',
  bold: 'scale',
  playful: 'bounce-soft',
  corporate: 'fade',
};

// Default token packs by industry
const INDUSTRY_TOKENS: Record<string, string> = {
  saas: 'violet-neutral',
  ecommerce: 'gold-warm',
  fintech: 'blue-trust',
  educacion: 'green-growth',
  salud: 'teal-calm',
  agencia: 'mono-stark',
};

/**
 * Assemble a concrete SectionSpec list from:
 * 1. Prompt signals (section suggestions + vibe + industry)
 * 2. Graph search results (matched templates/components)
 */
export function assembleSections(
  signals: PromptSignals,
  graphResults: GraphSearchResult[] = [],
): SectionSpec[] {
  const motionFamily =
    signals.detectedVibe ? VIBE_MOTION[signals.detectedVibe] ?? 'fade' : 'fade';

  const tokenPackId =
    signals.detectedIndustry
      ? INDUSTRY_TOKENS[signals.detectedIndustry] ?? 'violet-neutral'
      : 'violet-neutral';

  const graphNodeById = new Map(graphResults.map((r) => [r.nodeId, r]));

  const sections: SectionSpec[] = signals.suggestedSections.map((type) => {
    // Find graph match for this section type
    const graphMatch = graphResults.find(
      (r) =>
        r.type === 'Component' ||
        r.type === 'Template' ||
        r.vibe === signals.detectedVibe,
    );

    return {
      type,
      motionFamily,
      tokenPackId,
      is3d: type === 'model-viewer',
      graphNodeId: graphMatch?.nodeId,
      variant: resolveVariant(type, signals),
    } satisfies SectionSpec;
  });

  return sections;
}

function resolveVariant(
  type: string,
  signals: PromptSignals,
): string | undefined {
  const vibe = signals.detectedVibe ?? 'minimal';

  const variants: Record<string, Record<string, string>> = {
    hero: {
      cinematic: 'fullscreen-video',
      premium: 'split-image',
      bold: 'color-block',
      minimal: 'centered-text',
      default: 'centered-text',
    },
    features: {
      cinematic: 'reveal-grid',
      premium: 'icon-grid',
      bold: 'horizontal-scroll',
      default: 'icon-grid',
    },
    pricing: {
      premium: 'card-spotlight',
      default: 'card-row',
    },
  };

  return variants[type]?.[vibe] ?? variants[type]?.default;
}

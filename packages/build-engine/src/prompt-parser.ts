// packages/build-engine/src/prompt-parser.ts
// Extract signals from a free-form build prompt

import type { BuildRequest, SectionType } from './types.js';

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  saas: ['software', 'plataforma', 'app', 'tool', 'herramienta', 'saas', 'b2b'],
  ecommerce: ['tienda', 'store', 'shop', 'producto', 'vender', 'ventas'],
  fintech: ['fintech', 'pago', 'payment', 'inversión', 'banco', 'cripto'],
  educacion: ['curso', 'educación', 'learn', 'aprender', 'academia', 'escuela'],
  salud: ['salud', 'health', 'médico', 'clínica', 'wellness', 'fitness'],
  agencia: ['agencia', 'agency', 'studio', 'estudio', 'diseño'],
};

const VIBE_KEYWORDS: Record<string, string[]> = {
  premium: ['premium', 'lujo', 'luxury', 'exclusivo', 'high-end', 'elegant'],
  minimal: ['minimal', 'clean', 'simple', 'limpio', 'sencillo'],
  bold: ['bold', 'audaz', 'impactante', 'llamativo', 'vibrant'],
  cinematic: ['cine', 'cinematic', 'motion', 'storytelling', 'inmersivo'],
  corporate: ['corporativo', 'corporate', 'empresa', 'business', 'professional'],
  playful: ['divertido', 'playful', 'fun', 'colorful', 'creative'],
};

export interface PromptSignals {
  detectedIndustry?: string | undefined;
  detectedVibe?: string | undefined;
  suggestedSections: SectionType[];
  needs3d: boolean;
  locale: 'es-MX' | 'en';
}

export function parsePrompt(
  request: BuildRequest,
): PromptSignals {
  const lower = request.prompt.toLowerCase();

  // Detect industry
  const detectedIndustry =
    request.industry ??
    Object.entries(INDUSTRY_KEYWORDS).find(([, keywords]) =>
      keywords.some((k) => lower.includes(k)),
    )?.[0];

  // Detect vibe
  const detectedVibe =
    request.vibe ??
    Object.entries(VIBE_KEYWORDS).find(([, keywords]) =>
      keywords.some((k) => lower.includes(k)),
    )?.[0];

  // Always include base grammar sections
  const suggestedSections: SectionType[] = [
    'hero',
    'proof',
    'features',
    'pricing',
    'cta-footer',
  ];

  // Add cinematic sections for premium/cinematic vibes
  if (detectedVibe === 'cinematic' || detectedVibe === 'premium') {
    suggestedSections.splice(1, 0, 'parallax-hero');
    suggestedSections.splice(3, 0, 'story');
  }

  // Community section for platforms
  if (
    detectedIndustry === 'saas' ||
    lower.includes('comunidad') ||
    lower.includes('community')
  ) {
    suggestedSections.push('community');
  }

  // FAQ for docs/products
  if (lower.includes('faq') || lower.includes('preguntas')) {
    suggestedSections.push('faq');
  }

  // 3D section
  const needs3d =
    request.enable3d ||
    lower.includes('3d') ||
    lower.includes('modelo') ||
    lower.includes('immersive') ||
    lower.includes('inmersivo');

  if (needs3d) {
    suggestedSections.push('model-viewer');
  }

  // Add required sections (override)
  for (const s of request.requiredSections as SectionType[]) {
    if (!suggestedSections.includes(s)) {
      suggestedSections.push(s);
    }
  }

  return {
    detectedIndustry,
    detectedVibe,
    suggestedSections,
    needs3d,
    locale: request.locale,
  };
}

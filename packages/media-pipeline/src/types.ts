// packages/media-pipeline/src/types.ts

import { z } from 'zod';

export const ThumbnailSizeSchema = z.object({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  suffix: z.string(), // e.g. "thumb", "card", "og"
});

export type ThumbnailSize = z.infer<typeof ThumbnailSizeSchema>;

export const DEFAULT_THUMBNAIL_SIZES: ThumbnailSize[] = [
  { width: 400, height: 300, suffix: 'thumb' },
  { width: 800, height: 450, suffix: 'card' },
  { width: 1200, height: 630, suffix: 'og' },
];

export interface OptimizeOptions {
  quality?: number;           // JPEG/WebP quality 1-100
  format?: 'webp' | 'jpeg' | 'png' | 'avif';
  stripExif?: boolean;
  progressive?: boolean;
}

export interface AssetManifestEntry {
  id: string;
  originalPath: string;
  variants: {
    suffix: string;
    path: string;
    width: number;
    height: number;
    sizeBytes: number;
    format: string;
  }[];
  processedAt: string;
  locale?: string;
}

export interface AssetManifest {
  version: '1.0';
  assets: AssetManifestEntry[];
  generatedAt: string;
  totalAssets: number;
}

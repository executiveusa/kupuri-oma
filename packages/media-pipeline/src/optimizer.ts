// packages/media-pipeline/src/optimizer.ts
// Optimize a single image for web delivery

import sharp from 'sharp';
import type { OptimizeOptions } from './types.js';

export interface OptimizeResult {
  outputPath: string;
  format: string;
  width: number;
  height: number;
  originalBytes: number;
  outputBytes: number;
  savingPercent: number;
}

export async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options: OptimizeOptions = {},
): Promise<OptimizeResult> {
  const {
    quality = 85,
    format = 'webp',
    stripExif = true,
    progressive = true,
  } = options;

  const metadata = await sharp(inputPath).metadata();
  const originalBytes = metadata.size ?? 0;

  let processor = sharp(inputPath);

  if (stripExif) {
    processor = processor.withMetadata({ exif: {} });
  }

  switch (format) {
    case 'webp':
      processor = processor.webp({ quality });
      break;
    case 'avif':
      processor = processor.avif({ quality });
      break;
    case 'jpeg':
      processor = processor.jpeg({ quality, progressive });
      break;
    case 'png':
      processor = processor.png({ compressionLevel: 6 });
      break;
  }

  const info = await processor.toFile(outputPath);

  const savingPercent = originalBytes > 0
    ? Math.round(((originalBytes - info.size) / originalBytes) * 100)
    : 0;

  return {
    outputPath,
    format,
    width: info.width,
    height: info.height,
    originalBytes,
    outputBytes: info.size,
    savingPercent,
  };
}

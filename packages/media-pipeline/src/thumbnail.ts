// packages/media-pipeline/src/thumbnail.ts
// Generate responsive thumbnails using Sharp

import sharp from 'sharp';
import { join, extname, basename } from 'node:path';
import { mkdir } from 'node:fs/promises';
import type { ThumbnailSize, AssetManifestEntry } from './types.js';
import { DEFAULT_THUMBNAIL_SIZES } from './types.js';

export interface GenerateThumbnailsOptions {
  inputPath: string;
  outputDir: string;
  assetId: string;
  sizes?: ThumbnailSize[];
  format?: 'webp' | 'jpeg' | 'png';
  quality?: number;
}

export async function generateThumbnails(
  options: GenerateThumbnailsOptions,
): Promise<AssetManifestEntry> {
  const {
    inputPath,
    outputDir,
    assetId,
    sizes = DEFAULT_THUMBNAIL_SIZES,
    format = 'webp',
    quality = 85,
  } = options;

  await mkdir(outputDir, { recursive: true });

  const variants: AssetManifestEntry['variants'] = [];

  for (const size of sizes) {
    const outputFilename = `${assetId}-${size.suffix}.${format}`;
    const outputPath = join(outputDir, outputFilename);

    let processor = sharp(inputPath)
      .resize(size.width, size.height, {
        fit: 'cover',
        position: 'centre',
      })
      .withMetadata({ exif: {} }); // strip exif

    if (format === 'webp') {
      processor = processor.webp({ quality });
    } else if (format === 'jpeg') {
      processor = processor.jpeg({ quality, progressive: true });
    } else {
      processor = processor.png({ compressionLevel: 6 });
    }

    const info = await processor.toFile(outputPath);

    variants.push({
      suffix: size.suffix,
      path: outputPath,
      width: info.width,
      height: info.height,
      sizeBytes: info.size,
      format,
    });
  }

  return {
    id: assetId,
    originalPath: inputPath,
    variants,
    processedAt: new Date().toISOString(),
  };
}

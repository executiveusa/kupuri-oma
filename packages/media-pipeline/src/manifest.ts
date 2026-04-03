// packages/media-pipeline/src/manifest.ts
// Read/write asset manifest JSON

import { readFile, writeFile } from 'node:fs/promises';
import type { AssetManifest, AssetManifestEntry } from './types.js';

export function createManifest(entries: AssetManifestEntry[]): AssetManifest {
  return {
    version: '1.0',
    assets: entries,
    generatedAt: new Date().toISOString(),
    totalAssets: entries.length,
  };
}

export async function writeManifest(
  manifest: AssetManifest,
  outputPath: string,
): Promise<void> {
  await writeFile(outputPath, JSON.stringify(manifest, null, 2), 'utf-8');
}

export async function readManifest(manifestPath: string): Promise<AssetManifest> {
  const raw = await readFile(manifestPath, 'utf-8');
  return JSON.parse(raw) as AssetManifest;
}

export function mergeManifest(
  existing: AssetManifest,
  newEntries: AssetManifestEntry[],
): AssetManifest {
  const existingIds = new Set(existing.assets.map((a) => a.id));
  const added = newEntries.filter((e) => !existingIds.has(e.id));
  const updated = existing.assets.map((a) => {
    const updated = newEntries.find((e) => e.id === a.id);
    return updated ?? a;
  });

  return createManifest([...updated, ...added]);
}

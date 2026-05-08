import express from 'express';
import { z } from 'zod';
import { basename, join } from 'node:path';
import { access } from 'node:fs/promises';
import { generateWithBlender, getOutputDir } from './blender-runner.js';

const PORT = Number(process.env.PORT ?? 4001);

const app = express();
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'blender-worker', version: '0.2.0' });
});

const GenerateRequestSchema = z.object({
  sceneDescription: z.string().min(10),
  format: z.enum(['glb', 'gltf']).default('glb'),
  maxPolyCount: z.number().int().positive().default(50000),
  compressionLevel: z.number().int().min(0).max(6).default(4),
});

app.post('/api/3dgen', async (req, res) => {
  const parsed = GenerateRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ ok: false, error: 'invalid_request', issues: parsed.error.issues });
    return;
  }

  const startMs = Date.now();
  try {
    const result = await generateWithBlender(parsed.data);
    const durationMs = Date.now() - startMs;

    res.json({
      ok: true,
      assetUrl: `/api/3d/assets/${result.fileName}`,
      sizeBytes: result.sizeBytes,
      durationMs,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === 'BLENDER_UNAVAILABLE') {
      res.status(503).json({ ok: false, error: 'blender_unavailable' });
      return;
    }
    console.error('[blender-worker] generation failed:', msg);
    res.status(500).json({ ok: false, error: 'generation_failed' });
  }
});

app.get('/api/3d/assets/:fileName', async (req, res) => {
  const fileName = basename(req.params.fileName);
  const filePath = join(getOutputDir(), fileName);
  try {
    await access(filePath);
    res.setHeader('Cache-Control', 'private, max-age=300');
    res.sendFile(filePath);
  } catch {
    res.status(404).json({ ok: false, error: 'asset_not_found' });
  }
});

app.listen(PORT, () => {
  console.log(`[blender-worker] listening on port ${PORT}`);
});

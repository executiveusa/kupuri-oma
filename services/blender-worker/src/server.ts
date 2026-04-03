// services/blender-worker/src/server.ts
// HTTP server that accepts 3D generation jobs and calls Blender headless
// POST /api/3dgen  → { sceneDescription, format?, maxPolyCount? }
// GET  /health     → { ok: true }

import express from 'express';
import { z } from 'zod';
import { generateWithBlender } from './blender-runner.js';

const PORT = Number(process.env.PORT ?? 4001);

const app = express();
app.use(express.json({ limit: '2mb' }));

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'blender-worker', version: '0.1.0' });
});

// ─── 3D generation endpoint ──────────────────────────────────────────────────

const GenerateRequestSchema = z.object({
  sceneDescription: z.string().min(10),
  format: z.enum(['glb', 'gltf']).default('glb'),
  maxPolyCount: z.number().int().positive().default(50000),
  compressionLevel: z.number().int().min(0).max(6).default(4),
});

app.post('/api/3dgen', async (req, res) => {
  const parsed = GenerateRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ ok: false, error: 'Invalid request', issues: parsed.error.issues });
    return;
  }

  const startMs = Date.now();

  try {
    const result = await generateWithBlender(parsed.data);
    const durationMs = Date.now() - startMs;

    res.json({
      ok: true,
      assetUrl: result.outputPath,
      sizeBytes: result.sizeBytes,
      durationMs,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[blender-worker] generation failed:', msg);
    res.status(500).json({ ok: false, error: msg });
  }
});

app.listen(PORT, () => {
  console.log(`[blender-worker] listening on port ${PORT}`);
});

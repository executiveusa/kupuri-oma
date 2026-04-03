// packages/three-engine/src/blender-worker-client.ts
// HTTP client for the Blender generation worker service
// Sends scene descriptions, receives GLB asset URLs

import type { BlenderRequest, BlenderResponse } from './types.js';

export class BlenderWorkerClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  /** Submit a 3D generation job and wait for the result */
  async generate(request: BlenderRequest): Promise<BlenderResponse> {
    const url = `${this.baseUrl}/api/3dgen`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const text = await res.text();
      return {
        ok: false,
        error: `Blender worker HTTP ${res.status}: ${text.slice(0, 200)}`,
      };
    }

    return res.json() as Promise<BlenderResponse>;
  }

  /** Health check */
  async isHealthy(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  }
}

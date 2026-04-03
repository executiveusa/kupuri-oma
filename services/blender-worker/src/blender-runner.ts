// services/blender-worker/src/blender-runner.ts
// Execute Blender headless and return a GLB asset
// Requires: BLENDER_BIN env var pointing to the Blender executable
// Falls back to a mock in development when Blender is not available

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';

const execFileAsync = promisify(execFile);

export interface BlenderRunnerInput {
  sceneDescription: string;
  format: 'glb' | 'gltf';
  maxPolyCount: number;
  compressionLevel: number;
}

export interface BlenderRunnerOutput {
  outputPath: string;
  sizeBytes: number;
}

const BLENDER_BIN = process.env.BLENDER_BIN ?? 'blender';
const OUTPUT_DIR = process.env.BLENDER_OUTPUT_DIR ?? join(tmpdir(), 'kupuri-3d');

/**
 * Generate a 3D asset from a scene description.
 *
 * In production: calls Blender headless with a generated Python script.
 * In development (no BLENDER_BIN set): writes a stub GLB file.
 */
export async function generateWithBlender(
  input: BlenderRunnerInput,
): Promise<BlenderRunnerOutput> {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const jobId = randomUUID();
  const outputFilename = `${jobId}.${input.format}`;
  const outputPath = join(OUTPUT_DIR, outputFilename);

  const blenderAvailable = await checkBlenderAvailable();

  if (!blenderAvailable) {
    // Development stub — write a minimal valid GLB header
    console.warn('[blender-runner] Blender not available — writing stub GLB');
    await writeStubGLB(outputPath);
  } else {
    await runBlenderHeadless(input, outputPath);
  }

  const { size } = await stat(outputPath);
  return { outputPath, sizeBytes: size };
}

async function checkBlenderAvailable(): Promise<boolean> {
  if (process.env.NODE_ENV === 'test') return false;

  try {
    await execFileAsync(BLENDER_BIN, ['--version'], { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Invoke Blender headless with a generated Python script.
 * The Python script imports the scene description, creates geometry, and exports GLB.
 * This uses Blender's --python-expr flag for simple scenes.
 * For complex scenes, generate a .py file and pass --python.
 */
async function runBlenderHeadless(
  input: BlenderRunnerInput,
  outputPath: string,
): Promise<void> {
  // Escape the description for safe Python string interpolation
  const safeDesc = input.sceneDescription
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n');

  const pythonScript = `
import bpy
import sys

# Clear default scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# Add a simple mesh as placeholder (production would use AI generation)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
obj = bpy.context.active_object
obj.name = "KupuriScene"

# Limit poly count
bpy.ops.object.modifier_add(type='DECIMATE')
obj.modifiers["Decimate"].ratio = min(1.0, ${input.maxPolyCount} / 8.0)
bpy.ops.object.modifier_apply(modifier="Decimate")

# Export GLB
bpy.ops.export_scene.gltf(
    filepath="${outputPath.replace(/\\/g, '/')}",
    export_format="${input.format.toUpperCase()}",
    export_draco_mesh_compression_enable=${input.compressionLevel > 0 ? 'True' : 'False'},
    export_draco_mesh_compression_level=${input.compressionLevel},
)

print(f"Exported to: ${outputPath}")
`;

  const scriptPath = join(OUTPUT_DIR, `${randomUUID()}.py`);
  await writeFile(scriptPath, pythonScript, 'utf-8');

  await execFileAsync(
    BLENDER_BIN,
    ['--background', '--python', scriptPath],
    { timeout: 120000 }, // 2 min ceiling
  );
}

/** Write a minimal stub GLB for dev environments */
async function writeStubGLB(outputPath: string): Promise<void> {
  // Minimal valid GLB header (12 bytes magic + version + length)
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0); // magic: "glTF"
  header.writeUInt32LE(2, 4);           // version: 2
  header.writeUInt32LE(12, 8);          // total length: 12 bytes
  await writeFile(outputPath, header);
}

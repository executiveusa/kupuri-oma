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
  fileName: string;
  outputPath: string;
  sizeBytes: number;
}

const BLENDER_BIN = process.env.BLENDER_BIN ?? 'blender';
const OUTPUT_DIR = process.env.BLENDER_OUTPUT_DIR ?? join(tmpdir(), 'kupuri-3d');

export async function generateWithBlender(input: BlenderRunnerInput): Promise<BlenderRunnerOutput> {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const jobId = randomUUID();
  const fileName = `${jobId}.${input.format}`;
  const outputPath = join(OUTPUT_DIR, fileName);
  const blenderAvailable = await checkBlenderAvailable();

  if (!blenderAvailable) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('BLENDER_UNAVAILABLE');
    }
    const devFixtureName = `${jobId}.devFixture.${input.format}`;
    const devFixturePath = join(OUTPUT_DIR, devFixtureName);
    await writeDevFixtureGLB(devFixturePath);
    const { size } = await stat(devFixturePath);
    return { fileName: devFixtureName, outputPath: devFixturePath, sizeBytes: size };
  }

  await runBlenderHeadless(input, outputPath);
  const { size } = await stat(outputPath);
  return { fileName, outputPath, sizeBytes: size };
}

export function getOutputDir() {
  return OUTPUT_DIR;
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

async function runBlenderHeadless(input: BlenderRunnerInput, outputPath: string): Promise<void> {
  const pythonScript = `
import bpy
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, 0))
obj = bpy.context.active_object
obj.name = "KupuriScene"
bpy.ops.object.modifier_add(type='DECIMATE')
obj.modifiers["Decimate"].ratio = min(1.0, ${input.maxPolyCount} / 8.0)
bpy.ops.object.modifier_apply(modifier="Decimate")
bpy.ops.export_scene.gltf(
    filepath="${outputPath.replace(/\\/g, '/')}",
    export_format="${input.format.toUpperCase()}",
    export_draco_mesh_compression_enable=${input.compressionLevel > 0 ? 'True' : 'False'},
    export_draco_mesh_compression_level=${input.compressionLevel},
)
`;

  const scriptPath = join(OUTPUT_DIR, `${randomUUID()}.py`);
  await writeFile(scriptPath, pythonScript, 'utf-8');
  await execFileAsync(BLENDER_BIN, ['--background', '--python', scriptPath], { timeout: 120000 });
}

async function writeDevFixtureGLB(outputPath: string): Promise<void> {
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12, 8);
  await writeFile(outputPath, header);
}

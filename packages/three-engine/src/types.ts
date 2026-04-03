// packages/three-engine/src/types.ts

export interface ModelViewerProps {
  /** URL to the GLB/GLTF asset */
  src: string;
  /** Alt text (accessibility + WCAG) */
  alt: string;
  /** Enable camera orbit controls */
  cameraControls?: boolean;
  /** Enable auto-rotate */
  autoRotate?: boolean;
  /** Exposure value */
  exposure?: number;
  /** Shadow intensity */
  shadowIntensity?: number;
  /** Environment image preset */
  environmentImage?: 'neutral' | 'legacy' | 'sunset' | 'forest';
  className?: string;
  /** Loading poster image URL */
  poster?: string;
  /** Whether Draco compression is enabled */
  dracoDecoder?: boolean;
}

export interface SceneConfig {
  background?: string;
  ambientIntensity?: number;
  directionalIntensity?: number;
  fog?: boolean;
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
}

export interface BlenderRequest {
  /** Natural-language scene description */
  sceneDescription: string;
  /** Output format */
  format?: 'glb' | 'gltf';
  /** Maximum polygon count */
  maxPolyCount?: number;
  /** Draco compression */
  compressionLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export interface BlenderResponse {
  ok: boolean;
  /** Signed URL or relative path to generated GLB */
  assetUrl?: string;
  /** Asset size in bytes */
  sizeBytes?: number;
  /** Processing time in ms */
  durationMs?: number;
  error?: string;
}

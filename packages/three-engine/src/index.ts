// packages/three-engine/src/index.ts
// Three.js / model-viewer integration for kupuri-oma
// Provides: ModelViewer, ThreeScene, useGLTF hooks, BlenderWorkerClient

export { ModelViewer } from './ModelViewer.js';
export { ThreeScene } from './ThreeScene.js';
export { BlenderWorkerClient } from './blender-worker-client.js';
export type { ModelViewerProps, SceneConfig, BlenderRequest, BlenderResponse } from './types.js';

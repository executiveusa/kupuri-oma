'use client';
// packages/three-engine/src/ThreeScene.tsx
// React Three Fiber scene wrapper for advanced storytelling sections

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import type { SceneConfig } from './types.js';

interface GLTFModelProps {
  url: string;
}

function GLTFModel({ url }: GLTFModelProps): React.ReactElement {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

interface ThreeSceneProps {
  modelUrl?: string;
  config?: SceneConfig;
  className?: string;
  children?: React.ReactNode;
}

/**
 * ThreeScene — @react-three/fiber canvas with sensible defaults.
 * Used for advanced cinematic storytelling sections.
 */
export function ThreeScene({
  modelUrl,
  config = {},
  className,
  children,
}: ThreeSceneProps): React.ReactElement {
  const {
    background = '#0a0a0f',
    ambientIntensity = 0.5,
    directionalIntensity = 1,
  } = config;

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[10, 10, 5]} intensity={directionalIntensity} />

        <Suspense fallback={null}>
          {modelUrl && <GLTFModel url={modelUrl} />}
          <Environment preset="studio" />
          {children}
        </Suspense>

        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <OrbitControls {...({ enablePan: false, enableZoom: false } as any)} />
      </Canvas>
    </div>
  );
}

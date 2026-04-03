'use client';
// packages/three-engine/src/ModelViewer.tsx
// Wraps @google/model-viewer web component for React 19 + Next.js
// Primary 3D delivery format: GLB/GLTF with Draco compression

import React, { useEffect, useRef } from 'react';
import type { ModelViewerProps } from './types.js';

// Declare model-viewer custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          'camera-controls'?: boolean | '';
          'auto-rotate'?: boolean | '';
          exposure?: string;
          'shadow-intensity'?: string;
          'environment-image'?: string;
          poster?: string;
          class?: string;
        },
        HTMLElement
      >;
    }
  }
}

/**
 * ModelViewer — wraps @google/model-viewer.
 * Loads the web component script lazily on first mount.
 * Uses GLB/GLTF as primary format, Draco decoder optional.
 */
export function ModelViewer({
  src,
  alt,
  cameraControls = true,
  autoRotate = false,
  exposure = 1,
  shadowIntensity = 1,
  environmentImage = 'neutral',
  className,
  poster,
}: ModelViewerProps): React.ReactElement {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    const script = document.createElement('script');
    script.type = 'module';
    script.src =
      'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
    document.head.appendChild(script);
  }, []);

  return (
    // @ts-expect-error — model-viewer custom element JSX
    <model-viewer
      src={src}
      alt={alt}
      camera-controls={cameraControls ? '' : undefined}
      auto-rotate={autoRotate ? '' : undefined}
      exposure={String(exposure)}
      shadow-intensity={String(shadowIntensity)}
      environment-image={environmentImage}
      poster={poster}
      class={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

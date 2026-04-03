import type * as THREE from 'three';

// Augment react/jsx-runtime (used by jsx: "react-jsx") with R3F intrinsic elements
declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      primitive: { object: THREE.Object3D; [key: string]: unknown };
      ambientLight: { intensity?: number; [key: string]: unknown };
      directionalLight: {
        position?: [number, number, number] | THREE.Vector3;
        intensity?: number;
        [key: string]: unknown;
      };
    }
  }
}

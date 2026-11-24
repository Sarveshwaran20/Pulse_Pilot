import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      sphereGeometry: any;
      shaderMaterial: any;
      ambientLight: any;
      pointLight: any;
      group: any;
      primitive: any;
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      sphereGeometry: any;
      shaderMaterial: any;
      ambientLight: any;
      pointLight: any;
      group: any;
      primitive: any;
    }
  }
}

export {};

/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Fix for react-markdown JSX namespace issues with React 19
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
import type { NextConfig } from 'next';
const config:NextConfig={output:'export',images:{loader:'custom',loaderFile:'./app/lib/image-loader.ts',deviceSizes:[360,640,960,1280,1920],imageSizes:[360]}};
export default config;

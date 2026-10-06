'use client';
import type { ImageLoaderProps } from 'next/image';
export default function imageLoader({src,width}:ImageLoaderProps){
 if(!src.startsWith('/images/')||!src.endsWith('.webp'))return src;
 const size=[360,640,960,1280,1920].find(n=>n>=width)||1920;
 return src.replace('.webp',`-${size}.webp`);
}

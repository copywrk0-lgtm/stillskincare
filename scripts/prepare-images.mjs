import sharp from 'sharp';
import path from 'node:path';
const directory=path.resolve('public/images');
const originals=['skin-hero.webp','skin.webp','booster.webp','mask.webp','hyaluronic-gel.webp','glycerin-liquid.webp','panthenol-cream.webp'];
for(const name of originals){
 for(const width of [360,640,960,1280,1920]){
  await sharp(path.join(directory,name)).resize({width,withoutEnlargement:true}).webp({quality:78,effort:4}).toFile(path.join(directory,name.replace('.webp',`-${width}.webp`)));
 }
}
const overlay=Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#080a09" opacity=".57"/><g fill="#f5f3ed" font-family="sans-serif"><text x="70" y="210" font-size="120">STILL.</text><text x="75" y="355" font-size="38">Thoughtful hydration. Stay you.</text><text x="75" y="535" font-size="26">An independent skincare concept by Copywrk</text></g></svg>`);
await sharp(path.join(directory,'skin-hero.webp')).resize(1200,630,{fit:'cover'}).composite([{input:overlay}]).jpeg({quality:88,mozjpeg:true}).toFile(path.join(directory,'social-preview.jpg'));
console.log('Prepared responsive image variants and social preview.');

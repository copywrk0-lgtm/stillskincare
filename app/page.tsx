import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Script from 'next/script';

// The standalone cinematic concept is the source of truth.
// At build time Next.js embeds its accessible body markup on the homepage.
// The CSS and JS are served locally from /public, without an iframe or CDN.
export default function Home() {
  const document = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
  const body = document.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? '';
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: body }} />
      <Script src="/jar-engine.js" strategy="afterInteractive" />
      <Script src="/script.js" strategy="afterInteractive" />
    </>
  );
}

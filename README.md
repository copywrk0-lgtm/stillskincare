# STILL — Cinematic V3

Interactive skincare portfolio concept by Copywrk, served through the existing Next.js/Vercel project.

## Production entry point

`app/page.tsx` embeds the markup from the root `index.html` at build time. `app/layout.tsx` supplies the V3 metadata and links the local stylesheet. The original Next.js source and project assets remain in Git history for rollback.

- Edit the standalone design: `index.html`, `styles.css`, `script.js`, `jar-engine.js`.
- The same runtime files are copied to `public/` for the Next.js static deployment. Keep them synchronized when editing; the duplicate paths ensure Next can serve them on Vercel.
- `public/assets/` contains the illustrated image assets also kept in `assets/`.
- The production social image is generated from the original project's `public/images/` assets by `npm run prepare:images`. `noindex,follow` remains intentional for the concept.

## Run

Requires Node.js 22+. Use `npm ci`, `npm run dev`, then `npm run typecheck` and `npm run build`.

You may also open the root `index.html` directly as a standalone prototype; it has no third-party JavaScript dependencies.

## Content limitations

The branding, jar, formulas, product quantities, and quiz are illustrative. Nothing is for sale. The quiz is local-only and not medical guidance. Replace moodboard-derived image assets with appropriately licensed images before commercial use.

## Release notes

V3 removes the external Three.js CDN, adds an event-driven local WebGL renderer with a CSS fallback, fixes quiz-to-product navigation, adds the scroll-driven liquid interlude, and updates the project deployment entry point.

# STILL — skincare brand concept

Next.js static website with a hydration-led story, two concept products, a four-question quiz and a downloadable consultation summary. This is an independent portfolio concept by Copywrk. Products, sizes and packaging are illustrative; there is no checkout, price list, clinical claim or salon network.

## Run locally

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

## Validate and build

```sh
npm run typecheck
npm run build
```

The production static site is generated in `out/`. Deploy with the included Vercel configuration or serve `out/` on a static host. No backend is required. The ZIP includes the rebuilt `out/` directory.

## Configuration

Copy `.env.example` to `.env.local` before building. `NEXT_PUBLIC_SITE_URL` sets the origin for social image URLs. `NEXT_PUBLIC_ALLOW_INDEXING` defaults to `false` for this portfolio concept, while links remain followable. Set it to `true` only when intentionally publishing an indexable site and rebuild. An optional real `NEXT_PUBLIC_WHATSAPP_NUMBER` enables a WhatsApp link; no number is invented if it is absent. The existing contact email is Copywrk’s `copywrk0@gmail.com`.

## Content and interactions

Product names, usage context, sample sizes, featured ingredients and quiz suggestions come from the shared `products` array in `app/page.tsx`. Featured ingredients are not full INCI declarations. The booster features hyaluronic acid and glycerin; the mask features hyaluronic acid, panthenol and glycerin.

The quiz keeps answers in memory only. It recommends a concept routine or professional guidance for sensitivity, offers a text download, and links to the selected collection product. Nothing is booked, purchased or submitted. No analytics or marketing cookies are installed by this project.

FAQs use native buttons with expanded state and controlled answer panels. The product carousel supports swipe, arrow keys and buttons. Care notes support arrow keys and buttons. Dialogs support Escape, focus trapping and focus restoration. Footer privacy and terms describe the actual concept flow.

Mobile uses native scrolling. GSAP/Lenis are loaded only on desktop without reduced-motion preference. Motion preferences are respected. The build regenerates responsive WebP variants and the social preview from the supplied originals using Sharp. Variants live alongside the original assets in `public/images/`, served through a static image loader. All below-the-fold images lazy-load into containers that reserve layout space. Open Graph and Twitter share the included 1200 × 630 social preview.

See `VERIFICATION.md` for completed checks and limits. Existing supplied image assets are retained; their commercial-use rights should be reviewed before a real brand launch.

# STILL — Chrome skin story

Original skincare concept by Copywrk, inspired by the product presentation of Bryhel and the mixed typography and tactile imagery of TrueKind. Their images, branding, copy and source code are not reused.

## The experience

- Full-screen liquid sculpture with original silver STILL packaging and oversized STAY / you. typography.
- Scroll-responsive manifesto and full-screen portrait that reveals an illustrative older appearance with a circular wipe.
- Three clickable skin layers, shown as a simplified exploded cross-section.
- Two-product orbit: chrome Hydration Booster and silver Hydrogel Mask. Scroll, use Previous/Next, select a product, or swipe sideways. Hover/focus the active product to reveal ingredient notes on desktop. The ingredient disclosure remains usable on mobile.
- Interactive lighting comparison, care-note carousel, four-question skin quiz, FAQs and salon enquiry preparation.
- Original brand favicon and locally hosted DM Sans / Italiana fonts with licences included.

## Stack and running locally

Next.js App Router, TypeScript, GSAP ScrollTrigger, Lenis. Images are compressed WebP. Cutouts preserve genuine transparency. No Three.js payload is needed for the product orbit.

Use Node.js 20.9 or newer:

```bash
npm ci
npm run dev
```

Create a production export:

```bash
npm run build
```

## Deploy on Vercel

Import the source folder as a Next.js project. Use the standard npm install and build settings. The project uses output: export and produces the static `out/` directory. The complete source, lockfile and built export are included in the ZIP. The export must be served over HTTP, not opened with file://. There is no backend to provision.

## Connect real brand details

Copy `.env.example` to `.env.local`. Set `NEXT_PUBLIC_WHATSAPP_NUMBER` to the verified consultation number before rebuilding. International digits only; 10-digit Indian numbers automatically receive 91. Without a number, consultation buttons prepare a quiz summary instead of contacting an unrelated business.

The salon lookup reports that the verified directory is pending. It never invents salons or confirms bookings. Supply verified location records to replace that fallback.

Both products, packshots and ingredient lists are concepts. Verify actual ingredients and usage directions before a commercial launch. The portrait ageing sequence is an artistic illustration, not a prediction. The comparison slider demonstrates lighting differences, not a treatment result. The care-note carousel awaits verified client reviews. No payment, checkout, lead storage or external enquiry delivery is connected.

## Motion and accessibility

Only three pinned chapters: ageing portrait, skin layers, product orbit. Hero image and word motion remain unpinned. Reduced-motion preference disables Lenis and all GSAP animations/pins. Static content, product controls and layer controls remain usable. The comparison uses a keyboard-operable range. Quiz supports a focus trap, Escape, previous-question navigation and restart. Questions do not store personal data.

Loader reacts to hero image loading. Minimum display is 1.5 seconds; a two-second CSS cap starts before hydration. It is disabled entirely in reduced-motion mode and hidden in a no-JavaScript rendering. Motion libraries load after the initial hero is ready.

Demo metadata uses noindex. Remove it only when final brand identity and verified launch content are ready.

## References

Design references:
- https://bryhel.com/products/
- https://truekindskincare.com/

General hydration and sun-protection wording checked against American Academy of Dermatology public guidance:
- https://www.aad.org/public/everyday-care/skin-care-basics/dry/pick-moisturizer
- https://www.aad.org/public/everyday-care/skin-care-basics/dry/dermatologists-tips-relieve-dry-skin

Preview screenshots and the final local Lighthouse report are included in `preview/`. Measurements are local production-export checks, not deployed Vercel measurements.

## Final validation

Production compilation and TypeScript passed. Browser checks passed at 1440×900 and 390×844, covering quiz completion, product switching, mobile swipe, ingredient focus/hover, layer selection, comparison slider, navigation, honest salon fallback, no horizontal overflow and no browser JavaScript errors. Reduced-motion check confirmed zero pinned sections.

Lighthouse mobile simulation: Performance 94/100 and Accessibility 100/100. Measured on the local production export served with gzip text compression to approximate a normal production host. The earlier uncompressed Python server scored 77/100; compression materially changes transfer time. These are local checks, not deployed-site scores. Vercel deployment is currently unavailable through the connected deployment tool.

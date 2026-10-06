# Verification — 6 October 2026

Validated the rebuilt static production output in Chromium.

- TypeScript: `npm run typecheck` passes.
- Production export: `npm run build` passes; `out/` is current.
- No browser page errors observed in tested mobile and desktop flows.
- No horizontal overflow at 360 px, 390 px, or 1440 px.
- Four-question hydration flow reaches the booster recommendation, downloads a nonempty text summary, and opens the selected collection product.
- Sensitive-skin flow reaches professional guidance instead of a product recommendation.
- Product carousel switches with arrow keys and previous/next controls.
- All five FAQ answers open and contain text.
- Mobile collection navigation closes the menu and reaches its target.
- Privacy opens and closes with Escape. Quiz close restores focus to its trigger.
- Reduced-motion mode creates no scroll pin spacers; animation and transitions are disabled.
- axe-core scan: zero violations under WCAG 2 A/AA and 2.1 AA tags on the tested page state.
- Local cold-cache mobile simulation: 390 × 844, 4× CPU slowdown, 150 ms latency, 200 KB/s download. Observed LCP about 1.77 seconds and CLS 0 in one run. This is a local browser measurement, not a production Lighthouse score or guarantee.
- Responsive variants and lazy-loaded below-the-fold imagery checked. OG/Twitter metadata references the included 1200 × 630 preview.

Limits: no physical Android device test, live-host performance test, or actual WhatsApp delivery test was performed. Automated accessibility scans cannot fully evaluate image contrast, screen-reader experience, or every UI state. Optional WhatsApp is inactive without a configured number. Commercial ingredient lists, product availability, imagery rights and clinical evidence are outside this portfolio concept.

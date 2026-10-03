# LINII — Ближе к себе

Independent, Russian-language concept for LINII medical centre in Minsk, prepared by Copywrk. This is a design proposal, not the clinic's official website.

Next.js 16, React 19, GSAP ScrollTrigger and Lenis. Static export, suitable for Vercel. Run `npm ci`, `npm run dev` or `npm run build`.

The experience follows consultation → understanding the skin → specialist services → equipment → people → branches. Three pinned sections maximum. Reduced motion provides static content and functional controls. Photography is compressed WebP.

Service, equipment and specialist links go to linii.by. Calls use verified Belarusian branch numbers. The four-question helper stores answers in React state only; it does not transmit medical details, diagnose or confirm an appointment. Booking continues through the official contacts page or a phone call. There is no enquiry database or payment flow.

## Sources, checked 3 October 2026

- https://linii.by/ — centre, services and branch information.
- https://linii.by/contacts/ — addresses, telephone numbers and opening hours.
- https://linii.by/doctors/ — Kramareva Olga Alexandrovna and Yushenkova Yulia Valentinovna; both listed as cosmetologists, first category.
- https://linii.by/equipment/ — Fotona SP Dynamis NX Line and InMode Morpheus8 / Lumecca.

Actual clinic, specialist and equipment images are from LINII's official website. ASSET-SOURCES.json records their source URLs. Skin portraits, macro and abstract images are generated editorial illustrations inherited from the existing concept; they depict no LINII patient, clinical finding or treatment result. The page footer identifies the independent concept and illustrations. No patient testimonials or treatment results are invented.

The LINII work is on its own preview branch; STILL's main production version remains separate.

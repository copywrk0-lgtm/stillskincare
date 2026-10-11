# STILL — Immersive 2026 concept

An interactive, self-contained front-end experience created as a **new exploratory direction** for the Copywrk STILL skincare concept. **No GitHub or Vercel changes were made.**

## Run it

- Open `index.html` in Chrome, Edge, Safari or Firefox. No Node installation, build or API keys are required. An internet connection is needed only to load Three.js from cdnjs; offline, the CSS jar is shown instead.
- Alternatively, serve the folder locally with `python -m http.server 8080`, then visit `http://localhost:8080/`.
- The site is static and can be hosted on any static hosting platform. Point the deployment root at this folder.

## Features

- Scroll-directed multi-act hero with interactive drag-to-rotate conceptual product visual (real WebGL jar via Three.js r128 from cdnjs, with the original HTML/CSS 3D jar kept as an automatic fallback). Scroll turns, tilts and finally opens the lid.
- Animated scene titles and editorial sections; skin scanner responds to pointer movement.
- Interactive four-ingredient browser, mobile layouts, product selection and a three-question local-only routine quiz.
- Fully functional menu navigation, reduced-motion CSS, skip-link and keyboard-accessible ingredient tabs.
- Locally bundled illustrative product imagery cropped from the project moodboard; no third-party media dependencies.

## Concept-only limitations

This is **not a clinical or operating skincare brand**. Concept products, sizes, packaging and suggested routines are illustrative. The quiz does not transmit or store answers and is not medical advice. There is no checkout, price, salon finder, booking or fabricated testimonial. Before using commercially, replace art-direction imagery and claims with properly licensed, verified assets and actual product copy.

## Attribution

Creative direction and site implementation: Copywrk / STILL portfolio concept. Product photographs and illustrations are derived from the previous STILL moodboard provided for this project.

## Original project

This ZIP is a standalone visual rebuild, **not an exact clone/patch of the old Next.js codebase**. The existing source repository remains unchanged. To merge into the original Next app, migrate sections into Next components and keep the source project’s image-licensing and noindex requirements.

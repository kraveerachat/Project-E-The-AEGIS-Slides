# AEGIS Final Presentation

An independent, recording-ready presentation website for the AEGIS academic project. React, TypeScript, Vite and GSAP. This repository has no connection to the AEGIS production applications or private network.

## Run locally

Use Node.js 24 LTS and npm. No environment variables, credentials or private backend are required.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. For an occupied port: `npm run dev -- --port 5174`.

```sh
npm run check
npm run build
npm run preview
```

## Present and record

- Right / Left Arrow (or Page Down / Up): next / previous scene.
- F: fullscreen; Escape: exit fullscreen or dismiss the source/scene dialog.
- Top navigation: Home, Overview and the three IDEA chapters.
- Bottom controls: scene chooser, report sources and speaker notes, reading view, motion pause, fullscreen.
- Desktop uses a fixed 1920×1080 composition scaled to fit. Portrait phones default to a scrolling reading view. The view toggle is always available.
- Reduced motion follows the system setting. Videos require a deliberate play action.
- The editable scene budgets total **14 minutes 20 seconds**. This is a narration plan, not a timed recording guarantee. Include inserted video playback within each scene's budget.

Exactly 17 scenes cover the required sequence. Scenes and speaker notes are in `src/data/content.ts`; scene compositions are in `src/components/Scenes.tsx`.

## Content and media

The draft is based on the owner's **AEGIS Round 11 report**. The private report is not published in this repository. Every scene exposes editable section references in its source dialog. See [CONTENT_SOURCES.md](docs/CONTENT_SOURCES.md).

Both original logos are included. The monument artwork is explicitly decorative, based on the approved cover reference. All system UI frames await actual owner-supplied media: **14 screenshots and 3 videos**. No application screenshots or test results were generated.

See [ASSET_REQUESTS.md](ASSET_REQUESTS.md) for filenames, capture instructions and the two-step replacement process. The centralized manifest is `src/data/assets.ts`.

## Architecture

- React / TypeScript / Vite; locally bundled Manrope and Noto Sans Thai fonts.
- GSAP entrance/reverse scene motion and Flip chapter indicator; SVG relationship diagrams.
- `src/data`: report references, scene budgets, manifest and diagrams.
- `src/components`: reusable media/evidence frames and scene layouts.
- `src/hooks/usePresentation.ts`: navigation lock, reduced motion, scene animation and scaling.
- `public/assets`: original branding, generated decoration, actual screenshots and videos.

Missing/error media retain their reserved dimensions. IDEA 3 can be updated by changing content, sources and manifest entries, without replacing the media or scene architecture.

## Browser checks

Local tests use installed Google Chrome:

```sh
npm test
```

For bundled Chromium, install it with `npx playwright install chromium` and set `PLAYWRIGHT_CHANNEL=chromium` before running tests. The suite covers all scenes, 16:9 bounds, keyboard and chapter navigation, fullscreen, source dialogs, rapid input, placeholders, diagram selection, mobile reflow and automated accessibility checks.

Visual capture: start the preview on port 5174, then run `node scripts/capture-review.mjs`. Captures and full axe results stay in the ignored `.impeccable/review` directory. See [QA_REPORT.md](docs/QA_REPORT.md) for the verified scope and remaining owner tasks.

## Deployment

Vercel build command: `npm run build`. Output: `dist`. See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md). **Public deployment is pending owner authorization.**

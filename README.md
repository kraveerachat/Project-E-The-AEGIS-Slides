# AEGIS Final Presentation

A bilingual, recording-ready React / TypeScript / Vite presentation of **AEGIS: Local Data Center, Monitoring, Network Infrastructure and Security Assessment**. The 19 scenes follow the owner's V3 brief and approved closing-scene update, using the 180-page final report. No production backend or private network is needed.

## Run and verify

```sh
npm ci
npm run dev
npm run check
npm run build
npm test
```

The default preview is http://127.0.0.1:5173. An alternate port is supported with `npm run dev -- --port 5193`. Browser tests use installed Chrome; `PLAYWRIGHT_PORT` chooses a test port and `PLAYWRIGHT_CHANNEL` chooses the browser channel.

## Present

- Arrow Left/Right or Page Up/Down: previous/next scene; Right/Page Down on the final scene returns to the cover. F: fullscreen. Escape: close an inspection or exit fullscreen.
- The chapter rail links Home, Overview and the three IDEA chapters. The footer contains scene selection, references/speaker notes, TH/EN, reading mode and motion controls.
- Thai is the default. Language selection persists when browser storage is available and preserves the current scene and interactive selections.
- The 1920×1080 canvas scales to the screen. Small viewports use a reflowing reading layout when scaling would make navigation too small. Reduced motion follows the system preference or the footer control.
- The planned budget is **14:50**, including two **90-second** recordings, a 20-second hardware scene and a 15-second closing scene. The remaining buffer to 15 minutes is 10 seconds. Timing is a narration plan, not a recording guarantee.
- Both hardware photos open in a keyboard-accessible original-image inspection. Actual video playback expands to Presentation Video Mode and returns to the scene on completion or exit. It never advances the scene automatically.

## Content and media

`src/data/content.ts` contains ordered scenes, bilingual speaker notes, final-report references, timing and findings. `src/data/diagrams.ts` describes documented relationships; animated flow is illustrative. IDEA 3 is **Network and Web Application Security Assessment**, with separate scope, methodology and findings scenes. Assessor evidence stays separate from development-team tests.

The original SUT and AEGIS marks and two unchanged owner hardware photographs are included. The monument artwork is decorative. **19 real media assets remain missing:** 10 application screenshots, 5 redacted assessment captures, 2 video posters and 2 demonstration videos. Labeled frames preserve the layouts.

The central asset manifest is `src/data/assets.ts`. See [ASSET_REQUESTS.md](ASSET_REQUESTS.md) for exact files and insertion instructions. Missing or failed media never require application/backend access. Print uses a real poster or a labeled static frame for video.

## Architecture and review

- React scene components, SVG diagrams, GSAP entrances/reverse transitions and Flip chapter navigation.
- Existing language provider combines the UI dictionary with bilingual source records; Manrope and Noto Sans Thai are bundled locally.
- Native photo/evidence dialogs isolate keyboard navigation. Video focus temporarily makes background controls inert and restores focus on exit.
- Legacy scene links resolve to their revised scene equivalents.
- `node scripts/capture-v3.mjs http://127.0.0.1:5193` captures both languages and writes the required review screenshots to `docs/screenshots/v3/`. Other review captures stay in the ignored `.impeccable/review/v3/` folder.
- `npm run build && npm run capture:thank-you` captures Scene 19 in TH and EN at 1920×1080 from the production build, saving the images to `docs/screenshots/scene-19/`.
- `tests/fixtures/playback.mp4` is a neutral test-only clip for browser decoding, never a public AEGIS recording.

See [CONTENT_SOURCES.md](docs/CONTENT_SOURCES.md), [QA_REPORT.md](docs/QA_REPORT.md) and [ASSET_PROVENANCE.md](docs/ASSET_PROVENANCE.md).

## Deployment

Vercel: `npm run build`, output `dist`. See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md). Production deployment requires separate owner authorization. Temporary report extracts and generated PDFs are excluded from Git.

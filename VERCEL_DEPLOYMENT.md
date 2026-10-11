# Vercel setup — ready, not deployed

Public deployment requires separate owner authorization. This repository currently prepares a static build only.

## After authorization

1. Import `kraveerachat/Project-E-The-AEGIS-Slides` into the owner's Vercel account.
2. Select the reviewed branch/commit. Keep the Draft PR unmerged until human review is complete.
3. Framework preset: **Vite**. Root directory: repository root.
4. Node.js: **24.x**. Install command: `npm ci`.
5. Build command: `npm run build`. Output directory: **dist**.
6. Environment variables: **none**. No AEGIS backend, private network or credentials are required.
7. Review the generated preview before assigning a public production domain.

`vercel.json` records the build settings. Scene navigation uses URL hashes (`/#drive-demo`), so an SPA rewrite is unnecessary. Runtime assets use root-relative `/assets/...` URLs. Do not deploy this build under a non-root subpath without adjusting Vite's base and the asset resolver.

## Release checks

- Run `npm ci`, `npm run check`, `npm run build`, and the browser suite.
- Review all 17 scenes at 1920×1080 and fullscreen keyboard navigation in the recording browser.
- Review uploaded screenshot/video content for credentials, internal addresses, active tokens and unauthorized personal details. Project members' names are intentionally included from the report as requested; student IDs are omitted.
- Keep missing assets labeled until originals are available; obtain approval for public use of supplied branding and media.
- Check video play/pause, captions, playback seek and return navigation after real recordings arrive.
- Rehearse narration and media within the 14:20 plan / 15-minute limit.

No availability, security-performance or successful deployment claims are implied by a passing frontend build. Host/device redundancy and IDEA 3 integration remain subject to the report's limits.

## Rollback

Redeploy the previously approved static commit through the Vercel dashboard. There are no migrations or production AEGIS data changes to reverse.

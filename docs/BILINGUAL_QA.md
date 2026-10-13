# V3 bilingual QA

This section records the original 18-scene V3 bilingual pass. The later 19-scene closing update is checked in [SCENE_19_QA.md](SCENE_19_QA.md). The implementation retains the existing TH/EN provider, local-storage preference, current scene/hash and selected interactive states. English is the source text; report titles, notes and source interpretations are paired with Thai beside their records. The UI dictionary supplies controls, captions, descriptions and findings.

Natural Thai keeps NAS, VLAN, Twingate, Cloudflare, Docker, TLS, RBAC, SHA-256 and assessment tools where appropriate. Student IDs and both owner-approved name spellings remain exactly on the cover. Verified numerical values and test conditions are unchanged between languages.

Executed checks (13 October 2026):

- npm run check validates translations for every scene title/note, source record, diagram node/edge, core feature and asset label.
- All 18 scenes rendered in both modes. Language switching preserved the scene/hash, gallery and selected diagram node; persistence and unavailable-storage fallback passed.
- TH and EN all-scene mobile reflow tests passed at 390×844. Both languages fit the fixed 1920×1080 canvas; final browser captures returned no footer overlap or horizontal clipping.
- Required TH/EN screenshots are in docs/screenshots/v3/. Mobile and intermediate inspection captures are kept locally under .impeccable/review/v3/.
- Representative automated accessibility checks passed at serious/critical severity; hardware inspection passed keyboard and synthesized Chromium touch tests.

No claim is made about every physical phone/browser, screen reader combination or projector. See QA_REPORT.md for the executed suite and remaining owner media/rehearsal checks.

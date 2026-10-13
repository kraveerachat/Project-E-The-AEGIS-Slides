# Scene 19 — Thank You / Q&A verification

Verified 13 October 2026 against the isolated `codex/scene-19-thank-you` branch.

| Check | Result |
|---|---|
| `npm run check` | PASS — 19 ordered scenes; 890 seconds (14:50), leaving 10 seconds within the 15-minute limit; 24 asset records and 19 intentionally missing real media assets |
| `npm run build` | PASS — TypeScript and Vite static build |
| `npm test` | PASS — 28 Playwright tests, including Scene 19 identity, language, timing, assets, footer actions, keyboard, reduced motion, print styling and small landscape touch target |
| TH / EN at 1920×1080 | PASS — [Thai](screenshots/scene-19/thank-you-th.png) and [English](screenshots/scene-19/thank-you-en.png) captures reviewed; all text, three student cards and footer remain inside the frame |
| Closing navigation | PASS — no prior chapter is marked current on Scene 19; Back to Home returns to cover by button or Right Arrow; Left Arrow returns to Scene 18 |
| Reduced motion / print | PASS — entrance motion is skipped in reduced motion; hover lift is suppressed; artwork and text remain visible while the footer is hidden in print styling |

The closing scene uses the existing SUT emblem, AEGIS mark and decorative monument artwork. Student names and IDs come from the existing verified project data; the official Final Report title is reused. No production backend or new real media asset is required. The 15-second target is a speaking plan and still needs a human rehearsal to confirm the final recording length.

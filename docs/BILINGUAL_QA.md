# Thai and English presentation review

The reviewed `main` version is the English-only baseline. The update keeps the same 17 scene IDs and report-backed claims. Thai is now the initial language; the TH | EN control is present in the footer of every scene. The three IDs and both name spellings match the owner's supplied records.

## Visual comparison

All captures are 1920×1080. `before-en-*` was captured from reviewed `origin/main` (`2a2fd93`) with the original fonts. The baseline had no Thai mode, so a `before-th-*` state does not exist. `after-th-*` and `after-en-*` show the completed bilingual update.

| Scene | Before EN | After TH | After EN |
|---|---|---|---|
| Cover | [image](screenshots/i18n/before-en-cover.png) | [image](screenshots/i18n/after-th-cover.png) | [image](screenshots/i18n/after-en-cover.png) |
| Background | [image](screenshots/i18n/before-en-background.png) | [image](screenshots/i18n/after-th-background.png) | [image](screenshots/i18n/after-en-background.png) |
| Network architecture | [image](screenshots/i18n/before-en-network.png) | [image](screenshots/i18n/after-th-network.png) | [image](screenshots/i18n/after-en-network.png) |
| IDEA 1 features | [image](screenshots/i18n/before-en-drive-features.png) | [image](screenshots/i18n/after-th-drive-features.png) | [image](screenshots/i18n/after-en-drive-features.png) |
| IDEA 2 architecture | [image](screenshots/i18n/before-en-monitor-architecture.png) | [image](screenshots/i18n/after-th-monitor-architecture.png) | [image](screenshots/i18n/after-en-monitor-architecture.png) |
| IDEA 3 pending | [image](screenshots/i18n/before-en-security.png) | [image](screenshots/i18n/after-th-security.png) | [image](screenshots/i18n/after-en-security.png) |
| Source and speaker notes | [image](screenshots/i18n/before-en-sources.png) | [image](screenshots/i18n/after-th-sources.png) | [image](screenshots/i18n/after-en-sources.png) |

[Closing TH](screenshots/i18n/after-th-ending.png) · [Closing EN](screenshots/i18n/after-en-ending.png)

Mobile reading captures: [Cover TH](screenshots/i18n/after-th-cover-mobile.png) · [Cover EN](screenshots/i18n/after-en-cover-mobile.png) · [Closing TH](screenshots/i18n/after-th-ending-mobile.png) · [Closing EN](screenshots/i18n/after-en-ending-mobile.png).

## Verification

- `npm run check`: 17 scenes, source/asset references, exact student records and Thai coverage of scene notes, sources, diagram records, feature records and media labels.
- `npm test`: **14 passed** in Chrome. Coverage includes both languages, navigation and persistence, localStorage failure fallback, scene/render checks, missing-media behavior, mobile horizontal overflow, diagram and gallery state, and automated accessibility checks.
- `npm run build`: **passed**, producing Vercel output in `dist`.
- Browser captures: every scene inspected in both languages for text clipping into the footer; no page JavaScript errors in the capture run.

The 14 real screenshots and 3 demonstration videos remain intentionally missing. The placeholders preserve their final dimensions, and their labels are localized. No video playback claim was made without owner media.

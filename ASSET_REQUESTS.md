# Original AEGIS media requested

The layout is complete without these files. Keep missing entries marked `MISSING`; the site shows designed placeholders. Never use generated or reconstructed UI as actual system evidence.

## How to insert an asset

1. Place the approved file at the path below, relative to the repository root.
2. In `src/data/assets.ts`, change that asset's status to `AVAILABLE`. For screenshots created by the helper, add a status override to the individual entry or add a `status` argument with its default kept `MISSING`. Do not change all screenshot defaults at once.

The manifest centralizes IDs, intended scenes, type, filename, ratio, resolution, purpose, source category and status. `REPLACE` continues to show a placeholder. Incorrect/missing AVAILABLE images or videos fall back to a labeled error placeholder. Run `npm run check`, `npm run build` and `npm test` after replacing assets.

## Capture standard

Screenshots: PNG, **1920×1080 minimum**, **16:9**; preserve the real application's appearance. Frames use `object-fit: contain`, so other ratios letterbox instead of cropping. Videos: **1920×1080, 30 fps, H.264 MP4**, optional AAC audio. Keep each walkthrough short enough for its scene's narration budget. Supply `demo.en.vtt` captions beside each video when speech/audio conveys information; update the manifest if captions use another language.

Use an approved demonstration account and non-sensitive sample files. Remove credentials, active links/tokens, internal addresses, private device names, student IDs, chat IDs and unauthorized faces. Redaction is appropriate; fabricated detections or outcome labels are not.

## IDEA 1 — Drive, scene 09

| Asset ID | File to provide | Actual state to capture |
|---|---|---|
| drive-dashboard | `public/assets/screenshots/idea1/dashboard.png` | Authenticated login/dashboard overview. A separate login capture may be added later. |
| drive-files | `public/assets/screenshots/idea1/files.png` | Folders, file list and a completed upload using harmless filenames. |
| drive-vault | `public/assets/screenshots/idea1/private-vault.png` | Real Private Vault lock/unlock interface; no passphrase or private contents. |
| drive-shares | `public/assets/screenshots/idea1/secure-sharing.png` | Password/expiry/revocation settings; redact active share links. |
| drive-backup | `public/assets/screenshots/idea1/storage-backup.png` | Actual manual backup/restore or access-control view. Do not imply scheduled backup or installed RAID. |
| idea1-demo | `public/assets/videos/idea1/demo.mp4` | File management → Vault → create/revoke a controlled share. |

## IDEA 2 — Monitor, scene 12

| Asset ID | File to provide | Actual state to capture |
|---|---|---|
| monitor-live | `public/assets/screenshots/idea2/operator-live.png` | Operator live view with an approved real camera stream. |
| monitor-detection | `public/assets/screenshots/idea2/detection.png` | Genuine Authorized/Unknown detection, with publication permission. |
| monitor-soc | `public/assets/screenshots/idea2/soc-monitoring.png` | Actual passive SOC view and node/logical-camera identity. |
| monitor-archive | `public/assets/screenshots/idea2/archive.png` | Playable real clip and archive controls/provenance. |
| monitor-alert | `public/assets/screenshots/idea2/alert.png` | Actual recorded alert/event; remove Telegram chat IDs, bot tokens and personal information. |
| idea2-demo | `public/assets/videos/idea2/demo.mp4` | Viewer demand → live detection → close clip → archive playback. |

## IDEA 3 — Security, scene 14

Supply these only after verifying the associated implementation. Adding media does not automatically change the chapter's pending status.

| Asset ID | File to provide | Evidence needed |
|---|---|---|
| security-gui | `public/assets/screenshots/idea3/security-gui.png` | Actual Security GUI/Web UI. |
| security-incident | `public/assets/screenshots/idea3/incident.png` | Actual detected incident and corresponding test case. |
| security-response | `public/assets/screenshots/idea3/response.png` | Observed response, test method/date and limitations. |
| security-hardware | `public/assets/screenshots/idea3/hardware.png` | Actual hardware/control evidence supported by testing. |
| idea3-demo | `public/assets/videos/idea3/demo.mp4` | A verified detection-to-response walkthrough. |

Update `sources.idea3`, `sources.integration`, the scene speaker notes and chapter copy when the new evidence is approved. Retain limitations that still apply.

## Already available

Original SUT emblem and AEGIS project mark are in `public/assets/branding/`, unchanged. Decorative monument artwork is in `public/assets/generated/` and labeled `GENERATED`; it is not a documentary photograph or system evidence. See `docs/ASSET_PROVENANCE.md`.

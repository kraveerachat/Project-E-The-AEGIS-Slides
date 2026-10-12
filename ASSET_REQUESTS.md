# Original AEGIS media requests - V3

The 18-scene layout works with missing media. Keep each entry MISSING until an approved original file is ready. The hardware photographs and both original logos are already available. IDEA 3 is an assessment and has no independent application/video demonstration.

## Insert media

1. Add the approved file at the exact path below.
2. Change only that record to AVAILABLE in src/data/assets.ts. Helper-created records can be overridden as `{ ...screenshot(...), status: 'AVAILABLE' }` or `{ ...video(...), status: 'AVAILABLE' }`. Keep other records MISSING.
3. Run npm run check, npm run build and npm test.

Optional captions: place a VTT beside the recording and set that video's captions field to its path relative to public/assets. Posters have separate manifest IDs; change their status when supplied. No component changes are needed.

## Capture standard and recording plan

PNG screenshots/posters: 16:9, 1920×1080 minimum. MP4: H.264, 1920×1080, 30 fps, optional AAC audio. Native controls support play/pause, seeking, volume and fullscreen. Playback enters Presentation Video Mode, returns on end/exit and never advances the scene automatically. Print uses the approved poster or a labeled static frame.

Both demonstrations have a 90-second editing slot:
- IDEA 1: Dashboard → Files → Private Vault → Secure Shares → Revoke.
- IDEA 2: Operator Live → Detection → SOC Passive → Archive → Telegram / Logout.

These are prepared editing sequences, not claims that every operation completes live in 90 seconds. Show actual authorized behavior. Redact cookies, credentials, active links/tokens, internal addresses, private device names, chat IDs and unapproved personal/face data. Preserve the test conditions and outcome. Never reconstruct an interface or generate a hardware photograph as evidence.

## Missing files (19)

| Asset ID | Intended scene | File to provide | Original capture needed |
|---|---|---|---|
| drive-dashboard | 10 — IDEA 1 Real UI Demonstration | `public/assets/screenshots/idea1/dashboard.png` | Show the actual authenticated Drive overview using a sanitized demonstration account. Capture login separately if desired. |
| drive-files | 10 — IDEA 1 Real UI Demonstration | `public/assets/screenshots/idea1/files.png` | Show the real file list, folders and completed upload state. Use non-sensitive sample filenames. |
| drive-vault | 10 — IDEA 1 Real UI Demonstration | `public/assets/screenshots/idea1/private-vault.png` | Show the actual Vault interface and its lock/unlock state without revealing passphrases or private file content. |
| drive-shares | 10 — IDEA 1 Real UI Demonstration | `public/assets/screenshots/idea1/secure-sharing.png` | Show password, expiry and revocation controls. Redact active share tokens and links. |
| drive-backup | 10 — IDEA 1 Real UI Demonstration | `public/assets/screenshots/idea1/storage-backup.png` | Show the actual manual backup/restore or access-control screen. Do not imply a verified schedule or installed RAID. |
| monitor-live | 12 — IDEA 2 Real UI Demonstration | `public/assets/screenshots/idea2/operator-live.png` | Show an approved camera stream with operator controls. Blur faces and private surroundings unless publication is authorized. |
| monitor-detection | 12 — IDEA 2 Real UI Demonstration | `public/assets/screenshots/idea2/detection.png` | Show a real Authorized/Unknown detection state with permission to show the subject. No synthetic bounding boxes. |
| monitor-soc | 12 — IDEA 2 Real UI Demonstration | `public/assets/screenshots/idea2/soc-monitoring.png` | Show actual SOC passive viewing with Node and logical camera identity; redact personal device names. |
| monitor-archive | 12 — IDEA 2 Real UI Demonstration | `public/assets/screenshots/idea2/archive.png` | Show an actual playable clip, provenance and archive controls. Redact filenames or identities if needed. |
| monitor-alert | 12 — IDEA 2 Real UI Demonstration | `public/assets/screenshots/idea2/alert.png` | Show a real recorded event or approved Telegram alert. Remove phone numbers, chat IDs, bot tokens and faces without consent. |
| security-zap | 17 — Security Assessment Findings | `public/assets/screenshots/idea3/zap-passive.png` | Owner-approved redacted ZAP summary, linked to §4.6.3; preserve alert-type scope. |
| security-burp | 17 — Security Assessment Findings | `public/assets/screenshots/idea3/burp-session-rbac.png` | Actual redacted HTTP status evidence from §4.6.4. Hide cookies, tokens and personal data. |
| security-canary | 17 — Security Assessment Findings | `public/assets/screenshots/idea3/canary-integrity.png` | Original 65-byte SHA-256/cmp result from §4.6.5 with private paths removed. |
| security-tls | 17 — Security Assessment Findings | `public/assets/screenshots/idea3/tls-exposure.png` | Original protocol and limited-port evidence from §4.6.7–4.6.8; redact private addresses. |
| security-gitleaks | 17 — Security Assessment Findings | `public/assets/screenshots/idea3/gitleaks-redacted.png` | Redacted current-source summary from §4.6.6 without potential secret values. |
| idea1-poster | 10 — IDEA 1 Real UI Demonstration | `public/assets/screenshots/idea1/demo-poster.png` | Real redacted still from the forthcoming Drive recording; used in print and before playback. |
| idea2-poster | 12 — IDEA 2 Real UI Demonstration | `public/assets/screenshots/idea2/demo-poster.png` | Real redacted still from the forthcoming Monitor recording; used in print and before playback. |
| idea1-demo | 10 — IDEA 1 Real UI Demonstration | `public/assets/videos/idea1/idea1-demo.mp4` | An owner-approved screen recording of AEGIS Drive. Use a short continuous walkthrough with no credentials or personal data. |
| idea2-demo | 12 — IDEA 2 Real UI Demonstration | `public/assets/videos/idea2/idea2-demo.mp4` | An owner-approved screen recording of AEGIS Monitor. Use a short continuous walkthrough with no credentials or personal data. |

All missing assets are REAL. Wrong/missing AVAILABLE files fall back to labeled placeholders. Complete metadata (type, ratio, resolution, source and status) is in docs/ASSET_MANIFEST.md; the authoritative manifest remains src/data/assets.ts.

## Available original hardware

- public/assets/hardware/equipment-setup.png - original Figure 3.6-12, 3072×4096.
- public/assets/hardware/lan-cable-switch.png - original Figure 3.6-13, 4096×3072.

Both copies retain the owner's original bytes. The main slide uses a documentary detail crop; inspection opens the full original. The photographs establish physical arrangement only. Speed, VLAN, port status and reachability rely on separate configuration/test evidence.

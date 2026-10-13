import { readFileSync, writeFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
const { assets } = await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(readFileSync('src/data/assets.ts','utf8'))).toString('base64')}`)
const clean = value => String(value).replaceAll('|','\\|')
const missing = assets.filter(asset=>asset.status!=='AVAILABLE')
const requests = `# Original AEGIS media requests - V3

The 19-scene layout works with missing media. Keep each entry MISSING until an approved original file is ready. The hardware photographs and both original logos are already available. IDEA 3 is an assessment and has no independent application/video demonstration.

## Insert media

1. Add the approved file at the exact path below.
2. Change only that record to AVAILABLE in src/data/assets.ts. Helper-created records can be overridden as \`{ ...screenshot(...), status: 'AVAILABLE' }\` or \`{ ...video(...), status: 'AVAILABLE' }\`. Keep other records MISSING.
3. Run npm run check, npm run build and npm test.

Optional captions: place a VTT beside the recording and set that video's captions field to its path relative to public/assets. Posters have separate manifest IDs; change their status when supplied. No component changes are needed.

## Capture standard and recording plan

PNG screenshots/posters: 16:9, 1920×1080 minimum. MP4: H.264, 1920×1080, 30 fps, optional AAC audio. Native controls support play/pause, seeking, volume and fullscreen. Playback enters Presentation Video Mode, returns on end/exit and never advances the scene automatically. Print uses the approved poster or a labeled static frame.

Both demonstrations have a 90-second editing slot:
- IDEA 1: Dashboard → Files → Private Vault → Secure Shares → Revoke.
- IDEA 2: Operator Live → Detection → SOC Passive → Archive → Telegram / Logout.

These are prepared editing sequences, not claims that every operation completes live in 90 seconds. Show actual authorized behavior. Redact cookies, credentials, active links/tokens, internal addresses, private device names, chat IDs and unapproved personal/face data. Preserve the test conditions and outcome. Never reconstruct an interface or generate a hardware photograph as evidence.

## Missing files (${missing.length})

| Asset ID | Intended scene | File to provide | Original capture needed |
|---|---|---|---|
${missing.map(a=>`| ${a.id} | ${clean(a.intendedScene)} | \`public/assets/${a.expectedFilename}\` | ${clean(a.purpose)} |`).join('\n')}

All missing assets are REAL. Wrong/missing AVAILABLE files fall back to labeled placeholders. Complete metadata (type, ratio, resolution, source and status) is in docs/ASSET_MANIFEST.md; the authoritative manifest remains src/data/assets.ts.

## Available original hardware

- public/assets/hardware/equipment-setup.png - original Figure 3.6-12, 3072×4096.
- public/assets/hardware/lan-cable-switch.png - original Figure 3.6-13, 4096×3072.

Both copies retain the owner's original bytes. The main slide uses a documentary detail crop; inspection opens the full original. The photographs establish physical arrangement only. Speed, VLAN, port status and reachability rely on separate configuration/test evidence.
`
writeFileSync('ASSET_REQUESTS.md', requests)
writeFileSync('docs/ASSET_MANIFEST.md',`# V3 asset manifest\n\nGenerated from src/data/assets.ts.\n\n| ID | Scene | Type | Expected filename | Ratio | Required resolution | Purpose | Source | Status |\n|---|---|---|---|---|---|---|---|---|\n${assets.map(a=>`| ${[a.id,a.intendedScene,a.type,a.expectedFilename,a.aspectRatio,a.requiredResolution,a.purpose,a.source,a.status].map(clean).join(' | ')} |`).join('\n')}\n`)
console.log(`Updated asset documents: ${assets.length} records, ${missing.length} missing.`)

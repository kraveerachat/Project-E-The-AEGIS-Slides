export type AssetStatus = 'AVAILABLE' | 'MISSING' | 'REPLACE'
export type AssetSource = 'REAL' | 'GENERATED' | 'DECORATIVE'
export interface Asset {
  id: string
  intendedScene: string
  type: 'image' | 'video'
  expectedFilename: string
  aspectRatio: string
  requiredResolution: string
  purpose: string
  source: AssetSource
  status: AssetStatus
  label: string
  alt: string
  captions?: string
  posterAssetId?: string
  captureKind?: 'photograph'
}

// Add the file under public/assets, then change ONLY its status to AVAILABLE.
// Filenames and metadata live here; media components never guess paths.
const screenshot = (id: string, idea: string, filename: string, label: string, purpose: string): Asset => ({
  id, intendedScene: idea === 'idea1' ? '10 — IDEA 1 Real UI Demonstration' : idea === 'idea2' ? '12 — IDEA 2 Real UI Demonstration' : '17 — Security Assessment Findings',
  type: 'image', expectedFilename: `screenshots/${idea}/${filename}.png`, aspectRatio: '16:9', requiredResolution: '1920×1080 minimum',
  purpose, source: 'REAL', status: 'MISSING', label, alt: label,
})
const video = (idea: string, scene: string, label: string): Asset => ({
  id: `${idea}-demo`, intendedScene: scene, type: 'video', expectedFilename: `videos/${idea}/${idea}-demo.mp4`, aspectRatio: '16:9', requiredResolution: '1920×1080, 30 fps, H.264/AAC',
  purpose: `An owner-approved screen recording of ${label}. Use a short continuous walkthrough with no credentials or personal data.`,
  source: 'REAL', status: 'MISSING', label: `${label} walkthrough`, alt: `Recorded demonstration of ${label}`, posterAssetId: `${idea}-poster`,
})

export const assets: Asset[] = [
  { id: 'sut-logo', intendedScene: 'All scenes', type: 'image', expectedFilename: 'branding/sut-standard.png', aspectRatio: 'Original', requiredResolution: 'Original supplied file', purpose: 'Original university logo; proportions and original pixels preserved.', source: 'REAL', status: 'AVAILABLE', label: 'SUT logo', alt: 'Suranaree University of Technology emblem' },
  { id: 'aegis-logo', intendedScene: 'Cover / Ending / masthead', type: 'image', expectedFilename: 'branding/aegis-mark-dark-ink.png', aspectRatio: '1:1', requiredResolution: 'Original supplied file', purpose: 'Original AEGIS project mark, separate from the typographic wordmark.', source: 'REAL', status: 'AVAILABLE', label: 'AEGIS mark', alt: 'AEGIS project mark' },
  { id: 'cover-art', intendedScene: 'Cover / Overview / Ending', type: 'image', expectedFilename: 'generated/monument-arcs.png', aspectRatio: '4:5', requiredResolution: '1122×1402', purpose: 'Decorative illustration derived from the approved cover reference. Not a documentary campus photograph or test evidence.', source: 'GENERATED', status: 'AVAILABLE', label: 'Monument and arcs', alt: 'Decorative university-inspired monument illustration with violet and blue arches' },
  screenshot('drive-dashboard', 'idea1', 'dashboard', 'Login & dashboard', 'Show the actual authenticated Drive overview using a sanitized demonstration account. Capture login separately if desired.'),
  screenshot('drive-files', 'idea1', 'files', 'File management', 'Show the real file list, folders and completed upload state. Use non-sensitive sample filenames.'),
  screenshot('drive-vault', 'idea1', 'private-vault', 'Private Vault', 'Show the actual Vault interface and its lock/unlock state without revealing passphrases or private file content.'),
  screenshot('drive-shares', 'idea1', 'secure-sharing', 'Secure Sharing', 'Show password, expiry and revocation controls. Redact active share tokens and links.'),
  screenshot('drive-backup', 'idea1', 'storage-backup', 'Storage & backup', 'Show the actual manual backup/restore or access-control screen. Do not imply a verified schedule or installed RAID.'),
  screenshot('monitor-live', 'idea2', 'operator-live', 'Operator live view', 'Show an approved camera stream with operator controls. Blur faces and private surroundings unless publication is authorized.'),
  screenshot('monitor-detection', 'idea2', 'detection', 'Detection display', 'Show a real Authorized/Unknown detection state with permission to show the subject. No synthetic bounding boxes.'),
  screenshot('monitor-soc', 'idea2', 'soc-monitoring', 'SOC monitoring', 'Show actual SOC passive viewing with Node and logical camera identity; redact personal device names.'),
  screenshot('monitor-archive', 'idea2', 'archive', 'Recording archive', 'Show an actual playable clip, provenance and archive controls. Redact filenames or identities if needed.'),
  screenshot('monitor-alert', 'idea2', 'alert', 'Detection & alert', 'Show a real recorded event or approved Telegram alert. Remove phone numbers, chat IDs, bot tokens and faces without consent.'),
  { id: 'equipment-setup', intendedScene: '05 — Actual Hardware & Network Setup', type: 'image', captureKind: 'photograph', expectedFilename: 'hardware/equipment-setup.png', aspectRatio: '3:4', requiredResolution: '3072×4096 original', purpose: 'Original Figure 3.6-12 installation photograph. Evidence of physical equipment only.', source: 'REAL', status: 'AVAILABLE', label: 'Equipment Installation', alt: 'Original photograph of the MikroTik router, TP-Link managed switch and Beelink NAS installation' },
  { id: 'lan-cable-switch', intendedScene: '05 — Actual Hardware & Network Setup', type: 'image', captureKind: 'photograph', expectedFilename: 'hardware/lan-cable-switch.png', aspectRatio: '4:3', requiredResolution: '4096×3072 original', purpose: 'Original Figure 3.6-13 cabling photograph. Not proof of speed, VLAN or reachability.', source: 'REAL', status: 'AVAILABLE', label: 'Physical Network Cabling', alt: 'Original photograph of LAN cables connected to the router and managed switch during installation' },
  screenshot('security-zap','idea3','zap-passive','ZAP passive evidence','Owner-approved redacted ZAP summary, linked to §4.6.3; preserve alert-type scope.'),
  screenshot('security-burp','idea3','burp-session-rbac','Session & RBAC evidence','Actual redacted HTTP status evidence from §4.6.4. Hide cookies, tokens and personal data.'),
  screenshot('security-canary','idea3','canary-integrity','CANARY integrity evidence','Original 65-byte SHA-256/cmp result from §4.6.5 with private paths removed.'),
  screenshot('security-tls','idea3','tls-exposure','TLS & exposure evidence','Original protocol and limited-port evidence from §4.6.7–4.6.8; redact private addresses.'),
  screenshot('security-gitleaks','idea3','gitleaks-redacted','Source audit evidence','Redacted current-source summary from §4.6.6 without potential secret values.'),
  screenshot('idea1-poster','idea1','demo-poster','Drive video poster','Real redacted still from the forthcoming Drive recording; used in print and before playback.'),
  screenshot('idea2-poster','idea2','demo-poster','Monitor video poster','Real redacted still from the forthcoming Monitor recording; used in print and before playback.'),
  video('idea1', '10 — IDEA 1 Real UI Demonstration', 'AEGIS Drive'),
  video('idea2', '12 — IDEA 2 Real UI Demonstration', 'AEGIS Monitor'),
]

export const assetById = (id: string): Asset => {
  const asset = assets.find((entry) => entry.id === id)
  if (!asset) throw new Error(`Unknown presentation asset: ${id}`)
  return asset
}
export const assetUrl = (asset: Asset) => `/assets/${asset.expectedFilename}`
export const driveGallery = ['drive-dashboard', 'drive-files', 'drive-vault', 'drive-shares', 'drive-backup']
export const monitorGallery = ['monitor-live', 'monitor-detection', 'monitor-soc', 'monitor-archive', 'monitor-alert']
export const securityGallery = ['security-zap','security-burp','security-canary','security-tls','security-gitleaks']

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
}

// Add the file under public/assets, then change ONLY its status to AVAILABLE.
// Filenames and metadata live here; media components never guess paths.
const screenshot = (id: string, idea: string, filename: string, label: string, purpose: string): Asset => ({
  id, intendedScene: idea === 'idea1' ? '09 — IDEA 1 Real UI Demonstration' : idea === 'idea2' ? '12 — IDEA 2 Real UI Demonstration' : '14 — IDEA 3 Chapter',
  type: 'image', expectedFilename: `screenshots/${idea}/${filename}.png`, aspectRatio: '16:9', requiredResolution: '1920×1080 minimum',
  purpose, source: 'REAL', status: 'MISSING', label, alt: `Actual AEGIS ${label.toLowerCase()}`,
})
const video = (idea: string, scene: string, label: string): Asset => ({
  id: `${idea}-demo`, intendedScene: scene, type: 'video', expectedFilename: `videos/${idea}/demo.mp4`, aspectRatio: '16:9', requiredResolution: '1920×1080, 30 fps, H.264/AAC',
  purpose: `An owner-approved screen recording of ${label}. Use a short continuous walkthrough with no credentials or personal data.`,
  source: 'REAL', status: 'MISSING', label: `${label} walkthrough`, alt: `Recorded demonstration of ${label}`, captions: `videos/${idea}/demo.en.vtt`,
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
  screenshot('security-gui', 'idea3', 'security-gui', 'Security interface', 'Supply only an actual GUI/Web UI after implementation and verification.'),
  screenshot('security-incident', 'idea3', 'incident', 'Detection or incident', 'Show the actual detected incident with a matching test case and source reference.'),
  screenshot('security-response', 'idea3', 'response', 'Response evidence', 'Show a verified response outcome with its test method, date and limitations.'),
  screenshot('security-hardware', 'idea3', 'hardware', 'Hardware / control evidence', 'Provide a real hardware or control-state photograph only when the claimed behavior has been tested.'),
  video('idea1', '09 — IDEA 1 Real UI Demonstration', 'AEGIS Drive'),
  video('idea2', '12 — IDEA 2 Real UI Demonstration', 'AEGIS Monitor'),
  video('idea3', '14 — IDEA 3 Chapter', 'AEGIS Cyber-Physical Security'),
]

export const assetById = (id: string): Asset => {
  const asset = assets.find((entry) => entry.id === id)
  if (!asset) throw new Error(`Unknown presentation asset: ${id}`)
  return asset
}
export const assetUrl = (asset: Asset) => `/assets/${asset.expectedFilename}`
export const driveGallery = ['drive-dashboard', 'drive-files', 'drive-vault', 'drive-shares', 'drive-backup']
export const monitorGallery = ['monitor-live', 'monitor-detection', 'monitor-soc', 'monitor-archive', 'monitor-alert']
export const securityGallery = ['security-gui', 'security-incident', 'security-response', 'security-hardware']

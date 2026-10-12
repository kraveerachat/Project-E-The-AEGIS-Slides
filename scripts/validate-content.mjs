import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { stripTypeScriptTypes } from 'node:module'

async function loadData(path) {
  const output = stripTypeScriptTypes(readFileSync(path, 'utf8'))
  return import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`)
}
const { scenes, sources, totalSeconds, project, driveFeatures, contentPhrases, networkFunctions, securityFindings } = await loadData('src/data/content.ts')
const { assets } = await loadData('src/data/assets.ts')
const { diagrams } = await loadData('src/data/diagrams.ts')
const { thaiPhrases: uiPhrases } = await loadData('src/i18n/th.ts')
const thaiPhrases = {...uiPhrases,...contentPhrases}
const errors = []
const expectedSceneIds = ['cover','background','overview','network','hardware-setup','server-setup','access','network-features','drive-architecture','drive-demo','monitor-architecture','monitor-demo','network-results','performance','security-scope','security-methodology','security-findings','summary']
if (JSON.stringify(scenes.map(s=>s.id)) !== JSON.stringify(expectedSceneIds)) errors.push('Scene order differs from the approved V3 structure')
if (new Set(scenes.map(s => s.id)).size !== scenes.length) errors.push('Duplicate scene IDs')
if (totalSeconds !== 875) errors.push(`Expected 14:35 speaking budget, got ${totalSeconds}s`)
for (const id of ['drive-demo','monitor-demo']) if (scenes.find(s=>s.id===id)?.seconds !== 90) errors.push(`${id}: expected 90-second demo slot`)
if (totalSeconds > 900) errors.push(`Speaking budget exceeds 15 minutes: ${totalSeconds}s`)
for (const scene of scenes) {
  if (!scene.notes || !scene.sources.length) errors.push(`${scene.id}: missing notes or references`)
  for (const id of scene.sources) if (!sources[id]) errors.push(`${scene.id}: unknown reference ${id}`)
}
const expectedMembers = [
  ['B6701635', 'กิตติภัทร์ จันทศิลา', 'Mr. Kittiphat Chanthasila'],
  ['B6702861', 'นฤเบศ แสงประทุม', 'Mr. Narubet Saengprathum'],
  ['B6703370', 'วีรฉัตร จินะปริวัตอาภรณ์', 'Mr. Veerachat Jinapariwataporn'],
]
if (JSON.stringify(project.members.map(({id,th,en}) => [id,th,en])) !== JSON.stringify(expectedMembers)) errors.push('Student names or IDs differ from owner-supplied values')
const requireThai = (value, context) => { if (value && !Object.hasOwn(thaiPhrases,value)) errors.push(`${context}: missing Thai translation for ${value}`) }
for (const scene of scenes) { requireThai(scene.title, `scene ${scene.id} title`); requireThai(scene.notes, `scene ${scene.id} note`) }
for (const source of Object.values(sources)) { requireThai(source.title, `source ${source.id} title`); requireThai(source.note, `source ${source.id} note`) }
for (const [kind, diagram] of Object.entries(diagrams)) {
  requireThai(diagram.label, `diagram ${kind}`)
  for (const node of diagram.nodes) for (const field of ['title','subtitle','detail']) requireThai(node[field], `diagram ${kind}/${node.id} ${field}`)
  for (const edge of diagram.edges) requireThai(edge.label, `diagram ${kind} edge`)
}
for (const feature of driveFeatures) for (const field of ['title','text','detail']) requireThai(feature[field], `Drive feature ${feature.title} ${field}`)
for (const row of networkFunctions) for (const value of row) if (!/^(VLAN|Routing|UFW|Twingate|NGINX|Public Share)/.test(value)) requireThai(value,'network function')
for (const finding of securityFindings) for (const field of ['title','result','next']) requireThai(finding[field],`security ${finding.status}`)
if (project.fullTitle !== 'AEGIS: Local Data Center, Monitoring, Network Infrastructure and Security Assessment') errors.push('Official final-report title differs')
for (const asset of assets.filter(asset => asset.source === 'REAL' && asset.id !== 'sut-logo' && asset.id !== 'aegis-logo')) requireThai(asset.label, `asset ${asset.id} label`)
if (new Set(assets.map(a => a.id)).size !== assets.length) errors.push('Duplicate asset IDs')
for (const asset of assets) {
  for (const field of ['id','intendedScene','type','expectedFilename','aspectRatio','requiredResolution','purpose','source','status']) if (!asset[field]) errors.push(`${asset.id}: missing ${field}`)
  if (asset.expectedFilename.includes('..') || asset.expectedFilename.includes(':')) errors.push(`${asset.id}: unsafe asset path`)
  if (asset.status === 'AVAILABLE' && !existsSync(resolve('public/assets',asset.expectedFilename))) errors.push(`${asset.id}: available file does not exist`)
}
const walk = dir => readdirSync(dir,{ withFileTypes:true }).flatMap(f => f.isDirectory() ? walk(`${dir}/${f.name}`) : [`${dir}/${f.name}`])
for (const file of [...walk('src'), 'index.html']) {
  const content = readFileSync(file,'utf8')
  if (/C:\\Users|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+/.test(content)) errors.push(`${file}: local path or internal address in public application source`)
  if (/(?:ghp_|sk_live_|AKIA)[A-Za-z0-9]{12,}/.test(content)) errors.push(`${file}: possible credential`)
  if (/Round 11|Cyber-Physical|MQTT|ESP32|physical lockdown/i.test(content)) errors.push(`${file}: obsolete project description`)
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1) }
console.log(`Content check passed: ${scenes.length} scenes; ${Math.floor(totalSeconds/60)}m ${totalSeconds%60}s speaking budget; ${assets.length} asset records; ${assets.filter(a=>a.status==='MISSING').length} missing real media assets intentionally reserved.`)
console.log('All scene sources resolve; available files exist; no local runtime paths, private IPv4 addresses or common credential signatures in application source.')

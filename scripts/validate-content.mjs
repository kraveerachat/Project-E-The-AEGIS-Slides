import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { stripTypeScriptTypes } from 'node:module'

async function loadData(path) {
  const output = stripTypeScriptTypes(readFileSync(path, 'utf8'))
  return import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`)
}
const { scenes, sources, totalSeconds } = await loadData('src/data/content.ts')
const { assets } = await loadData('src/data/assets.ts')
const errors = []
if (scenes.length !== 17) errors.push(`Expected 17 scenes, got ${scenes.length}`)
if (new Set(scenes.map(s => s.id)).size !== 17) errors.push('Duplicate scene IDs')
if (totalSeconds > 900) errors.push(`Speaking budget exceeds 15 minutes: ${totalSeconds}s`)
for (const scene of scenes) {
  if (!scene.notes || !scene.sources.length) errors.push(`${scene.id}: missing notes or references`)
  for (const id of scene.sources) if (!sources[id]) errors.push(`${scene.id}: unknown reference ${id}`)
}
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
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1) }
console.log(`Content check passed: ${scenes.length} scenes; ${Math.floor(totalSeconds/60)}m ${totalSeconds%60}s speaking budget; ${assets.length} asset records; ${assets.filter(a=>a.status==='MISSING').length} missing real media assets intentionally reserved.`)
console.log('All scene sources resolve; available files exist; no local runtime paths, private IPv4 addresses or common credential signatures in application source.')

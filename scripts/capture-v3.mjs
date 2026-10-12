import { chromium } from '@playwright/test'
import { stripTypeScriptTypes } from 'node:module'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
const { scenes } = await import('data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(await readFile('src/data/content.ts','utf8'))).toString('base64'))
const url = process.argv[2] || 'http://127.0.0.1:5193'
const selected = new Set(['cover','network','hardware-setup','server-setup','access','drive-demo','monitor-demo','security-findings','summary'])
await mkdir('docs/screenshots/v3',{recursive:true})
await mkdir('.impeccable/review/v3',{recursive:true})
const browser = await chromium.launch({channel:'chrome'})
const findings=[]
for (const language of ['th','en']) {
  const context=await browser.newContext({viewport:{width:1920,height:1080},reducedMotion:'reduce'})
  await context.addInitScript(lang=>localStorage.setItem('aegis-presentation-language',lang),language)
  const page=await context.newPage()
  for (const scene of scenes) {
    await page.goto(`${url}/#${scene.id}`,{waitUntil:'networkidle'})
    await page.evaluate(()=>document.fonts.ready)
    await page.screenshot({path:`${selected.has(scene.id)?'docs/screenshots/v3':'.impeccable/review/v3'}/${language}-${scene.id}.png`})
    const overflow=await page.locator('main').evaluate(el=> {
      const foot=document.querySelector('.presentation-footer').getBoundingClientRect()
      return [...el.querySelectorAll('h1,h2,h3,p,button,figure,table,.evidence-panel,.diagram-stage')].filter(n=> {
        if (n.closest('dialog') || n.closest('.scene-cover')) return false
        const r=n.getBoundingClientRect()
        return r.width && r.height && (r.bottom>foot.top+3 || r.right>1920 || r.left<0)
      }).map(n=>({text:n.textContent.slice(0,70),class:n.className,bottom:Math.round(n.getBoundingClientRect().bottom)}))
    })
    findings.push({language,scene:scene.id,overflow})
  }
  await page.setViewportSize({width:390,height:844})
  for(const id of ['cover','hardware-setup','security-findings']) {
    await page.goto(`${url}/#${id}`,{waitUntil:'networkidle'})
    await page.screenshot({path:`.impeccable/review/v3/${language}-mobile-${id}.png`,fullPage:true})
    findings.push({language,scene:`mobile-${id}`,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)})
  }
  await page.setViewportSize({width:1440,height:900})
  await page.goto(`${url}/#hardware-setup`,{waitUntil:'networkidle'})
  await page.screenshot({path:`.impeccable/review/v3/${language}-intermediate.png`})
  await context.close()
}
await writeFile('.impeccable/review/v3/layout.json',JSON.stringify(findings,null,2))
console.log(JSON.stringify(findings.filter(f=>Array.isArray(f.overflow)?f.overflow.length:f.overflow),null,2))
await browser.close()

import { chromium } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { stripTypeScriptTypes } from 'node:module'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
const { scenes } = await import('data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(await readFile('src/data/content.ts','utf8'))).toString('base64'))
await mkdir('.impeccable/review',{recursive:true})
const browser = await chromium.launch({channel:'chrome'})
const context = await browser.newContext({viewport:{width:1920,height:1080},reducedMotion:'reduce'})
const page = await context.newPage()
const results=[]
for (const scene of scenes) {
  await page.goto(`http://127.0.0.1:5174/#${scene.id}`)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({path:`.impeccable/review/${scene.id}.png`,fullPage:true})
  const overflow=await page.locator('main').evaluate(el=>[...el.querySelectorAll('h1,h2,h3,p,button,.evidence-panel,.diagram-stage,.gallery-tabs,.video-frame')].filter(n=>{const r=n.getBoundingClientRect();return r.width&&r.height&&r.bottom>document.querySelector('.presentation-footer').getBoundingClientRect().top+3}).map(n=>({text:n.textContent.slice(0,65),bottom:Math.round(n.getBoundingClientRect().bottom)})))
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
  results.push({scene:scene.id,overflow,violations:axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))})
}
await page.setViewportSize({width:1440,height:900})
await page.goto('http://127.0.0.1:5174/#overview')
await page.screenshot({path:'.impeccable/review/user-1440.png',fullPage:true})
await page.setViewportSize({width:390,height:844})
for(const id of ['cover','network','drive-demo','security']) {
 await page.goto(`http://127.0.0.1:5174/#${id}`)
 await page.screenshot({path:`.impeccable/review/mobile-${id}.png`,fullPage:true})
}
await writeFile('.impeccable/review/checks.json',JSON.stringify(results,null,2))
console.log(JSON.stringify(results.filter(r=>r.overflow.length||r.violations.length),null,2))
await browser.close()

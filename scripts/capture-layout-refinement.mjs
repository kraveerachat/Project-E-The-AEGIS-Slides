import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'

const phase = process.argv[2] || 'after'
if (!['before', 'after'].includes(phase)) throw new Error('Use before or after')
const url = process.argv[3] || 'http://127.0.0.1:5193'
const ids = ['hardware-setup', 'drive-demo', 'monitor-demo']
const output = `docs/screenshots/layout-refinement/${phase}`
const review = '.impeccable/review/layout-refinement'
await mkdir(output, { recursive: true })
await mkdir(review, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
const findings = []
for (const language of ['th', 'en']) {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' })
  await context.addInitScript(lang => localStorage.setItem('aegis-presentation-language', lang), language)
  const page = await context.newPage()
  for (const id of ids) {
    await page.goto(`${url}/#${id}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: `${output}/${language}-${id}.png` })
    if (phase === 'after') {
      const overflow = await page.locator('main').evaluate(el => {
        const footer = document.querySelector('.presentation-footer').getBoundingClientRect()
        return [...el.querySelectorAll('h1,h2,h3,p,figure,li,.equipment-callouts')].filter(n => {
          if (n.closest('dialog')) return false
          const r = n.getBoundingClientRect()
          return r.width && r.height && (r.bottom > footer.top + 3 || r.right > innerWidth || r.left < 0)
        }).map(n => ({ text: n.textContent.slice(0, 70), class: n.className, bottom: n.getBoundingClientRect().bottom, footer: footer.top }))
      })
      findings.push({ language, scene: id, overflow })
    }
  }
  if (phase === 'after') {
    await page.setViewportSize({ width: 390, height: 844 })
    for (const id of ids) {
      await page.goto(`${url}/#${id}`, { waitUntil: 'networkidle' })
      await page.screenshot({ path: `${review}/${language}-mobile-${id}.png`, fullPage: true })
      findings.push({ language, scene: `mobile-${id}`, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1) })
    }
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${url}/#hardware-setup`, { waitUntil: 'networkidle' })
    await page.screenshot({ path: `${review}/${language}-intermediate.png` })
  }
  await context.close()
}
await browser.close()
if (phase === 'after') await writeFile(`${review}/layout.json`, JSON.stringify(findings, null, 2))
console.log(JSON.stringify({ phase, captures: 6, overflow: findings.filter(f => Array.isArray(f.overflow) ? f.overflow.length : f.overflow) }))

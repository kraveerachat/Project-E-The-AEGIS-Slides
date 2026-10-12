import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'

// Local QA artifacts are ignored by Git; this does not regenerate the full deck.
const output = '.impeccable/review/layout-refinement/print'
const url = process.argv[2] || 'http://127.0.0.1:5193'
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome' })
for (const language of ['th', 'en']) {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' })
  await context.addInitScript(lang => localStorage.setItem('aegis-presentation-language', lang), language)
  const page = await context.newPage()
  for (const id of ['hardware-setup', 'drive-demo', 'monitor-demo']) {
    await page.goto(`${url}/#${id}`, { waitUntil: 'networkidle' })
    await page.evaluate(() => document.fonts.ready)
    await page.pdf({ path: `${output}/${language}-${id}.pdf`, printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false })
  }
  await context.close()
}
await browser.close()
console.log(`Saved six print QA pages in ${output}`)

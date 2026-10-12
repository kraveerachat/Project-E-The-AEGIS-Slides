import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
const baseURL = process.env.AEGIS_URL || 'http://127.0.0.1:5173'
const shots = ['cover','background','network','drive-features','monitor-architecture','security','ending']
const ids = ['cover','background','objectives','overview','network','access','shared','drive-architecture','drive-features','drive-demo','drive-results','monitor-architecture','monitor-demo','monitor-results','security','summary','ending']
mkdirSync('docs/screenshots/i18n', { recursive: true })
for (const language of ['th','en']) {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' })
  await context.addInitScript(value => localStorage.setItem('aegis-presentation-language', value), language)
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  for (const id of ids) {
    await page.goto(`${baseURL}/#${id}`)
    await page.locator('main[aria-busy="false"]').waitFor()
    await page.waitForTimeout(80)
    const state = await page.evaluate(async () => {
      const { thaiPhrases } = await import('/src/i18n/th.ts')
      const main = document.querySelector('main')
      const footer = document.querySelector('.presentation-footer').getBoundingClientRect()
      const bad = [...main.querySelectorAll('h1,h2,h3,p,button,.evidence-panel,.diagram-stage,.gallery-tabs,.video-frame')].filter(child => {
        if (child.closest('.scene-cover,.scene-ending')) return false
        const r = child.getBoundingClientRect()
        return r.width && r.height && (r.bottom > footer.top + 3 || r.right > 1918 || r.left < -1)
      }).map(el => `${el.tagName}:${el.textContent?.slice(0,35)}`)
      const walker = document.createTreeWalker(document.getElementById('root'), NodeFilter.SHOW_TEXT)
      const untranslated = []
      while (walker.nextNode()) {
        const value = walker.currentNode.nodeValue?.trim()
        if (value && Object.hasOwn(thaiPhrases,value) && thaiPhrases[value] !== value) untranslated.push(value)
      }
      return { bad, untranslated, lang: document.documentElement.lang }
    })
    if (state.bad.length || language === 'th' && state.untranslated.length || state.lang !== language) console.log(`${language}/${id}: ${JSON.stringify(state)}`)
    if (shots.includes(id)) await page.screenshot({ path: `docs/screenshots/i18n/after-${language}-${id}.png` })
  }
  await page.locator('.utility-controls > button').nth(1).click()
  await page.locator('dialog[open]').waitFor()
  await page.screenshot({ path: `docs/screenshots/i18n/after-${language}-sources.png` })
  await page.keyboard.press('Escape')
  await page.setViewportSize({ width: 390, height: 844 })
  for (const id of ['cover','ending']) {
    await page.goto(`${baseURL}/#${id}`)
    await page.locator('main[aria-busy="false"]').waitFor()
    await page.screenshot({ path: `docs/screenshots/i18n/after-${language}-${id}-mobile.png`, fullPage: true })
  }
  console.log(`${language}: ${errors.length} page errors`, errors)
  await context.close()
}
await browser.close()

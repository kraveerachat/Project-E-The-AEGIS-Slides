import { chromium } from '@playwright/test'
import { existsSync, mkdirSync, readFileSync } from 'node:fs'
import { extname, join } from 'node:path'

if (!existsSync('dist/index.html')) throw new Error('Run npm run build before capturing the closing scene.')

const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' })
const output = 'docs/screenshots/scene-19'
mkdirSync(output, { recursive: true })
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2' }

for (const language of ['th', 'en']) {
  const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, reducedMotion: 'reduce' })
  await context.addInitScript(lang => localStorage.setItem('aegis-presentation-language', lang), language)
  const page = await context.newPage()
  await page.route('https://aegis.local/**', async route => {
    const pathname = new URL(route.request().url()).pathname
    const file = join(process.cwd(), 'dist', pathname === '/' ? 'index.html' : pathname.slice(1))
    if (!existsSync(file)) return route.fulfill({ status: 404, body: '' })
    await route.fulfill({ status: 200, contentType: mime[extname(file)] || 'application/octet-stream', body: readFileSync(file) })
  })
  await page.goto('https://aegis.local/#thank-you')
  await page.locator('main[data-scene-id="thank-you"][aria-busy="false"]').waitFor()
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: `${output}/thank-you-${language}.png`, animations: 'disabled' })
  await context.close()
}

await browser.close()
console.log(`Captured TH and EN closing scenes at 1920×1080 in ${output}.`)

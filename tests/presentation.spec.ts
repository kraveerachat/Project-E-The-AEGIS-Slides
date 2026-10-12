import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { scenes } from '../src/data/content'

// The legacy assertions below check the original English copy explicitly.
test.beforeEach(async ({ page }) => { await page.addInitScript(() => localStorage.setItem('aegis-presentation-language', 'en')) })

test('all configured scenes render, fit the recording canvas and retain source references', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const scene of scenes) {
    await page.goto(`/#${scene.id}`)
    await expect(page.locator('main')).toHaveAttribute('data-scene-id', scene.id)
    await expect(page.locator('main h1')).toBeVisible()
    await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
    const bounds = await page.locator('.presentation-stage').boundingBox()
    expect(bounds?.width).toBe(1920); expect(bounds?.height).toBe(1080)
    const overflow = await page.locator('main').evaluate(el => {
      const footer = document.querySelector('.presentation-footer')!.getBoundingClientRect()
      const out = [...el.querySelectorAll('h1,h2,h3,p,button,.evidence-panel,.diagram-stage,.gallery-tabs,.video-frame')].filter(child => {
        if (child.closest('.scene-cover,.scene-ending')) return false
        const r = child.getBoundingClientRect()
        return r.width && r.height && (r.bottom > footer.top + 3 || r.right > 1918 || r.left < -1)
      })
      return out.map(n => ({ text: n.textContent?.slice(0,80), class: n.className, bottom: Math.round(n.getBoundingClientRect().bottom) }))
    })
    expect(overflow, `${scene.id}: content must not overlap footer or clip horizontally`).toEqual([])
    await page.getByRole('button', { name: 'Open report sources and speaker notes' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.locator('.source-list article')).toHaveCount(scene.sources.length)
    await page.keyboard.press('Escape')
  }
  expect(errors).toEqual([])
})

test('keyboard, chapter links, chooser, fullscreen and reverse transitions work', async ({ page }) => {
  await page.goto('/#cover')
  await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('main')).toHaveAttribute('data-scene-id', 'background')
  await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('main')).toHaveAttribute('data-scene-id', 'cover')
  await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
  await page.getByRole('button', { name: 'Idea 2', exact: true }).click()
  await expect(page.locator('main')).toHaveAttribute('data-scene-id', 'monitor-architecture')
  await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
  await page.getByRole('button', { name: `Open all ${scenes.length} scenes` }).click()
  await expect(page.locator('.scene-picker button')).toHaveCount(scenes.length)
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('main')).toHaveAttribute('data-scene-id', 'monitor-architecture')
  await page.getByRole('button', { name: /Network evidence/ }).click()
  await expect(page.locator('main')).toHaveAttribute('data-scene-id', 'network-results')
  await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
  await page.keyboard.press('f')
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(true)
  await page.keyboard.press('Escape')
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(false)
})

test('rapid navigation is bounded and never leaves a hidden or stuck scene', async ({ page }) => {
  await page.goto('/#cover')
  await expect(page.locator('main')).toHaveAttribute('aria-busy','false')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowRight')
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('main')).toHaveAttribute('aria-busy','false')
  await expect(page.locator('main')).toHaveAttribute('data-scene-id','background')
  await expect(page.locator('main')).toHaveCSS('opacity','1')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('main')).toHaveAttribute('data-scene-id','overview')
})

test('demo placeholders, retained evidence gallery and diagram interactions work', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const id of ['drive-demo','monitor-demo']) {
    await page.goto(`/#${id}`)
    await expect(page.locator('.gallery-tabs')).toHaveCount(0)
    await expect(page.locator('.video-frame')).toHaveCount(1)
    await expect(page.locator('.video-frame .placeholder-state')).toHaveText('Real recording coming next')
    await expect(page.locator('video')).toHaveCount(0)
    expect(await page.locator('img').evaluateAll(images => images.filter(i => !i.complete || !i.naturalWidth).map(i => i.src))).toEqual([])
  }
  await page.goto('/#security-findings')
  await page.getByRole('button', { name: 'Review evidence captures' }).click()
  const buttons = page.locator('.assessment-dialog .gallery-tabs button')
  for (let i=0; i<await buttons.count(); i++) { await buttons.nth(i).click(); await expect(buttons.nth(i)).toHaveAttribute('aria-pressed','true'); await expect(page.locator('.assessment-dialog .placeholder-state')).toHaveText('Awaiting actual system screenshot') }
  await page.goto('/#network')
  await page.getByRole('button', { name: 'Reserved port. VLAN 40 · Reserved' }).click()
  await expect(page.locator('.diagram-inspector')).toContainText('reserved')
  await page.getByRole('button', { name: 'MikroTik hEX lite. RB750r2 · Edge router' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.diagram-inspector')).toContainText('100 Mbps')
})

test('mobile reading view reflows every scene and keeps controls usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const scene of scenes) {
    await page.goto(`/#${scene.id}`)
    await expect(page.locator('.app')).toHaveClass(/reading-mode/)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)
    expect(overflow, `${scene.id} mobile horizontal overflow`).toBe(false)
    await expect(page.locator('main h1')).toBeVisible()
  }
  await page.getByRole('button', { name: 'Switch to 16:9 presentation view' }).click()
  await expect(page.locator('.app')).toHaveClass(/presentation-mode/)
  const canvas = await page.locator('.presentation-stage').boundingBox()
  expect(canvas!.width / canvas!.height).toBeCloseTo(16/9,2)
})

test('representative scenes have no serious or critical automated accessibility violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const id of ['cover','network','drive-demo','network-results','security-findings']) {
    await page.goto(`/#${id}`)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
    expect(results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious'), id).toEqual([])
  }
})

test('unavailable files marked AVAILABLE fall back without broken image or video controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('**/src/data/assets.ts', async route => {
    const response = await route.fetch()
    const body = (await response.text()).replaceAll(/status: ["']MISSING["']/g, 'status: "AVAILABLE"')
    await route.fulfill({ response, body })
  })
  await page.goto('/#drive-demo')
  await expect(page.locator('.video-frame .placeholder-state')).toHaveText('Media unavailable · replace the supplied file')
  await expect(page.locator('video')).toHaveCount(0)
  await expect(page.locator('.screenshot-viewport img')).toHaveCount(0)
  await page.goto('/#security-findings')
  await page.getByRole('button', { name: 'Review evidence captures' }).click()
  await expect(page.locator('.screenshot-frame .placeholder-state')).toHaveText('Media unavailable · replace the supplied file')
})

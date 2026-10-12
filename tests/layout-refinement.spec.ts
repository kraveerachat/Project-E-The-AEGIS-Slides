import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'

for (const language of ['th', 'en']) {
  test(`${language}: original photo geometry, hover and both inspection dialogs`, async ({ page }) => {
    await page.addInitScript(lang => localStorage.setItem('aegis-presentation-language', lang), language)
    await page.goto('/#hardware-setup')
    await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
    const photos = page.locator('.hardware-photo-image')
    const geometry = await photos.evaluateAll(nodes => nodes.map(node => {
      const image = node as HTMLImageElement
      const bounds = image.getBoundingClientRect()
      const viewport = image.parentElement!.getBoundingClientRect()
      return { actual: bounds.width / bounds.height, original: image.naturalWidth / image.naturalHeight, gutter: viewport.width - bounds.width, fit: getComputedStyle(image).objectFit }
    }))
    expect(geometry).toHaveLength(2)
    for (const g of geometry) {
      expect(g.actual).toBeCloseTo(g.original, 4)
      expect(g.gutter).toBeLessThan(1)
      expect(g.fit).toBe('contain')
    }
    const firstSize = await photos.first().boundingBox()
    await page.locator('.hardware-photo-button').first().hover()
    expect((await photos.first().boundingBox())!.width).toBeCloseTo(firstSize!.width, 2)
    expect((await photos.first().boundingBox())!.height).toBeCloseTo(firstSize!.height, 2)
    for (let i = 0; i < 2; i++) {
      const button = page.locator('.hardware-photo-button').nth(i)
      await button.focus()
      await page.keyboard.press('Enter')
      await expect(page.locator('.photo-dialog[open]')).toBeVisible()
      await expect(page.locator('.photo-dialog[open] img')).toHaveAttribute('src', i ? '/assets/hardware/lan-cable-switch.png' : '/assets/hardware/equipment-setup.png')
      await page.keyboard.press('Escape')
      await expect(button).toBeFocused()
    }
    const gallery = (await page.locator('.hardware-story').boundingBox())!
    const strip = (await page.locator('.equipment-callouts').boundingBox())!
    expect(strip.y).toBeGreaterThan(gallery.y + gallery.height)
  })

  test(`${language}: demo has one dominant video, five text steps and static print fallback`, async ({ page }) => {
    await page.addInitScript(lang => localStorage.setItem('aegis-presentation-language', lang), language)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const id of ['drive-demo', 'monitor-demo']) {
      await page.goto(`/#${id}`)
      await expect(page.locator('.video-frame')).toHaveCount(1)
      await expect(page.locator('.screenshot-gallery')).toHaveCount(0)
      await expect(page.locator('.demo-side video,.demo-side figure')).toHaveCount(0)
      await expect(page.locator('.demo-step')).toHaveCount(5)
      await expect(page.getByRole('list')).toHaveCount(1)
      await expect(page.locator('.video-frame .missing-video')).toBeVisible()
      const row = (await page.locator('.demo-layout').boundingBox())!
      const frame = (await page.locator('.video-frame').boundingBox())!
      const viewport = (await page.locator('.video-viewport').boundingBox())!
      const side = (await page.locator('.demo-side').boundingBox())!
      expect(frame.width / row.width).toBeGreaterThanOrEqual(.65)
      expect(frame.width / row.width).toBeLessThanOrEqual(.72)
      expect(viewport.width / viewport.height).toBeCloseTo(16 / 9, 3)
      expect(side.x).toBeGreaterThan(frame.x + frame.width)
      await page.emulateMedia({ media: 'print' })
      await expect(page.locator('.video-frame .missing-video')).toBeVisible()
      await expect(page.locator('.presentation-footer')).not.toBeVisible()
      await page.emulateMedia({ media: 'screen' })
    }
  })
}

test('Monitor MP4 remains a single native player, preserves poster, and pauses on scene exit', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('aegis-presentation-language', 'en'))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.route('**/src/data/assets.ts', async route => {
    const response = await route.fetch()
    await route.fulfill({ response, body: (await response.text()).replaceAll(/status: ["']MISSING["']/g, 'status: "AVAILABLE"') })
  })
  await page.route('**/assets/videos/idea2/idea2-demo.mp4', route => route.fulfill({ contentType: 'video/mp4', body: readFileSync('tests/fixtures/playback.mp4') }))
  await page.route('**/assets/screenshots/idea2/demo-poster.png', route => route.fulfill({ contentType: 'image/png', body: readFileSync('public/assets/branding/aegis-mark-dark-ink.png') }))
  await page.goto('/#monitor-demo')
  const video = page.locator('video')
  await expect(video).toHaveCount(1)
  await expect(video).toHaveAttribute('controls', '')
  await expect(video).toHaveAttribute('poster', '/assets/screenshots/idea2/demo-poster.png')
  expect(await video.evaluate((el: HTMLVideoElement) => el.paused && !el.autoplay)).toBe(true)
  await video.evaluate((el: HTMLVideoElement) => el.play())
  await expect(page.locator('.media-focus')).toBeVisible()
  await expect(page.locator('video')).toHaveCount(1)
  await page.getByRole('button', { name: 'Exit presentation video mode' }).click()
  expect(await video.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true)
  await video.evaluate((el: HTMLVideoElement) => { el.currentTime = 1; return el.play() })
  await expect(page.locator('.media-focus')).toHaveCount(0, { timeout: 10000 })
  await expect(page.locator('main')).toHaveAttribute('data-scene-id', 'monitor-demo')
  await page.emulateMedia({ media: 'print' })
  await expect(video).not.toBeVisible()
  await expect(page.locator('.video-static-frame img')).toBeVisible()
  await page.emulateMedia({ media: 'screen' })
  // Leaving a scene also pauses a manually playing, unfocused element.
  await video.evaluate((el: HTMLVideoElement) => {
    el.addEventListener('play', event => event.stopPropagation(), { capture: true, once: true })
    el.currentTime = 0
    return el.play()
  })
  const handle = await video.elementHandle()
  await page.getByRole('button', { name: 'Next scene' }).click()
  await expect(page.locator('main')).toHaveAttribute('data-scene-id', 'network-results')
  expect(await handle!.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true)
})

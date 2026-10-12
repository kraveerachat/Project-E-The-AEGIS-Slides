import { test, expect } from '@playwright/test'
import { scenes, project } from '../src/data/content'
import AxeBuilder from '@axe-core/playwright'

test('Thai is the default and switching preserves the scene, hash and selected language', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#performance')
  await expect(page.locator('html')).toHaveAttribute('lang', 'th')
  await expect(page.locator('main h1')).toContainText('วัดเส้นทาง')
  await expect(page.locator('.language-switch button[lang="th"]')).toHaveAttribute('aria-pressed', 'true')
  await page.locator('.language-switch button[lang="en"]').click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('main h1')).toContainText('Measure the path.')
  await expect(page.locator('main')).toHaveAttribute('data-scene-id', 'performance')
  expect(new URL(page.url()).hash).toBe('#performance')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('main h1')).toContainText('Measure the path.')
  await page.locator('.language-switch button[lang="th"]').click()
  await expect(page.locator('main h1')).toContainText('วัดเส้นทาง')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('main')).toHaveAttribute('data-scene-id', 'security-scope')
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('main')).toHaveAttribute('data-scene-id', 'performance')
})

test('all configured scenes retain Thai copy, IDs, source notes and available controls', async ({ page }) => {
  test.setTimeout(120000)
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const scene of scenes) {
    await page.goto(`/#${scene.id}`)
    await expect(page.locator('main')).toHaveAttribute('data-scene-id', scene.id)
    await expect(page.locator('main h1')).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('lang', 'th')
    await expect(page.locator('.language-switch button[lang="th"]')).toBeVisible()
    await expect(page.locator('.utility-controls > button')).toHaveCount(5)
    const untranslated = await page.evaluate(async () => {
      const { thaiPhrases: uiPhrases } = await import('/src/i18n/th.ts')
      const { contentPhrases } = await import('/src/data/content.ts')
      const thaiPhrases = { ...uiPhrases, ...contentPhrases }
      const walker = document.createTreeWalker(document.getElementById('root')!, NodeFilter.SHOW_TEXT)
      const missing: string[] = []
      while (walker.nextNode()) {
        const value = walker.currentNode.nodeValue?.trim()
        if (value && Object.hasOwn(thaiPhrases, value) && thaiPhrases[value as keyof typeof thaiPhrases] !== value) missing.push(value)
      }
      return missing
    })
    expect(untranslated, scene.id).toEqual([])
    if (scene.id === 'cover') for (const member of project.members) {
      await expect(page.locator('main')).toContainText(member.id)
      await expect(page.locator('main')).toContainText(member.th)
    }
  }
  await page.locator('.utility-controls > button').nth(1).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog')).toContainText('อ้างอิงจากรายงาน')
  await page.keyboard.press('Escape')
  await page.locator('.language-switch button[lang="en"]').click()
  await page.locator('.utility-controls > button').nth(1).click()
  await expect(page.getByRole('dialog')).toContainText('Report references')
  await page.keyboard.press('Escape')
  expect(errors).toEqual([])
})

test('owner-supplied English names and IDs appear exactly on the cover', async ({ page }) => {
  await page.goto('/#cover')
  await page.locator('.language-switch button[lang="en"]').click()
  for (const id of ['cover']) {
    await page.goto(`/#${id}`)
    for (const member of project.members) {
      const row = page.locator('.member-row').filter({ hasText: member.id })
      await expect(row).toHaveText(`${member.id}${member.en}`)
    }
  }
})

test('diagram inspector and gallery selection survive a language change', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#network')
  await page.locator('.diagram-node').last().click()
  await expect(page.locator('.diagram-inspector')).toContainText('สงวนไว้')
  await page.locator('.language-switch button[lang="en"]').click()
  await expect(page.locator('.diagram-node').last()).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.diagram-inspector')).toContainText('reserved')
  await page.goto('/#security-findings')
  await page.getByRole('button', { name: 'Review evidence captures' }).click()
  await page.locator('.gallery-tabs button').nth(1).click()
  await expect(page.locator('.gallery-tabs button').nth(1)).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Close evidence review' }).click()
  await page.locator('.language-switch button[lang="th"]').click()
  await page.getByRole('button', { name: 'ตรวจดูภาพหลักฐาน' }).click()
  await expect(page.locator('.gallery-tabs button').nth(1)).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.placeholder-state').first()).toHaveText('รอภาพหน้าจอจากระบบจริง')
  await expect(page.locator('video')).toHaveCount(0)
})

test('mobile reading mode has no horizontal overflow in either language', async ({ page }) => {
  test.setTimeout(120000)
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const language of ['th','en'] as const) {
    await page.goto('/#cover')
    await page.locator(`.language-switch button[lang="${language}"]`).click()
    for (const scene of scenes) {
      await page.goto(`/#${scene.id}`)
      await expect(page.locator('.app')).toHaveClass(/reading-mode/)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)
      expect(overflow, `${language}/${scene.id}`).toBe(false)
      await expect(page.locator('main h1')).toBeVisible()
    }
  }
})

test('language switching remains usable when browser storage is unavailable', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('storage disabled') }
    Storage.prototype.setItem = () => { throw new Error('storage disabled') }
  })
  await page.goto('/#cover')
  await expect(page.locator('html')).toHaveAttribute('lang', 'th')
  await page.locator('.language-switch button[lang="en"]').click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'th')
  expect(errors).toEqual([])
})

test('Thai controls and diagrams have no serious automated accessibility violations', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const id of ['cover', 'network', 'security-findings']) {
    await page.goto(`/#${id}`)
    const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
    expect(result.violations.filter(item => item.impact === 'critical' || item.impact === 'serious'), id).toEqual([])
  }
})

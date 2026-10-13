import { test, expect } from '@playwright/test'
import { project, scenes, totalSeconds } from '../src/data/content'

test('the final scene keeps verified identities, language and the 15-minute budget', async ({ page }) => {
  expect(scenes).toHaveLength(19)
  expect(scenes.at(-1)).toMatchObject({ id: 'thank-you', seconds: 15 })
  expect(totalSeconds).toBe(890)

  await page.addInitScript(() => localStorage.setItem('aegis-presentation-language', 'th'))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#thank-you')
  await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
  await expect(page.getByRole('heading', { level: 1, name: 'ขอบคุณ' })).toBeVisible()
  await expect(page.locator('.thank-you-questions')).toContainText('คำถามและอภิปราย')
  await expect(page.locator('.thank-you-project')).toContainText(project.title)
  await expect(page.locator('.thank-you-student')).toHaveCount(3)
  for (const member of project.members) {
    await expect(page.locator('.thank-you-students')).toContainText(member.id)
    await expect(page.locator('.thank-you-students')).toContainText(member.th)
    await expect(page.locator('.thank-you-students')).toContainText(member.en)
  }
  await expect(page.locator('.scene-counter')).toContainText('19/ 19')
  await expect(page.locator('.chapter-nav [aria-current="page"]')).toHaveCount(0)
  await expect(page.locator('.nav-indicator')).toBeHidden()
  await expect(page.getByRole('button', { name: 'กลับหน้าแรก' })).toBeEnabled()
  await expect(page.getByRole('button', { name: 'ฉากถัดไป' })).toHaveCount(0)
  expect(await page.locator('.thank-you-art img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)
  expect(await page.locator('.thank-you-project img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0)

  const { cardBottom, footerTop } = await page.evaluate(() => ({
    cardBottom: Math.max(...[...document.querySelectorAll('.thank-you-student')].map(card => card.getBoundingClientRect().bottom)),
    footerTop: document.querySelector('.presentation-footer')!.getBoundingClientRect().top,
  }))
  expect(cardBottom).toBeLessThan(footerTop)

  await page.getByRole('button', { name: 'ภาษาอังกฤษ' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Thank You!' })).toBeVisible()
  await expect(page.locator('.thank-you-questions')).toContainText('Questions & Discussion')
  await expect(page.getByRole('button', { name: 'Back to Home' })).toBeVisible()
  await page.getByRole('button', { name: 'Back to Home' }).click()
  await expect(page.locator('main')).toHaveAttribute('data-scene-id', 'cover')
})

test('closing navigation, reduced motion and print remain usable', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('aegis-presentation-language', 'en'))
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/#summary')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('main')).toHaveAttribute('data-scene-id', 'thank-you')
  await expect(page.locator('main')).toHaveAttribute('aria-busy', 'false')
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('main')).toHaveAttribute('data-scene-id', 'summary')
  await page.goto('/#thank-you')
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('main')).toHaveAttribute('data-scene-id', 'cover')

  await page.goto('/#thank-you')
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' })
  await expect(page.locator('.thank-you-heading')).toBeVisible()
  await expect(page.locator('.thank-you-art img')).toBeVisible()
  await expect(page.locator('.presentation-footer')).not.toBeVisible()
})

test('small landscape screens retain a usable Back to Home target', async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 600 })
  await page.addInitScript(() => localStorage.setItem('aegis-presentation-language', 'en'))
  await page.goto('/#thank-you')
  await expect(page.locator('.app')).toHaveClass(/reading-mode/)
  const bounds = await page.getByRole('button', { name: 'Back to Home' }).boundingBox()
  expect(bounds).not.toBeNull()
  expect(bounds!.width).toBeGreaterThanOrEqual(44)
  expect(bounds!.height).toBeGreaterThanOrEqual(44)
})

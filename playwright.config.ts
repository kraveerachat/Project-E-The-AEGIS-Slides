import { defineConfig } from '@playwright/test'
const port = process.env.PLAYWRIGHT_PORT || '5173'
const baseURL = `http://127.0.0.1:${port}`
export default defineConfig({
  testDir: './tests', timeout: 45000, fullyParallel: false, workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL, viewport: { width: 1920, height: 1080 }, browserName: 'chromium', channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: { command: `npm run dev -- --port ${port} --strictPort`, url: baseURL, reuseExistingServer: !process.env.CI, timeout: 30000 },
})

// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  webServer: {
    command: 'npm run dev',
    port: 3000,
  },
  use: {
    browserName: 'chromium',
  },
});

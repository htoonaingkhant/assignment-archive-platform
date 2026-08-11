import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('shows the assignment library', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Assignment Archive/)

    await expect(
      page.getByRole('heading', { name: /Assignment answers that don.t disappear/i }),
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Find your assignment' })).toBeVisible()
  })
})

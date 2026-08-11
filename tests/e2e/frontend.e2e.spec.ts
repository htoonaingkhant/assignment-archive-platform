import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('shows the assignment library', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Assignment Archive/)

    await expect(page.getByRole('heading', { name: 'Answers that stay findable.' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Find your assignment' })).toBeVisible()
  })

  test('keeps the mobile archive usable without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ height: 844, width: 390 })
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Answers that stay findable.' })).toBeVisible()
    await expect(page.getByText('Refine results')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible()

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }))

    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
  })

  test('applies select filters and search without a document refresh', async ({ page }) => {
    await page.goto('/')

    await page.selectOption('#filter-semester', 'first')
    await expect(page).toHaveURL(/semester=first/)

    await page.locator('#query').fill('calculus')
    const navigationsBefore = await page.evaluate(
      () => performance.getEntriesByType('navigation').length,
    )
    await page.getByRole('button', { name: 'Search' }).click()
    await expect(page).toHaveURL(/q=calculus/)
    const navigationsAfter = await page.evaluate(
      () => performance.getEntriesByType('navigation').length,
    )

    expect(navigationsAfter).toBe(navigationsBefore)
  })
})

import { test, expect } from '@playwright/test';

test('Successful login redirects to inventory page', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.waitForLoadState('load');
  await page.locator('[id=user-name]').fill('standard_user');
  await page.locator('[id="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();


  await test.step('Verify successful login and redirect', async () => {
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page).toHaveTitle('Swag Labs');
  });
});


test('Verify wrong login', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.waitForLoadState('load');
  await page.locator('[id=user-name]').fill('standard_userWrong');
  await page.locator('[id="password"]').fill('secret_sauceWrong');
  await page.locator('[data-test="login-button"]').click();


  await expect(page.locator('[class="error-message-container error"]')).toBeVisible();
  await expect(page.locator('[class="error-message-container error"]')).toHaveText('Epic sadface: Username and password do not match any user in this service');
});


test('Verify locked out user', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.waitForLoadState('load');
  await page.locator('[id=user-name]').fill('locked_out_user');
  await page.locator('[id="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();


  await expect(page.locator('[class="error-message-container error"]')).toBeVisible();
  await expect(page.locator('[class="error-message-container error"]')).toHaveText('Epic sadface: Sorry, this user has been locked out.');
});


test('Verify you are logged in', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/inventory.html');
  await page.waitForLoadState('load');


  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await page.waitForLoadState('load');
  await expect(page.locator('[class="error-message-container error"]')).toBeVisible();
  const errorMessage = await page.locator('[class="error-message-container error"]').innerText();
  await expect(errorMessage.replace(/['"]/g, '"').trim()).toBe('Epic sadface: You can only access "/inventory.html" when you are logged in.');
});


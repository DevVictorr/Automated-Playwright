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
        await expect(page.locator('[data-test="secondary-header"]')).toContainText('Products');
        
        const invItems = await page.locator('[data-test="inventory-item-name"]').allTextContents();

        for (const item of invItems) {
            if (!item.startsWith("Sauce Labs")) {
                throw new Error(`Item inválido encontrado: ${item}`);
            }
        }
    
        console.log('Todos os itens começam com Sauce Labs!');
        
    });
}); 
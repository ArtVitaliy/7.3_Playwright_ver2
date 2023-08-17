const { test, expect, chromium } = require('@playwright/test');

const {
    email,
    password,
    incorrectEmail,
    incorrectPassword,
  } = require("../user");

test('Successful authorization', async ({ page }) => {
    const browser = await chromium.launch({
        headless: false,
      });
  await page.goto('https://netology.ru/');
  await page.click('text=Войти');
  await expect(page).toHaveURL('https://netology.ru/?modal=sign_in');
  await page.click('[placeholder="Email"]');
  await page.fill('[placeholder="Email"]', email);
  await page.click('[placeholder="Пароль"]');
  await page.fill('[placeholder="Пароль"]', password);
  await Promise.all([
    page.waitForNavigation(/*{ url: 'https://netology.ru/profile' }*/),
    page.click('[data-testid="login-submit-btn"]')
  ]);
  await expect(page.locator("h2")).toHaveText("Моё обучение");
  await page.screenshot({ path: "screenshot.png" });
  await browser.close();
});


test("Unsuccessful authorization", async ({ page }) => {
    const browser = await chromium.launch({
      headless: false,
    });
  await page.goto('https://netology.ru/');
  await page.click('text=Войти');
  await expect(page).toHaveURL('https://netology.ru/?modal=sign_in');
  await page.click('[placeholder="Email"]');
  await page.fill('[placeholder="Email"]', incorrectEmail);
  await page.click('[placeholder="Пароль"]');
  await page.fill('[placeholder="Пароль"]', incorrectPassword);
  await page.click('[data-testid="login-submit-btn"]');
  
  const error = await page.locator('[data-testid="login-error-hint"]');
  await expect(error).toHaveText("Вы ввели неправильно логин или пароль");
  await page.screenshot({ path: "screenshotFailed.png", fullPage: true });
  await browser.close();
  });
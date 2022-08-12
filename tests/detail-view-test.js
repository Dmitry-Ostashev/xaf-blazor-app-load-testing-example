async function detailViewTest(page) {
    const testFunc = async () => {
        for (let i = 0; i < 20; i++) {
            await page.waitForSelector('.dxbs-grid .card', { timeout: 30000 });
            await page.waitForSelector('.xaf-loading-content[style*="hidden"]', { timeout: 30000 });
            await page.waitForXPath(`//td[contains(., 'Employee ${i}#')]`, { timeout: 30000 });

            const row = await page.$x(`//td[contains(., 'Employee ${i}#')]`, { timeout: 30000 });

            await page.waitForTimeout(200);

            await row[0].click();

            await page.waitForSelector('input[name="FirstName"]', { timeout: 30000 });
            await page.waitForSelector('.xaf-loading-content[style*="hidden"]', { timeout: 30000 });
            await page.waitForTimeout(1000);
            await page.goBack();

            await page.waitForTimeout(2000);
        }
    }

    for (let i = 0; i < 5; i++) {
        await testFunc();
    }
}

module.exports = detailViewTest;

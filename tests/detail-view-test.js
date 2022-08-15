async function detailViewTest(page) {
    const tryClickRow = async (rowNumber, attempts) => {
        let attempt = attempts;

        while (attempt > 0) {
            await page.waitForTimeout(1000);

            await page.waitForXPath(`//td[contains(., 'Employee ${rowNumber}#')]`, { timeout: 30000 });

            const row = await page.$x(`//td[contains(., 'Employee ${rowNumber}#')]`, { timeout: 30000 });

            try {
                await row[0].click();

                await page.waitForSelector('input[name="FirstName"]', { timeout: 30000 });
                await page.waitForSelector('.xaf-loading-content[style*="hidden"]', { timeout: 30000 });

                return;
            }
            catch (e) {
                console.log(`Reconnection attempt ${attempt}`);

                await page.waitForTimeout(8000);
                attempt--;

                if (attempt < 1)
                    throw e;
            }
        }
    }
    const testFunc = async () => {
        for (let i = 0; i < 20; i++) {
            await page.waitForSelector('.dxbs-grid .card', { timeout: 30000 });
            await page.waitForSelector('.xaf-loading-content[style*="hidden"]', { timeout: 30000 });

            await tryClickRow(i, 3);

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

async function detailViewTest(page) {
    const tryClickRow = async (rowNumber, attempts) => {
        await page.waitForTimeout(1000);

        await page.waitForXPath(`//td[contains(., 'Employee ${rowNumber}#')]`, { timeout: 30000 });

        let row = await page.$x(`//td[contains(., 'Employee ${rowNumber}#')]`, { timeout: 30000 });

        try {
            await row[0].click();
        }
        catch (e) {
            console.log('CATCH!');

            if (attempts > 0)
                tryClickRow(attempts - 1);

            else
                throw e;
        }
    }
    const testFunc = async () => {
        for (let i = 0; i < 20; i++) {
            await page.waitForSelector('.dxbs-grid .card', { timeout: 30000 });
            await page.waitForSelector('.xaf-loading-content[style*="hidden"]', { timeout: 30000 });

            await tryClickRow(i, 1);

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

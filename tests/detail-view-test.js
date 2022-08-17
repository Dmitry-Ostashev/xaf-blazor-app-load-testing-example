async function detailViewTest(page) {
    const actionWithConnectionCheck = async (action) => {
        let attempt = 3;

        while (attempt > 0) {
            try {
                await page.waitForSelector('#blazor-reconnect-ui[style*="display: none;"]', { timeout: 45000 });

                attempt = 0;
            }
            catch (e) {
                console.log(`Reconnection attempt ${attempt}`);

                await page.waitForTimeout(10000);
                attempt--;

                if (attempt < 1)
                    throw e;
            }
        }

        await action();
    }

    const tryClickRow = async (rowNumber, attempts) => {
        let attempt = attempts;

        while (attempt > 0) {
            try {
                const row = await page.$x(`//td[contains(., 'Employee ${rowNumber}#')]`, { timeout: 30000 });

                await row[0].click();

                return;
            }
            catch (e) {
                console.log(`Click attempt ${attempt}`);

                await page.waitForTimeout(8000);
                attempt--;

                if (attempt < 1)
                    throw e;
            }
        }
    }
    const testFunc = async () => {
        for (let i = 0; i < 20; i++) {
            await actionWithConnectionCheck(async () => await page.waitForSelector('.xaf-loading-content[style*="hidden"]', { timeout: 30000 }));
            
            await page.waitForTimeout(2000);
            // await page.waitForSelector('.xaf-loading-content[style*="hidden"]', { timeout: 30000 });
            try {
                await actionWithConnectionCheck(async () => await page.waitForSelector('.main-content>.grid-content .dxbs-grid .card', { timeout: 30000 }));
            }
            catch (e) {
                const url = await page.url();

                if (!url.endsWith('Employee_ListView'))
                    await page.goBack();
                else
                    throw e;
            }
            
            await actionWithConnectionCheck(async () => await page.waitForXPath(`//td[contains(., 'Employee ${i}#')]`, { timeout: 30000 }));

            // const row = await page.$x(`//td[contains(., 'Employee ${i}#')]`, { timeout: 30000 });

            await actionWithConnectionCheck(async () => await tryClickRow(i, 3));

            await page.waitForTimeout(5000);

            const loadingContent = await page.$('.xaf-loading-content');

            if (loadingContent)
                await page.waitForSelector('.xaf-loading-content[style*="hidden"]', { timeout: 40000 });

            await page.waitForSelector('input[name="FirstName"]', { timeout: 30000 });
            
            await page.goBack();
            await page.waitForTimeout(2000);

            const url = await page.url();

            try {
                await page.waitForFunction('/Employee_ListView/.test(window.location.pathname)', { timeout: 30000 });
            }
            catch (e) {
                console.log(`Navigation issue: ${url}`);

                if (!url.endsWith('Employee_ListView'))
                    await page.goBack();
                else
                    throw e;
            }
        }
    }

    for (let i = 0; i < 5; i++) {
        await testFunc();
    }
}

module.exports = detailViewTest;

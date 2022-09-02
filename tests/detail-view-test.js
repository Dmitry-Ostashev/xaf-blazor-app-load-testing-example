async function detailViewTest(page) {
    const testFuncCore = async (i) => {
        await page.waitForSelector('#blazor-reconnect-ui[style*="display: none;"]', { timeout: 45000 });

        await page.waitForSelector('.main-content>.grid-content .dxbs-grid .card', { timeout: 30000 });
        await page.waitForSelector('.xaf-loading-content[style*="hidden"]', { timeout: 30000 });

        await page.waitForTimeout(9000);

        await page.evaluate(`Blazor.navigateTo("Employee_DetailView/${i + 1}")`);
        // const row = await page.waitForXPath(`//td[contains(., 'Employee ${i}#')]`, { timeout: 30000 });

        // await row[0].click();

        await page.waitForSelector('#blazor-reconnect-ui[style*="display: none;"]', { timeout: 45000 });
        await page.waitForSelector('input[name="Person.FirstName"]', { timeout: 30000 });
        await page.waitForSelector('.xaf-loading-content[style*="hidden"]', { timeout: 30000 });

        await page.waitForTimeout(5000);
        await page.evaluate('Blazor.navigateTo("Employee_ListView")')
    }
    const testFunc = async () => {
        for (let i = 0; i < 20; i++) {
            await testFuncCore(i);
                // await page.waitForTimeout(1000);

                // try {
                //     await page.waitForSelector('#blazor-reconnect-ui[style*="display: block;"]', { timeout: 10000 });

                //     console.log('Reconnect ... ');

                //     await page.waitForSelector('#blazor-reconnect-ui[style*="display: none;"]', { timeout: 45000 });

                //     await page.waitForSelector('.main-window-template-content', { timeout: 30000 });
                //     await page.evaluate('Blazor.navigateTo("Employee_ListView")');
                //     await page.waitForSelector('.main-content>.grid-content .dxbs-grid .card', { timeout: 30000 });
                    
                //     console.log('Reconnection success ... ');
                // }
                // catch (err) {
                //     throw e;
                // }
        };
    }

    for (let i = 0; i < 3; i++) {
        await testFunc();
    }
}

module.exports = detailViewTest;

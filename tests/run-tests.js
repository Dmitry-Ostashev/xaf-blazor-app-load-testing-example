const { Cluster }  = require('puppeteer-cluster');
const listViewTest = require('./list-view-test');
const detailViewTest = require('./detail-view-test');
const navigationTest = require('./navigation-test');

async function runTestFunc (page, url, instance, testFunc) {
    const { retry, takeScreenshot } = require('./utils');

    await retry(() => page.goto(url), 1000);

    try {
        return await testFunc(page, instance);
    }

    catch (err) {
        await takeScreenshot(page, instance);

        throw err;
    }
}

async function runTests(url, concurrency, headless) {
    const cluster = await Cluster.launch({
        puppeteerOptions: { headless, defaultViewport: null, /*slowMo: 20,*/ args: ['--ignore-certificate-errors', '--start-maximized', '--no-sandbox'] },
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: concurrency,
        monitor: false,
        timeout: 1200000,
        defaultViewport: null
    });

    const startTime = Date.now();
    const workerTimings = [];
    const viewNavigationTimings = [];

    let succededTests = 0;


    await Promise.all(new Array(concurrency).fill('').map((item, index) => cluster.execute(url, async ({ page, data: url }) => {
        try {
            // await page.setViewport({ width: 800, height: 1200});

            const workerStartTime = new Date();

            const viewNavigationTime = await runTestFunc(page, `${url}`, index, navigationTest);
            // await runTestFunc(page, `${url}/StickyNote_ListView`, index, listViewTest);
            // await runTestFunc(page, `${url}/Employee_ListView`, index, detailViewTest);

            const workerDuration = (Date.now() - workerStartTime.getTime()) / 1000;

            succededTests++;

            workerTimings.push(workerDuration);
            viewNavigationTimings.push(viewNavigationTime);

            console.log(`Worker ${index} started at ${workerStartTime.toLocaleTimeString()} finished successfully after ${workerDuration} seconds. View nav time: ${viewNavigationTime}`);
        }
        catch (err) {
            console.log(`Worker ${index} failed.`);
            console.log(err);
        }
    })));

    const duration    = (Date.now() - startTime) / 1000;
    const averageTime = workerTimings.reduce((acc, val) => acc+=val) / workerTimings.length;
    const averageViewTime = viewNavigationTimings.reduce((acc, val) => acc+=val) / viewNavigationTimings.length;

    console.log(`${concurrency - succededTests} of ${concurrency} instances are failed.`);
    console.log(`All tests took ${duration} seconds. Average: ${averageTime} s. View nav time: ${averageViewTime}`);

    await cluster.idle();
    await cluster.close();

    if (succededTests !== concurrency)
        throw new Error('Some test instances are failed');
};

module.exports = runTests;

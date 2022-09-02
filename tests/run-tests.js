const { Cluster }  = require('puppeteer-cluster');
const listViewTest = require('./list-view-test');
const detailViewTest = require('./detail-view-test');

async function runTestFunc (page, url, instance, testFunc) {
    const { retry, takeScreenshot } = require('./utils');

    await retry(() => page.goto(url), 1000);

    try {
        await testFunc(page);
    }

    catch (err) {
        await takeScreenshot(page, instance);

        throw err;
    }
}

async function runTests(url, concurrency, headless) {
    const cluster = await Cluster.launch({
        puppeteerOptions: { headless, args: ['--ignore-certificate-errors', '--start-maximized'] },
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: concurrency,
        monitor: false,
        timeout: 9000000,
        defaultViewport: null
    });

    const startTime = Date.now();
    const workerTimings = [];

    let succededTests = 0;


    await Promise.all(new Array(concurrency).fill('').map((item, index) => new Promise(resolve => setTimeout(() => resolve(cluster.execute(url, async ({ page, data: url }) => {
        try {
            console.log(`Worker ${index} started`);

            await page.setViewport({ width: 800, height: 1200});

            const workerStartTime = new Date();

            let workerErrors = [];

            for (let i = 0; i < 1; i++) {
                try {
                    // await runTestFunc(page, `${url}/StickyNote_ListView`, index, listViewTest);
                    await runTestFunc(page, `${url}/Employee_ListView`, index, detailViewTest);
                }
                catch (e) {
                    const url = await page.url();

                    console.log(`Worker ${index} error. Url: ${url}`);

                    workerErrors.push(e);
                }
            }
            const workerDuration = (Date.now() - workerStartTime.getTime()) / 1000;

            if (!workerErrors.length)
                succededTests++;

            workerTimings.push(workerDuration);

            if (workerErrors.length) {
                console.log(`Worker ${index} errors: ${workerErrors.length}`);

                for (let err of workerErrors)
                    console.log(err);

                throw new Error('Fail');
            }

            console.log(`Worker ${index} started at ${workerStartTime.toLocaleTimeString()} finished successfully after ${workerDuration} seconds.`);
        }
        catch (err) {
            console.log(`Worker ${index} failed.`);
            // console.log(err);
        }
    })), index * 10000))));

    const duration    = (Date.now() - startTime) / 1000;
    const averageTime = workerTimings.reduce((acc, val) => acc+=val) / workerTimings.length;

    console.log(`${concurrency - succededTests} of ${concurrency} instances are failed.`);
    console.log(`All tests took ${duration} seconds. Average: ${averageTime} s`);

    await cluster.idle();
    await cluster.close();

    if (succededTests !== concurrency)
        throw new Error('Some test instances are failed');
};

module.exports = runTests;

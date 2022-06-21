const { Cluster }         = require('puppeteer-cluster');
const simpleNavigaionTest = require('./simple-navigation-test');


async function runTests (url, concurrency, headless) {
    const cluster = await Cluster.launch({
        puppeteerOptions: { headless,  args: [ '--ignore-certificate-errors' ] },
        concurrency: Cluster.CONCURRENCY_CONTEXT,
        maxConcurrency: concurrency,
        monitor: false,
        timeout: 60000
    });

    await cluster.task(async ({ page, data }) => {
        await simpleNavigaionTest({ page, data });
    });

    const startTime = Date.now();

    try {
        await Promise.all(new Array(concurrency).fill('').map(i => cluster.execute(url)));
    }

    catch (err) {
        console.log(err);

        throw err;
    }

    const duration = (Date.now() - startTime) / 1000;

    console.log(`All tests took ${duration} seconds`);

    await cluster.idle();
    await cluster.close();
};

module.exports = runTests;

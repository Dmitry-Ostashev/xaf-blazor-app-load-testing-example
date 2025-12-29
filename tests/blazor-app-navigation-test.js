const { pageModel } = require('./blazor-load-app-model');

const DXGRID           = '.dxbs-grid .card';
const NEXT_PAGE_BUTTON = '[data-args="PBN"] div svg';

async function navigationTest(page, instance) {
    await pageModel.waitForLoading(page);
    await pageModel.delay(500);
    const appLoadedTime = new Date();

    await pageModel.navigate(page, 'Employees');
    await pageModel.processRow(page, 'Mary');
    await pageModel.back(page);

    await pageModel.navigate(page, 'Tasks');
    await pageModel.processRow(page, 'Prepare');
    await pageModel.back(page);

    await pageModel.navigate(page, 'Departments');
    await pageModel.processRow(page, 'Human');
    await pageModel.back(page);

    await pageModel.navigate(page, 'Notes');
    await pageModel.processRow(page, 'Limeira');
    await pageModel.back(page);

    await pageModel.navigate(page, 'Paychecks');
    await pageModel.processRow(page, 'Hewitt');
    await pageModel.back(page);

    await pageModel.navigate(page, 'Resumes');
    await pageModel.processRow(page, 'Hewitt');
    await pageModel.back(page);
    
    await pageModel.navigate(page, 'Events');
    await pageModel.back(page);

    const viewsNavigationTime = (Date.now() - appLoadedTime.getTime()) / 1000;

    await new Promise(res => setTimeout(res, 2000));

    return viewsNavigationTime;
}

module.exports = navigationTest;

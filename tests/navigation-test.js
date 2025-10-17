const { pageModel } = require('./page-model');

const DXGRID           = '.dxbs-grid .card';
const NEXT_PAGE_BUTTON = '[data-args="PBN"] div svg';

async function navigationTest(page) {
    await pageModel.waitForLoading(page);
    await pageModel.setEditorValue(page, 'User Name', 'Sam');
    await pageModel.clickActionButton(page, 'Log In');

    await pageModel.navigate(page, 'Employees');
    await pageModel.processRow(page, 'Karl');
    await pageModel.closeTab(page);
    await pageModel.closeTab(page);

    await pageModel.navigate(page, 'Tasks');
    await pageModel.processRow(page, 'Travel');
    await pageModel.closeTab(page);
    await pageModel.closeTab(page);

    await pageModel.navigate(page, 'Departments');
    await pageModel.processRow(page, 'Human');
    await pageModel.closeTab(page);
    await pageModel.closeTab(page);

    await pageModel.navigate(page, 'Calendar');
    await pageModel.closeTab(page);

    await pageModel.navigate(page, 'Notes');
    await pageModel.processRow(page, 'Limeira');
    await pageModel.closeTab(page);
    await pageModel.closeTab(page);

    await pageModel.navigate(page, 'My Details', 'Sam');
    await pageModel.closeTab(page);

    await pageModel.navigate(page, 'Payroll');
    await pageModel.clickActionButton(page, 'New');
    await pageModel.closeTab(page);
    await pageModel.closeTab(page);

    await pageModel.navigate(page, 'Resumes');
    await pageModel.processRow(page, 'Hewitt');
    await pageModel.closeTab(page);
    await pageModel.closeTab(page);

    await new Promise(res => setTimeout(res, 500));
}

module.exports = navigationTest;

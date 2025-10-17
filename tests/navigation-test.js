const { pageModel } = require('./page-model');

const DXGRID           = '.dxbs-grid .card';
const NEXT_PAGE_BUTTON = '[data-args="PBN"] div svg';

async function navigationTest(page) {
    await pageModel.waitForLoading(page);
    await pageModel.setEditorValue(page, 'User Name', 'Sam');
    await pageModel.clickActionButton(page, 'Log In');
    await pageModel.navigate(page, 'Employees');
    await pageModel.processRow(page, 'Karl');
    await pageModel.navigate(page, 'Tasks');
    await pageModel.processRow(page, 'Travel');
    await pageModel.navigate(page, 'Departments');
    await pageModel.processRow(page, 'Human');
    await pageModel.navigate(page, 'Notes');
    await pageModel.navigate(page, 'Roles');
    await pageModel.navigate(page, 'Users');
    await pageModel.navigate(page, 'Resumes');

    await new Promise(res => setTimeout(res, 2000));
}

module.exports = navigationTest;

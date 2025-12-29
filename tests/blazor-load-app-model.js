const LOADING_INDICATOR_SELECTOR = `.dxbl-loading-panel-indicator-area`;

const PROPERTY_EDITOR_SELECTOR = '[data-item-name="%FIELD_CAPTION%"] + .dxbl-text-edit input';
const ACTION_BUTTON_SELECTOR = '[data-action-name="%ACTION_CAPTION%"]';

const NAVIGATION_LINK_CLICK_AREA_CSS_CLASS = '.dxbl-drawer-content .xaf-navigation-link-click-area a.dxbl-accordion-item-content';

const CLOSE_TAB_BUTTON_SELECTOR = '.dxbl-tabs-close-button.xaf-close-tab-button';
const TAB_HEADER_SELECTOR = `//div[contains(@class, 'xaf-tab-header-template')]`;
const ACTIVE_TAB_HEADER_SELECTOR = `//dxbl-tab-item[contains(@class, 'dxbl-active')]${TAB_HEADER_SELECTOR}`;

function getInlineActionSelector (title, rowText) {
    return `//div[contains(@class, 'dxbl-active')]//tr[contains(normalize-space(.), '${rowText}')]//div[contains(@class, 'xaf-inline-action')]//button[@data-action-name='%ACTION_CAPTION%']`.replace('%ACTION_CAPTION%', title);
}
function getActiveTabHeader () {}
class BlazorLoadPageModel {
    async waitForLoading (page) {
        await page.waitForSelector(LOADING_INDICATOR_SELECTOR, { hidden: true, timeout: 100000 });
        try {
            await page.waitForFunction(() => {
                const images = Array.from(document.images);
                return images.every(img => img.complete && img.naturalWidth > 0);
            }, { timeout: 10000 });
        }
        catch {
            console.log('Some images were not loaded.');
        }
    }
    async waitForTabAppear (page, tabCaption) {
        await page.locator(`xpath=//h3[contains(normalize-space(.), '${tabCaption}')]`).wait();
    }
    async setEditorValue (page, title, value) {
        const selector = PROPERTY_EDITOR_SELECTOR.replace('%FIELD_CAPTION%', title);
        await page.waitForSelector(selector);
        await page.click(selector);
        await page.keyboard.down('Control');                  // or 'Meta' on macOS
        await page.keyboard.press('A');                       // select all text
        await page.keyboard.up('Control');
        await page.type(selector, value);
    }
    async clickActionButton (page, title) {
        const selector = ACTION_BUTTON_SELECTOR.replace('%ACTION_CAPTION%', title);

        // await page.locator(selector).wait();
        // await page.locator(selector).click();
        const el = await page.$(selector);
        await el.click();
        
        await this.waitForLoading(page);
    }
    async navigate (page, caption, expectedTabCaption) {
        const selector = `${NAVIGATION_LINK_CLICK_AREA_CSS_CLASS}::-p-text("${caption}")`;

        await page.waitForSelector(selector);
        await page.click(selector);

        await this.waitForLoading(page);
        await this.waitForTabAppear(page, expectedTabCaption || caption);
        await this.delay(500);
    }
    async processRow (page, cellText) {
        await page.locator(`xpath=//td[contains(normalize-space(.), '${cellText}')]`).click();
        await this.waitForLoading(page);
        await this.delay(500);
    }
    async back(page) {
        await page.locator('.back-button').click();
    }
    async closeTab (page) {
        await this.delay(1000);
        const xpath = `${ACTIVE_TAB_HEADER_SELECTOR}//button[contains(@class, 'xaf-close-tab-button')]`;

        await page.locator(`xpath=${xpath}`).setTimeout(2000).wait();
        await page.locator(`xpath=${xpath}`).click();
        await this.waitForLoading(page);
    }
    async delay(timeout) {
        await new Promise(res => setTimeout(res, timeout));
    }
}

module.exports = { pageModel: new BlazorLoadPageModel() };
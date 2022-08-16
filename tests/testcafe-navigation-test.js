import { Selector } from 'testcafe';

fixture`Simple Page Navigation`
    .page`http://81.28.7.216:31596/Employee_ListView`;

for (let i = 0; i < 5; i++) {
    test(`New Test ${i}`, async t => {
        // await t
        //     .expect(Selector('.dxbs-grid div').exists).ok()
        //     .click(Selector('[data-args="PBN"] div svg use'))
        //     .click(Selector('[data-args="PBN"] div svg'))
        //     .click(Selector('[data-args="PBN"] div svg'))
        //     .click(Selector('[data-args="PBN"] div svg'))
        //     .click(Selector('[data-args="PBN"] div svg'))
        //     .click(Selector('[data-args="PBN"] div svg'))
        //     .click(Selector('[data-args="PBN"] div svg'));

        for (let j = 0; j < 20; j++) {
            await t
                .expect(Selector('.dxbs-grid .card').exists).ok({ timeout: 30000 })
                .expect(Selector('.xaf-loading-content[style*="hidden"]').visible).notOk({ timeout: 30000 })
                .wait(1000)
                .click(Selector('td').withText(`Employee ${j}#`), { timeout: 30000 })
                .expect(Selector('input[name="FirstName"]').exists).ok({ timeout: 30000 });

            await t.eval(() => history.back());
        }
    });
}

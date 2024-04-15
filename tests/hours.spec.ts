import {test, expect, Page} from '@playwright/test';
import {Db} from "../Db";

const pg = Db.instance;

async function selectDropDown(selector: string, target: string, page: Page) {
    await page.locator(`${selector} .ui-select-toggle`).click();
    await page.waitForSelector(`${selector} .ui-select-choices`);

    await page
        .locator(`${selector} .ui-select-choices .ui-select-choices-row`, {
            has: page.locator(`div[title='${target}']`)
        }).click();
}

test('Fill hours', async ({page}) => {

    await page.goto('https://app.timechimp.com/account/login');
    await page
        .locator("#UserName")
        .fill(process.env.timechimpUs);
    await page
        .locator("#Password")
        .fill(process.env.timechimpPw);

    await page.locator("#loginAccount").click();

    await page.waitForURL('https://app.timechimp.com/#/registration/time/day');

    const data = await pg.getHours();
    for (const record of data) {
        await page.locator('button[class^=\'datepickerbutton\']').click();
        await page.waitForSelector('div[class^=\'bootstrap-datetimepicker-widget\']');
        //await page.locator(`td[data-day='14-04-2024']`).click();
        await page.waitForSelector(`td[data-day='${record.day.toFormat("dd-MM-yyyy")}']`);
        await page.locator(`td[data-day='${record.day.toFormat("dd-MM-yyyy")}']`).click();

        await selectDropDown('#time-customer-select', record.customer, page);
        await selectDropDown('#time-project-select', record.project, page);
        await selectDropDown('#time-task-select', record.task, page);

        await page.locator('.form-group.notes-labels.ng-scope textarea').fill(record.description);

        await page.locator('.registration-time-from input').fill(record.from.toFormat('HH:mm'));
        await page.locator('.registration-time-to input').fill(record.to.toFormat('HH:mm'));

        await page.locator('#create-time-button').click();
        await pg.setProcessed(record.id);
        await page.waitForTimeout(200);
    }
    expect.anything();
});

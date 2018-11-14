import { dashboardPage } from '../../../../page_objects/Dashboard';
import isVisible from '../../../support/check/isVisible';
import getConsoleLog from '../../../support/action/getConsoleLog';
const { Then } = require('cucumber');

Then(
  /^I expect that header is visible$/,
  () => {
    browser.waitForExist(dashboardPage.headerDiv.selector);
    isVisible(dashboardPage.headerDiv);
  }
);
Then(
  /^I expect the logout link to be present$/,
  () => {
    isVisible(dashboardPage.logoutLink);
  }
);

Then(
  /^I expect that dashboard filters are visible$/,
  () => {
    isVisible(dashboardPage.filtersArea, false);
  }
);

Then(
  /^every dashboard item should open without errors$/, { timeout: 120 * 1000 },
  () => {
    let totalConsoleErrors = 0;
    browser.waitForVisible(dashboardPage.filtersArea.selector);
    const filters = dashboardPage.filters;

    expect(filters.length).to.be.above(0, 'No filters to verify');

    filters.forEach(filter => {
      // getText() returns empty string for invisible filters.
      const filterName = filter.element('span').getHTML(false);
      const filterHref = filter.getAttribute('href');

      console.log('opening ' + filterName);

      browser.url(filterHref);
      browser.pause(1500);

      const consoleLogs = getConsoleLog();
      const reportLog = 'Filter: ' + filterName + ' has ' + consoleLogs.length + ' severe errors: \n' + JSON.stringify(consoleLogs, null, 1);
      totalConsoleErrors += consoleLogs.length;

      const status = consoleLogs.length > 0 ? 'failed' : 'passed';
      allure.createStep(filterName, reportLog, 'attachment', status);
    });

    expect(totalConsoleErrors).to.equal(0, 'Total errors: ' + totalConsoleErrors.length);
  }
);

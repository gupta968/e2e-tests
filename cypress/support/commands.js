import './commands/wait.js'
import './commands/logs.js'
//require('@reportportal/agent-js-cypress/lib/commands/reportPortalCommands');

// Cypress throws an exception in dashboard tests when scrolling/using the viewport.
// This disables that exception.
// See https://github.com/quasarframework/quasar/issues/2233
const resizeObserverLoopErrRe = "ResizeObserver loop limit exceeded"
Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes(resizeObserverLoopErrRe)) {
    return false;
  }
});

Cypress.Commands.add('login', () => {
  const username = Cypress.env('LOGIN_USERNAME');
  const password = Cypress.env('LOGIN_PASSWORD');
  cy.session([ username, password ], () => {
    cy.request({
      method: 'POST',
      url: '/dhis-web-commons-security/login.action',
      form: true,
      followRedirect: true,
      body: {
        j_username: username,
        j_password: password
      },
    }).then((resp) => {
        cy.log(resp)
      })
  }, 
  {
    validate() {
      cy.request('/api/me').its('status').should('equal', 200)
    }
  })
})

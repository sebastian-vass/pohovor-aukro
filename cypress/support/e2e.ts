import './commands/commands'
import './commands/check'
import './commands/make'
import './commands/select'

// Removing XHR and Fetch calls in open view
const APP = window.top
if (Cypress.env('hideCalls') && !APP.document.head.querySelector('[data-hide-command-log-request]')) {
  const STYLE = APP.document.createElement('style')
  STYLE.innerHTML = '.command-name-request, .command-name-xhr { display: none }'
  STYLE.setAttribute('data-hide-command-log-request', '')
  APP.document.head.appendChild(STYLE)
}

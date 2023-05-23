import {accountsModel} from '~/models/usermodel';
import {getPageDescription} from '~/helpers/use-document-head';
const tagManagerID = 'GTM-W6N7PB';

// eslint-disable-next-line max-params
(function (w, d, s, l, i) {
    // Disable ESLint rules since we're copying Google's script
    /* eslint-disable one-var, prefer-const, prefer-template */
    w[l] = w[l] || [];
    w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
    });

    let f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l !== 'dataLayer' ? '&l=' + l : '';

    // Breaks in tests because there are no scripts
    if (f) {
        j.async = true;
        j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
    }
})(window, document, 'script', 'dataLayer', tagManagerID);

window.dataLayer = window.dataLayer || [];

/*
 * google analytics 4 has enhanced tracking for page views when javascript
 * navigates with the history api, in these cases GA4 seems to wait for the
 * page metadata to be updated so it gets the right title, but the initial
 * page load fires as soon as the config is loaded, so we delay the
 * app_initialized event until the page title has been updated
 */
const initialTitle = document.title;
const initialDescription = getPageDescription();

let timeout;
let interval;
const dataInitialized = Promise.race([
  new Promise((resolve) => {
    timeout = window.setTimeout(resolve, 1000);
  }),
  new Promise((resolve) => {
   interval = window.setInterval(() => {
      if (initialTitle !== document.title && initialDescription !== getPageDescription()) {
        resolve();
      }
    }, 1);
  })
])
  .finally(() => {
    window.clearInterval(interval);
    window.clearTimeout(timeout);
  });

Promise.all([accountsModel.load(), dataInitialized]).then(([accountResponse]) => {
    const role = ['instructor', 'student'].includes(accountResponse.self_reported_role) ?
        accountResponse.self_reported_role :
        undefined;

    const faculty = accountResponse.faculty_status;

    // eslint-disable-next-line camelcase
    const user_tags = (role === 'instructor' || faculty === 'confirmed_faculty' ?
        [role, faculty, accountResponse.using_openstax] :
        [role]
    ).filter((x) => !!x).join(',') || undefined;

    // eslint-disable-next-line camelcase
    window.dataLayer.push({event: 'app_loaded', app: 'osweb', user_tags});
});

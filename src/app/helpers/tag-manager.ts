/* eslint-disable camelcase, no-nested-ternary */
import {accountsModel} from '~/models/usermodel';
const tagManagerID = 'GTM-W6N7PB';

const extendedWindow: Window & {
  dataLayer?: unknown[];
  oxDLF?: unknown[];
} = window;

extendedWindow.dataLayer = extendedWindow.dataLayer || [];
extendedWindow.oxDLF = extendedWindow.oxDLF || [];

// eslint-disable-next-line max-params
(function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
    });

    // Disable ESLint rules since we're copying Google's script
    /* eslint-disable one-var, prefer-const, prefer-template */
    let f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l !== 'dataLayer' ? '&l=' + l : '';

    // Breaks in tests because there are no scripts
    if (f) {
        j.async = true;
        j.src = '//www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode?.insertBefore(j, f);
    }
})(extendedWindow, document, 'script' as const, 'dataLayer' as const, tagManagerID);


/* the analytics helper delays analytics until both of these are set
 * they can also be set again later and it'll trigger a re-configure */
accountsModel.load().then(
  (user) => {
    extendedWindow.oxDLF?.push({user});
  }
);
export function setContentTags(contentTags: unknown) {
  extendedWindow.oxDLF?.push({contentTags});
}

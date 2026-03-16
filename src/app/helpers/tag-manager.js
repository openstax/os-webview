import accountsModel from '~/models/accounts-model';
const tagManagerID = 'GTM-W6N7PB';

// Initialize dataLayer and consent - these exist even if GTM doesn't load
window.dataLayer ||= [];

function gtag(...args) {
  window.dataLayer.push(...args);
}
/* eslint-disable camelcase */
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 2000
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', false);
/* eslint-enable camelcase */

window.oxDLF ||= [];

let gtmInitialized = false;

/**
 * Initialize Google Tag Manager
 * This should be called conditionally based on portal K12 status
 */
export function initializeGTM() {
    if (gtmInitialized) {
        return;
    }
    gtmInitialized = true;

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

    /* the analytics helper delays analytics until both of these are set
     * they can also be set again later and it'll trigger a re-configure */
    accountsModel.load().then(
      (user) => {
        window.oxDLF.push({user});
      }
    );
}

export function setContentTags(contentTags) {
  window.oxDLF.push({contentTags});
}

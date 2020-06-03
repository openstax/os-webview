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

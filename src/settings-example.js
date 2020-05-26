const settings = {
    accountHref: 'https://accounts-qa.openstax.org',
    analyticsID: 'UA-73668038-3',
    apiOrigin: 'https://cms-dev.openstax.org',
    apiPrefix: '/apps/cms/api/v2',
    buildVersion: '2.7.0',
    tagManagerID: 'GTM-W6N7PB',
    mapboxPK: 'pk.eyJ1Ijoib3BlbnN0YXgiLCJhIjoiY2pnbWtjajZzMDBkczJ6cW1kaDViYW02aCJ9.0w3LCa7lzozzRgXM7xvBfQ',
    testingEnvironment: (/(localhost|oscms-)/).test(window.location.hostname),
    titleSuffix: ' - OpenStax',
    webmaster: 'webmaster@openstax.org',
    touchnet: {
        test: {
            url: 'https://ebank.rice.edu:8443/C21279test_upay/web/index.jsp',
            id: 90
        },
        prod: {
            url: 'https://ebank.rice.edu/C21279_upay/web/index.jsp',
            id: 106
        }
    }
};

window.SETTINGS = settings;

// Do not include this line in settings.js
// It is necessary here, because Jest uses this file for tests
export default settings;

const settings = {
    accountHref: 'https://accounts-dev.openstax.org',
    analyticsID: 'UA-73668038-3',
    apiOrigin: 'https://cms-dev.openstax.org',
<<<<<<< 388314e2a074727d5b9e4767c280e39201260335
    buildVersion: '2.7.0',
=======
    buildVersion: '2.6.0',
>>>>>>> resolve submit your testimonial link issue for mobile display
    tagManagerID: 'GTM-W6N7PB',
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

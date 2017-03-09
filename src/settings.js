const settings = {
    titleSuffix: ' - OpenStax',
    analyticsID: 'UA-73668038-1',
    tagManagerID: 'GTM-W6N7PB',
    webmaster: 'webmaster@openstax.org',
    apiOrigin: 'http://oscms-dev.openstax.org',
    accountHref: 'https://accounts-qa.openstax.org',
    touchnet: {
        test: {
            url: 'https://ebank.rice.edu:8443/C21279test_upay/web/index.jsp',
            id: 90
        },
        prod: {
            url: 'https://ebank.rice.edu/C21279_upay/web/index.jsp',
            id: 106
        }
    },
    testingEnvironment: (/(localhost|oscms-)/).test(window.location.hostname)
};

export default settings;

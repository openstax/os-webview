const settings = {
    accountHref: 'https://accounts-qa.openstax.org',
    analyticsID: 'UA-73668038-1',
    analyticsID2: 'UA-73668038-2',
    apiOrigin: 'https://oscms.openstax.org',
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

export default settings;

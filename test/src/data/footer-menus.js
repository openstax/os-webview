export default [
    {
        key: 'help',
        name: 'Help',
        menu: [
            {label: 'Contact Us', partial_url: '/contact', key: 'contact-us'},
            {label: 'Support Center', partial_url: 'https://help.openstax.org/s/', key: 'support-center'},
            {label: 'FAQ', partial_url: '/faq', key: 'faq'},
            {label: 'Order Print', partial_url: '/print/', key: 'order-print'},
            {label: 'System Status', partial_url: 'https://status.openstax.org/', key: 'system-status'}
        ]
    },
    {
        key: 'openstax',
        name: 'OpenStax',
        menu: [
            {label: 'Press', partial_url: '/press', key: 'press'},
            {label: 'Newsletter', partial_url: 'http://www2.openstax.org/l/218812/2016-10-04/lvk', key: 'newsletter'},
            {label: 'Careers', partial_url: '/careers'}
        ]
    },
    {
        key: 'policies',
        name: 'Policies',
        menu: [
            {label: 'Accessibility Statement', partial_url: '/accessibility-statement', key: 'accessibility-statement'},
            {label: 'Terms of Use', partial_url: '/tos', key: 'terms-of-use'},
            {label: 'Licensing', partial_url: '/license', key: 'licensing'},
            {label: 'Privacy Notice', partial_url: '/privacy', key: 'privacy-notice'}
        ]
    }
];

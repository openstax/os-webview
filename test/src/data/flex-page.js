/* eslint-disable max-len, camelcase */
export default {
    id: 554,
    meta: {
        slug: 'partner-application-test',
        seo_title: '',
        search_description: '',
        type: 'pages.FlexPage',
        detail_url: 'https://dev.openstax.org/apps/cms/api/v2/pages/554/',
        html_url: 'https://dev.openstax.org/partner-application-test',
        show_in_menus: false,
        first_published_at: '2024-12-10T15:48:35.518298-06:00',
        alias_of: null,
        parent: {
            id: 542,
            meta: {
                type: 'pages.RootPage',
                detail_url:
                    'https://dev.openstax.org/apps/cms/api/v2/pages/542/',
                html_url: 'https://dev.openstax.org/'
            },
            title: 'Home'
        },
        locale: 'en'
    },
    title: 'Partner Application Test',
    layout: [
        {
            type: 'default',
            value: {},
            id: '781890c3-e27d-4acd-bbc1-5f18007ca103'
        }
    ],
    body: [
        {
            type: 'section',
            value: {
                content: [
                    {
                        type: 'text',
                        value: '<h2 data-block-key="ovw54">Apply today to be an OpenStax Partner</h2>',
                        id: '06d4c020-d4c7-436f-98c3-dc3e38693cb7'
                    }
                ],
                config: [
                    {
                        type: 'text_alignment',
                        value: 'center',
                        id: '5891847b-e7f9-402e-873c-753a8fcfcf2d'
                    },
                    {
                        type: 'padding',
                        value: 3,
                        id: '1576ffab-c2ef-41e3-ab26-4afb156f5640'
                    }
                ]
            },
            id: '8ebbd93d-6e6b-4f95-a0ff-42d0e6480180'
        },
        {
            type: 'divider',
            value: {
                image: {
                    id: 946,
                    file: 'https://assets.openstax.org/oscms-dev/media/original_images/strips.svg',
                    title: 'strips',
                    height: 10,
                    width: 932,
                    created_at: '2024-11-18T10:58:25.763084-06:00'
                },
                config: []
            },
            id: 'fa7d8a0c-8347-49f4-8a11-0143945dbfb7'
        },
        {
            type: 'section',
            value: {
                content: [
                    {
                        type: 'html',
                        value: '<form action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00DU0000000Kwch" method="POST">\r\n\r\n<input type=hidden name="oid" value="00DU0000000Kwch">\r\n<input type=hidden name="retURL" value="http://openstax.org/partners">\r\n\r\n<label for="first_name">First Name</label><input  id="first_name" maxlength="40" name="first_name" size="20" type="text" /><br>\r\n\r\n<label for="last_name">Last Name</label><input  id="last_name" maxlength="80" name="last_name" size="20" type="text" /><br>\r\n\r\n<label for="email">Email</label><input  id="email" maxlength="80" name="email" size="20" type="text" /><br>\r\n\r\n<label for="company">Company</label><input  id="company" maxlength="40" name="company" size="20" type="text" /><br>\r\n\r\n<label for="url">Website</label><input  id="url" maxlength="80" name="url" size="20" type="text" /><br>\r\n\r\n<input type="submit" name="submit">\r\n\r\n</form>',
                        id: '982b3aa3-235a-4615-b5af-5b7c9a44adde'
                    }
                ],
                config: [
                    {
                        type: 'padding',
                        value: 5,
                        id: '4f7d5b07-1fed-4d8f-bb5d-acf67eb1977e'
                    }
                ]
            },
            id: 'd692b42c-8086-4daf-9a63-ef548770a1b9'
        }
    ]
};

/* eslint-disable max-len, camelcase */
export default {
    id: 281,
    meta: {
        slug: 'test-general-page',
        seo_title: 'The Generalest',
        search_description: 'This is a description to use',
        type: 'pages.GeneralPage',
        detail_url: 'https://dev.openstax.org/apps/cms/api/v2/pages/281/',
        html_url: 'https://dev.openstax.org/test-general-page',
        show_in_menus: false,
        first_published_at: '2018-11-14T14:28:38.286483-06:00',
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
    title: 'Test of General Page',
    body: [
        {
            type: 'heading',
            value: 'This is some kind of heading',
            id: 'a135df77-bf32-4840-ab29-fdcb0793c0f2'
        },
        {
            type: 'paragraph',
            value: '<p data-block-key="p8nwa">This is a paragraph, which can have some other markup in it. Lorem ipsum doo wacka doo.<br/></p>',
            id: '362c034b-1fc9-43b6-8907-50b5844c4c6b'
        },
        {
            type: 'paragraph',
            value: '<p data-block-key="ju9ms">The <b>Justice Department</b> issued a defense of President Donald Trump&#x27;s controversial appointment of Matt Whitaker as acting attorney general Wednesday, offering several reasons why the appointment is consistent with the Constitution, federal statutes and past precedent.</p>',
            id: '0b746b24-213d-458b-8e05-beae57370823'
        },
        {
            type: 'html',
            value: 'Ok, so this is if I just want to include <b>raw tags</b> of my own or something. HTML, baby.',
            id: 'b392b8ff-857e-4d57-86a9-f91c807d3d16'
        }
    ],
    promote_image: null
};

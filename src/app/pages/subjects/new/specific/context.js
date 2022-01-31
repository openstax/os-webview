import buildContext from '~/components/jsx-helpers/build-context';
import $ from '~/helpers/$';
import {transformData} from '~/helpers/controller/cms-mixin';

function useContextValue() {
    /* eslint-disable max-len */
    return transformData($.camelCaseKeys({
        'id': 477,
        'meta': {
            'seo_title': '',
            'search_description': '',
            'type': 'pages.Subject',
            'detail_url': 'http://openstax.org/apps/cms/api/v2/pages/477/',
            'html_url': 'http://openstax.org/new-subjects-2/business-3/',
            'slug': 'business-3',
            'show_in_menus': false,
            'first_published_at': '2022-02-01T16:14:23.065443-06:00',
            'parent': {
                'id': 475,
                'meta': {
                    'type': 'pages.Subjects',
                    'detail_url': 'http://openstax.org/apps/cms/api/v2/pages/475/',
                    'html_url': 'http://openstax.org/new-subjects-2/'
                },
                'title': 'New Subjects 2'
            },
            'locale': 'en'
        },
        'title': 'Business 2',
        'tutor_ad': [
            {
                'type': 'content',
                'value': {
                    'heading': 'Instructors, take your course online',
                    'image': {
                        'id': 1099,
                        'file': 'http://localhost:8000/media/original_images/sample-clouds2-400x300.png',
                        'title': 'sample-clouds2-400x300',
                        'height': 300,
                        'width': 400,
                        'created_at': '2022-01-04T11:25:24.590608-06:00'
                    },
                    'ad_html': '<strong>Assign homework and readings synced with OpenStax textbooks</strong>',
                    'link_text': 'Learn more',
                    'link_href': 'https://openstax.org'
                },
                'id': '49af303a-d101-4c0b-8bdb-1dad872eb7f6'
            }
        ],
        'blog_header': [
            {
                'type': 'content',
                'value': {
                    'heading': 'Read our blogs about Business Textbooks',
                    'blog_description': 'Our blog is the bestest',
                    'link_text': 'View all blog posts',
                    'link_href': 'https://openstax.org'
                },
                'id': '38f77349-f83c-4aa1-981f-5f0359b97092'
            }
        ],
        'webinar_header': [
            {
                'type': 'content',
                'value': {
                    'heading': 'Webinars about OpenStax textbooks',
                    'webinar_description': 'Hear about the making of OpenStax textbooks from experts. Tips and Tricks on using out textbooks',
                    'link_text': 'View all webinars',
                    'link_href': 'https://openstax.org'
                },
                'id': '22885202-ff37-47af-bd3d-978c4cfe76b4'
            }
        ],
        'os_textbook_heading': 'Learn more about OpebStax Business textbooks',
        'os_textbook_categories': [
            {
                'type': 'category',
                'value': [
                    {
                        'heading': 'General Business',
                        'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                    },
                    {
                        'heading': 'Accounting',
                        'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                    },
                    {
                        'heading': 'Statistics',
                        'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                    },
                    {
                        'heading': 'Management',
                        'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                    },
                    {
                        'heading': 'Entrepreneurship',
                        'text': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                    }
                ],
                'id': 'ea0097d6-7e52-446b-9a08-2da94dd40e1f'
            }
        ],
        'about_os': [
            {
                'type': 'content',
                'value': {
                    'heading': 'About Openstax textbooks',
                    'image': {
                        'id': 1098,
                        'file': 'http://localhost:8000/media/original_images/sample-birch-400x300.jpg',
                        'title': 'sample-birch-400x300',
                        'height': 300,
                        'width': 400,
                        'created_at': '2022-01-04T11:10:57.121204-06:00'
                    },
                    'os_text': 'OpenStax is part of Rice University, which is a 501(c)(3) nonprofit charitable corporation. Our mission is to improve educational access and learning for everyone. We do this by publishing openly licensed books, developing and improving research-based courseware, establishing partnerships with educational resource companies, and more.',
                    'link_text': 'Learn about OpenStax',
                    'link_href': 'https://openstax.org'
                },
                'id': 'e1bc812f-6bbc-435e-bf07-f27972eb10c1'
            }
        ],
        'info_boxes': [
            {
                'type': 'info_box',
                'value': [
                    {
                        'image': {
                            'id': 1101,
                            'file': 'http://localhost:8000/media/original_images/subj-icon-science.png',
                            'title': 'subj-icon-science',
                            'height': 50,
                            'width': 40,
                            'created_at': '2022-01-27T09:21:30.619838-06:00'
                        },
                        'heading': 'Expert Authors',
                        'text': 'Our open source textbooks are written by professional content developers who are experts in their fields.'
                    },
                    {
                        'image': {
                            'id': 1101,
                            'file': 'http://localhost:8000/media/original_images/subj-icon-science.png',
                            'title': 'subj-icon-science',
                            'height': 50,
                            'width': 40,
                            'created_at': '2022-01-27T09:21:30.619838-06:00'
                        },
                        'heading': 'Standard Scope and Sequence',
                        'text': 'All textbooks meet standard scope and sequence requirements, making them seamlessly adaptable into existing courses.'
                    },
                    {
                        'image': {
                            'id': 1101,
                            'file': 'http://localhost:8000/media/original_images/subj-icon-science.png',
                            'title': 'subj-icon-science',
                            'height': 50,
                            'width': 40,
                            'created_at': '2022-01-27T09:21:30.619838-06:00'
                        },
                        'heading': 'Peer Reviewed',
                        'text': 'OpenStax textbooks undergo a rigorous peer review process. You can view the list of contributors when you click on each book.'
                    }
                ],
                'id': 'eb185143-b8ca-4856-930e-f09c403ef972'
            }
        ],
        'philanthropic_support': 'With philanthropic support, our books have been used in <strong>38,160<strong> classrooms, saving students <strong>$1,747,190,405<strong> since 2012. <a href=\'https://openstax.org/impact\'>Learn more about our impact</a> and how you can help.',
        'subjects': {
            'Business': {
                'icon': '/media/original_images/subj-icon-calculator.png',
                'categories': {
                    'Business Statistics': {
                        'books': {
                            'Introductory Business Statistics': [
                                {
                                    'id': 189,
                                    'slug': 'books/introductory-business-statistics',
                                    'book_state': 'live',
                                    'title': 'Introductory Business Statistics',
                                    'subjects': [
                                        'Math',
                                        'Business'
                                    ],
                                    'subject_categories': [
                                        'Introduction to Business',
                                        'Business Statistics'
                                    ],
                                    'is_ap': false,
                                    'cover_url': '/media/documents/IntroductoryBusinessStatistics-bookcard.svg',
                                    'cover_color': 'light-blue',
                                    'high_resolution_pdf_url': '/media/documents/IntroductoryBusinessStatistics-OP.pdf',
                                    'low_resolution_pdf_url': null,
                                    'ibook_link': '',
                                    'ibook_link_volume_2': '',
                                    'webview_link': 'https://cnx.orgcontents/b56bb9e9-5eb8-48ef-9939-88b1b12ce22f',
                                    'webview_rex_link': 'https://openstax.org/books/introductory-business-statistics/pages/1-introduction',
                                    'bookshare_link': '',
                                    'kindle_link': 'http://a.co/d/0it1288',
                                    'amazon_coming_soon': false,
                                    'amazon_link': 'https://www.amazon.com/dp/1947172468',
                                    'bookstore_coming_soon': false,
                                    'comp_copy_available': false,
                                    'salesforce_abbreviation': 'Business Statistics',
                                    'salesforce_name': 'Introductory Business Statistics',
                                    'urls': [],
                                    'last_updated_pdf': null
                                }
                            ]
                        }
                    },
                    'Management': {
                        'books': {
                            'Principles of Management': [
                                {
                                    'id': 304,
                                    'slug': 'books/principles-management',
                                    'book_state': 'live',
                                    'title': 'Principles of Management',
                                    'subjects': [
                                        'Business'
                                    ],
                                    'subject_categories': [
                                        'Management'
                                    ],
                                    'is_ap': false,
                                    'cover_url': '/media/documents/principles_of_management_book_card.svg',
                                    'cover_color': 'blue',
                                    'high_resolution_pdf_url': '/media/documents/PrinciplesofManagement-OP_mGBMvoU.pdf',
                                    'low_resolution_pdf_url': null,
                                    'ibook_link': '',
                                    'ibook_link_volume_2': '',
                                    'webview_link': 'https://cnx.orgcontents/c3acb2ab-7d5c-45ad-b3cd-e59673fedd4e',
                                    'webview_rex_link': 'https://openstax.org/books/principles-management/pages/1-introduction',
                                    'bookshare_link': '',
                                    'kindle_link': 'https://www.amazon.com/dp/B07VP6G5GL/ref=cm_sw_em_r_mt_dp_U_95DiEb5YRE7HB',
                                    'amazon_coming_soon': false,
                                    'amazon_link': 'https://www.amazon.com/dp/0998625760',
                                    'bookstore_coming_soon': false,
                                    'comp_copy_available': false,
                                    'salesforce_abbreviation': 'Management',
                                    'salesforce_name': 'Management',
                                    'urls': [],
                                    'last_updated_pdf': null
                                }
                            ]
                        }
                    },
                    'Introduction to Business': {
                        'books': {
                            'Introductory Business Statistics': [
                                {
                                    'id': 189,
                                    'slug': 'books/introductory-business-statistics',
                                    'book_state': 'live',
                                    'title': 'Introductory Business Statistics',
                                    'subjects': [
                                        'Math',
                                        'Business'
                                    ],
                                    'subject_categories': [
                                        'Introduction to Business',
                                        'Business Statistics'
                                    ],
                                    'is_ap': false,
                                    'cover_url': '/media/documents/IntroductoryBusinessStatistics-bookcard.svg',
                                    'cover_color': 'light-blue',
                                    'high_resolution_pdf_url': '/media/documents/IntroductoryBusinessStatistics-OP.pdf',
                                    'low_resolution_pdf_url': null,
                                    'ibook_link': '',
                                    'ibook_link_volume_2': '',
                                    'webview_link': 'https://cnx.orgcontents/b56bb9e9-5eb8-48ef-9939-88b1b12ce22f',
                                    'webview_rex_link': 'https://openstax.org/books/introductory-business-statistics/pages/1-introduction',
                                    'bookshare_link': '',
                                    'kindle_link': 'http://a.co/d/0it1288',
                                    'amazon_coming_soon': false,
                                    'amazon_link': 'https://www.amazon.com/dp/1947172468',
                                    'bookstore_coming_soon': false,
                                    'comp_copy_available': false,
                                    'salesforce_abbreviation': 'Business Statistics',
                                    'salesforce_name': 'Introductory Business Statistics',
                                    'urls': [],
                                    'last_updated_pdf': null
                                }
                            ]
                        }
                    },
                    'Accounting': {
                        'books': {
                            'Principles of Accounting, Volume 2: Managerial Accounting': [
                                {
                                    'id': 292,
                                    'slug': 'books/principles-managerial-accounting',
                                    'book_state': 'live',
                                    'title': 'Principles of Accounting, Volume 2: Managerial Accounting',
                                    'subjects': [
                                        'Business'
                                    ],
                                    'subject_categories': [
                                        'Accounting'
                                    ],
                                    'is_ap': false,
                                    'cover_url': '/media/documents/principles_of_acounting_volume_2_book_card_Vu9ykSz.svg',
                                    'cover_color': 'blue',
                                    'high_resolution_pdf_url': '/media/documents/ManagerialAccounting-OP_x3x7rSO.pdf',
                                    'low_resolution_pdf_url': null,
                                    'ibook_link': '',
                                    'ibook_link_volume_2': '',
                                    'webview_link': 'https://cnx.orgcontents/920d1c8a-606c-4888-bfd4-d1ee27ce1795',
                                    'webview_rex_link': 'https://openstax.org/books/principles-managerial-accounting/pages/1-why-it-matters',
                                    'bookshare_link': '',
                                    'kindle_link': 'https://www.amazon.com/dp/B07SZ93NJK/ref=cm_sw_em_r_mt_dp_U_D6DiEbMDEC61A',
                                    'amazon_coming_soon': false,
                                    'amazon_link': 'https://www.amazon.com/dp/1947172603',
                                    'bookstore_coming_soon': true,
                                    'comp_copy_available': false,
                                    'salesforce_abbreviation': 'Managerial Accounting',
                                    'salesforce_name': 'Managerial Accounting',
                                    'urls': [],
                                    'last_updated_pdf': null
                                }
                            ]
                        }
                    }
                }
            }
        },
        'translations': [],
        'promote_image': null
    }));
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SpecificSubjectContextProvider
};

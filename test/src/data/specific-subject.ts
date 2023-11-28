import {camelCaseKeys} from '~/helpers/page-data-utils';

export const tutorAd = {
    content: {
        image: 'url',
        heading: 'Ad heading',
        adHtml: 'ad body',
        linkHref: 'linkurl',
        linkText: 'link text'
    }
};
export const infoBoxes = [
    [
        {
            image: {
                id: 844,
                file: 'https://assets.openstax.org/oscms-prod/media/original_images/expert_authors.png',
                title: 'expert_authors',
                height: 80,
                width: 76,
                created_at: '2022-04-28T17:02:55.708551-05:00'
            },
            heading: 'Expert authors',
            text: 'Our free, openly licensed math textbooks are written by professional content developers who are experts in their fields.'
        }
    ]
];
export const aboutOs = {
    content: {
        heading: 'About OpenStax textbooks',
        image: {
            file: 'https://assets.openstax.org/oscms-prod/media/original_images/about_OpenStax_textbooks.png',
            title: 'about_OpenStax_textbooks'
        },
        osText: "OpenStax is part of Rice University, a 501(c)(3) nonprofit charitable corporation. As an educational initiative, it's our mission to improve educational access and learning for everyone. We provide access to education for millions of learners by publishing high-quality, peer-reviewed, openly licensed college and high school textbooks that are available free online. We currently offer 15 free math textbooks, and our library is only growing: <i>Algebra and Trigonometry</i>; <i>Algebra and Trigonometry 2e</i>; <i>Calculus (Volumes 1, 2, and 3)</i>; <i>College Algebra</i>; <i>College Algebra 2e</i>; <i>College Algebra with Corequisite Support</i>; <i>College Algebra with Corequisite Support 2e</i>; <i>Elementary Algebra 2e</i>; <i>High School Statistics</i>; <i>Intermediate Algebra 2e</i>; <i>Introductory Business Statistics</i>; <i>Introductory Statistics</i>; <i>Prealgebra 2e</i>; <i>Precalculus</i>; and <i>Precalculus 2e</i>.",
        linkText: 'Learn about OpenStax',
        linkHref: 'https://openstax.org/about-us'
    }
};

export const webinarHeader = {
    content: {
        heading: 'Webinar section heading about OpenStax math textbooks',
        webinarDescription: 'Learn how our free textbooks are made...',
        linkText: 'View all webinars',
        linkHref: 'https://openstax.org/webinars'
    }
};

export const webinarItems = camelCaseKeys([
    {
        title: 'The webinar title',
        description: 'Join this OpenStax Ally ',
        registration_url:
            'https://event.on24.com/wcc/r/4348563/895FB8389998E8F3F5366F97A306A87E',
        registration_link_text: 'Register today',
    },
    {
        description: 'Forgot a title this OpenStax Ally ',
        registration_url:
            'https://event.on24.com/wcc/r/4348563/895FB8389998E8F3F5366F97A306A87E',
        registration_link_text: 'Register today',
    }
]);

const mathBooksData = camelCaseKeys({
    id: 400,
    meta: {
        seo_title: '',
        search_description: '',
        type: 'pages.Subject',
        detail_url: 'https://staging.openstax.org/apps/cms/api/v2/pages/400/',
        html_url: 'https://staging.openstax.org/new-subjects/math-books/',
        slug: 'math-books',
        show_in_menus: false,
        first_published_at: '2022-04-14T13:17:27.494630-05:00',
        alias_of: null,
        parent: {
            id: 399,
            meta: {
                type: 'pages.Subjects',
                detail_url:
                    'https://staging.openstax.org/apps/cms/api/v2/pages/399/',
                html_url: 'https://staging.openstax.org/new-subjects/'
            },
            title: 'Subjects'
        },
        locale: 'en'
    },
    title: 'Math',
    page_description:
        'Simple to use, simple to adopt. Our online math textbooks are designed to meet the standard scope and sequence requirements of several math courses – and are 100% free. Complete with free resources for educators (like course shells, PowerPoints, instructor solution guides, and more), check out our books below to see if they’re right for your course.',
    tutor_ad: [],
    blog_header: [
        {
            content: {
                heading: 'Blogs about OpenStax math textbooks',
                blog_description:
                    'Read up on best practices for using our free math textbooks and instructor resources in your course in these blog posts.',
                link_text: 'View all blog posts',
                link_href: 'https://openstax.org/blogs'
            }
        }
    ],
    os_textbook_heading: 'Learn more about OpenStax Math textbooks',
    os_textbook_categories: [
        {
            type: 'category',
            value: [
                {
                    heading: 'Algebra and Trigonometry',
                    text: `<i>Algebra and Trigonometry</i> provides a comprehensive exploration of algebraic principles and is designed to meet the scope and sequence requirements of a typical introductory algebra and trigonometry course. Our free algebra and trigonometry textbook offers a wealth of examples with detailed, conceptual explanations, building a strong foundation in the material before asking students to apply what they’ve learned. Our text increases student engagement and understanding through over 6,300 exercises and practice problems, practice tests, and worked examples. Like our other math textbooks, this online algebra and trigonometry book can be downloaded as a PDF and comes with a wide array of instructor and student resources, like LMS course shells, PowerPoint slides, an instructor solutions manual, and corequisite skillsheets.
    <p>To see accompanying courseware, online homework, and learning technology tools, view OpenStax’s <a href='https://openstax.org/partners'>Tech Scout</a> tool.`
                }
            ],
            id: 'b266d9a2-87f9-494f-b2d6-362041a21ff9'
        }
    ],
    about_os: [],
    book_categories_heading: 'Math',
    learn_more_heading: 'Free OpenStax math textbooks for all learners',
    learn_more_blog_posts: 'Articles about using OpenStax math textbooks',
    learn_more_webinars: 'Webinars about OpenStax math textbooks',
    learn_more_about_books: 'Free OpenStax math textbooks for all learners',
    philanthropic_support:
        "With philanthropic support, our books have been used in <strong>38,160<strong> classrooms, saving students <strong>$1,747,190,405<strong> since 2012. <a href='https://openstax.org/impact'>Learn more about our impact</a> and how you can help.",
    subjects: {
        Math: {
            icon: 'https://assets.openstax.org/oscms-prod/media/original_images/math_icon.png',
            categories: {
                'Algebra & Trigonometry': {
                    category_description:
                        'Our free algebra and trigonometry textbooks can be customized to meet your teaching needs and come with online educational resources. Try out our resources for yourself below!',
                    books: {
                        'Algebra and Trigonometry 2e': [
                            {
                                id: 385,
                                slug: 'books/algebra-and-trigonometry-2e',
                                book_state: 'live',
                                title: 'Algebra and Trigonometry 2e',
                                subjects: ['Math'],
                                subject_categories: ['Algebra & Trigonometry'],
                                k12subject: ['Algebra'],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/algebra_trigonometry_2e.svg',
                                cover_color: 'yellow',
                                high_resolution_pdf_url: null,
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://staging.cnx.org/contents/eaefdaf1-bda0-4ada-a9fe-f1c065bfcc4e',
                                webview_rex_link:
                                    'https://staging.openstax.org/books/algebra-and-trigonometry-2e/pages/1-introduction-to-prerequisites',
                                bookshare_link: '',
                                kindle_link: '',
                                amazon_coming_soon: false,
                                amazon_link: '',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation:
                                    'Algebra and Trigonometry',
                                salesforce_name: 'Algebra and Trigonometry',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ]
                    }
                },
                Calculus: {
                    category_description:
                        'We have so much exciting calculus material to share, it all couldn’t fit in one textbook! Our three-volume calculus textbook is 100% free, customizable, and can be accessed anytime, anywhere – check it out below!',
                    books: {
                        'Calculus Volume 1 old': [
                            {
                                id: 74,
                                slug: 'books/calculus-volume-1-old',
                                book_state: 'live',
                                title: 'Calculus Volume 1 old',
                                subjects: ['Math'],
                                subject_categories: ['Calculus'],
                                k12subject: ['Calculus'],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/calculus-v1.svg',
                                cover_color: 'yellow',
                                high_resolution_pdf_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/CalculusVolume1-OP.pdf',
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://staging.cnx.org/contents/8b89d172-2927-466f-8661-01abc7ccdba4',
                                webview_rex_link:
                                    'https://staging.openstax.org/books/calculus-volume-1/pages/1-introduction',
                                bookshare_link: '',
                                kindle_link: '',
                                amazon_coming_soon: false,
                                amazon_link:
                                    'https://www.amazon.com/dp/193816802X',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation: 'Calculus',
                                salesforce_name: 'Calculus',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ],
                        'Calculus Volume 2': [
                            {
                                id: 75,
                                slug: 'books/calculus-volume-2',
                                book_state: 'live',
                                title: 'Calculus Volume 2',
                                subjects: ['Math'],
                                subject_categories: ['Calculus'],
                                k12subject: ['Calculus'],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/calculus-v2.svg',
                                cover_color: 'yellow',
                                high_resolution_pdf_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/CalculusVolume2-OP_7nNwGJD.pdf',
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://staging.cnx.org/contents/1d39a348-071f-4537-85b6-c98912458c3c',
                                webview_rex_link:
                                    'https://staging.openstax.org/books/calculus-volume-2/pages/1-introduction',
                                bookshare_link: '',
                                kindle_link:
                                    'https://www.amazon.com/Calculus-2-Gilbert-Strang-ebook/dp/B075FD7MZK/ref=sr_1_20?s=digital-text&ie=UTF8&qid=1509044794&sr=1-20&keywords=Openstax',
                                amazon_coming_soon: false,
                                amazon_link:
                                    'https://www.amazon.com/dp/1938168062',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation: 'Calculus',
                                salesforce_name: 'Calculus',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ],
                        'Calculus Volume 3': [
                            {
                                id: 76,
                                slug: 'books/calculus-volume-3',
                                book_state: 'live',
                                title: 'Calculus Volume 3',
                                subjects: ['Math'],
                                subject_categories: ['Calculus'],
                                k12subject: ['Calculus'],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/calculus-v3.svg',
                                cover_color: 'yellow',
                                high_resolution_pdf_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/CalculusVolume3-OP.pdf',
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://staging.cnx.org/contents/a31cd793-2162-4e9e-acb5-6e6bbd76a5fa',
                                webview_rex_link:
                                    'https://staging.openstax.org/books/calculus-volume-3/pages/1-introduction',
                                bookshare_link: '',
                                kindle_link:
                                    'https://www.amazon.com/Calculus-3-Gilbert-Strang-ebook/dp/B075FGYTQT/ref=sr_1_22_twi_kin_1?s=books&ie=UTF8&qid=1508964001&sr=1-22&keywords=OpenStax',
                                amazon_coming_soon: false,
                                amazon_link:
                                    'https://www.amazon.com/dp/1938168070',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation: 'Calculus',
                                salesforce_name: 'Calculus',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ]
                    }
                },
                'College Algebra': {
                    category_description:
                        'Like our other math textbooks, our college algebra textbooks are free, flexible, and can be viewed online and downloaded as a PDF. Take a look at our free college algebra textbooks and educational resources below.',
                    books: {
                        'College Algebra 2e': [
                            {
                                id: 383,
                                slug: 'books/college-algebra-2e',
                                book_state: 'live',
                                title: 'College Algebra 2e',
                                subjects: ['Math'],
                                subject_categories: ['College Algebra'],
                                k12subject: [],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/college_algebra_2e_web_card.svg',
                                cover_color: 'yellow',
                                high_resolution_pdf_url: null,
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://staging.cnx.org/contents/35d7cce2-48dd-4403-b6a5-e828cb5a17da',
                                webview_rex_link:
                                    'https://staging.openstax.org/books/college-algebra-2e/pages/1-introduction-to-prerequisites',
                                bookshare_link: '',
                                kindle_link: '',
                                amazon_coming_soon: false,
                                amazon_link: '',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation: 'College Algebra',
                                salesforce_name: 'College Algebra',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ],
                        'College Algebra 2e with Corequisite Support': [
                            {
                                id: 386,
                                slug: 'books/college-algebra-corequisite-support-2e',
                                book_state: 'live',
                                title: 'College Algebra 2e with Corequisite Support',
                                subjects: ['Math'],
                                subject_categories: ['College Algebra'],
                                k12subject: ['Algebra'],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/college_algebra_with_corequisite_support_2e_2.svg',
                                cover_color: 'light-blue',
                                high_resolution_pdf_url: null,
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://staging.cnx.org/contents/59024a63-2b1a-4631-94c5-ae275a77b587',
                                webview_rex_link:
                                    'https://staging.openstax.org/books/college-algebra-corequisite-support-2e/pages/1-introduction-to-prerequisites',
                                bookshare_link: '',
                                kindle_link: '',
                                amazon_coming_soon: false,
                                amazon_link: '',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation:
                                    'College Algebra with Corequisite Support',
                                salesforce_name:
                                    'College Algebra with Corequisite Support',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ]
                    }
                },
                'Developmental Math': {
                    category_description:
                        'Our free algebra and prealgebra textbooks are customizable and can be accessed anytime, anywhere. Did we also mention that they come with additional resources for educators and students? Check them out below.',
                    books: {
                        'Elementary Algebra 2e': [
                            {
                                id: 349,
                                slug: 'books/elementary-algebra-2e',
                                book_state: 'live',
                                title: 'Elementary Algebra 2e',
                                subjects: ['Math'],
                                subject_categories: ['Developmental Math'],
                                k12subject: ['Algebra'],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/elementary-algebra.svg',
                                cover_color: 'yellow',
                                high_resolution_pdf_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/ElementaryAlgebra2e-WEB_9MAe69X.pdf',
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://staging.cnx.org/contents/55931856-c627-418b-a56f-1dd0007683a8',
                                webview_rex_link:
                                    'http://staging.openstax.org/books/elementary-algebra-2e/pages/1-introduction',
                                bookshare_link: '',
                                kindle_link: '',
                                amazon_coming_soon: false,
                                amazon_link:
                                    'https://www.amazon.com/dp/1975076478/',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation: 'Elementary Algebra',
                                salesforce_name: 'Elementary Algebra',
                                urls: [],
                                last_updated_pdf: '2021-02-04T17:16:00Z'
                            }
                        ],
                        'Intermediate Algebra 2e': [
                            {
                                id: 351,
                                slug: 'books/intermediate-algebra-2e',
                                book_state: 'live',
                                title: 'Intermediate Algebra 2e',
                                subjects: ['Math'],
                                subject_categories: ['Developmental Math'],
                                k12subject: ['Algebra'],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/intermediate_algebra_2e_web_card_GzBTGtH.svg',
                                cover_color: 'yellow',
                                high_resolution_pdf_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/IntermediateAlgebra2e-WEB_ko3xEUm.pdf',
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://staging.cnx.org/contents/4664c267-cd62-4a99-8b28-1cb9b3aee347',
                                webview_rex_link:
                                    'https://staging.openstax.org/books/intermediate-algebra-2e/pages/1-introduction',
                                bookshare_link: '',
                                kindle_link: '',
                                amazon_coming_soon: false,
                                amazon_link:
                                    'https://www.amazon.com/dp/1975076486/',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation: 'Intermediate Algebra',
                                salesforce_name: 'Intermediate Algebra',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ],
                        'Prealgebra 2e': [
                            {
                                id: 343,
                                slug: 'books/prealgebra-2e',
                                book_state: 'live',
                                title: 'Prealgebra 2e',
                                subjects: ['Math'],
                                subject_categories: ['Developmental Math'],
                                k12subject: ['Algebra'],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/prealgebra_2e_web_card_FoepHLS.svg',
                                cover_color: 'yellow',
                                high_resolution_pdf_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/Prealgebra2e-WEB.pdf',
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://staging.cnx.org/contents/f0fa90be-fca8-43c9-9aad-715c0a2cee2b',
                                webview_rex_link:
                                    'https://staging.openstax.org/books/prealgebra-2e/pages/1-introduction',
                                bookshare_link: '',
                                kindle_link: '',
                                amazon_coming_soon: false,
                                amazon_link:
                                    'https://www.amazon.com/dp/0998625795/',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation: 'Prealgebra',
                                salesforce_name: 'Prealgebra',
                                urls: [],
                                last_updated_pdf: '2020-03-11T05:00:00Z'
                            }
                        ]
                    }
                },
                Precalculus: {
                    category_description:
                        'Like our other OpenStax textbooks, our free precalculus textbooks can be viewed online and downloaded as a PDF. Explore our precalculus textbooks and educational resources below.',
                    books: {
                        'Precalculus 2e': [
                            {
                                id: 384,
                                slug: 'books/precalculus-2e',
                                book_state: 'live',
                                title: 'Precalculus 2e',
                                subjects: ['Math'],
                                subject_categories: ['Precalculus'],
                                k12subject: ['Precalculus'],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/precalculus_2e.svg',
                                cover_color: 'blue',
                                high_resolution_pdf_url: null,
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://staging.cnx.org/contents/f021395f-fd63-46cd-ab95-037c6f051730',
                                webview_rex_link:
                                    'https://staging.openstax.org/books/precalculus-2e/pages/1-introduction-to-functions',
                                bookshare_link: '',
                                kindle_link: '',
                                amazon_coming_soon: false,
                                amazon_link: '',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation: 'Precalc',
                                salesforce_name: 'Precalculus',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ]
                    }
                },
                Statistics: {
                    category_description:
                        'Our college and high school statistics textbooks are free, customizable, and can be viewed online and downloaded as a PDF. Explore our free statistics textbooks and educational resources below.',
                    books: {
                        'Introductory Business Statistics': [
                            {
                                id: 189,
                                slug: 'books/introductory-business-statistics',
                                book_state: 'live',
                                title: 'Introductory Business Statistics',
                                subjects: ['Business', 'Math'],
                                subject_categories: [
                                    'Business Statistics',
                                    'Statistics'
                                ],
                                k12subject: ['Business'],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/IntroductoryBusinessStatistics-bookcard.svg',
                                cover_color: 'light-blue',
                                high_resolution_pdf_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/IntroductoryBusinessStatistics-OP.pdf',
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://staging.cnx.org/contents/b56bb9e9-5eb8-48ef-9939-88b1b12ce22f',
                                webview_rex_link:
                                    'https://staging.openstax.org/books/introductory-business-statistics/pages/1-introduction',
                                bookshare_link: '',
                                kindle_link: 'http://a.co/d/0it1288',
                                amazon_coming_soon: false,
                                amazon_link:
                                    'https://buyprint.openstax.org/introductory-business-statistics',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation: 'Business Statistics',
                                salesforce_name:
                                    'Introductory Business Statistics',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ],
                        'Introductory Business Statistics 2e': [
                            {
                                id: 504,
                                slug: 'books/introductory-business-statistics-2e',
                                book_state: 'coming_soon',
                                title: 'Introductory Business Statistics 2e',
                                subjects: ['Business', 'Math'],
                                subject_categories: [
                                    'Business Statistics',
                                    'Statistics'
                                ],
                                k12subject: [],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/introductory_business_statistics_2e_web_card.svg',
                                cover_color: 'blue',
                                high_resolution_pdf_url: null,
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://staging.cnx.org/contents/b56bb9e9-5eb8-48ef-9939-88b1b12ce22f',
                                webview_rex_link: '',
                                bookshare_link: '',
                                kindle_link: '',
                                amazon_coming_soon: false,
                                amazon_link:
                                    'https://buyprint.openstax.org/introductory-business-statistics-2e',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation:
                                    'Business Statistics 2e',
                                salesforce_name:
                                    'Introductory Business Statistics 2e',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ],
                        'Introductory Statistics': [
                            {
                                id: 36,
                                slug: 'books/introductory-statistics',
                                book_state: 'live',
                                title: 'Introductory Statistics',
                                subjects: ['Math'],
                                subject_categories: ['Statistics'],
                                k12subject: ['Statistics'],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/statistics.svg',
                                cover_color: 'yellow',
                                high_resolution_pdf_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/IntroductoryStatistics-OP_bGvVITN.pdf',
                                low_resolution_pdf_url: null,
                                ibook_link:
                                    'https://itunes.apple.com/us/book/introductory-statistics/id898910154?mt=13',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://staging.cnx.org/contents/30189442-6998-4686-ac05-ed152b91b9de',
                                webview_rex_link:
                                    'https://staging.openstax.org/books/introductory-statistics/pages/1-introduction',
                                bookshare_link:
                                    'http://www.bookshare.org/browse/book/751376',
                                kindle_link:
                                    'https://www.amazon.com/Introductory-Statistics-Barbara-Illowsk-ebook/dp/B075FF48ST/ref=tmm_kin_swatch_0?_encoding=UTF8&qid=1508964581&sr=1-1',
                                amazon_coming_soon: false,
                                amazon_link:
                                    'https://www.amazon.com/dp/1938168208',
                                bookstore_coming_soon: false,
                                comp_copy_available: true,
                                salesforce_abbreviation:
                                    'Introductory Statistics',
                                salesforce_name: 'Introductory Statistics',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ],
                        'Introductory Statistics 2e': [
                            {
                                id: 503,
                                slug: 'books/introductory-statistics-2e',
                                book_state: 'coming_soon',
                                title: 'Introductory Statistics 2e',
                                subjects: ['Math'],
                                subject_categories: ['Statistics'],
                                k12subject: [],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/introductory_statistics_2e_web_card.svg',
                                cover_color: 'green',
                                high_resolution_pdf_url: null,
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://staging.cnx.org/contents/30189442-6998-4686-ac05-ed152b91b9de',
                                webview_rex_link: '',
                                bookshare_link: '',
                                kindle_link: '',
                                amazon_coming_soon: false,
                                amazon_link:
                                    'https://buyprint.openstax.org/introductory-statistics-2e',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation:
                                    'Introductory Statistics 2e',
                                salesforce_name: 'Introductory Statistics 2e',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ],
                        Statistics: [
                            {
                                id: 348,
                                slug: 'books/statistics',
                                book_state: 'live',
                                title: 'Statistics',
                                subjects: ['Math'],
                                subject_categories: ['Statistics'],
                                k12subject: ['Statistics'],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/high_school_statistics_cover.svg',
                                cover_color: 'yellow',
                                high_resolution_pdf_url:
                                    'https://assets.openstax.org/oscms-prod/media/documents/Statistics-WEB.pdf',
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://staging.cnx.org/contents/394a1101-fd8f-4875-84fa-55f15b06ba66',
                                webview_rex_link:
                                    'http://staging.openstax.org/books/statistics/pages/1-introduction',
                                bookshare_link: '',
                                kindle_link: '',
                                amazon_coming_soon: false,
                                amazon_link:
                                    'https://www.amazon.com/dp/1975076532/',
                                bookstore_coming_soon: false,
                                comp_copy_available: true,
                                salesforce_abbreviation: 'HS Statistics',
                                salesforce_name: 'HS Statistics',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ]
                    }
                }
            }
        }
    },
    translations: [
        {
            type: 'translation',
            value: [
                {
                    locale: 'es',
                    slug: 'matematicas'
                }
            ],
            id: 'aed8031b-d217-4697-931f-204db66841e4'
        }
    ],
    promote_image: null
});

export const mathSubjectContext = {
    ...mathBooksData,
    categories: Object.entries(mathBooksData.subjects.Math.categories)
};

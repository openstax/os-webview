import {camelCaseKeys} from '~/helpers/page-data-utils';

/* eslint-disable camelcase, max-len */
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
            text: 'Our free, openly licensed math textbooks are written by professional...'
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
        osText: 'OpenStax is part of Rice University, a 501(c)(3)...',
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
        registration_link_text: 'Register today'
    },
    {
        description: 'Forgot a title this OpenStax Ally ',
        registration_url:
            'https://event.on24.com/wcc/r/4348563/895FB8389998E8F3F5366F97A306A87E',
        registration_link_text: 'Register today'
    }
]);

const mathBooksData = camelCaseKeys({
    title: 'Math',
    page_description: 'Simple to use, simple to adopt...',
    tutor_ad: [],
    blog_header: [
        {
            content: {
                heading: 'Blogs about OpenStax math textbooks',
                blog_description:
                    'Read up on best practices for using our free math textbooks and instructor resources in...',
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
                    text: `<i>Algebra and Trigonometry</i> provides a comprehensive exploration of
                    algebraic principles and is designed to meet the scope and sequence requirements of
                    a typical introductory algebra and trigonometry course. Our free algebra and trigonometry
                    textbook offers a wealth of examples with detailed, conceptual explanations, building a
                    strong foundation in the material before asking students to apply what they’ve learned.
                    Our text increases student engagement and understanding through over 6,300 exercises and
                    practice problems, practice tests, and worked examples. Like our other math textbooks,
                    this online algebra and trigonometry book can be downloaded as a PDF and comes with a wide
                    array of instructor and student resources, like LMS course shells, PowerPoint slides, an
                    instructor solutions manual, and corequisite skillsheets.
                    <p>To see accompanying courseware, online homework, and learning technology tools, view
                    OpenStax’s <a href='https://openstax.org/partners'>Tech Scout</a> tool.`
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
        'With philanthropic support, our books have been used...',
    subjects: {
        Math: {
            icon: 'https://assets.openstax.org/oscms-prod/media/original_images/math_icon.png',
            categories: {
                'Algebra & Trigonometry': {
                    category_description:
                        'Our free algebra and trigonometry textbooks can be customized...',
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
    ]
}) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

const spanishMathBooksData = camelCaseKeys({
    title: 'Matemáticas',
    page_description: 'Sencillo de usar, sencillo de adoptar...',
    tutor_ad: [],
    blog_header: [
        {
            type: 'content',
            value: {
                heading:
                    'Artículos sobre el uso de libros de texto de matemáticas de OpenStax',
                blog_description:
                    'Aquí se encuentra una biblioteca de recursos que comparten las mejores...',
                link_text: 'Ver publicaciones de blog de matemáticas',
                link_href: 'https://openstax.org/blog/explore/subject/Math'
            },
            id: '21d4a692-7fa2-4b0f-8a31-92aa0d38ce4e'
        }
    ],
    webinar_header: [
        {
            type: 'content',
            value: {
                heading:
                    'Seminarios web sobre los libros de texto de matemáticas de OpenStax',
                webinar_description:
                    'Aprenda cómo se elaboran nuestros libros de texto gratuitos, directamente de la mano de los expertos. Obtenga consejos y trucos para usar un libro de OpenStax de parte de educadores cotidianos.',
                link_text: 'Ver todos los seminarios web',
                link_href: 'https://openstax.org/webinars/explore/subjects/Math'
            },
            id: 'a6f2a669-64d6-4e6b-a291-0c21f6cd088e'
        }
    ],
    os_textbook_heading:
        'Más información sobre los libros de texto de OpenStax Math',
    os_textbook_categories: [
        {
            type: 'category',
            value: [
                {
                    heading: 'Cálculo (Volúmenes 1, 2 y 3)',
                    text: '<i>Cálculo</i> está diseñado para cumplir con los ..'
                },
                {
                    heading: 'Introducción a la estadística',
                    text: 'Introducción a la estadística está diseñado...'
                }
            ],
            id: 'b481d63c-5a1f-4060-82f9-2da757ea9f77'
        }
    ],
    book_categories_heading: 'Categorías de matemáticas',
    learn_more_heading: 'Aprende más',
    learn_more_blog_posts: 'Entradas de blogs de matemáticas',
    learn_more_webinars: 'Seminarios web de matemáticas',
    learn_more_about_books: 'Conoce más sobre nuestros libros',
    philanthropic_support:
        "Con apoyo filantrópico, nuestros libros se han utilizado en <strong>38 160<strong> aulas, ahorrando a los estudiantes <strong>$1,747,190,405<strong> desde 2012. <a href='https://openstax.org/impact'>Obtenga más información sobre nuestro impacto</a> y cómo puedes ayudar.",
    subjects: {
        Matemáticas: {
            icon: 'https://assets.openstax.org/oscms-prodcms/media/original_images/math_icon.max-800x600.webp',
            categories: {
                Cálculo: {
                    category_description:
                        '¡Tenemos tanto material de cálculo interesante...',
                    books: {
                        'Cálculo volumen 1': [
                            {
                                id: 578,
                                slug: 'books/cálculo-volumen-1',
                                book_state: 'live',
                                title: 'Cálculo volumen 1',
                                subjects: ['Matemáticas'],
                                subject_categories: ['Cálculo'],
                                k12subject: [],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prodcms/media/documents/calculo_volumen_1_cover_card_JYKrbmA.svg',
                                cover_color: 'yellow',
                                high_resolution_pdf_url:
                                    'https://assets.openstax.org/oscms-prodcms/media/documents/Calculo_volumen_1_-_WEB_vGHB4xK.pdf',
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://cnx.org/contents/8635f0be-e734-4cd1-a10e-8063e5b863b6',
                                webview_rex_link:
                                    'https://openstax.org/books/c%C3%A1lculo-volumen-1/pages/1-introduccion',
                                bookshare_link: '',
                                kindle_link: '',
                                amazon_coming_soon: false,
                                amazon_link: '',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation: 'Calculus',
                                salesforce_name: 'Cálculo',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ],
                        'Cálculo volumen 2': [
                            {
                                id: 579,
                                slug: 'books/cálculo-volumen-2',
                                book_state: 'live',
                                title: 'Cálculo volumen 2',
                                subjects: ['Matemáticas'],
                                subject_categories: ['Cálculo'],
                                k12subject: [],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prodcms/media/documents/calculo_volumen_2_cover_card_YGgZ01m.svg',
                                cover_color: 'yellow',
                                high_resolution_pdf_url:
                                    'https://assets.openstax.org/oscms-prodcms/media/documents/Calculo_volumen_2_-_WEB_8JoonWk.pdf',
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://cnx.org/contents/8079f22f-c0a0-43ed-bb35-871d8d9743f3',
                                webview_rex_link:
                                    'https://openstax.org/books/c%C3%A1lculo-volumen-2/pages/1-introduccion',
                                bookshare_link: '',
                                kindle_link: '',
                                amazon_coming_soon: false,
                                amazon_link: '',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation: 'Calculus',
                                salesforce_name: 'Cálculo',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ]
                    }
                },
                Estadísticas: {
                    category_description:
                        'Nuestros libros de texto de estadística para universidades y escuelas secundarias son gratuitos, personalizables y se pueden ver en línea y descargar como PDF. Explore nuestros libros de texto de estadística y recursos educativos gratuitos a continuación.',
                    books: {
                        'Introducción a la estadística': [
                            {
                                id: 564,
                                slug: 'books/introducción-estadística',
                                book_state: 'live',
                                title: 'Introducción a la estadística',
                                subjects: ['Matemáticas'],
                                subject_categories: ['Estadísticas'],
                                k12subject: [],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prodcms/media/documents/introduccion_a_la_estadistica.svg',
                                cover_color: 'yellow',
                                high_resolution_pdf_url:
                                    'https://assets.openstax.org/oscms-prodcms/media/documents/Introduccion_al_la_estadistica_-_WEB.pdf',
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://cnx.org/contents/e53d6c8b-fd9e-4a28-8930-c564ca6fd77d',
                                webview_rex_link:
                                    'https://openstax.org/books/introducci%C3%B3n-estad%C3%ADstica/pages/1-introduccion',
                                bookshare_link: '',
                                kindle_link: '',
                                amazon_coming_soon: false,
                                amazon_link: '',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation:
                                    'Introductory Statistics',
                                salesforce_name:
                                    'Introducción a la estadística',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ],
                        'Introducción a la estadística empresarial': [
                            {
                                id: 565,
                                slug: 'books/introducción-estadística-empresarial',
                                book_state: 'live',
                                title: 'Introducción a la estadística empresarial',
                                subjects: ['Matemáticas', 'Empresarial'],
                                subject_categories: ['Estadísticas'],
                                k12subject: [],
                                is_ap: false,
                                cover_url:
                                    'https://assets.openstax.org/oscms-prodcms/media/documents/introduccion_a_la_estadistica_empresarial.svg',
                                cover_color: 'light-blue',
                                high_resolution_pdf_url:
                                    'https://assets.openstax.org/oscms-prodcms/media/documents/Introduccion_al_la_estadistica_empresarial_-_WEB.pdf',
                                low_resolution_pdf_url: null,
                                ibook_link: '',
                                ibook_link_volume_2: '',
                                webview_link:
                                    'https://cnx.org/contents/f346fe75-ae39-4d11-ad32-d80c03df58cb',
                                webview_rex_link:
                                    'https://openstax.org/books/introducci%C3%B3n-estad%C3%ADstica-empresarial/pages/1-introduccion',
                                bookshare_link: '',
                                kindle_link: '',
                                amazon_coming_soon: false,
                                amazon_link: '',
                                bookstore_coming_soon: false,
                                comp_copy_available: false,
                                salesforce_abbreviation: 'Business Statistics',
                                salesforce_name:
                                    'Introducción a la estadística empresarial',
                                urls: [],
                                last_updated_pdf: null
                            }
                        ]
                    }
                },
                Precálculo: {
                    category_description:
                        'Al igual que nuestros otros libros de texto de OpenStax, nuestro libro de texto de precálculo gratuito se puede ver en línea y descargar como PDF. Explore nuestro libro de texto de precálculo y nuestros recursos educativos a continuación.',
                    books: {}
                }
            }
        }
    },
    translations: [
        {
            type: 'translation',
            value: [
                {
                    locale: 'en',
                    slug: 'math-books'
                }
            ],
            id: '807d3f94-0a97-425e-a27c-9dfb591e649d'
        }
    ]
}) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

export const mathSubjectContext = {
    ...mathBooksData,
    categories: Object.entries(mathBooksData.subjects.Math.categories)
};

export const spanishMathSubjectContext = {
    ...spanishMathBooksData,
    categories: Object.entries(spanishMathBooksData.subjects.Matemáticas.categories)
};

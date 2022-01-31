import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import usePageData from '~/components/jsx-helpers/page-loader';
import useLanguageContext from '~/contexts/language';
import $ from '~/helpers/$';

const preserveWrapping = true;
const icons = [
    '/images/subjects/author-icon.svg',
    '/images/subjects/scope-icon.svg',
    '/images/subjects/review-icon.svg'
];

function aboutBlurbs(model) {
    const textData = Reflect.ownKeys(model)
        .filter((k) => (/^devStandard\d/).test(k))
        .reduce((a, b) => {
            const [_, num, textId] = b.match(/(\d+)(\w+)/);
            const index = num - 1;

            a[index] = a[index] || {};
            a[index][textId.toLowerCase()] = model[b];
            a[index].iconUrl = icons[index];
            return a;
        }, []);

    return textData;
}

function useContextValue() {
    const [slug, setSlug] = React.useState('subjects');
    const data = usePageData(`pages/${slug}`, preserveWrapping);
    const {language} = useLanguageContext();

    React.useEffect(() => {
        if (!data || !data.translations || !data.translations.length) {
            return;
        }
        const translations = data.translations[0].value;
        const thisTranslation = translations.find((t) => t.locale === language);

        if (thisTranslation) {
            setSlug(thisTranslation.slug);
        }
    }, [data, language]);

    if (data?.books) {
        data.books = data.books.filter((b) => b.bookState !== 'retired');
    }

    if (data) {
        data.aboutBlurbs = aboutBlurbs(data);
    }

    // DATA STUBBING HERE
    // See also contexts/subject-category for icons and colors
    // and specific/context for specific-subject page data
    /* eslint-disable max-len */
    const newPageData = $.camelCaseKeys({
        'id': 475,
        'meta': {
            'seo_title': '',
            'search_description': '',
            'type': 'pages.Subjects',
            'detail_url': 'http://openstax.org/apps/cms/api/v2/pages/475/',
            'html_url': 'http://openstax.org/new-subjects-2/',
            'slug': 'new-subjects-2',
            'show_in_menus': false,
            'first_published_at': '2022-02-01T10:18:25.376168-06:00',
            'parent': {
                'id': 29,
                'meta': {
                    'type': 'pages.HomePage',
                    'detail_url': 'http://openstax.org/apps/cms/api/v2/pages/29/',
                    'html_url': 'http://openstax.org/'
                },
                'title': 'OpenStax Homepage'
            },
            'locale': 'en'
        },
        'title': 'New Subjects 2',
        'heading': 'Browse Our Subjects',
        'description': 'Our subjects are the bestest',
        'heading_image': {
            'id': 1098,
            'meta': {
                'width': 400,
                'height': 300,
                'type': 'wagtailimages.Image',
                'detail_url': 'http://openstax.org/apps/cms/api/v2/images/1098/',
                'download_url': '/media/original_images/sample-birch-400x300.jpg'
            },
            'title': 'sample-birch-400x300'
        },
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
                'id': '4bacfe26-f7d7-4dfd-899a-f3f89cbf58f8'
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
                'id': 'bd1f6927-7062-48d9-86e5-c1ecaa13ff6e'
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
                'id': '6de03e3e-1601-477d-9917-c9b0a5aec5f0'
            }
        ],
        'philanthropic_support': 'With philanthropic support, our books have been used in <strong>38,160<strong> classrooms, saving students <strong>$1,747,190,405<strong> since 2012. <a href=\'https://openstax.org/impact\'>Learn more about our impact</a> and how you can help.',
        'subjects': {
            'Social Sciences': {
                'icon': null,
                'categories': []
            },
            'Humanities': {
                'icon': null,
                'categories': []
            },
            'Business': {
                'icon': null,
                'categories': []
            },
            'Essentials': {
                'icon': null,
                'categories': []
            },
            'College Success': {
                'icon': null,
                'categories': []
            },
            'High School': {
                'icon': null,
                'categories': []
            },
            'Math': {
                'icon': '/media/original_images/subj-icon-calculator.png',
                'categories': [
                    'College Algebra',
                    'Calculus'
                ]
            },
            'Science': {
                'icon': '/media/original_images/subj-icon-science.png',
                'categories': [
                    'Chemistry'
                ]
            }
        },
        'translations': [],
        'promote_image': null
    }
    );

    /*
    if (data) {
        // pageDescription is used in hero
        data.heroImage = 'https://via.placeholder.com/328x323/?text="student sitting"';
        // Some indicator for whether there is a separate page for particular subjects?
        // In the design, one-book subjects did not have separate pages (Success, Humanities)
        data.tutorAd = {
            image: '/images/subjects/tutor-computer.svg',
            heading: 'Instructors, assign homework and readings synced with OpenStax textbooks',
            html: `<b>OpenStax courseware</b> is currently available for use
            with our Business textbook “Entrepreneurship”.`,
            ctaText: 'Learn more',
            ctaLink: '/openstax-tutor'

        };
        data.aboutOpenstax = {
            heading: 'About OpenStax textbooks',
            paragraph: `OpenStax is part of Rice University, a 501(c)(3) nonprofit charitable
            corporation. As an educational initiative, it's our mission to transform learning so
            that education works for every student. We are improving access to education for
            millions of learners by publishing high-quality, peer-reviewed, openly licensed
            college textbooks that are available free online. We currently offer 10 free business
            textbooks, and our library is only growing: Business Ethics, Business Law I Essentials,
            Entrepreneurship, Introduction to Business, Introduction to Intellectual Property,
            Introductory Business Statistics, Organizational Behavior, Principles of Accounting,
            Volume 1: Financial Accounting, Principles of Accounting, Volume 2: Managerial
            Accounting, and Principles of Management.`,
            buttonText: 'Learn about OpenStax',
            buttonUrl: '/about',
            imgSrc: 'https://via.placeholder.com/330x293'
        };
        // devStandard entries are used for info boxes and philanthropic support
    }*/

    console.info('Returning NPD', newPageData);
    return newPageData;
    // return data;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SubjectsContextProvider
};

import React from 'react';
// import LoaderPage from '~/components/jsx-helpers/loader-page';
import LazyLoad from 'react-lazyload';
import {transformData, camelCaseKeys} from '~/helpers/page-data-utils';
import Banner from './sections/banner/banner';
import OverlappingQuote from './sections/overlapping-quote/overlapping-quote';
import About from './sections/about/about';
import Promoting from './sections/promoting/promoting';
import Results from './sections/results/results';
import SignUp from './sections/sign-up/sign-up';
import StickyFooter from '~/components/sticky-footer/sticky-footer';
import './assignable.scss';

/* eslint-disable camelcase,max-len */
const pageData = transformData({
    id: 302,
    meta: {
        type: 'pages.InstitutionalPartnerProgramPage',
        detail_url: 'https://dev.openstax.org/apps/cms/api/v2/pages/302/',
        html_url: 'https://dev.openstax.org/assignable/',
        slug: 'assignable',
        show_in_menus: false,
        seo_title: '',
        search_description: '',
        first_published_at: '2019-03-26T13:37:03.328000-05:00',
        alias_of: null,
        parent: {
            id: 29,
            meta: {
                type: 'pages.HomePage',
                detail_url: 'https://dev.openstax.org/apps/cms/api/v2/pages/29/',
                html_url: 'https://dev.openstax.org/'
            },
            title: 'Openstax Homepage'
        },
        locale: 'en'
    },
    title: 'OpenStax Assignable',
    section_1_heading: 'OpenStax Assignable',
    section_1_subheading: 'Flexible learning experiences within your LMS workflow.',
    section_1_description: `<p>Build customized assignments directly in your Learning Management
     System. Designed to keep your students engaged with a wide range of content and question types. 
    </p></p>
    Assignable seamlessly integrates a wealth of enrichment and support materials, documents,
     assessments, and other assets to meet your students’ needs.
    </p>`,
    section_1_link_text: 'Apply now',
    section_1_link: 'http://openstax.org/assignable-application',
    section_1_background_image: {
        id: 611,
        meta: {
            width: 3200,
            height: 1254,
            type: 'wagtailimages.Image',
            detail_url: 'https://dev.openstax.org/apps/cms/api/v2/images/611/',
            download_url: 'https://assets.openstax.org/oscms-dev/media/original_images/hero2x.png'
        },
        title: 'hero@2x.png'
    },
    quote: 'It\'s not clear we have anything to put here, but I left it to keep the option open.',
    quote_name: 'Roy Johnson',
    quote_title: 'Website developer',
    quote_school: 'OpenStax',
    section_2_heading: 'Assignable: Easy to find, easy to view, and easy to assign. 100% free.',
    section_2_description: `
    This fall, instructors will be able to:
    <ul>
    <li>Assign OpenStax readings from select textbooks directly within their LMS</li>
    <li>Assign pre- and post-reading assessment questions</li>
    <li>Assign additional culturally responsive and interactive materials from the OpenStax Resource Library</li>
    </ul>
    <p>
    In the future, Assignable will meet more core instructor and student needs by providing more content,
     courses, and insights to ensure academic success.</p>

    `,
    section_2_image: {
        id: 598,
        meta: {
            width: 436,
            height: 468,
            type: 'wagtailimages.Image',
            detail_url: 'https://dev.openstax.org/apps/cms/api/v2/images/598/',
            download_url: 'https://assets.openstax.org/oscms-dev/media/original_images/image_PgSZbHq.png'
        },
        title: 'image.png'
    },
    section_2_image_alt: 'A view of Rice',
    section_3_heading1: 'Courses available as of Fall 2023:',
    section_3_courses1: [
        'Anatomy & Physiology 2e',
        'Biology 2e',
        'Concepts of Biology'
    ],
    section_3_heading2: 'Coming soon:',
    section_3_courses2: [
        'Sociology 3e',
        'Psychology 2e',
        'U.S. History',
        '& more'
    ],
    section_3_html: `
    <p>Want to see your OpenStax book in Assignable? Let us know <a href="/contact">here</a>. </p>
    `,
    section_6_cards: [
        {
            heading: 'Instructors',
            info_link_text: 'Learn more about OpenStax Assignable',
            info_link_url: 'info_link_url',
            help_link_text: 'Help articles',
            help_link_url: 'help-link-url'
        },
        {
            heading: 'Administrators',
            info_link_text: 'Add OpenStax Assignable to your LMS now',
            info_link_url: 'info_link_url',
            help_link_text: 'Help articles',
            help_link_url: 'help-link-url'
        }
    ],
    section_6_html: `
    <a href="/contact">Request access to our VPAT & HECVAT forms</a>
    `,
    section_9_heading: 'Guessing they follow this link that presents TOS',
    section_9_submit_url: 'http://www2.openstax.org/l/218812/2019-05-10/9v99x',
    section_9_button_text: 'Get started',
    section_9_contact_html: '<p></p>'
});
/* eslint-enable camelcase,max-len */

function unprefixKey(newObject, oldKey, prefix, data) {
    const newKey = oldKey.replace(prefix, '');

    newObject[newKey] = data[oldKey];
    return newObject;
}

function sectionData(data, sectionNumber) {
    const sectionPrefix = `section_${sectionNumber}_`;

    return camelCaseKeys(
        Reflect.ownKeys(data)
            .filter((k) => k.startsWith(sectionPrefix))
            .reduce(
                (a, oldKey) => unprefixKey(a, oldKey, sectionPrefix, data), {}
            )
    );
}

function quoteData(data) {
    return Reflect.ownKeys(data)
        .filter((k) => k.startsWith('quote'))
        .reduce(
            (a, oldKey) => unprefixKey(a, oldKey, 'quote_', data), {}
        );
}

function Assignable({data}) {
    const leftButton = {
        descriptionHtml: data.section_1_description,
        text: data.section_1_link_text,
        link: data.section_1_link
    };

    console.info('Section three is', sectionData(data, 3));

    return (
        <React.Fragment>
            <Banner {...sectionData(data, 1)} />
            <OverlappingQuote {...quoteData(data)} />
            <About {...sectionData(data, 2)} />
            <LazyLoad>
                <Promoting {...sectionData(data, 3)} />
            </LazyLoad>
            <LazyLoad>
                <Results {...sectionData(data, 6)} />
            </LazyLoad>
            <LazyLoad>
                <SignUp {...sectionData(data, 9)} />
                <StickyFooter leftButton={leftButton} />
            </LazyLoad>
        </React.Fragment>
    );
}

// const slug = 'pages/assignable';

export default function PageLoader() {
    return (
        <main className="assignable page">
            <Assignable data={pageData} />
        </main>
    );
}

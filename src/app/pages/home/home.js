import React from 'react';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import LazyLoad from 'react-lazyload';
import Banner from './banner/banner';
import Features from './features/features';
import Quotes from './quotes/quotes';
import Tutor from './tutor/tutor';
import WhatsOpenStax from './whats-openstax/whats-openstax';
import './home.scss';

const slug = 'pages/openstax-homepage';

function Homepage({data}) {
    // Until we get real data
    data.banner = {
        headline: 'Free and flexible textbooks and resources.',
        description: `<b>Create a free account</b> for full access to our free
        textbooks and resources.`,
        leftImage: '/images/home/bg-pluses.png',
        rightImage: '/images/home/books-devices.png'
    };
    data.features = {
        headline: 'More than just books.',
        tab1Heading: 'For instructors',
        tab2Heading: 'For students',
        tab1Features: [
            'LMS integration',
            'Test banks',
            'Answer guides',
            'Powerpoint slides'
        ],
        tab1ExploreUrl: 'http://www.google.com',
        tab2Features: [
            'Highlighting',
            'Note-taking',
            'Multiple different book formats',
            'Low cost or free'
        ],
        tab2ExploreUrl: '/subjects',
        bgImage: '/images/home/bg-pluses.png'
    };
    data.quotes = {
        headline: 'Improving education for students and instructors.',
        studentQuote: `I was assigned the OpenStax Psychology textbook in my
        first psychology course. <b>I thought it was great that the book was free
        online.</b> I thought it was even better that I could get the physical book,
        brand new for $30 because that's how I learn best. <b>I feel like the book
        helped my instructor bring in more real world, relatable examples
        because it was so current.</b>`,
        studentAttribution: 'Christine Mompoint, student at Houston Community College',
        instructorQuote: `OpenStax has changed the way I teach this subject and
        the way my students navigate the learning process.`,
        instructorAttribution: 'Instructor at Midlands College',
        studentImage: '/images/home/student.png',
        instructorImage: '/images/home/instructor.png'
    };
    data.tutor = {
        logoUrl: '/images/home/tutor-logo.svg',
        description: `OpenStax Tutor, our courseware platform, costs only $10
        per student, and enables better learning for your students and easy
        course creation for you. With digital reading, personalized homework, a
        library of thousands of assessments, and LMS integration, OpenStax Tutor
        works well for online, hybrid, and in-person courses.`,
        readingIcon: 'https://assets.openstax.org/oscms-dev/media/original_images/books3x.png',
        readingText: 'Digital reading',
        lmsIcon: 'https://assets.openstax.org/oscms-dev/media/original_images/data-science3x.png',
        lmsText: 'LMS integration',
        homeworkIcon: 'https://assets.openstax.org/oscms-dev/media/original_images/lms3x.png',
        homeworkText: 'Personalized homework',
        analyticsIcon: 'https://assets.openstax.org/oscms-dev/media/original_images/learning3x.png',
        analyticsText: 'Analytics'
    };
    data.whatsOpenstax = {
        imageUrl: 'https://assets.openstax.org/oscms-prodcms/media/original_images/summer_interns_portraits-33.original.jpg',
        headline: 'What’s OpenStax',
        description: `OpenStax is part of Rice University, which is a 501(c)(3)
        nonprofit charitable corporation. Our mission is to improve educational
        access and learning for everyone. We do this by publishing openly
        licensed books, developing and improving research-based courseware,
        establishing partnerships with educational resource companies, and more.`,
        donateText: 'We couldn’t do what we do without the help of our generous supporters.',
        giveLink: '/give',
        giveText: 'Give today',
        learnMoreLink: '/about',
        learnMoreText: 'Learn more about OpenStax'
    };

    return (
        <React.Fragment>
            <Banner data={data.banner} />
            <Features data={data.features} />
            <LazyLoad once offset={100} height={400}>
                <Quotes data={data.quotes} />
            </LazyLoad>
            <LazyLoad once offset={100} height={400}>
                <Tutor data={data.tutor} />
            </LazyLoad>
            <LazyLoad once offset={100} height={400}>
                <WhatsOpenStax data={data.whatsOpenstax} />
            </LazyLoad>
        </React.Fragment>
    );
}

export default function HomepageLoader() {
    return (
        <main className="home page">
            <LoaderPage slug={slug} Child={Homepage} doDocumentSetup />
        </main>
    );
}

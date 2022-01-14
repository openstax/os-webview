import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import usePageData from '~/components/jsx-helpers/page-loader';
import useLanguageContext from '~/contexts/language';

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
    }

    return data;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SubjectsContextProvider
};

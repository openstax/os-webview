import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import usePageData from '~/helpers/use-page-data';
import useLanguageContext from '~/contexts/language';
import type {LocaleEntry} from '~/components/language-selector/language-selector';
import type {InfoBox} from './info-boxes';
import type {TutorValue} from './tutor-ad';
import {toNumber} from 'lodash';

type DevStandardKeys = 'devStandard1Heading';
type DevStandardPair = {[key in DevStandardKeys]: string};
export type SubjectData = {
    icon: string;
    categories: string[];
};
export type ImageData = {
    id: number;
    title: string;
    file: string;
};
type SubjectsPageData = {
    title: string;
    pageDescription: string;
    subjects: {[key: string]: SubjectData};
    translations: Array<{value: LocaleEntry[]}>;
    books?: {
        bookState: string;
    }[];
    aboutBlurbs?: ReturnType<typeof aboutBlurbs>;
    heading: string;
    description: string;
    headingImage: {
        meta: {
            downloadUrl: string;
        };
    };
    infoBoxes: InfoBox[];
    tutorAd: [
        {
            value: TutorValue;
        }
    ];
    philanthropicSupport: string;
};

// The Page data before DevStandardPair is translated to aboutBlurbs
type RawPageData = SubjectsPageData & DevStandardPair;

const preserveWrapping = true;
const icons = [
    '/dist/images/subjects/author-icon.svg',
    '/dist/images/subjects/scope-icon.svg',
    '/dist/images/subjects/review-icon.svg'
];

function aboutBlurbs(model: RawPageData) {
    const textData = (Reflect.ownKeys(model) as string[])
        .filter((k) => (/^devStandard\d/).test(k))
        .reduce((a, b) => {
            const [_, num, textId] = b.match(/(\d+)(\w+)/) as string[];
            const index = toNumber(num) - 1;

            a[index] = a[index] || {};
            a[index][textId.toLowerCase()] = model[b as DevStandardKeys];
            a[index].iconUrl = icons[index];
            return a;
        }, [] as {[key: string]: string}[]);

    return textData;
}

function useContextValue() {
    const [slug, setSlug] = React.useState('new-subjects');
    const data = usePageData<RawPageData>(`pages/${slug}`, preserveWrapping);
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

    return data as SubjectsPageData;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as SubjectsContextProvider};

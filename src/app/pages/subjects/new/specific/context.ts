import React from 'react';
import usePageData from '~/helpers/use-page-data';
import buildContext from '~/components/jsx-helpers/build-context';
import {setPageTitleAndDescriptionFromBookData} from '~/helpers/use-document-head';
import {ImageData} from '../context';
import type {InfoBoxValues} from '../info-boxes';
import type { AboutOsData } from '../about-openstax';
import {LocaleEntry} from '~/components/language-selector/language-selector';
import type {OsTextbookCategory} from './learn-more';

// There will be more, but this is what I need for now
export type Book = {
    id: number;
    slug: string;
    title: string;
    webviewRexLink: string;
    webviewLink: string;
    highResolutionPdfUrl: string;
    lowResolutionPdfUrl: string;
    coverUrl: string;
    bookstoreComingSoon: boolean;
    description: string;
};

export type CategoryData = {
    books: {
        [title: string]: [Book];
    };
    categoryDescription: string;
};

type SubjectEntry = {
    [title: string]: {
        categories: CategoryData[];
    };
};

type SectionContent = {
    heading: string;
    linkHref: string;
    linkText: string;
};

type SectionInfo = {
    content: SectionContent & {
        image: ImageData;
        adHtml: string;
    };
};

type WebinarSectionInfo = {
    content: SectionContent & {
        webinarDescription: string;
    };
};

type BlogSectionInfo = {
    content: SectionContent & {
        blogDescription: string;
    };
};

type SpecificSubjectPageData = {
    translations?: [LocaleEntry[]];
    title?: string;
    subjects?: SubjectEntry;
    tutorAd: SectionInfo;
    aboutOs: {content: AboutOsData};
    webinarHeader: WebinarSectionInfo;
    infoBoxes: InfoBoxValues;
    blogHeader: BlogSectionInfo;
    osTextbookHeading: string;
    osTextbookCategories: [OsTextbookCategory[]];
    pageDescription: string;
    learnMoreAboutBooks: string;
    learnMoreBlogPosts: string;
    learnMoreWebinars: string;
};

const preserveWrapping = false;

function useContextValue(slug: string) {
    const data = usePageData<SpecificSubjectPageData>(
        `pages/${slug}-books?type=pages.Subject`,
        preserveWrapping
    );
    const categories = React.useMemo(() => {
        if (!data) {
            return [];
        }

        const {subjects, title} = data;

        if (subjects && title && subjects[title]) {
            return Object.entries(subjects[title].categories);
        }
        console.warn('Specific subjects and title need to be defined');
        return [];
    }, [data]);

    React.useEffect(() => {
        if (data) {
            setPageTitleAndDescriptionFromBookData(data);
        }
    }, [data]);

    return {...data, categories};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SpecificSubjectContextProvider
};

import React from 'react';
import { LocaleEntry } from '~/components/language-selector/language-selector';

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
};

type Category = [
    string, {
        books: {
            [title: string]: [Book]
        }
    }
];

type SubjectEntry = {
    [title: string]: {
        categories: Category[];
    }
};

type SectionContent = {
    heading: string;
    linkHref: string;
    linkText: string;
};

type SectionInfo = {
    content: SectionContent & {
        image: string;
        adHtml: string;
    }
};

type WebinarSectionInfo = {
    content: SectionContent & {
        webinarDescription: string;
    }
};

type InfoBox = {
    image: string;
    heading: string;
    text: string;
}

type SpecificSubjectPageData = {
    translations?: [LocaleEntry[]];
    title?: string;
    subjects?: SubjectEntry;
    tutorAd: SectionInfo;
    aboutOs: SectionInfo;
    webinarHeader: WebinarSectionInfo;
    infoBoxes: [InfoBox[]];
};

export default function (): SpecificSubjectPageData;

type ProviderArgs = {
    contextValueParameters: string;
};
export function SpecificSubjectContextProvider(
    args: React.PropsWithChildren<ProviderArgs>
): React.ReactNode;

import {useState} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
export type LocaleType = {
    locale: string;
};
export type TranslationType = Array<LocaleType & {slug: string}>;
type WebinarContent = {
    content: {
        heading: string;
        link: string;
        content: string;
    };
};
type StuffContent = {
    content: {
        id: number;
        buttonText: string | null;
        buttonUrl: string | null;
        content: string;
        contentLoggedIn: string;
        heading: string;
    };
};
type VideoContent = {
    title: string;
    description: string;
    embed: string;
};
type Author = {
    name: string;
    university: string;
    seniorAuthor?: boolean;
};

export type IsbnType = 'print' | 'printSoftcover' | 'digital' | 'ibook' | 'ibookVolume2';

export type ContextValues = {
    slug: string;
    translations: Array<TranslationType>;
    bookState: string;
    comingSoon: boolean;
    coverColor: string;
    meta: LocaleType;
    reverseGradient: boolean;
    title: string;
    titleImageUrl: string;
    communityResourceHeading: string;
    communityResourceLogoUrl: string;
    communityResourceUrl: string;
    communityResourceCta: string;
    communityResourceBlurb: string;
    communityResourceFeatureLinkUrl: string;
    communityResourceFeatureText: string;
    amazonIframe: string;
    webinarContent?: WebinarContent;
    freeStuffStudent: StuffContent;
    freeStuffInstructor: StuffContent;
    videos: [VideoContent[]];
    setUseCardBackground: React.Dispatch<React.SetStateAction<boolean>>;
    authors: Author[];
    created: string;
    updated: string;
    coverUrl: string;
    webviewRexLink: string;
    webviewLink: string;
    errataContent: string;
    cnxId: string;
    publishDate: string;
    printIsbn10: string;
    printIsbn13: string;
    printSoftcoverIsbn10: string;
    printSoftcoverIsbn13: string;
    digitalIsbn10: string;
    digitalIsbn13: string;
    ibookIsbn10: string;
    ibookIsbn13: string;
    ibookVolume2Isbn10: string;
    ibookVolume2Isbn13: string;
    lastUpdatedWeb: string;
    lastUpdatedPdf: string;
    licenseName: string;
    licenseText: string;
    licenseTitle: string;
    licenseVersion: string;
    licenseIcon: string;
};

function useContextValue({data}: {data: ContextValues}) {
    const [useCardBackground, setUseCardBackground] = useState(false);

    data.comingSoon = data.bookState === 'coming_soon';

    return {...data, useCardBackground, setUseCardBackground};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as DetailsContextProvider};

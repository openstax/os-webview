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
}
type StuffContent = {
    content: {
        id: number;
        buttonText: string | null;
        buttonUrl: string | null;
        content: string;
        contentLoggedIn: string;
        heading: string;
    };

}
type VideoContent = {
    title: string;
    description: string;
    embed: string;
}
export type ContextValues = {
    slug: string;
    translations: Array<TranslationType>;
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
};

export default function (): ContextValues;

export function DetailsContextProvider({
    data
}: {
    data: Omit<ContextValues, 'comingSoon'>;
}): null;

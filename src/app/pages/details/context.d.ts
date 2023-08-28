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
    webinarContent?: WebinarContent;
};

export default function (): ContextValues;

export function DetailsContextProvider({
    data
}: {
    data: Omit<ContextValues, 'comingSoon'>;
}): null;

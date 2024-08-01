import buildContext from '~/components/jsx-helpers/build-context';
import usePageData from '~/helpers/use-page-data';

type FeaturedInRollup = {
    name: string;
    url: string;
    image: string;
};

// This will need more filling in as other components move to TSX
type PressPageData = {
    meta: object;
    mentions: {
        date: string;
        featuredIn: boolean;
        headline: string;
        source: {
            id: number;
            logo: string;
            name: string;
        };
        url: string;
    }[];
    featuredIn: FeaturedInRollup[];
}

function useContextValue() {
    const value = usePageData<PressPageData>('press');

    if (value) {
        value.featuredIn = value.mentions.filter(
            (m) => m.featuredIn
        ).map(
            (m) => ({
                name: m.source.name,
                url: m.url,
                image: m.source.logo
            })
        );
    }

    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as PageContextProvider};

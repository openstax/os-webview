import buildContext from '~/components/jsx-helpers/build-context';
import usePageData from '~/helpers/use-page-data';

function useContextValue() {
    const value = usePageData('press');

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

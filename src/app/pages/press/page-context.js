import buildContext from '~/components/jsx-helpers/build-context';
import usePageData from '~/helpers/use-page-data';

function useContextValue() {
    return usePageData('press');
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as PageContextProvider
};

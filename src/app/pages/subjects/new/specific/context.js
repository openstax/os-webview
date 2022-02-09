import usePageData from '~/components/jsx-helpers/page-loader';
import buildContext from '~/components/jsx-helpers/build-context';

const preserveWrapping = false;

function useContextValue(slug) {
    return usePageData(`pages/${slug}`, preserveWrapping);
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SpecificSubjectContextProvider
};

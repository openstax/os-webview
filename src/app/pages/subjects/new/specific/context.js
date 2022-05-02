import usePageData from '~/components/jsx-helpers/page-loader';
import buildContext from '~/components/jsx-helpers/build-context';

const preserveWrapping = false;

function useContextValue(slug) {
    const data = usePageData(`pages/${slug}?type=pages.Subject`, preserveWrapping);

    return data;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SpecificSubjectContextProvider
};

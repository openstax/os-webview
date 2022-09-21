import buildContext from '~/components/jsx-helpers/build-context';
import {usePageData} from '~/helpers/controller/cms-mixin';

const fpdParams = {slug: 'press'};

function useContextValue() {
    const [data] = usePageData(fpdParams);

    return data;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as PageContextProvider
};

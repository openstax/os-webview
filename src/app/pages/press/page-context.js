import buildContext from '~/components/jsx-helpers/build-context';
import {usePageData} from '~/helpers/controller/cms-mixin';

function useContextValue() {
    const [data] = usePageData({slug: 'press'});

    return data;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as PageContextProvider
};

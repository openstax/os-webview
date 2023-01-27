import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue({data}) {
    data.comingSoon = data.bookState === 'coming_soon';

    return data;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as DetailsContextProvider
};

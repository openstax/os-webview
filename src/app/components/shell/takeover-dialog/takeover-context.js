import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue({close}) {
    return {close};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as TakeoverContextProvider
};

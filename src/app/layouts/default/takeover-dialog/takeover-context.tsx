import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue({close}: {close: () => void}) {
    return {close};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as TakeoverContextProvider
};

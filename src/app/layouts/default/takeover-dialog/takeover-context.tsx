import buildContext from '~/components/jsx-helpers/build-context';

type ContextValueParameters = {
    close: () => void;
};

function useContextValue({close}: ContextValueParameters) {
    return {close};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as TakeoverContextProvider};

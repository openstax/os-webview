import {useErrorBoundary} from 'preact/hooks';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue() {
    useErrorBoundary();

    return {};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as RouterContextProvider};

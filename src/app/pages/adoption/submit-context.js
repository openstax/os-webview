import buildContext from '~/components/jsx-helpers/build-context';
import {useState} from 'react';

function useContextValue() {
    const [currentBook, setCurrentBook] = useState();

    return {currentBook, setCurrentBook};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SubmitContextProvider
};

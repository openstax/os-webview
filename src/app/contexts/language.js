import {useReducer} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue() {
    const [language, setLanguage] = useReducer(
        (_, newValue) => {
            window.localStorage.oswebLanguage = newValue;
            return newValue;
        }
        , window.localStorage.oswebLanguage || 'en'
    );

    return {language, setLanguage};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as LanguageContextProvider
};

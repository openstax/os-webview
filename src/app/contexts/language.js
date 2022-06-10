import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue() {
    const [language, setLanguage] = useState(window.localStorage?.getItem('oswebLanguage') || 'en');

    useEffect(
        () => window.localStorage?.setItem('oswebLanguage', language),
        [language]
    );

    return {language, setLanguage};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as LanguageContextProvider
};

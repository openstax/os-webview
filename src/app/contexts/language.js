import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue() {
    const [language, setLanguage] = React.useState(window.localStorage.getItem('oswebLanguage') || 'en');

    // Copy it to localStorage for later defaulting
    React.useEffect(
        () => window.localStorage.setItem('oswebLanguage', language),
        [language]
    );

    return {language, setLanguage};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as LanguageContextProvider
};

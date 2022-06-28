import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import {IntlProvider} from 'react-intl';
import English from '~/lang/en';
import Spanish from '~/lang/es';

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

function ReactIntlUsingLanguage({children}) {
    const {language} = useContext();
    const messages = React.useMemo(
        () => {
            switch (language) {
            case 'es': return Spanish;
            default: return English;
            }
        },
        [language]
    );

    return (
        <IntlProvider locale={language} messages={messages}>
            {children}
        </IntlProvider>
    );
}

function WrapReactIntl({children}) {
    return (
        <ContextProvider>
            <ReactIntlUsingLanguage>
                {children}
            </ReactIntlUsingLanguage>
        </ContextProvider>
    );
}

export {
    useContext as default,
    WrapReactIntl as LanguageContextProvider
};

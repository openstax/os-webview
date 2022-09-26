import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import cookie from '~/helpers/cookie';
import {useSettable} from '~/helpers/data';

function useWalkthroughCookie() {
    return useSettable(
        () => window.localStorage.showMyOpenStaxWalkthrough && !cookie.hash.walkthroughDone,
        (doUpdate=true) => {
            if (doUpdate) {
                cookie.setKey('walkthroughDone');
            }
        }
    );
}

function useContextValue() {
    const value = useWalkthroughCookie();
    const [_, dispatch] = value;

    // Refreshing picks up a value that might have been updated elsewhere
    React.useEffect(
        () => {
            const refresh = () => dispatch(false);

            window.addEventListener('navigate', refresh);

            return () => window.removeEventListener('navigate', refresh);
        },
        [dispatch]
    );

    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as WalkthroughCookieContextProvider
};

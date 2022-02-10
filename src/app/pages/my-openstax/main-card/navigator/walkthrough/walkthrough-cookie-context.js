import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import cookie from '~/helpers/cookie';

// This is a degenerate reducer based on a cookie value
// If the cookie is not set, returns true
// Dispatch by default sets the cookie, but if called with false just refreshes state
function useWalkthroughCookie() {
    return React.useReducer(
        (_, doUpdate=true) => {
            if (doUpdate) {
                cookie.setKey('walkthroughDone');
            }
            return !cookie.hash.walkthroughDone;
        },
        window.localStorage.showMyOpenStaxWalkthrough && !cookie.hash.walkthroughDone
    );
}

function useContextValue() {
    const value = useWalkthroughCookie();
    const [_, dispatch] = value;

    React.useEffect(() => {
        const refresh = () => dispatch(false);

        window.addEventListener('navigate', refresh);

        return () => window.removeEventListener('navigate', refresh);
    }, [dispatch]);

    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as WalkthroughCookieContextProvider
};

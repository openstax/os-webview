import React from 'react';
import cookie from '~/helpers/cookie';

const WalkthroughCookieContext = React.createContext();

export default WalkthroughCookieContext;

// This is a degenerate reducer based on a cookie value
// If the cookie is not set, returns true
// Dispatch by default sets the cookie, but if called with false just refreshes state
function useWalkthroughCookie() {
    return React.useReducer((_, doUpdate=true) => {
        if (doUpdate) {
            cookie.setKey('walkthroughDone');
        }
        return !cookie.hash.walkthroughDone;
    }, !cookie.hash.walkthroughDone);
}

// It needs to be shared so that all instances react to the cookie being set
export function WalkthroughCookieContextProvider({children}) {
    const value = useWalkthroughCookie();
    const [_, dispatch] = value;

    React.useEffect(() => {
        const refresh = () => dispatch(false);

        window.addEventListener('navigate', refresh);

        return () => window.removeEventListener('navigate', refresh);
    }, [dispatch]);


    return (
        <WalkthroughCookieContext.Provider children={children} value={value} />
    );
}

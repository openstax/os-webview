import React from 'react';
import {useRefreshable} from '~/helpers/data';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue() {
    const [value, refresh] = useRefreshable(() => document.activeElement);
    const blurHandler = React.useCallback(
        ({relatedTarget}) => {
            if (!relatedTarget) {
                refresh();
            }
        },
        [refresh]
    );

    React.useLayoutEffect(() => {
        document.addEventListener('focus', refresh, true);
        document.addEventListener('blur', blurHandler, true);
        refresh();

        return () => {
            document.removeEventListener('focus', refresh, true);
            document.removeEventListener('blur', blurHandler, true);
        };
    }, [refresh, blurHandler]);

    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as ActiveElementContextProvider
};

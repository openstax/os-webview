import {useState} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import cmsFetch from '~/helpers/cms-fetch';
import {usePromise} from '~/helpers/use-data';

const flagPromise = cmsFetch('flags')
    .then(({all_flags: flags}) => flags.reduce(
        (a, f) => {
            a[f.name] = f.feature_active;
            return a;
        },
        {}
    ))
    .catch((err) => {throw new Error(`Unable to get flags: ${err}`);})
;

function useFlags() {
    return usePromise(flagPromise, false);
}

function useContextValue() {
    const flags = useFlags();
    const stickyFooterState = useState(null);

    return {
        flags,
        stickyFooterState
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SharedDataContextProvider
};

import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import cmsFetch from '~/models/cmsFetch';

export const flagPromise = cmsFetch('flags')
    .then(({all_flags: flags}) => flags.reduce(
        (a, f) => {
            a[f.name] = f.feature_active;
            return a;
        },
        {}
    ));

function useContextValue() {
    const [value, setValue] = useState(false);

    useEffect(() => flagPromise.then(setValue), []);

    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as FlagContextProvider
};

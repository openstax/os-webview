import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import cmsFetch from '~/models/cmsFetch';

export const flagPromise = cmsFetch('flags?format=json')
    .then(({all_flags: flags}) => flags.reduce(
        (a, f) => {
            a[f.name] = f.feature_active;
            return a;
        },
        {}
    ))
    .catch((err) => {throw new Error(`Unable to get flags: ${err}`);})
;

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

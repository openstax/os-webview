import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import cmsFetch from '~/models/cmsFetch';

export const flagPromise = cmsFetch('flags?flag=my_openstax')
    .then((obj) => obj.feature_active);

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

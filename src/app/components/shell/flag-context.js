import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import cmsFetch from '~/models/cmsFetch';

export const flagPromise = cmsFetch('flags?flag=enable_my_openstax')
    .then(([obj]) => (/true|on/i).test(obj.conditions[0]?.value));

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

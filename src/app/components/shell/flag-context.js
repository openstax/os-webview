import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import cmsFetch from '~/models/cmsFetch';

function useContextValue() {
    const [value, setValue] = useState(false);

    useEffect(() => {
        cmsFetch('flags?flag=enable_my_openstax')
            .then(([obj]) => setValue((/true|on/i).test(obj.conditions[0]?.value)));
    }, []);

    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as FlagContextProvider
};

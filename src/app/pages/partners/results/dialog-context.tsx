import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue(partner: unknown) {
    const [title, setTitle] = useState('');

    // Reset between partners
    useEffect(() => setTitle(''), [partner]);

    return {
        title,
        setTitle
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as DialogContextProvider};

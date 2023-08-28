import {useState} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue({data}) {
    const [useCardBackground, setUseCardBackground] = useState(false);

    data.comingSoon = data.bookState === 'coming_soon';

    return {...data, useCardBackground, setUseCardBackground};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as DetailsContextProvider
};

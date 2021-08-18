import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import useNavigationContext from '~/pages/my-openstax/main-card/navigator/navigation-context';

function useContextValue() {
    const [selectedBook, setSelectedBook] = React.useState();
    const {activeId} = useNavigationContext();

    React.useEffect(() => {
        setSelectedBook(null);
    }, [activeId]);

    return {
        selectedBook,
        setSelectedBook
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as CollectionContextProvider
};

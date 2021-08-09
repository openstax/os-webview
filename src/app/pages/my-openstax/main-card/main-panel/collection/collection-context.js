import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import NavigationContext from '~/pages/my-openstax/main-card/navigator/navigation-context';

function useContextValue() {
    const [selectedBook, setSelectedBook] = React.useState();
    const {activeId} = React.useContext(NavigationContext);

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

import React from 'react';
import NavigationContext from '~/pages/my-openstax/main-card/navigator/navigation-context';

const CollectionContext = React.createContext();

export function CollectionContextProvider({children}) {
    const [selectedBook, setSelectedBook] = React.useState();
    const {activeId} = React.useContext(NavigationContext);
    const value = {
        selectedBook,
        setSelectedBook
    };

    React.useEffect(() => {
        setSelectedBook(null);
    }, [activeId]);

    return (
        <CollectionContext.Provider value={value} children={children} />
    );
}

export default CollectionContext;

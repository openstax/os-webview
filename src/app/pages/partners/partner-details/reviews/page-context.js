import React, {createContext} from 'react';

const PageContext = createContext();

export default PageContext;

export function PageContextProvider({togglePage, children}) {
    return (
        <PageContext.Provider value={togglePage}>
            {children}
        </PageContext.Provider>
    );
}

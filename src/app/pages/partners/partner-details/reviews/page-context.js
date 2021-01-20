import React, {createContext, useContext} from 'react';
import useReviews from '~/models/reviews';

const PageContext = createContext();

export default PageContext;

export function PageContextProvider({togglePage, children}) {
    return (
        <PageContext.Provider value={togglePage}>
            {children}
        </PageContext.Provider>
    );
}

import React from 'react';
import ContextLoader from '~/components/jsx-helpers/context-loader';

const SubjectsContext = React.createContext();

function useContextValue(data) {
    data.books = data.books.filter((b) => b.bookState !== 'retired');

    return data;
}

export default function useSubjectsContext() {
    return React.useContext(SubjectsContext);
}

export function SubjectsContextProvider({children}) {
    return (
        <ContextLoader
            Context={SubjectsContext}
            slug="books"
            useContextValue={useContextValue}
            preserveWrapping
        >
            {children}
        </ContextLoader>
    );
}

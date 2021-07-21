import React from 'react';
import ContextLoader from '~/components/jsx-helpers/context-loader';

const Context = React.createContext();

function useContextValue(data) {
    data.comingSoon = data.bookState === 'coming_soon';

    return data;
}

function getSlugFromLocation() {
    const bookTitle = window.location.pathname.replace(/.*details\//, '');
    let slug;

    if ((/^books/).test(bookTitle)) {
        slug = bookTitle;
    } else {
        slug = `books/${bookTitle}`;
    }
    // Special handling for books whose slugs have changed
    if ((/university-physics$/).test(slug)) {
        slug += '-volume-1';
    }

    return slug;
}

export function DetailsContextProvider({children}) {
    return (
        <ContextLoader
            Context={Context}
            slug={getSlugFromLocation()}
            useContextValue={useContextValue}
            doDocumentSetup
        >
            {children}
        </ContextLoader>
    );
}

export default function useDetailsContext() {
    return React.useContext(Context);
}

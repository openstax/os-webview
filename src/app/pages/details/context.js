import React from 'react';
import {useLocation} from 'react-router-dom';
import buildContextLoader from '~/components/jsx-helpers/context-loader';
import buildContext from '~/components/jsx-helpers/build-context';

/*
    Managing the slug requires a Context
*/
function getSlugFromLocation(pathname) {
    const bookTitle = pathname.replace(/.*details\//, '');
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

function useSlugContextValue() {
    const {pathname} = useLocation();
    const slug = getSlugFromLocation(pathname);

    return {slug};
}

const {
    useContext: useSlugContext,
    ContextProvider: SlugContextProvider
} = buildContext({useContextValue: useSlugContextValue});

// ------

function useContextValue(data) {
    data.comingSoon = data.bookState === 'coming_soon';
    data.language = data.meta.locale;

    return data;
}

const {useContext, ContextLoader} = buildContextLoader();

function DetailsLoader({children}) {
    const {slug} = useSlugContext();

    return (
        <ContextLoader
            slug={slug}
            useContextValue={useContextValue}
            doDocumentSetup
        >
            {children}
        </ContextLoader>
    );
}

export function DetailsContextProvider({children}) {
    return (
        <SlugContextProvider>
            <DetailsLoader>
                {children}
            </DetailsLoader>
        </SlugContextProvider>
    );
}

export default useContext;

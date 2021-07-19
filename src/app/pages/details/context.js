import React from 'react';
import buildContextLoader from '~/components/jsx-helpers/context-loader';
import buildContext from '~/components/jsx-helpers/build-context';
import useLanguageContext from '~/models/language-context';
import routerBus from '~/helpers/router-bus';

/*
    Managing the slug requires a Context
*/
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

function useSlugContextValue() {
    const [slug, setSlug] = React.useState(getSlugFromLocation());

    return {slug, setSlug};
}

const {
    useContext: useSlugContext,
    ContextProvider: SlugContextProvider
} = buildContext({useContextValue: useSlugContextValue});

// ------

function useSlugTiedToLocation(data) {
    const {slug, setSlug} = useSlugContext();
    const {language} = useLanguageContext();

    /*
        Compare language to available translations
        If it matches, we need to switch the data
        1. Get the new slug
        2. Swap it for the old slug in the Location
        3. Navigate there and update slug
    */
    React.useEffect(() => {
        if (!data) {
            return;
        }
        const foundTranslation = (data.translations[0] || []).find((tr) => tr.locale === language);

        if (foundTranslation) {
            routerBus.emit('navigate', `/details/${foundTranslation.slug}`);
            setSlug(`books/${foundTranslation.slug}`);
        }
    }, [language, data, setSlug, slug]);
}

function useContextValue(data) {
    data.comingSoon = data.bookState === 'coming_soon';

    useSlugTiedToLocation(data);

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

import React, {useState} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import fetchBooks from '~/models/books';
import {useLocation} from 'react-router-dom';
import {useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {urlFromSlug} from '~/models/cmsFetch';

// const queryDict = $.parseSearchString(window.location.search);
//
// if (userInfo.accounts_id) {
//     const entry = books.find((info) => info.title === title);
//     const infoUrl = urlFromSlug(`books/${entry.meta.slug}`);
//
//     fetch(infoUrl).then((r) => r.json()).then((bookInfo) => {
//         setModel({
//             defaultEmail: userInfo.email,
//             submittedBy: userInfo.id,
//             selectedTitle: title,
//             title: `Suggest a correction for ${title}`,
//             isTutor: Boolean(bookInfo.tutor_marketing_book),
//             mode: 'form',
//             books,
//             location: queryDict.location && queryDict.location[0],
//             source: queryDict.source && queryDict.source[0]
//         });
//     });
// } else {
//     window.location = linkHelper.loginLink();
// }

function useBookInfo(selectedBook) {
    const [info, setInfo] = useState();

    React.useEffect(() => {
        if (selectedBook) {
            const slug = selectedBook.meta?.slug;

            if (slug) {
                const infoUrl = urlFromSlug(`books/${slug}`);

                fetch(infoUrl).then((r) => r.json()).then(setInfo);
            } else {
                setInfo({error: 'not found'});
            }
        }
    }, [selectedBook]);

    return info;
}

function useSearchParams() {
    const {search} = useLocation();

    return React.useMemo(() => new window.URLSearchParams(search), [search]);
}

function useContextValue() {
    const searchParams = useSearchParams();
    const initialTitle = React.useMemo(() => searchParams.get('book'), [searchParams]);
    const [title, setTitle] = useState(initialTitle);
    const books = useDataFromPromise(fetchBooks);
    const selectedBook = React.useMemo(
        () => books?.find((b) => b.title === title) || {},
        [books, title]
    );
    const bookInfo = useBookInfo(selectedBook);
    const [hasError, setHasError] = useState('You have not completed the form');
    const [hideErrors, setHideErrors] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const validateBeforeSubmitting = React.useCallback(
        (event) => {
            event.preventDefault();
            setHideErrors(false);
            if (!hasError) {
                setSubmitting(true);
            }
        },
        [setHideErrors, hasError, setSubmitting]
    );

    return {
        selectedBook,
        isTutor: Boolean(bookInfo?.tutor_marketing_book),
        books,
        hasError, setHasError,
        hideErrors,
        submitting,
        validateBeforeSubmitting,
        searchParams,
        title,
        setTitle
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as ErrataFormContextProvider
};

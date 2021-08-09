import {useState, useEffect} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import useLanguageContext from '~/models/language-context';
import cmsFetch from './cmsFetch';

function useContextValue() {
    const {language} = useLanguageContext();
    const [value, setValue] = useState([]);

    useEffect(() => {
        cmsFetch(`books?format=json&locale=${language}`)
            .then((r) => r.books.filter((b) => b.book_state !== 'retired'))
            .then(setValue);
    }, [language]);

    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as BooksContextProvider
};

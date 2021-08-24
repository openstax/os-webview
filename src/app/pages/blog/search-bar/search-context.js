import {useState} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import useBlogContext from '../blog-context';

function useContextValue() {
    const {setPath} = useBlogContext();
    const [searchString, setSearchString] = useState(decodeURIComponent(window.location.search.substr(1)));

    function doSearch() {
        setPath(`/blog/?${searchString}`);
    }

    return {searchString, setSearchString, doSearch};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as SearchContextProvider
};

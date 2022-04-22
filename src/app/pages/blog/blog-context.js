import React from 'react';
import {useHistory} from 'react-router-dom';
import buildContextLoader from '~/components/jsx-helpers/context-loader';
import useLatestBlogEntries from '~/models/blog-entries';

const stayHere = {path: '/blog'};

function useContextValue() {
    const history = useHistory();
    const pinnedData = useLatestBlogEntries(1);
    const pinnedStory = pinnedData && pinnedData[0];
    const totalCount = pinnedData?.totalCount;

    function setPath(href) {
        const {pathname, search, hash} = new window.URL(href, window.location.href);

        history.push(`${pathname}${search}${hash}`, stayHere);
        window.scrollTo(0, 0);
    }

    return {
        setPath, pinnedStory, totalCount
    };
}

const {useContext, ContextLoader} = buildContextLoader();

export function BlogContextProvider({children}) {
    return (
        <ContextLoader
            slug="news" useContextValue={useContextValue}
            doDocumentSetup noCamelCase
        >
            {children}
        </ContextLoader>
    );
}

export default useContext;

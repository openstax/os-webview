import React from 'react';
import {useHistory} from 'react-router-dom';
import buildContextLoader from '~/components/jsx-helpers/context-loader';
import {useDataFromSlug} from '~/components/jsx-helpers/jsx-helpers.jsx';
import $ from '~/helpers/$';

const stayHere = {path: '/blog'};
const fields = [
    'title', 'id', 'article_image', 'featured_image_alt_text', 'heading',
    'subheading', 'body_blurb', 'date', 'author'
].join(',');
const pageSize = 6;

function useLimit() {
    const [limit, dispatchLimit] = React.useReducer((state, action) => {
        switch (action) {
        case 'more':
            return state + pageSize;
        case 'fewer':
            return Math.max(state - pageSize, pageSize);
        default:
            console.warn('Unknown action for article limit', action);
            return pageSize;
        }
    }, pageSize);

    return {
        pageSize,
        limit,
        moreStories() {
            dispatchLimit('more');
        },
        fewerStories() {
            dispatchLimit('fewer');
        }
    };
}

function useContextValue() {
    const history = useHistory();
    const {limit, moreStories, fewerStories} = useLimit();
    const lsData = useDataFromSlug(
        `pages?type=news.newsArticle&fields=${fields}` +
        `&order=-date&pin_to_top=false&limit=${limit}`
    );
    const latestStories = lsData && $.camelCaseKeys(lsData.items);
    const pinnedData = useDataFromSlug(
        `pages?type=news.newsArticle&fields=${fields}` +
        '&order=-date&pin_to_top=true'
    );
    const pinnedStory = pinnedData && $.camelCaseKeys(pinnedData.items[0]);

    function setPath(href) {
        const {pathname, search, hash} = new window.URL(href, window.location.href);

        history.push(`${pathname}${search}${hash}`, stayHere);
        window.scrollTo(0, 0);
    }

    return {
        setPath, latestStories, pinnedStory,
        limit, pageSize, moreStories, fewerStories
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

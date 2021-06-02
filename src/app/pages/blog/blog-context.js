import React from 'react';
import {useDataFromSlug} from '~/components/jsx-helpers/jsx-helpers.jsx';
import $ from '~/helpers/$';

const BlogContext = React.createContext();
const stayHere = {path: '/blog'};
const fields = [
    'title', 'id', 'article_image', 'featured_image_alt_text', 'heading',
    'subheading', 'body_blurb', 'date', 'author'
].join(',');
const pageSize = 12;

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

function useLocationSynchronizedToPath() {
    const [location, setLocation] = React.useState(window.location);
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

    function syncLocation() {
        setLocation({...window.location});
    }

    React.useEffect(() => {
        // The router refers to history state, to see if it's changing pages
        history.replaceState(stayHere, '');
        window.addEventListener('popstate', syncLocation);

        return () => window.removeEventListener('popstate', syncLocation);
    }, []);

    function setPath(href) {
        history.pushState(stayHere, '', href);
        syncLocation();
        window.scrollTo(0, 0);
    }

    return {
        location, setPath, latestStories, pinnedStory,
        limit, pageSize, moreStories, fewerStories
    };
}

export function BlogContextProvider({children}) {
    const value = useLocationSynchronizedToPath();

    return (
        <BlogContext.Provider value={value} children={children} />
    );
}

export default BlogContext;

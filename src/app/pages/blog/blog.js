import React, {useEffect} from 'react';
import useBlogContext, {BlogContextProvider} from './blog-context';
import {WindowContextProvider} from '~/models/window-context';
import PinnedArticle from './pinned-article/pinned-article';
import UpdateBox from './update-box/update-box';
import DisqusForm from './disqus-form/disqus-form';
import MoreStories from './more-stories/more-stories';
import SearchBar from './search-bar/search-bar';
import SearchResults from './search-results/search-results';
import {ArticleFromSlug} from './article/article';
import timers from './timers';
import './blog.scss';

export function DefaultPage() {
    const {pinnedStory} = useBlogContext();

    return (
        <WindowContextProvider>
            <PinnedArticle />
            <UpdateBox />
            <MoreStories exceptSlug={pinnedStory && pinnedStory.meta.slug} />
        </WindowContextProvider>
    );
}

export function SearchResultsPage() {
    return (
        <React.Fragment>
            <SearchBar />
            <SearchResults />
        </React.Fragment>
    );
}

export function ArticlePage({slug}) {
    return (
        <WindowContextProvider>
            <ArticleFromSlug slug={`news/${slug}`} />
            <DisqusForm />
            <UpdateBox />
            <MoreStories exceptSlug={slug} />
        </WindowContextProvider>
    );
}

function ContentBasedOnLocation() {
    const {location} = useBlogContext();

    useEffect(() => {
        timers.start();

        return () => timers.clear();
    }, [location]);

    const slugMatch = location.pathname.match(/\/blog\/(.+)/);

    if (slugMatch) {
        return (
            <ArticlePage slug={slugMatch[1]} />
        );
    }

    if (location.search) {
        return (
            <SearchResultsPage />
        );
    }

    return (
        <DefaultPage />
    );
}

export default function LoadBlog() {
    return (
        <main className="blog page">
            <BlogContextProvider>
                <ContentBasedOnLocation />
            </BlogContextProvider>
        </main>
    );
}

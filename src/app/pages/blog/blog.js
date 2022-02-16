import React, {useEffect} from 'react';
import useBlogContext, {BlogContextProvider} from './blog-context';
import {Switch, Route, useLocation, useParams} from 'react-router-dom';
import {WindowContextProvider} from '~/contexts/window';
import PinnedArticle from './pinned-article/pinned-article';
import UpdateBox from './update-box/update-box';
import DisqusForm from './disqus-form/disqus-form';
import MoreStories from './more-stories/more-stories';
import SearchBar from './search-bar/search-bar';
import SearchResults from './search-results/search-results';
import {ArticleFromSlug} from './article/article';
import timers from './timers';
import './blog.scss';

export function SearchResultsPage() {
    return (
        <React.Fragment>
            <SearchBar />
            <SearchResults />
        </React.Fragment>
    );
}

export function DefaultPage() {
    const {pinnedStory} = useBlogContext();
    const {search} = useLocation();

    if (search) {
        return (<SearchResultsPage />);
    }
    return (
        <WindowContextProvider>
            <PinnedArticle />
            <UpdateBox />
            <MoreStories exceptSlug={pinnedStory && pinnedStory.meta.slug} />
        </WindowContextProvider>
    );
}

export function ArticlePage() {
    const {slug} = useParams();

    useEffect(
        () => window.scrollTo(0, 0),
        [slug]
    );

    return (
        <WindowContextProvider>
            <ArticleFromSlug slug={`news/${slug}`} />
            <DisqusForm />
            <UpdateBox />
            <MoreStories exceptSlug={slug} />
        </WindowContextProvider>
    );
}

export default function LoadBlog() {
    const location = useLocation();

    useEffect(() => {
        timers.start();

        return () => timers.clear();
    }, [location]);

    return (
        <main className="blog page">
            <BlogContextProvider>
                <Switch>
                    <Route exact path="/blog">
                        <DefaultPage />
                    </Route>
                    <Route path="/blog/:slug">
                        <ArticlePage />
                    </Route>
                </Switch>
            </BlogContextProvider>
        </main>
    );
}

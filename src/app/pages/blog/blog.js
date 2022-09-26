import React, {useEffect} from 'react';
import useBlogContext, {BlogContextProvider} from './blog-context';
import {Routes, Route, useLocation, useParams} from 'react-router-dom';
import {WindowContextProvider} from '~/contexts/window';
import Head from '~/components/jsx-helpers/head';
import ExploreBySubject from './explore/by-subject';
import ExploreCollections from './explore/collections';
import ExplorePage from './explore-page/explore-page';
import PinnedArticle from './pinned-article/pinned-article';
import DisqusForm from './disqus-form/disqus-form';
import MoreStories from './more-stories/more-stories';
import SearchBar, {HeadingAndSearchBar} from './search-bar/search-bar';
import SearchResults from './search-results/search-results';
import LatestBlogPosts from './latest-blog-posts/latest-blog-posts';
import {ArticleFromSlug} from './article/article';
import GatedContentDialog from './gated-content-dialog/gated-content-dialog';
import timers from './timers';
import './blog.scss';

export function SearchResultsPage() {
    const {pageDescription} = useBlogContext();

    return (
        <React.Fragment>
            <Head title="OpenStax Blog Search" description={pageDescription} />
            <div className="boxed left">
                <SearchBar />
            </div>
            <SearchResults />
        </React.Fragment>
    );
}

// Exported so it can be tested
export function MainBlogPage() {
    const {pinnedStory, pageDescription} = useBlogContext();

    return (
        <WindowContextProvider>
            <Head title="OpenStax News" description={pageDescription} />
            <div className="boxed">
                <HeadingAndSearchBar>
                    <h1>OpenStax Blog</h1>
                </HeadingAndSearchBar>
                <ExploreBySubject />
                <ExploreCollections />
                <PinnedArticle />
                <MoreStories exceptSlug={pinnedStory && pinnedStory.meta.slug} />
            </div>
        </WindowContextProvider>
    );
}

// Export so it can be tested
export function ArticlePage() {
    const {slug} = useParams();
    const [articleData, setArticleData] = React.useState();

    useEffect(
        () => window.scrollTo(0, 0),
        [slug]
    );

    return (
        <WindowContextProvider>
            <ArticleFromSlug slug={`news/${slug}`} onLoad={setArticleData} />
            <DisqusForm />
            <div className="boxed">
                <MoreStories exceptSlug={slug} />
            </div>
            <GatedContentDialog articleData={articleData} />
        </WindowContextProvider>
    );
}

export default function LoadBlog() {
    const location = useLocation();
    const TopLevelPage = location.search ? SearchResultsPage : MainBlogPage;

    useEffect(() => {
        timers.start();

        return () => timers.clear();
    }, [location]);

    return (
        <main className="blog page">
            <BlogContextProvider>
                <Routes>
                    <Route path="" element={<TopLevelPage />} />
                    <Route path="latest" element={<LatestBlogPosts />} />
                    <Route path="explore/:exploreType/:topic" element={<ExplorePage />} />
                    <Route path=":slug" element={<ArticlePage />} />
                </Routes>
            </BlogContextProvider>
        </main>
    );
}

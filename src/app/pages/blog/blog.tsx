import React from 'react';
import {Routes, Route, useLocation} from 'react-router-dom';
import LatestBlogPosts from './latest-blog-posts/latest-blog-posts';
import {useCanonicalLink} from '~/helpers/use-document-head';
import {SearchResultsPage, MainBlogPage, ArticlePage} from './blog-pages';
import ExplorePage from './explore-page/explore-page';
import {BlogContextProvider} from './blog-context';

export default function LoadBlog() {
    const location = useLocation();
    const TopLevelPage = location.search ? SearchResultsPage : MainBlogPage;

    useCanonicalLink();

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

import React from 'react';
import {Routes, Route} from 'react-router-dom';
import LatestBlogPosts from './latest-blog-posts/latest-blog-posts';
import {useCanonicalLink} from '~/helpers/use-document-head';
import {MainBlogPage, ArticlePage} from './blog-pages';
import ExplorePage from './explore-page/explore-page';
import {BlogContextProvider} from './blog-context';

export default function LoadBlog() {
    useCanonicalLink();

    return (
        <main className="blog page">
            <BlogContextProvider>
                <Routes>
                    <Route path="" element={<MainBlogPage />} />
                    <Route path="latest" element={<LatestBlogPosts />} />
                    <Route
                        path="explore/:exploreType/:topic"
                        element={<ExplorePage />}
                    />
                    <Route path=":slug" element={<ArticlePage />} />
                </Routes>
            </BlogContextProvider>
        </main>
    );
}

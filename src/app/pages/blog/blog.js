import React, {useEffect} from 'react';
import useBlogContext, {BlogContextProvider} from './blog-context';
import {Routes, Route, useLocation, useParams} from 'react-router-dom';
import {WindowContextProvider} from '~/contexts/window';
import useDocumentHead, {useCanonicalLink} from '~/helpers/use-document-head';
import RawHTML from '~/components/jsx-helpers/raw-html';
import ExploreBySubject from '~/components/explore-by-subject/explore-by-subject';
import ExploreByCollection from '~/components/explore-by-collection/explore-by-collection';
import ExplorePage from './explore-page/explore-page';
import PinnedArticle from './pinned-article/pinned-article';
import DisqusForm from './disqus-form/disqus-form';
import MoreStories from './more-stories/more-stories';
import SearchBar, {HeadingAndSearchBar} from '~/components/search-bar/search-bar';
import SearchResults from './search-results/search-results';
import LatestBlogPosts from './latest-blog-posts/latest-blog-posts';
import {ArticleFromSlug} from './article/article';
import GatedContentDialog from './gated-content-dialog/gated-content-dialog';
import './blog.scss';

function WriteForUs({descriptionHtml, text, link}) {
    return (
        <section className='boxed'>
            <RawHTML Tag='h2' className="description" html={descriptionHtml} />
            <a href={link} className="btn primary">{text}</a>
        </section>
    );
}

export function SearchResultsPage() {
    const {pageDescription, searchFor} = useBlogContext();

    useDocumentHead({
        title: 'OpenStax Blog Search',
        description: pageDescription
    });

    return (
        <React.Fragment>
            <div className="boxed left">
                <SearchBar searchFor={searchFor} amongWhat='blog posts' />
            </div>
            <SearchResults />
        </React.Fragment>
    );
}

// Exported so it can be tested
// eslint-disable-next-line complexity
export function MainBlogPage() {
    const {
        pinnedStory, pageDescription, searchFor,
        subjectSnippet: categories,
        collectionSnippet: collections,
        footerText, footerButtonText, footerLink
    } = useBlogContext();
    const writeForUsData = {
        descriptionHtml: footerText || 'Interested in sharing your story?',
        text: footerButtonText || 'Write for us',
        link: footerLink || '/write-for-us'
    };

    useDocumentHead({
        title: 'OpenStax News',
        description: pageDescription
    });

    return (
        <WindowContextProvider>
            <div className="boxed">
                <HeadingAndSearchBar searchFor={searchFor} amongWhat='blog posts'>
                    <h1>OpenStax Blog</h1>
                </HeadingAndSearchBar>
                <ExploreBySubject categories={categories} analyticsNav='Blog Subjects' />
                <ExploreByCollection collections={collections} analyticsNav='Blog Collections' />
                <PinnedArticle />
                <MoreStories exceptSlug={pinnedStory && pinnedStory.meta.slug} />
            </div>
            <div className="write-for-us">
                <WriteForUs {...writeForUsData} />
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

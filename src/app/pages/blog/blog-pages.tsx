import React, {useEffect} from 'react';
import useBlogContext from './blog-context';
import {useParams} from 'react-router-dom';
import {WindowContextProvider} from '~/contexts/window';
import useDocumentHead from '~/helpers/use-document-head';
import RawHTML from '~/components/jsx-helpers/raw-html';
import ExploreBySubject from '~/components/explore-by-subject/explore-by-subject';
import ExploreByCollection from '~/components/explore-by-collection/explore-by-collection';
import PinnedArticle from './pinned-article/pinned-article';
import MoreStories from './more-stories/more-stories';
import {HeadingAndSearchBar} from '~/components/search-bar/search-bar';
import SearchResults from './search-results/search-results';
import FacetControls from './facet-controls/facet-controls';
import useBlogSearchParams from './use-blog-search-params';
import {ArticleData, ArticleFromSlug} from './article/article';
import GatedContentDialog from './gated-content-dialog/gated-content-dialog';
import {assertDefined} from '~/helpers/data';
import './blog.scss';

function WriteForUs({descriptionHtml, text, link}: {
    descriptionHtml: string;
    text: string;
    link: string;
}) {
    return (
        <section className='boxed'>
            <RawHTML Tag='h2' className="description" html={descriptionHtml} />
            <a href={link} className="btn primary">{text}</a>
        </section>
    );
}

function buildWriteForUsData({footerText, footerButtonText, footerLink}: {
    footerText?: string;
    footerButtonText?: string;
    footerLink?: string;
}) {
    return {
        descriptionHtml: footerText || 'Interested in sharing your story?',
        text: footerButtonText || 'Write for us',
        link: footerLink || '/write-for-us'
    };
}

type SearchState = ReturnType<typeof useBlogSearchParams>;

function hasActiveQuery({q, subjects, collection, sort}: SearchState) {
    return Boolean(q || subjects.length || collection || sort !== 'relevance');
}

function DiscoveryContent({
    categories,
    collections,
    pinnedSlug
}: {
    categories: ReturnType<typeof useBlogContext>['subjectSnippet'];
    collections: ReturnType<typeof useBlogContext>['collectionSnippet'];
    pinnedSlug?: string;
}) {
    return (
        <React.Fragment>
            <ExploreBySubject categories={categories} analyticsNav='Blog Subjects' />
            <ExploreByCollection collections={collections} analyticsNav='Blog Collections' />
            <PinnedArticle />
            <MoreStories exceptSlug={pinnedSlug || ''} />
        </React.Fragment>
    );
}

// Exported so it can be tested

export function MainBlogPage() {
    const {
        pinnedStory, pageTitle, pageDescription, searchFor,
        subjectSnippet: categories,
        collectionSnippet: collections,
        footerText, footerButtonText, footerLink
    } = useBlogContext();
    const writeForUsData = buildWriteForUsData({footerText, footerButtonText, footerLink});
    // Editable in the CMS (the news page title); falls back to a friendlier
    // default than the bare "OpenStax Blog".
    const heading = pageTitle || 'Stories from OpenStax';
    const searchState = useBlogSearchParams();
    const isActive = hasActiveQuery(searchState);
    const pinnedSlug = pinnedStory && pinnedStory.meta.slug;

    useDocumentHead({
        title: heading,
        description: pageDescription
    });

    return (
        <WindowContextProvider>
            <div className="boxed">
                <HeadingAndSearchBar searchFor={searchFor} amongWhat='blog posts'>
                    <h1>{heading}</h1>
                </HeadingAndSearchBar>
                <FacetControls subjects={categories} collections={collections} />
                {isActive
                    ? <SearchResults />
                    : <DiscoveryContent
                        categories={categories}
                        collections={collections}
                        pinnedSlug={pinnedSlug}
                    />
                }
            </div>
            <div className="write-for-us">
                <WriteForUs {...writeForUsData} />
            </div>
        </WindowContextProvider>
    );
}

export function ArticlePage() {
    // slug is always defined because ArticlePage is only rendered via the route path=":slug"
    // where :slug is a required route parameter
    const slug = assertDefined(useParams().slug);
    const [articleData, setArticleData] = React.useState<ArticleData>();

    useEffect(
        () => {
            window.scrollTo(0, 0);
        },
        [slug]
    );

    return (
        <WindowContextProvider>
            <ArticleFromSlug slug={`news/${slug}`} onLoad={setArticleData} />
            <div className="boxed">
                <MoreStories exceptSlug={slug as string} />
            </div>
            <GatedContentDialog articleData={articleData} />
        </WindowContextProvider>
    );
}

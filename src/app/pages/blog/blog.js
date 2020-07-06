import React, {useState, useEffect} from 'react';
import {usePageData} from '~/helpers/controller/cms-mixin';
import WrappedJsx from '~/controllers/jsx-wrapper';
import PinnedArticle from './pinned-article/pinned-article';
import UpdateBox from './update-box/update-box';
import DisqusForm from './disqus-form/disqus-form';
import MoreStories from './more-stories/more-stories';
import SearchBar from './search-bar/search-bar';
import SearchResults from './search-results/search-results';
import {ArticleFromSlug} from './article/article';
import {blurbModel} from './article-summary/article-summary.jsx';
import timers from './timers';
import './blog.css';
import $ from '~/helpers/$';

const path = '/blog';

function pinnedArticleData(articles) {
    const articleSlug = Reflect.ownKeys(articles)
        .find((k) => articles[k].pin_to_top);
    const pinnedData = articles[articleSlug];

    return blurbModel(articleSlug, pinnedData);
}

function moreStoriesOptions(articles, test) {
    const slugs = Reflect.ownKeys(articles)
        .filter((k) => test(k, articles[k]))
        .sort((a, b) => articles[a].date < articles[b].date ? 1 : -1);

    return slugs.map((s) => {
        const model = blurbModel(s, articles[s]);

        delete model.subheading;
        return model;
    });
}

function isNotPinned(slug, article) {
    return !article.pin_to_top;
}

function exceptThisSlug(slug) {
    return (articleSlug, article) => `news/${articleSlug}` !== slug;
}

export function DefaultPage({articles, setPath}) {
    return (
        <React.Fragment>
            <PinnedArticle model={{setPath, ...pinnedArticleData(articles)}} />
            <UpdateBox />
            <MoreStories
                articles={moreStoriesOptions(articles, isNotPinned)}
                setPath={setPath}
            />
        </React.Fragment>
    );
}

export function SearchResultsPage({location, setPath}) {
    return (
        <React.Fragment>
            <SearchBar setPath={setPath} />
            <SearchResults location={location} setPath={setPath} />
        </React.Fragment>
    );
}

export function ArticlePage({slug, articles, setPath}) {
    return (
        <React.Fragment>
            <ArticleFromSlug slug={slug} />
            <DisqusForm />
            <UpdateBox />
            <MoreStories
                articles={moreStoriesOptions(articles, exceptThisSlug(slug))}
                setPath={setPath}
            />
        </React.Fragment>
    );
}

const slug = 'news';

function useLocationSynchronizedToPath() {
    const [location, setLocation] = useState(window.location);

    function syncLocation() {
        setLocation({...window.location});
    }

    useEffect(() => {
        // The router refers to history state, to see if it's changing pages
        history.replaceState({path: '/blog'}, '');
        window.addEventListener('popstate', syncLocation);

        return () => window.removeEventListener('popstate', syncLocation);
    }, []);

    function setPath(href) {
        history.pushState({path: '/blog'}, '', href);
        syncLocation();
        window.scrollTo(0, 0);
    }

    return [location, setPath];
}

export function BlogPage() {
    const [pageData, statusPage] = usePageData({slug});
    const [location, setPath] = useLocationSynchronizedToPath();

    useEffect(() => {
        const linkController = $.setCanonicalLink();

        return () => linkController.remove();
    }, []);
    useEffect(() => {
        timers.start();

        return () => timers.clear();
    }, [location]);

    if (statusPage) {
        return statusPage;
    }

    const slugMatch = location.pathname.match(/\/blog\/(.+)/);
    const articles = pageData.articles;

    if (!slugMatch) {
        return location.search ?
            <SearchResultsPage
                location={location}
                setPath={setPath}
            /> :
            <DefaultPage
                articles={pageData.articles}
                setPath={setPath}
            />;
    }

    return (
        <React.Fragment>
            <ArticlePage slug={`news/${slugMatch[1]}`}
                articles={pageData.articles}
                setPath={setPath}
            />
        </React.Fragment>
    );
}

export default class extends WrappedJsx {

    init() {
        super.init(BlogPage);
        this.view = {
            classes: ['blog', 'page'],
            tag: 'main'
        };
    }

}

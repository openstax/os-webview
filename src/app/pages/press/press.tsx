import React from 'react';
import {Routes, Route, Navigate, useLocation, useParams} from 'react-router-dom';
import usePageContext, {PageContextProvider} from './page-context';
import {
    setPageTitleAndDescriptionFromBookData,
    useCanonicalLink
} from '~/helpers/use-document-head';
import Banner from './banner/banner';
import FeaturedIn from './featured-in/featured-in';
import AboutOpenStax from './about-openstax/about-openstax';
import Testimonials from './testimonials/testimonials';
import MissionStatements from './mission/mission';
import Infographic from './infographic/infographic';
import PressReleases from './press-releases/press-releases';
import {ArticleLoader} from './article/article';
import NewsMentions from './news-mentions/news-mentions';
import FAQ from './faq/faq';
import './press.scss';

function MainPage() {
    const pageData = usePageContext();

    useCanonicalLink(true);
    React.useEffect(() => {
        setPageTitleAndDescriptionFromBookData(pageData);
    }, [pageData]);

    return (
        <React.Fragment>
            <section id='in-the-press'>
                <Banner />
            </section>
            <section id='featured-in'>
                <FeaturedIn />
            </section>
            <section id='mission'>
                <MissionStatements />
            </section>
            <section id='about-openstax'>
                <AboutOpenStax />
            </section>
            <section id='facts-infographic'>
                <Infographic />
            </section>
            <section id='testimonials'>
                <Testimonials />
            </section>
            <section id='faq'>
                <FAQ />
            </section>
            <section id='press-releases'>
                <PressReleases />
            </section>
            <section id='news-mentions'>
                <NewsMentions />
            </section>
        </React.Fragment>
    );
}

function ArticlePage() {
    const {article} = useParams();
    const slug = `press/${article}`;

    return (
        <React.Fragment>
            <ArticleLoader slug={slug} />
            <div className="text-content">
                <h1>Other press releases</h1>
                <div className="other press-releases">
                    <PressReleases excludeSlug={slug} />
                </div>
            </div>
        </React.Fragment>
    );
}

function RedirectSlash() {
    const {pathname} = useLocation();

    if (pathname.endsWith('/')) {
        return <Navigate to={pathname.slice(0, -1)} replace />;
    }
    return <MainPage />;
}

export default function Press() {
    return (
        <div className='press page'>
            <PageContextProvider>
                <Routes>
                    <Route path='/' element={<RedirectSlash />} />
                    <Route path=':article' element={<ArticlePage />} />
                </Routes>
            </PageContextProvider>
        </div>
    );
}

import React from 'react';
import {Routes, Route, Navigate, useLocation} from 'react-router-dom';
import usePageContext, {PageContextProvider} from './page-context';
import {
    setPageTitleAndDescriptionFromBookData,
    useCanonicalLink
} from '~/helpers/use-document-head';
import Banner from './banner/banner';
import FeaturedIn from './featured-in/featured-in';
import Testimonials from './testimonials/testimonials';
import MissionStatements from './mission/mission';
import Infographic from './infographic/infographic';
import PressReleases from './press-releases/press-releases';
import NewsMentions from './news-mentions/news-mentions';
import FAQ from './faq/faq';
import './new-press.scss';

function MainPage() {
    const pageData = usePageContext();

    useCanonicalLink(true);
    React.useEffect(() => {
        if (pageData) {
            setPageTitleAndDescriptionFromBookData(pageData);
        }
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
    return <h1>Article page</h1>;
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

import React from 'react';
import {LoaderPage, useLocation} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Banner from './banner/banner';
import Navigator from './navigator/navigator';
import FetchedContent from './fetched-content/fetched-content';
import HomeContent from './home-content/home-content';
import './creator-fest.css';

function PageContent({data, navLinks}) {
    // Gives reactivity on window.location.pathname
    useLocation();
    const linkEntry = navLinks
        .find((obj) => `/creator-fest/${obj.url}` === window.location.pathname);

    return (
        <div id="page-content">
            {
                linkEntry ?
                    <FetchedContent slug={linkEntry.slug} pageId={linkEntry.url} /> :
                    <HomeContent pagePanels={data.pagePanels} register={data.register[0][0]} />
            }
        </div>
    );
}

function CreatorFest({data}) {
    const bannerProps = {
        headline: data.bannerHeadline,
        content: data.bannerContent,
        image: data.bannerImage.meta.downloadUrl
    };
    const navLinks = data.navigator[0].map((nData) => ({
        url: nData.slug.replace(/creator-fest|general\/|-/g, ''),
        text: nData.text,
        slug: nData.slug.replace('general', 'spike')
    }));

    return (
        <React.Fragment>
            <Banner {...bannerProps} />
            <Navigator navLinks={navLinks} />
            <PageContent data={data} navLinks={navLinks} />
        </React.Fragment>
    );
}

export default function CFLoader() {
    return (
        <main className="creator-fest page">
            <LoaderPage slug="pages/creator-fest" Child={CreatorFest} doDocumentSetup />
        </main>
    );
}

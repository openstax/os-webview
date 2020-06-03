import React, {useState, useEffect} from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import {fetchPageData} from '~/helpers/controller/cms-mixin';
import $ from '~/helpers/$';
import BannerCarousel from './banner-carousel/banner-carousel.jsx';
import Buckets from './buckets/buckets.jsx';
import Education from './education/education.jsx';
import Quotes from './quotes/quotes.jsx';
import './home.css';

const view = {
    classes: ['home-page'],
    tag: 'main',
    id: 'maincontent'
};
const slug = 'pages/openstax-homepage';

function Page() {
    const [pageData, setPageData] = useState();

    useEffect(() => fetchPageData({slug}).then(setPageData), []);
    useEffect(() => {
        const linkController = $.setCanonicalLink();

        return () => linkController.remove();
    }, []);

    if (!pageData) {
        return (
            <div className="content loading" />
        );
    }

    const quotesData = pageData.row_1.map((columnData) => {
        const result = Object.assign(
            {
                hasImage: !!columnData.image.image
            },
            columnData
        );

        return result;
    });
    const [educationData] = pageData.row_2;
    const bucketData = [4, 5].map((rowNum, index) => {
        const cmsData = pageData[`row_${rowNum}`][0];
        const result = Object.assign({
            bucketClass: index ? 'partners' : 'our-impact',
            btnClass: index ? 'btn-gold' : 'btn-cyan',
            hasImage: index === 0
        }, cmsData);

        return result;
    });

    return (
        <React.Fragment>
            <BannerCarousel
                largeImages={pageData.banner_images}
                smallImages={pageData.mobile_banner_images}
            />
            <Quotes quotes={quotesData} />
            <Education
                content={educationData.content}
                linkUrl={educationData.link}
                linkText={educationData.cta}
            />
            <Buckets bucketModels={bucketData} />
        </React.Fragment>
    );
}

export default pageWrapper(Page, view);

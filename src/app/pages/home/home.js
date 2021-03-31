import React from 'react';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import BannerCarousel from './banner-carousel/banner-carousel';
import Buckets from './buckets/buckets';
import Education from './education/education';
import Quotes from './quotes/quotes';
import LazyLoad from 'react-lazyload';
import './home.css';

function HomePage({data}) {
    const quotesData = data.row_1.map((columnData) => {
        const result = Object.assign(
            {
                hasImage: !!columnData.image.image
            },
            columnData
        );

        return result;
    });
    const [educationData] = data.row_2;
    const bucketData = [4, 5].map((rowNum, index) => {
        const cmsData = data[`row_${rowNum}`][0];
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
                largeImages={data.banner_images}
                smallImages={data.mobile_banner_images}
            />
            <LazyLoad>
                <Quotes quotes={quotesData} />
            </LazyLoad>
            <LazyLoad>
                <Education
                    content={educationData.content}
                    linkUrl={educationData.link}
                    linkText={educationData.cta}
                />
            </LazyLoad>
            <LazyLoad>
                <Buckets bucketModels={bucketData} />
            </LazyLoad>
        </React.Fragment>
    );
}

export default function HomeLoader() {
    return (
        <main id="maincontent" className="home-page">
            <LoaderPage
                slug="pages/openstax-homepage" Child={HomePage}
                doDocumentSetup noCamelCase
            />
        </main>
    );
}

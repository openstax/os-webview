import React, {useEffect} from 'react';
import {usePageData} from '~/helpers/controller/cms-mixin';
import $ from '~/helpers/$';
import BannerCarousel from './banner-carousel/banner-carousel';
import Buckets from './buckets/buckets';
import Education from './education/education';
import Quotes from './quotes/quotes';
import './home.css';

const slug = 'pages/openstax-homepage';

export default function Page() {
    const [pageData, statusPage] = usePageData({slug});

    useEffect(() => {
        const linkController = $.setCanonicalLink();

        return () => linkController.remove();
    }, []);

    if (statusPage) {
        return statusPage;
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
        <main id="maincontent" className="home-page">
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
        </main>
    );
}

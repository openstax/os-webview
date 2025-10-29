import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useOptimizedImage, {
    maxDimIfNarrowerThan
} from '~/helpers/use-optimized-image';
import './banner.scss';

export type BannerData = {
    headingTitleImageUrl: string;
    subheading: string;
    headingDescription: string;
    headingImage: {
        meta: {
            downloadUrl: string;
        };
    };
    addAssignableCtaHeader: string;
    addAssignableCtaDescription: string;
    addAssignableCtaLink: string;
    addAssignableCtaButtonText: string;
    instructorInterestCtaHeader: string;
    instructorInterestCtaDescription: string;
    instructorInterestCtaLink: string;
    instructorInterestCtaButtonText: string;
    instructorHelpCtaHeader: string;
    instructorHelpCtaDescription: string;
    instructorHelpCtaLink: string;
    instructorHelpCtaButtonText: string;
    ctaSectionFooter: string;
};

export default function Banner({data}: {data: BannerData}) {
    const maxDim = maxDimIfNarrowerThan(1920);
    const image = data.headingImage.meta.downloadUrl;
    const optimizedImage = useOptimizedImage(image, maxDim);

    return (
        <section className="banner">
            <div
                className="background-image"
                style={{backgroundImage: `url(${optimizedImage})`}}
            />
            <div className="content-block">
                <div>
                    <img
                        src={data.headingTitleImageUrl}
                        className="title-image"
                        alt="Assignable by OpenStax"
                    />
                    <h1>{data.subheading}</h1>
                </div>
                <RawHTML className="text-content" html={data.headingDescription} />
                <div className="button-row">
                    <CTAButton
                        header={data.addAssignableCtaHeader}
                        href={data.addAssignableCtaLink}
                        linkText={data.addAssignableCtaButtonText}
                    />
                    <CTAButton
                        header={data.instructorInterestCtaHeader}
                        href={data.instructorInterestCtaLink}
                        linkText={data.instructorInterestCtaButtonText}
                    />
                    <CTAButton
                        header={data.instructorHelpCtaHeader}
                        href={data.instructorHelpCtaLink}
                        linkText={data.instructorHelpCtaButtonText}
                    />
                </div>
                <RawHTML className="text-content" html={data.ctaSectionFooter} />
            </div>
        </section>
    );
}

function CTAButton({header, href, linkText}: {
    header: string;
    href: string;
    linkText: string;
}) {
    return <div className="button-shaped">
        <p>{header}</p>
        <a href={href}>{linkText}</a>
    </div>;
}

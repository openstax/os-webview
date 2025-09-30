import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useOptimizedImage, {
    maxDimIfNarrowerThan
} from '~/helpers/use-optimized-image';
import './banner.scss';

type BannerProps = {
    data: {
        headingTitleImageUrl: string;
        subheading: string;
        headingDescription: string;
        headingImage: {
            meta: {
                downloadUrl: string;
            };
        };
    };
};

export default function Banner({
    data: {
        headingTitleImageUrl,
        subheading,
        headingDescription: description,
        headingImage: {
            meta: {downloadUrl: image}
        }
    }
}: BannerProps) {
    const maxDim = maxDimIfNarrowerThan(1920);
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
                        src={headingTitleImageUrl}
                        className="title-image"
                        alt="Assignable by OpenStax"
                    />
                    <div>
                        <i>{subheading}</i>
                    </div>
                </div>
                <RawHTML className="text-content" html={description} />
            </div>
        </section>
    );
}

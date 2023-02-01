import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useOptimizedImage from '~/helpers/use-optimized-image';
import './banner.scss';

export default function Banner({data}) {
    const bannerImgUrl = useOptimizedImage(data.subjectImage, 600);
    const bgStyle = React.useMemo(
        () => ({style: `url(${bannerImgUrl})`}),
        [bannerImgUrl]
    );

    return (
        <section className="banner">
            <div className="boxed">
                <div className="text-block">
                    <div className="category">{data.subheader}</div>
                    <h1>{data.title}</h1>
                    <RawHTML html={data.subjectIntro} />
                </div>
                <div className="right-bg" style={bgStyle} />
            </div>
        </section>
    );
}

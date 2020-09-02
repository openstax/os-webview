import React, {useState, useRef} from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import cn from 'classnames';
import analytics from '~/helpers/analytics';
import $ from '~/helpers/$';

function ImageOrVideo({currentImage, transitioning}) {
    const isImage = currentImage.url.substr(-3) === 'png';

    return (
        isImage ?
            <img
                className={transitioning}
                alt={currentImage.description}
                src={currentImage.url}
            /> :
            <video
                className={transitioning}
                src={currentImage.url}
                controls preload="metadata" loop
            />
    );
}

function Thumbnail({image, currentImage, setCurrentImage}) {
    const blurb = $.htmlToText(image.description);
    const ref = useRef();

    function onClick() {
        analytics.sendPageEvent(
            `OXT marketing button [${blurb}]`,
            'open',
            'video'
        );
        setCurrentImage(image);
        ref.current.scrollIntoView({block: 'nearest', inline: 'center', behavior: 'smooth'});
    }

    return (
        <div
            key={image}
            className={cn({active: image === currentImage})}
            onClick={onClick}
            ref={ref}
        >
            <RawHTML html={image.title} />
        </div>
    );
}

// So it doesn't rebuild every call
function useImagesFromMarketingVideos(marketingVideos) {
    const imageRef = useRef(marketingVideos.map((entry) => ({
        url: entry.videoUrl || entry.videoFile || entry.imageUrl || entry.image || '',
        description: entry.videoImageBlurb,
        title: entry.videoTitle
    })));

    return imageRef.current;
}

function Carousel({marketingVideos}) {
    const images = useImagesFromMarketingVideos(marketingVideos);
    const [currentImage, setCurrentImage] = useState(images[0]);
    const [transitioning, setTransitioning] = useState('');

    function onThumbnailClick(image) {
        setTransitioning('transitioning');
        setTimeout(() => setCurrentImage(image), 100);
        setTimeout(() => setTransitioning(''), 400);
    }

    return (
        <div className="carousel">
            <div className="viewer">
                {
                    currentImage ?
                        <div className="viewport">
                            <ImageOrVideo currentImage={currentImage} transitioning={transitioning} />
                        </div> :
                        <img alt="no selected image" />
                }
            </div>
            {
                currentImage &&
                    <div className="video-description">
                        <RawHTML
                            className="content"
                            html={currentImage.description}
                        />
                    </div>
            }
            <div className="thumbnails">
                {
                    images.map((image) =>
                        <Thumbnail key={image} {...{image, currentImage, setCurrentImage: onThumbnailClick}} />
                    )
                }
            </div>
        </div>
    );
}

export default function WhatStudentsGet({model}) {
    return (
        <section id="what-students-get">
            <div className="background-imagery" />
            <div className="text-content">
                <h1>{model.section3Heading}</h1>
                <RawHTML className="description" html={model.section3Description} />
            </div>
            <div className="boxed">
                <Carousel marketingVideos={model.marketingVideos} />
            </div>
        </section>
    );
}

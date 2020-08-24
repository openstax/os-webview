import React, {useState, useEffect, useRef} from 'react';
import $ from '~/helpers/$';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './carousel.css';

function Images({images, icon, frameCount}) {
    const imagesOrIcon = frameCount ? images : [icon];
    const onlyLogo = frameCount === 0;

    return (
        imagesOrIcon.map((image) =>
            <div key={image} className={onlyLogo ? 'logo-holder' : 'image-holder'}>
                <img src={image} />
            </div>
        )

    );
}

function Videos({videos}) {
    return (
        videos.map((video) =>
            <div className="image-holder" key={video}>
                <video controls>
                    <source src={video} type="video/mp4" />
                </video>
            </div>
        )
    );
}

function FrameChanger({frameNumber, diff, frameCount, setFrameNumber}) {
    const [chevronDirection, buttonClass] = diff < 0 ?
        ['left', 'previous'] :
        ['right', 'next'];
    const destFrame = frameNumber + diff;

    return (
        destFrame >= 0 && destFrame < frameCount &&
            <button
                type="button" className={`navigate ${buttonClass}`}
                onClick={() => setFrameNumber(destFrame)}
            >
                <FontAwesomeIcon icon={`chevron-${chevronDirection}`} />
            </button>
    );
}

export default function Carousel({icon, images, videos}) {
    const [frameNumber, setFrameNumber] = useState(0);
    const frameCount = images.length + videos.length;
    const rowStyle = {
        'grid-template-columns': `repeat(${frameCount || 1}, 1fr)`,
        width: `${frameCount || 1}00%`
    };
    const imageRowRef = useRef();
    const prevFrame = useRef(0);

    useEffect(() => {
        $.scrollToFrame({
            divEl: imageRowRef.current,
            newFrameNumber: frameNumber,
            oldFrameNumber: prevFrame.current,
            unit: '%'
        });
        prevFrame.current = frameNumber;
    }, [frameNumber]);

    return (
        <div className="carousel" onClick={(e) => e.stopPropagation()}>
            <div className="image-row" style={rowStyle} ref={imageRowRef}>
                <Images images={images} icon={icon} frameCount={frameCount} />
                <Videos videos={videos} />
            </div>
            <FrameChanger {...{frameNumber, diff: -1, frameCount, setFrameNumber}} />
            <FrameChanger {...{frameNumber, diff: +1, frameCount, setFrameNumber}} />
        </div>
    );
}

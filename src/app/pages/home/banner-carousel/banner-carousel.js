import React, {useState, useRef, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import analytics from '~/helpers/analytics';
import $ from '~/helpers/$';
import './banner-carousel.css';

export default function ({largeImages, smallImages}) {
    const [frameNumber, updateFrameNumber] = useState(0);
    const [isMobile, updateIsMobile] = useState($.isMobileDisplay());
    const previousFrameNumber = useRef();
    const imageRowRef = useRef();
    const images = (isMobile ? smallImages : largeImages);

    useEffect(() => {
        $.scrollToFrame({
            divEl: imageRowRef.current,
            newFrameNumber: frameNumber,
            oldFrameNumber: previousFrameNumber.current
        });

        previousFrameNumber.current = frameNumber;
    }, [frameNumber]);

    useEffect(() => {
        const updateSize = () => updateIsMobile($.isMobileDisplay());

        window.addEventListener('resize', updateSize);

        return () => window.removeEventListener('resize', updateSize);
    }, []);

    function reportImageClick() {
        const imageData = images[frameNumber];
        const identifier = imageData.identifier || imageData.image.replace(/.*\//, '');

        analytics.sendPageEvent(
            'Homepage banner',
            'click',
            identifier
        );
    }


    return (
        <div className="banner-carousel">
            <div className="image-row" ref={imageRowRef}>
                {
                    images.map((image, index) =>
                        <a
                            href={image.link}
                            style={`background-image: url(${image.image})`}
                            aria-label={image.alt_text}
                            tabIndex={index === frameNumber ? 0 : -1}
                            onClick={reportImageClick}
                            key={image.link}
                        />
                    )
                }
            </div>
            <div className="frame-control">
                <div className="dots">
                    {
                        images.map((image, index) =>
                            <button
                                className={`dot ${index === frameNumber ? 'active' : ''}`}
                                type="button"
                                onClick={() => updateFrameNumber(index)}
                                key={image.link}
                            />
                        )
                    }
                </div>
            </div>
            {
                frameNumber > 0 &&
                    <button
                        className="left-arrow" type="button"
                        onClick={() => updateFrameNumber(frameNumber - 1)}
                    >
                        <FontAwesomeIcon icon="chevron-left" />
                    </button>
            }
            {
                frameNumber < images.length - 1 &&
                    <button
                        className="right-arrow" type="button"
                        onClick={() => updateFrameNumber(frameNumber + 1)}
                    >
                        <FontAwesomeIcon icon="chevron-right" />
                    </button>
            }
        </div>
    );
}

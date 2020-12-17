import React, {useState, useEffect, useRef} from 'react';
import $ from '~/helpers/$';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Carousel from '~/components/carousel/carousel';
import './carousel.css';

function Images({images, icon, frameCount}) {
    const [className, imagesOrIcon] = frameCount ?
        ['image-holder', images] : ['logo-holder', [icon]];

    return (
        imagesOrIcon.map((image) =>
            <div key={image} className={className}>
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

export default function PartnerCarousel({icon, images, videos}) {
    const frameCount = images.length + videos.length;

    return (
        <Carousel>
            <Images {...{images, icon, frameCount}} />
            <Videos videos={videos} />
        </Carousel>
    );
}

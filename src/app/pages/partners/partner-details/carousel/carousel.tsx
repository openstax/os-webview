import React from 'react';
import Carousel from '~/components/carousel/carousel';
import './carousel.scss';

export default function PartnerCarousel({icon, images, videos}: {
    icon: string;
    images: string[];
    videos: string[];
}) {
    const frameCount = images.length + videos.length;
    const [className, imagesOrIcon] = frameCount ?
        ['image-holder', images] : ['logo-holder', [icon]];

    return (
        <Carousel hoverTextThing='image or video'>
            {
                videos.map((video) =>
                    <div className="image-holder" key={video}>
                        <video controls>
                            <source src={video} type="video/mp4" />
                        </video>
                    </div>
                )
            }
            {
                imagesOrIcon.map((image) =>
                    <div key={image} className={className}>
                        <img src={image} />
                    </div>
                )
            }
        </Carousel>
    );
}

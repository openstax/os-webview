import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import Carousel from '~/components/carousel/carousel';
import './about.scss';

function CarouselDialog({isOpen, onPutAway}) {
    const images = [1, 2, 3, 4].map((i) => `https://via.placeholder.com/640x480?text=[image ${i}]`);

    return (
        <Dialog title="Screenshots" isOpen={isOpen} onPutAway={onPutAway}>
            <section className="carousel">
                <Carousel>
                    {
                        images.map(
                            (src, i) =>
                                <div className="img-container" key={src}>
                                    <img src={src} alt={`#${i}`} />
                                </div>
                        )
                    }
                </Carousel>
            </section>
        </Dialog>
    );
}

export default function About({
    data: {
        section2Heading: heading,
        section2Description: description,
        imageCarousel
    }
}) {
    const images = imageCarousel[0];

    return (
        <section className="about near-white">
            <div className="content-block">
                <div className="text-block">
                    <h2>{heading}</h2>
                    <RawHTML className="description-block" html={description} />
                </div>
                <Carousel>
                    {
                        images.map(
                            ({image: {file: src, height, width, title, id}}) =>
                                <div className="img-container" key={id}>
                                    <img src={src} alt={title} width={width} height={height} />
                                </div>
                        )
                    }
                </Carousel>
            </div>
        </section>
    );
}

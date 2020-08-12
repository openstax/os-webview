import React from 'react';
import {Section, HeadingAndDescription} from './section';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './map.css';

export default function Map({heading, description, image1, image2, link, linkText, backgroundImage}) {
    return (
        <Section
            id="map"
            style={{
                backgroundImage: `url(${backgroundImage.image})`,
                position: 'relative'
            }}
            contentClass={false}
        >
            <img className="floating hide-on-mobile" src={image1.image} alt={image1.imageAlt} />
            <div className="content with-layers">
                <div>
                    {image2 && <img src={image2.image} alt={image2.imageAlt} />}
                </div>
                <HeadingAndDescription classList={['text-block']} {...{heading, description}}>
                    <a href={link}>
                        {linkText}
                        <FontAwesomeIcon icon="chevron-right" />
                    </a>
                </HeadingAndDescription>
            </div>
        </Section>
    );
}

import React from 'react';
import {Section, HeadingAndDescription} from './section';
import './tutor.css';

export default function Tutor({heading, description, rightImage, link, linkText, bottomImage}) {
    return (
        <Section id="tutor" style={{position: 'relative'}} contentClass={false}>
            <img className="right-image" src={rightImage.image} alt={rightImage.altText} />
            <div className="content">
                <HeadingAndDescription classList={['text-block']} {...{heading, description}}>
                    <a href={link}>{linkText}</a>
                </HeadingAndDescription>
            </div>
            <img
                className="bottom-image"
                src={bottomImage.image} alt={bottomImage.altText} />
        </Section>
    );
}

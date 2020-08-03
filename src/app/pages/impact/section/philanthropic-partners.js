import React from 'react';
import {Section, HeadingAndDescription} from './section';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './philanthropic-partners.css';

export default function PhilanthropicPartners({
    heading, description, image, quote, attributionName, attributionTitle,
    link1, link1Text, link2, link2Text
}) {
    return (
        <Section id="philanthropic-partners" className="white">
            <HeadingAndDescription classList={['centered', 'content']}
                {...{heading, description}}
            />
            <div className="text-overlapping-photo">
                <img src={image.image} alt={image.altText} />
                <div className="text-block">
                    <div className="card">
                        <div className="quote-on-left">
                            <div className="big-orange-quote">“</div>
                            <div className="text-block">
                                <div>{quote}</div>
                                <div className="attribution">
                                    <div className="name">{attributionName}</div>
                                    <RawHTML className="title" html={attributionTitle} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        {link1 && <a href={link1}>{link1Text}</a>}
                        {link2 && <a href={link2}>{link2Text}</a>}
                    </div>
                </div>
            </div>
        </Section>
    );
}

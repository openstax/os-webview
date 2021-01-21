import React, {useState} from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './quote.css';

export default function Quote({
    model: {
        heading, quote: quoteBody, image: {image: portraitSrc, altText: portraitAlt},
        linkHref, linkText
    }, supporter=false, noStrips=false
}) {
    return (
        <section className="founder-quote">
            {
                heading &&
                    <div className="boxed trimmed">
                        <h2>{heading}</h2>
                    </div>
            }
            <div className="boxed">
                <div>
                    <div className="picture-porthole">
                        <img src={portraitSrc} alt={portraitAlt} />
                    </div>
                </div>
                <div className="quote">
                    <RawHTML className="strip-outer-margins" html={quoteBody} />
                    {linkHref && <a href={linkHref}>{linkText}</a>}
                </div>
            </div>
            {
                !noStrips &&
                    <img
                        class="strips" src="/images/components/strips.svg"
                        height="10" alt="" role="presentation" />
            }
        </section>
    );
}

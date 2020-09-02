import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import analytics from '~/helpers/analytics';
import $ from '~/helpers/$';

export default function Frontier({model}) {
    const access = {
        text: model.accessTagline,
        label: model.accessButtonCta,
        url: model.accessButtonLink
    };
    const frontier = {
        headline: model.section1Heading,
        subhead: model.section1Subheading,
        description: model.section1Paragraph,
        learnMore: {
            href: model.section1CtaLink,
            text: model.section1CtaText
        }
    };

    function trackClick(e) {
        analytics.sendPageEvent(
            'OXT marketing page Learn more',
            'scroll',
            frontier.learnMore.href
        );
        $.hashClick(e);
    }

    return (
        <section id="new-frontier">
            <div className="background-imagery" role="img" aria-label="hiker looking over a valley">
                <div className="top-image" />
                <div className="middle-image" />
                <div className="bottom-image" />
            </div>
            <div className="text-content">
                <div className="above-head smaller">
                    <div>{access.text}</div>
                    <a href={access.url} className="btn small">{access.label}</a>
                </div>
                <div className="headline">
                    <img id="tutor-logo" alt="OpenStax Tutor beta logo" src="/images/openstax-tutor/tutor-logo.svg" />
                    <div className="headline-text">
                        <h1>{frontier.headline}</h1>
                        <div className="blurb">{frontier.subhead}</div>
                        <RawHTML className="blurb" html={frontier.description} />
                        <a href={frontier.learnMore.href} className="btn primary" onClick={trackClick}>
                            {frontier.learnMore.text}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

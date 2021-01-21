import React, {useState} from 'react';
import Carousel from '~/components/carousel/carousel';
import LinkWithChevron from '~/components/link-with-chevron/link-with-chevron';
import showDialog, {hideDialog} from '~/helpers/show-dialog';
import {useDataFromSlug, RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {Article} from '~/pages/blog/article/article';
import ClippedImage from '~/components/clipped-image/clipped-image';
import $ from '~/helpers/$';
import './testimonials.css';

function LightboxContent({cards, initialPosition, articleDataArr, done}) {
    function ArticleCard({position}) {
        const articleData = articleDataArr[position];

        if (!articleData) {
            return <div className="text-content"><h2>Loading</h2></div>;
        }
        // eslint-disable-next-line camelcase
        articleData.article_image = articleData.featured_image.meta.download_url;

        return (
            <div className="lightbox-article">
                <Article data={articleData} />
            </div>
        );
    }

    return (
        <div className="lightbox-testimonial">
            <Carousel initialFrame={initialPosition}>
                {cards.map((c, position) => <ArticleCard position={position} key={position} />)}
            </Carousel>
        </div>
    );
}

function useDataFromCard(card) {
    const slug = `pages/${card.linkedStory}`;

    return useDataFromSlug(slug, true);
}

function addAndRemoveClass(onDone) {
    let overlayEl;

    function start() {
        overlayEl = document.querySelector('.page-overlay');

        overlayEl.classList.add('impact-testimonial-overlay');
    }

    function done() {
        if (overlayEl) {
            overlayEl.classList.remove('impact-testimonial-overlay');
        }
        onDone();
    }

    return [start, done];
}

function Card({position, cards}) {
    const {image, storyText: description, embeddedVideo} = cards[position];
    const articleDataArr = cards.map(useDataFromCard);
    const [start, done] = addAndRemoveClass(hideDialog);

    function onClick(event) {
        event.preventDefault();
        showDialog({
            event,
            dialogContent: LightboxContent,
            dialogContentArgs: {cards, initialPosition: position, done, articleDataArr}
        });
        start();
    }

    return (
        <div className="card">
            <div className="picture-part">
                {
                    embeddedVideo ?
                        <RawHTML className="embedded-video" html={embeddedVideo} embed /> :
                        (image && <ClippedImage src={image.file} />)
                }
            </div>
            <div className="text-part">
                <div>{description}</div>
                <LinkWithChevron href="lightbox-more" onClick={onClick}>
                    Read more
                </LinkWithChevron>
            </div>
        </div>
    );
}

export default function Testimonials({
    model: {
        heading, description, stories
    }
}) {
    return (
        <section className="testimonials off-white">
            <div className="boxed">
                <h2>{heading}</h2>
                <RawHTML html={description} />
                <Carousel atATime="3" mobileSlider>
                    {
                        stories.map((c, i) =>
                            <Card cards={stories} position={i} key={c.description} />
                        )
                    }
                </Carousel>
            </div>
        </section>
    );
}

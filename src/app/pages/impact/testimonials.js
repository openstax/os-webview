import React from 'react';
import Carousel from '~/components/carousel/carousel';
import LinkWithChevron from '~/components/link-with-chevron/link-with-chevron';
import Dialog from '~/components/dialog/dialog';
import {useToggle, useDataFromSlug, RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {Article} from '~/pages/blog/article/article';
import ClippedImage from '~/components/clipped-image/clipped-image';
import './testimonials.css';

function LightboxContent({cards, initialPosition, articleDataArr}) {
    function ArticleCard({position}) {
        const articleData = articleDataArr[position];
        const {embeddedVideo} = cards[position];

        if (!articleData) {
            return <div className="text-content"><h2>Loading</h2></div>;
        }
        // eslint-disable-next-line camelcase
        articleData.article_image = embeddedVideo ? null : articleData.featured_image.meta.download_url;

        return (
            <div className="lightbox-article">
                {
                    embeddedVideo &&
                        <RawHTML className="embedded-video" html={embeddedVideo} embed />
                }
                <Article data={articleData} />
            </div>
        );
    }

    return (
        <div className="lightbox-testimonial">
            <Carousel initialFrame={initialPosition} hoverTextThing="story">
                {cards.map((c, position) => <ArticleCard position={position} key={position} />)}
            </Carousel>
        </div>
    );
}

function useDataFromCard(card) {
    const slug = `pages/${card.linkedStory}`;

    return useDataFromSlug(slug, true);
}

function Card({position, cards}) {
    const {image, storyText: description} = cards[position];
    const articleDataArr = cards.map(useDataFromCard);
    const [isOpen, toggle] = useToggle();

    function onClick(event) {
        event.preventDefault();
        toggle();
    }

    return (
        <div className="card">
            <div className="picture-part">
                {image && <ClippedImage src={image.file} />}
            </div>
            <div className="text-part">
                <div>{description}</div>
                <LinkWithChevron href="lightbox-more" onClick={onClick}>
                    Read more
                </LinkWithChevron>
            </div>
            <Dialog
                isOpen={isOpen} onPutAway={toggle} className="impact-testimonial"
            >
                <LightboxContent {...{cards, initialPosition: position, articleDataArr}} />
            </Dialog>
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

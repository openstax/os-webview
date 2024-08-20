import React from 'react';
import Carousel from '~/components/carousel/carousel';
import LinkWithChevron from '~/components/link-with-chevron/link-with-chevron';
import Dialog from '~/components/dialog/dialog';
import {useDataFromSlug} from '~/helpers/page-data-utils';
import {useToggle, useRefreshable} from '~/helpers/data';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {Article} from '~/pages/blog/article/article';
import ClippedImage from '~/components/clipped-image/clipped-image';
import useWindowContext, {WindowContextProvider} from '~/contexts/window';
import './testimonials.scss';

function LightboxContent({cards, position, articleData}) {
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

function useDataFromCard(card) {
    const slug = `pages/${card.linkedStory}`;

    return useDataFromSlug(slug, true);
}

function Card({position, cards}) {
    const {image, storyText: description} = cards[position];
    const articleData = useDataFromCard(cards[position]);
    const [isOpen, toggle] = useToggle();
    const openInLightbox = articleData?.meta?.type === 'pages.ImpactStory';
    const openDialog = React.useCallback((event) => {
        event.preventDefault();
        toggle();
    }, [toggle]);

    return (
        <div className="card">
            <div className="picture-part">
                {image && <ClippedImage src={image.file} />}
            </div>
            <div className="text-part">
                <div>{description}</div>
                {articleData ? <LinkWithChevron
                    {...(openInLightbox
                        ? {href: 'lightbox-more', onClick: openDialog}
                        : {href: articleData.meta.html_url}
                    )}
                >
                    Read more
                </LinkWithChevron> : null}
            </div>
            <Dialog
                isOpen={isOpen} onPutAway={toggle} className="impact-testimonial"
            >
                <div className="lightbox-testimonial">
                    <LightboxContent cards={cards} position={position} articleData={articleData} />
                </div>
            </Dialog>
        </div>
    );
}

function useAtATime(container) {
    const {innerWidth} = useWindowContext();
    const containerWidth = React.useMemo(
        () => container?.getBoundingClientRect().width,
        [innerWidth, container] // eslint-disable-line react-hooks/exhaustive-deps
    );

    if (containerWidth > 900) {
        return 3;
    }
    if (containerWidth > 600) {
        return 2;
    }
    return 1;
}

function TestimonialCarousel({stories, container}) {
    const atATime = useAtATime(container);

    return (
        <Carousel atATime={atATime} hoverTextThing='stories'>
        {
            stories.map((c, i) =>
                <Card cards={stories} position={i} key={c.description} />
            )
        }
        </Carousel>
    );
}

export default function Testimonials({
    model: {
        heading, description, stories
    }
}) {
    const ref = React.useRef();
    const [container, refreshContainer] = useRefreshable(() => ref.current);

    React.useEffect(
        () => refreshContainer(),
        [refreshContainer]
    );

    return (
        <section className="testimonials off-white">
            <div className="boxed" ref={ref}>
                <h2>{heading}</h2>
                <RawHTML html={description} />
                <WindowContextProvider>
                    <TestimonialCarousel stories={stories} container={container} />
                </WindowContextProvider>
            </div>
        </section>
    );
}

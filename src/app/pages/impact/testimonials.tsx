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

export type TestimonialModel = {
    heading: string;
    description: string;
    stories: Story[];
}

type Story = {
    description: string;
    storyText: string;
    linkedStory: string;
    image?: {file: string}
    embeddedVideo: string;
}

type ArticleData = Parameters<typeof Article>[0]['data'] & {
    meta?: {
        html_url: string;
    }
    featured_image: {
        meta: {
            download_url: string;
        }
    }
};

function LightboxContent({cards, position, articleData}: {
    cards: Story[];
    position: number;
    articleData: ArticleData;
}) {
    const {embeddedVideo} = cards[position];

    articleData.articleImage = embeddedVideo ? '' : articleData.featured_image?.meta.download_url;
    articleData.tags ||= [];

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

function useDataFromCard(card: Story) {
    const slug = `pages/${card.linkedStory}`;

    return useDataFromSlug<ArticleData>(slug, true);
}

// eslint-disable-next-line complexity
function Card({position, cards}: {
    position: number;
    cards: Story[];
}) {
    const {image, storyText: description} = cards[position];
    const articleData = useDataFromCard(cards[position]);

    const [isOpen, toggle] = useToggle();
    const readMoreLink = articleData?.meta?.html_url;
    const openDialog = React.useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        toggle();
    }, [toggle]);

    if (!articleData) {
        return null;
    }

    return (
        <div className="card">
            <div className="picture-part">
                {image && <ClippedImage src={image.file} />}
            </div>
            <div className="text-part">
                <div>{description}</div>
                <LinkWithChevron
                    {...(readMoreLink
                        ? {href: articleData.meta?.html_url}
                        : {href: 'lightbox-more', onClick: openDialog, 'data-opens-in-lightbox': 'true'}
                    )}
                >
                    Read more
                </LinkWithChevron>
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

function useAtATime(container: HTMLElement) {
    const {innerWidth} = useWindowContext();
    const containerWidth = React.useMemo(
        () => container?.getBoundingClientRect().width,
        [innerWidth, container] // eslint-disable-line react-hooks/exhaustive-deps
    );

    return Math.min(3, Math.floor(containerWidth / 300));
}

function TestimonialCarousel({stories, container}: {
    stories: Story[];
    container: HTMLElement;
}) {
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
}: {model: TestimonialModel}) {
    const ref = React.useRef<HTMLDivElement>(null);
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
                    {container && <TestimonialCarousel stories={stories} container={container} />}
                </WindowContextProvider>
            </div>
        </section>
    );
}

import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import LazyLoad from 'react-lazyload';
import RawHTML from '~/components/jsx-helpers/raw-html';
import useOptimizedImage from '~/helpers/use-optimized-image';
import './about.scss';

const slug = 'pages/about';

type ImageCard = {
    type: 'image';
    value: {
        image: string;
        link: string;
    };
};
type TextCard = {
    type: 'paragraph';
    value: string;
};
type RawCard = [ImageCard, TextCard];

function translateCard(c: RawCard) {
    const imgEntry = c.find((v) => v.type === 'image') as ImageCard;
    const textEntry = c.find((v) => v.type === 'paragraph') as TextCard;

    return {
        image: imgEntry.value.image,
        text: textEntry.value,
        link: imgEntry.value.link
    };
}

function Card({
    link,
    image,
    text
}: {
    link: string;
    image: string;
    text: string;
}) {
    const optimizedImage = useOptimizedImage(image);

    return (
        <a className="card" href={link}>
            <img src={optimizedImage} role="presentation" />
            <div className="content">{text}</div>
        </a>
    );
}

type AboutData = {
    whoHeading: string;
    whoParagraph: string;
    whoImageUrl: string;
    whatHeading: string;
    whatParagraph: string;
    whatCards: RawCard[];
    whereHeading: string;
    whereParagraph: string;
    whereMapUrl: string;
    whereMapAlt: string;
};

function About({
    data: {
        whoHeading,
        whoParagraph,
        whoImageUrl,
        whatHeading,
        whatParagraph,
        whatCards,
        whereHeading,
        whereParagraph,
        whereMapUrl: map,
        whereMapAlt
    }
}: {
    data: AboutData;
}) {
    const cards = React.useMemo(
        () => whatCards.map(translateCard),
        [whatCards]
    );
    const mapAlt =
        whereMapAlt ||
        'animated map suggesting where our books are being adopted';
    const maxDim = window.innerWidth < 1920 ? 1015 : undefined;
    const optimizedWhoImage = useOptimizedImage(whoImageUrl, maxDim);

    return (
        <main className="about page">
            <section className="who">
                <div className="content">
                    <div className="text-block">
                        <h1>{whoHeading}</h1>
                        <RawHTML html={whoParagraph} />
                    </div>
                </div>
                <img src={optimizedWhoImage} role="presentation" />
            </section>
            <LazyLoad>
                <section className="what">
                    <div className="content">
                        <div className="text-content">
                            <h2>{whatHeading}</h2>
                            <RawHTML html={whatParagraph} />
                        </div>
                        <div className="cards">
                            {cards.map(({link, image, text}) => (
                                <Card
                                    key={text}
                                    link={link}
                                    image={image}
                                    text={text}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </LazyLoad>
            <LazyLoad>
                <section className="where content">
                    <div className="text-content">
                        <h2>{whereHeading}</h2>
                        <RawHTML html={whereParagraph} />
                    </div>
                </section>
                <div className="map">
                    <div className="content">
                        <img src={map} alt={mapAlt} />
                    </div>
                </div>
            </LazyLoad>
        </main>
    );
}

export default function AboutLoader() {
    return <LoaderPage slug={slug} Child={About} doDocumentSetup />;
}

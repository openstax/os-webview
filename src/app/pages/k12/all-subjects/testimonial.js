import React from 'react';
import useWindowContext, {WindowContextProvider} from '~/contexts/window';
import './testimonial.scss';

const cmsData = {
    heading: 'What our teachers are saying',
    description: `
    At OpenStax, we have been dedicated to improving access to high-quality education
    for over a decade now. Our high school materials are no exception – we work closely
    with high school teachers to ensure our resources meet their needs and the needs of
    their students.
    `,
    quotes: [
        {
            quote: `[It's] wonderful to have high-quality resources that may be used
            with students and no budget impact`,
            attribution1: 'High School Teacher',
            attribution2: 'Verified OpenStax User',
            imgSrc: 'https://images.unsplash.com/photo-1564325724739-bae0bd08762c'
        },
        {
            quote: `Your product is amazing. It rivals any textbook out there. More
            and more of my colleagues are dropping their PAID FOR texts and heading
            your way.`,
            attribution1: 'High School Teacher',
            attribution2: 'Verified OpenStax User',
            imgSrc: 'https://images.unsplash.com/photo-1562884328-39da45501a9c'
        },
        {
            quote: `I am deeply grateful as a teacher in an urban setting that we can
            access valuable, current, and expert curriculum without cost for our students.`,
            attribution1: 'High School Teacher',
            attribution2: 'Verified OpenStax User',
            imgSrc: 'https://images.unsplash.com/photo-1562884328-39da45501a9c'
        },
        {
            quote: `Thank you for making this free!! So much better than out-of-date hard
            copy textbooks!`,
            attribution1: 'High School Teacher',
            attribution2: 'Verified OpenStax User',
            imgSrc: 'https://images.unsplash.com/photo-1630286643448-ca2f23679a35'
        }
    ]
};

function QuoteCard({data, selected}) {
    return (
        <div className="card" aria-hidden={!selected}>
            <div className="quote">&ldquo;{data.quote}&rdquo;</div>
            <img src={data.imgSrc} />
            <div className="attribution">
                <div><strong>{data.attribution1}</strong></div>
                <div>{data.attribution2}</div>
            </div>
        </div>
    );
}

function CarouselButton({item, selectedItem, setSelectedItem}) {
    return (
        <button
            type="button"
            role="radio"
            aria-selected={item === selectedItem}
            onClick={() => setSelectedItem(item)}
        />
    );
}

function QuoteCarousel({data}) {
    const [selectedItem, setSelectedItem] = React.useState(-1);
    const ref = React.useRef();
    const {innerWidth} = useWindowContext();
    const style = React.useMemo(
        () => {
            if (selectedItem < 0 || innerWidth < 100) { // need to use innerWidth somehow...
                return null;
            }
            const {left: rowLeft} = ref.current.getBoundingClientRect();
            const card = ref.current.querySelectorAll('.card')[selectedItem];
            const {left: cLeft, right: cRight} = card.getBoundingClientRect();
            const mid = (cRight + cLeft) / 2 - rowLeft;

            return ({
                left: `calc(50% - ${mid}px)`
            });
        },
        [selectedItem, innerWidth]
    );

    React.useLayoutEffect(() => setSelectedItem(0), []);

    return (
        <div>
            <div className="quote-carousel" ref={ref} style={style}>
                {
                    data.map((q, i) =>
                        <QuoteCard
                            data={q} key={q.quote}
                            selected={i===selectedItem}
                        />
                    )
                }
            </div>
            <div className="button-row">
                {
                    data.map((_, i) =>
                        <CarouselButton
                            key={i} item={i}
                            selectedItem={selectedItem}
                            setSelectedItem={setSelectedItem}
                        />
                    )
                }
            </div>
        </div>
    );
}

export default function Testimonial() {
    const data = cmsData;

    return (
        <section className="testimonial">
            <div className="bg-image-top-left" />
            <div className="bg-image-bottom-right" />
            <div className="text-content">
                <h1>{data.heading}</h1>
                <p>{data.description}</p>
            </div>
            <WindowContextProvider>
                <QuoteCarousel data={data.quotes} />
            </WindowContextProvider>
        </section>
    );
}

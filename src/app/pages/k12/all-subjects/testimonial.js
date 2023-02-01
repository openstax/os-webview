import React from 'react';
import useWindowContext, {WindowContextProvider} from '~/contexts/window';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './testimonial.scss';

function QuoteCard({data, selected}) {
    const [attribution1, attribution2] = data.author.split(',');

    return (
        <div className="card" aria-hidden={!selected}>
            <RawHTML className="quote" html={data.testimonial} />
            <img src={data.authorIcon.file} height="50" width="50" />
            <div className="attribution">
                <div><strong>{attribution1}</strong></div>
                <div>{attribution2}</div>
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

export default function Testimonial({data}) {
    return (
        <section className="testimonial">
            <div className="bg-image-top-left" />
            <div className="bg-image-bottom-right" />
            <div className="text-content">
                <h1>{data.testimonialsHeader}</h1>
                <p>{data.testimonialsDescription}</p>
            </div>
            <WindowContextProvider>
                <QuoteCarousel data={data.testimonials} />
            </WindowContextProvider>
        </section>
    );
}

import React from 'react';
import Carousel from '~/components/carousel/carousel';
import useWindowContext from '~/contexts/window';
import './carousel-section.scss';

export default function CarouselSection({
    heading, description, linkUrl, linkText, children, thing, minWidth
}) {
    const {innerWidth} = useWindowContext();
    const ref = React.useRef();
    const [atATime, setAtATime] = React.useState(1);

    React.useEffect(
        () => {
            const carouselWidth = ref.current.base.getBoundingClientRect().width;

            setAtATime(Math.max(1, Math.floor(carouselWidth / minWidth)));
        },
        [innerWidth, minWidth]
    );

    return (
        <React.Fragment>
            <div className="top">
                <h2>{heading}</h2>
                <div>{description}</div>
            </div>
            <a className="btn primary" href={linkUrl}>
                {linkText}
            </a>
            <Carousel hoverTextThing={thing} ref={ref} atATime={atATime}>
                {children}
            </Carousel>
        </React.Fragment>
    );
}

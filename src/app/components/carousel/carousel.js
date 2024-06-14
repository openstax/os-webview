import React from 'react';
import {Carousel as BaseCarousel, CarouselButton, CarouselItem, CarouselScroller} from 'react-aria-carousel';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import './carousel.scss';

export function FrameChanger({
    chevronDirection,
    onClick,
    hoverText,
    disable = false
}) {
    const icon = {
        left: faChevronLeft,
        right: faChevronRight
    }[chevronDirection];

    return (
        <button
            type='button'
            className={`frame-changer ${chevronDirection}`}
            onClick={onClick}
            disabled={disable}
        >
            <FontAwesomeIcon icon={icon} />
            {hoverText && <span className='hover-text'>{hoverText}</span>}
        </button>
    );
}

function HoverText({which, thing}) {
    if (!thing) {
        return null;
    }
    return (
        <span className='hover-text'>{`${which} ${thing}`}</span>
    );
}

export default function Carousel({
    atATime = 1,
    children,
    hoverTextThing
}) {
    const slides = React.useMemo(
        () => {
            return React.Children.toArray(children).map((child, i) =>
            <CarouselItem index={i} key={i}>{child}</CarouselItem>);
        },
        [children]
    );

    return (
        <BaseCarousel className="carousel" itemsPerPage={atATime}>
            <CarouselScroller className="scroller">
                {slides}
            </CarouselScroller>
            <CarouselButton dir="prev" className="frame-changer left">
                <FontAwesomeIcon icon={faChevronLeft} />
                <HoverText which='Previous' thing={hoverTextThing} />
            </CarouselButton>
            <CarouselButton dir="next" className="frame-changer right">
                <FontAwesomeIcon icon={faChevronRight} />
                <HoverText which='Next' thing={hoverTextThing} />
            </CarouselButton>
        </BaseCarousel>
    );
}

import React from 'react';
import {
    Carousel as BaseCarousel,
    CarouselButton,
    CarouselItem,
    CarouselScroller
} from 'react-aria-carousel';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import './carousel.scss';

// FrameChanger was part of the homegrown carousel, but react-aria-carousel has such items
// built-in, so this is only used by pdf-unit (body-units) now. Might be able to use
// CarouselButton (from react-aria-carousel) for that.
export function FrameChanger({
    chevronDirection,
    onClick,
    hoverText,
    disable
}: {
    chevronDirection: 'left' | 'right';
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    hoverText?: string;
    disable?: boolean;
}) {
    const icon = {
        left: faChevronLeft,
        right: faChevronRight
    }[chevronDirection];
    const label = {
        left: 'Previous page',
        right: 'Next page'
    }[chevronDirection];

    return (
        <button
            type="button"
            className={`frame-changer ${chevronDirection}`}
            onClick={onClick}
            disabled={disable}
            aria-label={label}
        >
            <FontAwesomeIcon icon={icon} />
            {hoverText && <span className="hover-text">{hoverText}</span>}
        </button>
    );
}

function HoverText({which, thing}: {which: string; thing: string}) {
    if (!thing) {
        return null;
    }
    return <span className="hover-text">{`${which} ${thing}`}</span>;
}

export default function Carousel({
    atATime = 1,
    children,
    hoverTextThing,
    ref
}: React.PropsWithChildren<{
    atATime?: number;
    hoverTextThing: string;
    ref?: Parameters<typeof BaseCarousel>[0]['ref'];
}>) {
    const slides = React.useMemo(() => {
        return React.Children.toArray(children).map((child, i) => (
            <CarouselItem index={i} key={i}>
                {child}
            </CarouselItem>
        ));
    }, [children]);

    return (
        <BaseCarousel className="carousel" itemsPerPage={atATime} ref={ref}>
            <CarouselScroller className="scroller">{slides}</CarouselScroller>
            <CarouselButton dir="prev" className="frame-changer left">
                <FontAwesomeIcon icon={faChevronLeft} />
                <HoverText which="Previous" thing={hoverTextThing} />
            </CarouselButton>
            <CarouselButton dir="next" className="frame-changer right">
                <FontAwesomeIcon icon={faChevronRight} />
                <HoverText which="Next" thing={hoverTextThing} />
            </CarouselButton>
        </BaseCarousel>
    );
}

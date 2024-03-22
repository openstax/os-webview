import React from 'react';
import {CarouselProvider, Slider, Slide, ButtonBack, ButtonNext} from 'pure-react-carousel';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import useWindowContext, {WindowContextProvider} from '~/contexts/window';
import 'pure-react-carousel/dist/react-carousel.es.css';
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

function Carousel({
    children,
    atATime = 1,
    mobileSlider = false,
    initialFrame = 0,
    hoverTextThing
}) {
    const slides = React.useMemo(
        () => {
            return React.Children.toArray(children).map((child, i) => <Slide index={i} key={i}>{child}</Slide>);
        },
        [children]
    );
    const ref = React.useRef();
    const [width, setWidth] = React.useState(260);
    const [height, setHeight] = React.useState(260);
    const {innerWidth} = useWindowContext();

    React.useEffect(
        () => {
            const viewportWidth = ref.current.base.getBoundingClientRect().width;

            setWidth(viewportWidth / atATime - (atATime - 1) * 15);
        },
        [innerWidth, atATime]
    );

    React.useEffect(
        () => {
            const slideContents = Array.from(ref.current.base.querySelectorAll('.carousel__inner-slide > *'));
            const heights = slideContents.map((c) => c.getBoundingClientRect().height);

            setHeight(Math.max(...heights));
        },
        [width]
    );

    return (
        <CarouselProvider
            naturalSlideWidth={width}
            naturalSlideHeight={height}
            visibleSlides={atATime}
            step={atATime}
            totalSlides={slides.length}
            currentSlide={initialFrame}
            ref={ref}
            className={mobileSlider ? 'mobile-slider' : ''}
        >
            <Slider>
                {slides}
            </Slider>
            <ButtonBack className="frame-changer left">
                <FontAwesomeIcon icon={faChevronLeft} />
                <HoverText which='Previous' thing={hoverTextThing} />
            </ButtonBack>
            <ButtonNext className="frame-changer right">
                <FontAwesomeIcon icon={faChevronRight} />
                <HoverText which='Next' thing={hoverTextThing} />
            </ButtonNext>
        </CarouselProvider>
    );
}

export default function CarouselWithContext(props) {
    return (
        <WindowContextProvider>
            <Carousel {...props} />
        </WindowContextProvider>
    );
}

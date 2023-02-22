import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import useWindowContext, {WindowContextProvider} from '~/contexts/window';
import cn from 'classnames';
import './carousel.scss';

export function FrameChanger({chevronDirection, onClick, hoverText, disable=false}) {
    const icon = ({
        'left': faChevronLeft,
        'right': faChevronRight
    })[chevronDirection];

    return (
        <button
            type="button" className={`frame-changer ${chevronDirection}`}
            onClick={onClick} disabled={disable}
        >
            <FontAwesomeIcon icon={icon} />
            {
                hoverText && <span className="hover-text">{hoverText}</span>
            }
        </button>
    );
}

function LeftFrameChanger({frameNumber, setFrameNumber, step=1, hoverTextThing}) {
    const destFrame = frameNumber - step;
    const hoverText = hoverTextThing ? `Previous ${hoverTextThing}` : null;

    return (
        destFrame >= 0 &&
            <FrameChanger
                chevronDirection="left"
                onClick={() => setFrameNumber(destFrame)}
                hoverText={hoverText}
            />
    );
}

function RightFrameChanger({frameNumber, frameCount, setFrameNumber, step=1, hoverTextThing}) {
    const destFrame = frameNumber + step;
    const hoverText = hoverTextThing ? `Next ${hoverTextThing}` : null;

    return (
        destFrame < frameCount - 1 &&
            <FrameChanger
                chevronDirection="right"
                onClick={() => setFrameNumber(destFrame)}
                hoverText={hoverText}
            />
    );
}

// How many whole items are in the viewport?
function getStep(atATime, containerEl, frameNumber) {
    if (!containerEl) {
        return Number(atATime);
    }
    const {width: vpWidth} = containerEl.getBoundingClientRect();
    const itemsFromCurrent = Array.from(
        containerEl.querySelectorAll('.items > *')
    ).slice(frameNumber);
    const {left} = itemsFromCurrent[0].getBoundingClientRect();
    const wholeItems = itemsFromCurrent.filter(
        (i) => {
            const {right} = i.getBoundingClientRect();

            return right - left <= vpWidth;
        }
    );

    return Math.max(Number(atATime), wholeItems.length);
}

function Carousel({
    children, atATime=1, mobileSlider=false, initialFrame=0, hoverTextThing,
    frameCount = React.Children.count(children)
}) {
    const [frameNumber, setFrameNumber] = React.useState(initialFrame);
    const ref = React.useRef();
    const firstTimeRef = React.useRef(true);
    const wcx = useWindowContext();
    // Not useMemo because it has to update when children render
    const step = getStep(atATime, ref.current, frameNumber);

    React.useLayoutEffect(
        () => {
            const targetItem = ref.current.querySelectorAll('.items > *')[frameNumber];
            const {left: viewportLeft} = ref.current.getBoundingClientRect();
            const {left: targetLeft} = targetItem.getBoundingClientRect();
            const left = targetLeft - viewportLeft + ref.current.scrollLeft;

            ref.current.scrollTo({
                left,
                behavior: firstTimeRef.current ? 'auto' : 'smooth'
            });
            firstTimeRef.current = false;
        },
        [frameNumber, wcx.innerWidth]
    );

    return (
        <div className={cn('carousel', {'mobile-slider': mobileSlider})}>
            <div className="viewport" ref={ref}>
                <div className="items">
                    {children}
                </div>
            </div>
            <LeftFrameChanger {...{frameNumber, setFrameNumber, step, hoverTextThing}} />
            <RightFrameChanger {...{frameNumber, setFrameNumber, frameCount, step, hoverTextThing}} />
        </div>
    );
}

export default function CarouselWithContext(props) {
    return (
        <WindowContextProvider>
            <Carousel {...props} />
        </WindowContextProvider>
    );
}

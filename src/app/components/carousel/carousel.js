import React, {useState, useRef} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {WindowContextProvider, WindowContext} from '~/components/jsx-helpers/jsx-helpers.jsx';
import cn from 'classnames';
import './carousel.css';

function FrameChanger({chevronDirection, onClick, hoverText}) {
    return (
        <button
            type="button" className={`frame-changer ${chevronDirection}`}
            onClick={onClick}
        >
            <FontAwesomeIcon icon={`chevron-${chevronDirection}`} />
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
        destFrame < frameCount &&
            <FrameChanger
                chevronDirection="right"
                onClick={() => setFrameNumber(destFrame)}
                hoverText={hoverText}
            />
    );
}

function Carousel({
    children, atATime=1, mobileSlider=false, initialFrame=0, hoverTextThing,
    frameCount = React.Children.count(children)
}) {
    const [frameNumber, setFrameNumber] = useState(initialFrame);
    const ref = useRef();
    const step = Number(atATime);
    const firstTimeRef = useRef(true);
    const wcx = React.useContext(WindowContext);

    React.useEffect(() => {
        // On initial draw, need to wait for render.
        setTimeout(() => {
            const targetItem = ref.current.querySelectorAll('.items > *')[frameNumber];
            const {left: viewportLeft} = ref.current.getBoundingClientRect();
            const {left: targetLeft} = targetItem.getBoundingClientRect();
            const left = targetLeft - viewportLeft + ref.current.scrollLeft;

            ref.current.scrollTo({
                left,
                behavior: firstTimeRef.current ? 'auto' : 'smooth'
            });
            firstTimeRef.current = false;
        }, 10);
    }, [frameNumber, wcx.innerWidth]);

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

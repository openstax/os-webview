import React, {useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {WindowContextProvider, WindowContext} from '~/components/jsx-helpers/jsx-helpers.jsx';
import cn from 'classnames';
import './carousel.css';

function FrameChanger({chevronDirection, onClick}) {
    return (
        <button
            type="button" className={`frame-changer ${chevronDirection}`}
            onClick={onClick}
        >
            <FontAwesomeIcon icon={`chevron-${chevronDirection}`} />
        </button>
    );
}

function LeftFrameChanger({frameNumber, setFrameNumber, step=1}) {
    const destFrame = frameNumber - step;

    return (
        destFrame >= 0 &&
            <FrameChanger
                chevronDirection="left"
                onClick={() => setFrameNumber(destFrame)}
            />
    );
}

function RightFrameChanger({frameNumber, frameCount, setFrameNumber, step=1}) {
    const destFrame = frameNumber + step;

    return (
        destFrame < frameCount &&
            <FrameChanger
                chevronDirection="right"
                onClick={() => setFrameNumber(destFrame)}
            />
    );
}

function Carousel({children, atATime=1, mobileSlider=false, initialFrame=0}) {
    const [frameNumber, setFrameNumber] = useState(initialFrame);
    const frameCount = React.Children.count(children);
    const ref = useRef();
    const step = Number(atATime);
    const firstTimeRef = useRef(true);
    const wcx = React.useContext(WindowContext);

    useEffect(() => {
        const targetItem = ref.current.querySelectorAll('.items > *')[frameNumber];
        const {left: viewportLeft} = ref.current.getBoundingClientRect();
        const {left: targetLeft} = targetItem.getBoundingClientRect();
        const left = targetLeft - viewportLeft + ref.current.scrollLeft;

        ref.current.scrollTo({
            left,
            behavior: firstTimeRef.current ? 'auto' : 'smooth'
        });
        firstTimeRef.current = false;
    }, [frameNumber, wcx.innerWidth]);

    return (
        <div className={cn('carousel', {'mobile-slider': mobileSlider})}>
            <div className="viewport" ref={ref}>
                <div className="items">
                    {children}
                </div>
            </div>
            <LeftFrameChanger {...{frameNumber, setFrameNumber, step}} />
            <RightFrameChanger {...{frameNumber, setFrameNumber, frameCount, step}} />
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

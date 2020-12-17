import React, {useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
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

export default function Carousel({children, atATime=1, mobileSlider=false}) {
    const [frameNumber, setFrameNumber] = useState(0);
    const [frameCount, setFrameCount] = useState(1);
    const ref = useRef();
    const step = Number(atATime);

    useEffect(() => {
        const targetItem = ref.current.querySelectorAll('.items > *')[frameNumber];
        const {left: viewportLeft} = ref.current.getBoundingClientRect();
        const {left: targetLeft} = targetItem.getBoundingClientRect();
        const left = targetLeft - viewportLeft + ref.current.scrollLeft;

        ref.current.scrollTo({
            left,
            behavior: 'smooth'
        });
    }, [frameNumber]);

    React.useLayoutEffect(() => {
        setFrameCount(ref.current.querySelectorAll('.items > *').length);
    }, [children]);

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

import React, {useState, useRef} from 'react';
import {WindowContextProvider, WindowContext} from '~/components/jsx-helpers/jsx-helpers.jsx';
import ClippedImage from '~/components/clipped-image/clipped-image';
import cn from 'classnames';
import './hero.scss';

const TOO_SKINNY_RATIO = 1.15;
const NARROW_SCREEN = 500;

function isTooSkinny(el) {
    const {height, width} = el.getBoundingClientRect();

    return height > TOO_SKINNY_RATIO * width;
}

function useWrappingRules(el) {
    const {innerWidth} = React.useContext(WindowContext);
    const [wrapNarrowerThan, setWrapNarrowerThan] = useState(NARROW_SCREEN);
    const wrapped = innerWidth <= wrapNarrowerThan;

    React.useLayoutEffect(() => {
        if (el && !wrapped && isTooSkinny(el)) {
            setWrapNarrowerThan(innerWidth);
        }
    }, [el, wrapped, innerWidth]);

    return wrapped;
}

export default function Hero({children, src, alt, Tag='div', reverse}) {
    const pictureRef = useRef();
    const wrapped = useWrappingRules(pictureRef.current);

    return (
        <WindowContextProvider>
            <Tag className={cn('hero-component hero', {wrapped, reverse})}>
                <div className="text-content">
                    {children}
                </div>
                <div className="picture-content" ref={pictureRef}>
                    <ClippedImage src={src} alt={alt} />
                    <img src={src} alt={alt} />
                </div>
            </Tag>
        </WindowContextProvider>
    );
}

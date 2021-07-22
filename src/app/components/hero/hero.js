import React, {useState, useRef} from 'react';
import useWindowContext, {WindowContextProvider} from '~/models/window-context';
import ClippedImage from '~/components/clipped-image/clipped-image';
import cn from 'classnames';
import './hero.scss';

console.info('Using', useState, useWindowContext);
// const TOO_SKINNY_RATIO = 1.15;
// const NARROW_SCREEN = 500;
//
// function isTooSkinny(el) {
//     const {height, width} = el.getBoundingClientRect();
//
//     return height > TOO_SKINNY_RATIO * width;
// }
//
// function useWrappingRules(el) {
//     const {innerWidth} = useWindowContext();
//     const [wrapNarrowerThan, setWrapNarrowerThan] = useState(NARROW_SCREEN);
//     const wrapped = innerWidth <= wrapNarrowerThan;
//
//     React.useLayoutEffect(() => {
//         if (el && !wrapped && isTooSkinny(el)) {
//             setWrapNarrowerThan(innerWidth);
//         }
//     }, [el, wrapped, innerWidth]);
//
//     return wrapped;
// }

export default function Hero({children, src, alt, Tag='div', reverse}) {
    const pictureRef = useRef();

    return (
        <WindowContextProvider>
            <Tag className={cn('hero-component hero', {reverse})}>
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

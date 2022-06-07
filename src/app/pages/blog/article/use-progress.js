import React from 'react';
import useWindowContext from '~/contexts/window';

function getProgress(divRect, viewportBottom) {
    if (!divRect) {
        return 0;
    }
    const visibleHeight = viewportBottom - divRect.top;

    if (visibleHeight <= 0) {
        return 0;
    }
    if (viewportBottom >= divRect.bottom) {
        return 100;
    }

    return Math.round(100 * visibleHeight / divRect.height);
}

export default function useScrollProgress(ref) {
    const bodyRef = React.useRef();
    const el = bodyRef.current;
    const [rect, refresh] = React.useReducer(
        () => el?.getBoundingClientRect(),
        el?.getBoundingClientRect()
    );
    const {innerHeight, scrollY} = useWindowContext();
    const progress = React.useMemo(
        () => getProgress(rect, innerHeight),
        [rect, innerHeight]
    );

    React.useEffect(
        () => {
            Array.from(ref.current.querySelectorAll('img'))
                .forEach((img) => {
                    img.onload = refresh;
                });
        },
        [ref]
    );

    // Wait a tick so the bodyRef assignment happens
    React.useEffect(() => window.requestAnimationFrame(refresh), [innerHeight, scrollY, refresh]);

    return [progress, bodyRef];
}

import React from 'react';
import {WindowContextProvider} from '~/models/window-context';
import ClippedImage from '~/components/clipped-image/clipped-image';
import cn from 'classnames';
import './hero.scss';

export default function Hero({children, src, alt, Tag='div', reverse}) {
    const pictureRef = React.useRef();

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

import React from 'react';
import cn from 'classnames';
import './clipped-image.scss';

export default function ClippedImage({
    className,
    src,
    alt,
    ...positionArgs
}: {
    className?: string;
    src: string;
    alt?: string;
    positionArgs?: React.CSSProperties;
}) {
    const style = {backgroundImage: `url(${src})`, ...positionArgs};
    const titleOrHidden = alt ? {title: alt} : {'aria-hidden': true};

    return (
        <div
            className={cn(className, 'clipped-image')}
            style={style}
            {...titleOrHidden}
        />
    );
}

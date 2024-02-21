import React from 'react';
import cn from 'classnames';
import './clipped-image.scss';

export default function ClippedImage({className, src, alt, ...positionArgs}) {
    const style = {backgroundImage: `url(${src})`, ...positionArgs};
    const title = alt ? {title: alt} : {'aria-hidden': true};

    return (
        <div className={cn(className, 'clipped-image')} style={style} {...title} />
    );
}

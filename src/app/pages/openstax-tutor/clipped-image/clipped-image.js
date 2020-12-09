import React from 'react';
import cn from 'classnames';
import './clipped-image.css';

export default function ClippedImage({className, src, alt, ...positionArgs}) {
    const style = {backgroundImage: `url(${src})`, ...positionArgs};

    return (
        <div className={cn(className, 'clipped-image')} style={style} title={alt} />
    );
}

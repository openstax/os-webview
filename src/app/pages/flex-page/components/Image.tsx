import React from 'react';

export interface ImageFields {
    id: string;
    file: string;
    height: number;
    width: number;
}

type ImageProps = {
    image: ImageFields;
} & React.ImgHTMLAttributes<HTMLImageElement>

export function Image({image, ...props}: ImageProps) {
    return <img {...props} src={image.file} width={image.width} height={image.height} />;
}


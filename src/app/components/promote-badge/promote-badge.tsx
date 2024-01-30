import React from 'react';

export default function PromoteBadge({
    name,
    image
}: {
    name: string;
    image: string;
}) {
    if (!image) {
        return null;
    }
    const altText = `${name} available`;

    return <img className='badge' src={image} alt={altText} title={altText} />;
}

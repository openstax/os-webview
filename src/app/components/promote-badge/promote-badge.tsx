import React from 'react';

export default function PromoteBadge({
    name,
    image
}: {
    name: string;
    image: string;
}) {
    const altText = `${name} available`;

    return <img className='badge' src={image} alt={altText} title={altText} />;
}

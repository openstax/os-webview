import React from 'react';
import type {Icon} from '../participants';
import './established-partners.scss';

export default function EstablishedPartners({model}: {model: Icon[]}) {
    return (
        <div className="established-partners">
            {model.map((icon) => (
                <img
                    key={icon.image.image}
                    src={icon.image.image}
                    alt={icon.imageAltText}
                />
            ))}
        </div>
    );
}

import React from 'react';
import './established-partners.scss';

export default function EstablishedPartners({model=[]}) {
    return (
        <div className="established-partners">
            {
                model.map((icon) => <img key={icon} src={icon.image.image} alt={icon.altText} />)
            }
        </div>
    );
}

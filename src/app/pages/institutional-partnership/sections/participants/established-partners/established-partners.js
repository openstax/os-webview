import React from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import './established-partners.css';

function EstablishedPartners({model}) {
    return (
        <React.Fragment>
            {
                model.map((icon) => <img key={icon} src={icon.image.image} alt={icon.altText} />)
            }
        </React.Fragment>
    );
}

const view = {
    classes: ['established-partners']
};

export default pageWrapper(EstablishedPartners, view);

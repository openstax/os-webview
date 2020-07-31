import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './link-with-chevron.css';

export default function LinkWithChevron({children, className, ...props}) {
    const classList = ['link-with-chevron'];

    if (className) {
        classList.push(className);
    }

    return (
        <a className={classList.join(' ')} {...props}>
            {children}{' '}
            <FontAwesomeIcon icon="chevron-right" />
        </a>
    );
}

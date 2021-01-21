import React from 'react';
import cn from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './link-with-chevron.css';

export default function LinkWithChevron({children, className, ...props}) {
    const classList = ['link-with-chevron'];

    return (
        <a className={cn('link-with-chevron', className)} {...props}>
            {children}{' '}
            <FontAwesomeIcon icon="chevron-right" />
        </a>
    );
}

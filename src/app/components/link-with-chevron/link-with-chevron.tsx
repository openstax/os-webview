import React from 'react';
import cn from 'classnames';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronRight} from '@fortawesome/free-solid-svg-icons/faChevronRight';
import './link-with-chevron.scss';

export default function LinkWithChevron({children, className, ...props}:
    React.AnchorHTMLAttributes<HTMLAnchorElement>
) {
    return (
        <a className={cn('link-with-chevron', className)} {...props}>
            {children}{' '}
            <FontAwesomeIcon icon={faChevronRight} />
        </a>
    );
}

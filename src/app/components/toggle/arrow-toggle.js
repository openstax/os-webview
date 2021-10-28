import React from 'react';
import cn from 'classnames';
import './arrow-toggle.scss';

export default function ArrowToggle({isOpen}) {
    return (
        <span
            className={cn('arrow-toggle with-arrow', {open: isOpen})}
        />
    );
}

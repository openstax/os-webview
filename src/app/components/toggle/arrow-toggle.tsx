import React from 'react';
import cn from 'classnames';
import './arrow-toggle.scss';

export default function ArrowToggle({isOpen}: {isOpen: boolean}) {
    return <span className={cn('arrow-toggle with-arrow', {open: isOpen})} />;
}

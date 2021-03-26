import React from 'react';
import cn from 'classnames';

export function pageWrapper(Component, {tag: Tag = 'div', classes, ...others}) {
    return (
        <Tag className={cn(classes)}>
            <Component />
        </Tag>
    );
}

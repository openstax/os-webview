import React from 'react';
import cn from 'classnames';
import './labeled-data.scss';

export default function LabeledData({
    Tag = 'div', LabelTag = 'label', label, className, children, ...other
}) {
    return (
        <Tag className={cn('labeled-data', className)} {...other}>
            <LabelTag>{label}</LabelTag>
            <div className='value'>{children}</div>
        </Tag>
    );
}

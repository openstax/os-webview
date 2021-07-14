import React from 'react';
import PutAway from '../put-away/put-away';
import './selected-items.scss';

function Item({ item, onRemove }) {
    return (
        <div className='item'>
            <span>{item.label}</span>
            <PutAway onClick={() => onRemove(item)} />
        </div>
    );
}

export default function SelectedItems({ items, children, onRemove }) {
    return (
        <div className='selected-items' role='group'>
            <div className='items-box'>
                {items.map((item) => <Item item={item} key={item.value} onRemove={onRemove} />)}
            </div>
            {children}
        </div>
    );
}

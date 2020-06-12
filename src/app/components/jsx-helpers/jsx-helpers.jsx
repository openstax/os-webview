import React from 'react';

export function RawHTML({Tag='div', html, ...otherProps}) {
    return (
        <Tag dangerouslySetInnerHTML={{__html: html}} {...otherProps} />
    );
}

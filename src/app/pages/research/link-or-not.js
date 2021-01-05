import React from 'react';

export default function LinkOrNot({url, children}) {
    return (
        url ? <a href={url}>{children}</a> : children
    );
}

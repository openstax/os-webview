import React from 'react';

export default function LinkOrNot({url, children}) {
    return (
        url ?
            <a href={url}>
                {children}
            </a> :
            <React.Fragment>
                {children}
            </React.Fragment>
    );
}

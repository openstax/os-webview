import React from 'react';

export default function ({messageHtml}) {
    return (
        <div dangerouslySetInnerHTML={{__html: messageHtml}} />
    );
}

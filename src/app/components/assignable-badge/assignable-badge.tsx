import React from 'react';
import assignableSnippet from '~/models/assignable-snippet';
import {usePromise} from '~/helpers/use-data';

const altText = 'Assignable available';

export default function AssignableBadge() {
    const snippet = usePromise(assignableSnippet, undefined);

    if (!snippet) {
        return null;
    }

    return (
        <img
            className='badge'
            src={snippet.assignableAvailableImage}
            alt={altText}
            title={altText}
        />
    );
}

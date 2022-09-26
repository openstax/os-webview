import {useEffect} from 'react';
import $ from '~/helpers/$';

export default function Head({title, description, noindex}) {
    useEffect(
        () => $.setPageTitleAndDescription(title, description),
        [title, description]
    );

    useEffect(
        () => {
            if (noindex) {
                const tag = document.createElement('meta');

                tag.setAttribute('content', 'noindex');
                tag.setAttribute('name', 'robots');
                document.head.appendChild(tag);

                return () => document.head.removeChild(tag);
            }
            return null;
        },
        [noindex]
    );

    return null;
}

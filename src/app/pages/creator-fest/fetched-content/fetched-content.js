import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {urlFromSlug} from '~/models/cmsFetch';
import './fetched-content.css';

// March 16 2021: Removing Signup form code. This page is currently inactive with
// no way to see whether porting worked. If and when we re-activate the page,
// pull code from older archive

function useTextFromSlug(slug) {
    const [text, setText] = React.useState();
    const url = urlFromSlug(slug);

    React.useEffect(() => {
        fetch(url).then((r) => r.text()).then((pageHtml) => {
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(pageHtml, 'text/html');

            setText(newDoc.body.innerHTML);
        });
    }, [url]);

    return text;
}

export default function FetchedContent({pageId, slug}) {
    const html = useTextFromSlug(slug);

    return (
        <section className={pageId}>
            <RawHTML className="boxed" html={html} embed />
        </section>
    );
}

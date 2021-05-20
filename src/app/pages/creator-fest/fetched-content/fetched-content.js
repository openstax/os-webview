import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {useTextFromSlug} from '~/helpers/controller/cms-mixin';
import './fetched-content.scss';

// March 16 2021: Removing Signup form code. This page is currently inactive with
// no way to see whether porting worked. If and when we re-activate the page,
// pull code from older archive


export default function FetchedContent({pageId, slug}) {
    const html = useTextFromSlug(slug);

    return (
        <section className={pageId}>
            <RawHTML className="boxed" html={html} embed />
        </section>
    );
}

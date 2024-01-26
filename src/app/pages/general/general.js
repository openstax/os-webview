import React from 'react';
import useDocumentHead, {useCanonicalLink} from '~/helpers/use-document-head';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {useTextFromSlug} from '~/helpers/page-data-utils';
import {useLocation} from 'react-router-dom';
import './general.scss';

function GeneralPage({html}) {
    const parser = new window.DOMParser();
    const newDoc = parser.parseFromString(html, 'text/html');
    const strips = parser
        .parseFromString(
            '<img class="strips" src="/dist/images/components/strips.svg" height="10" alt="">',
            'text/html'
        )
        .querySelector('img');
    const innerHTML = Array.from(newDoc.body.children)
        .reduce((arr, el) => {
            if (el.classList.contains('block-heading')) {
                el.innerHTML = `<h1>${el.innerHTML.trim()}</h1>`;
                el.appendChild(strips);
            }
            arr.push(el.outerHTML);
            return arr;
        }, [])
        .join('\n');

    return <RawHTML className='general page' html={innerHTML} embed />;
}

function isCanonical(slug) {
    return slug.includes('kinetic') || slug.endsWith('partner-program');
}

function getCanonicalPath(slug) {
    return `${slug.replace(/.*\/(?!$)/, '/')}${slug.endsWith('/') ? '' : '/'}`;
}

export function GeneralPageFromSlug({slug, fallback}) {
    const {head, text: html} = useTextFromSlug(slug);
    const canonicalPath = getCanonicalPath(slug);
    const putCanonicalLinkInPage = isCanonical(slug);

    useDocumentHead({
        title: head?.title || 'OpenStax',
        description: head?.description,
        noindex: !putCanonicalLinkInPage
    });
    useCanonicalLink(putCanonicalLinkInPage, canonicalPath);

    if (html instanceof Error) {
        if (fallback) {
            fallback();
        }
        return <h1>Error: {head}</h1>;
    }

    return !html ? <h1>Loading...</h1> : <GeneralPage html={html} />;
}

export default function GeneralPageLoader() {
    const {pathname} = useLocation();
    const slug = pathname.substring(1).replace('general', 'spike');

    return <GeneralPageFromSlug slug={slug} />;
}

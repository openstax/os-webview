import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {useTextFromSlug} from '~/helpers/controller/cms-mixin';
import useRouterContext from '~/components/shell/router-context';
import {useLocation} from 'react-router-dom';
import $ from '~/helpers/$';
import './general.scss';

function GeneralPage({html}) {
    const parser = new window.DOMParser();
    const newDoc = parser.parseFromString(html, 'text/html');
    const strips = parser
        .parseFromString(
            '<img class="strips" src="/images/components/strips.svg" height="10" alt="">',
            'text/html'
        )
        .querySelector('img');
    const innerHTML = Array.from(newDoc.body.children).reduce((arr, el) => {
        if (el.classList.contains('block-heading')) {
            el.appendChild(strips);
        }
        arr.push(el.outerHTML);
        return arr;
    }, []).join('\n');

    return (
        <RawHTML className="general page" html={innerHTML} embed />
    );
}

export function GeneralPageFromSlug({slug, fallback}) {
    const html = useTextFromSlug(slug);
    const {fail} = useRouterContext();

    React.useEffect(() => {
        $.setPageTitleAndDescription();
    }, []);

    if (html instanceof Error) {
        fallback ? fallback() : fail(`Could not load general page from ${slug}`);
    }

    return (
        <main>
            {html ? <GeneralPage html={html} /> : <h1>Loading...</h1>}
        </main>
    );
}

export default function GeneralPageLoader() {
    const location = useLocation();
    const slug = location.pathname.substr(1).replace('general', 'spike');

    console.info('Pulling slug', slug);
    return (
        <GeneralPageFromSlug slug={slug} />
    );
}

import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {useTextFromSlug} from '~/helpers/controller/cms-mixin';
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

export default function GeneralPageLoader() {
    const slug = window.location.pathname.substr(1).replace('general', 'spike');
    const html = useTextFromSlug(slug);

    React.useEffect(() => {
        $.setPageTitleAndDescription();
    }, []);

    return (
        <main>
            {html ? <GeneralPage html={html} /> : <h1>Loading...</h1>}
        </main>
    );
}

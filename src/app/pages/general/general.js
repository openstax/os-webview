import {pageWrapper} from '~/controllers/jsx-wrapper';
import React from 'react';
import {LoaderPage, RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {urlFromSlug} from '~/models/cmsFetch';
import './general.css';

function GeneralPage({html}) {
    const parser = new DOMParser();
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

function GeneralPageLoader() {
    const [html, setHtml] = React.useState();

    React.useEffect(() => {
        const slug = window.location.pathname.substr(1).replace('general', 'spike');
        const url = urlFromSlug(slug);

        fetch(url)
            .then((r) => r.text())
            .then(setHtml);
    }, []);

    return (
        html ? <GeneralPage html={html} /> : <h1>Loading...</h1>
    );
}

const view = {
    tag: 'main'
};

export default pageWrapper(GeneralPageLoader, view);

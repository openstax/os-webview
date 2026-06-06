import React from 'react';

// While previewing a draft, Wagtail redirects the editor here with a `?preview`
// query parameter (see the CMS `serve_preview`). Loading Wagtail's userbar on
// the previewed page is what enables live-preview scroll restoration, the
// accessibility/content checker, content metrics, and wagtail-ai's content
// checks on the decoupled front-end (per the Wagtail headless docs). The CMS
// and front-end share an origin, so the fetch is same-origin.
const apiOrigin = process.env.API_ORIGIN ?? '';
const userbarEndpoint = `${apiOrigin}/apps/cms/userbar/`;
const userbarScripts = [
    `${apiOrigin}/static/wagtailadmin/js/vendor.js`,
    `${apiOrigin}/static/wagtailadmin/js/userbar.js`
];

function isPreviewing() {
    return new URLSearchParams(window.location.search).has('preview');
}

function appendScript(parent: HTMLElement, src: string) {
    const script = document.createElement('script');

    script.src = src;
    // Preserve order: vendor.js must run before userbar.js.
    script.async = false;
    parent.appendChild(script);
}

export default function HeadlessUserbar() {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const container = ref.current;
        let cancelled = false;

        if (isPreviewing() && container) {
            fetch(userbarEndpoint, {credentials: 'include'})
                .then((response) => response.text())
                .then((html) => {
                    // Guard against double-injection (e.g. effect re-runs) and
                    // the empty body the endpoint returns for non-admins.
                    if (
                        cancelled ||
                        !html ||
                        container.querySelector('wagtail-userbar')
                    ) {
                        return;
                    }
                    container.innerHTML = html;
                    userbarScripts.forEach((src) =>
                        appendScript(container, src)
                    );
                })
                .catch(() => undefined);
        }

        return () => {
            cancelled = true;
        };
    }, []);

    return <div ref={ref} className="headless-userbar" />;
}

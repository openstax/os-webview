import React from 'react';

// While previewing a draft, Wagtail redirects the editor here with a `?preview`
// query parameter (see the CMS `serve_preview`). Loading Wagtail's userbar on
// the previewed page is what enables live-preview scroll restoration, the
// accessibility/content checker, content metrics, and wagtail-ai's content
// checks on the decoupled front-end (per the Wagtail headless docs). The CMS
// may be on a different origin when API_ORIGIN is set (otherwise this is same-origin).
const apiOrigin = process.env.API_ORIGIN ?? '';
// Under /apps/cms/api/ because that is the only /apps/cms/ path the production
// nginx routes to the CMS backend; other paths proxy to the front-end itself.
// TEMPORARY: the dedicated /apps/cms/api/userbar/* CloudFront behavior (cookies
// forwarded, no cache) isn't deployed yet, so /apps/cms/api/userbar/ strips the
// session cookie and returns blank. Ride the already-deployed, now-unused
// /apps/cms/api/salesforce/reviews/* behavior (cookies forwarded) to test.
// Revert to `${apiOrigin}/apps/cms/api/userbar/` once the CloudFront change ships.
const userbarEndpoint = `${apiOrigin}/apps/cms/api/salesforce/reviews/userbar/`;
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
    // Public traffic never previews, so don't mount the loader (or its effect
    // and DOM node) at all outside preview. Gating here rather than inside the
    // effect keeps the div off every public page. The hookless wrapper makes
    // the early return safe: all hooks live in UserbarLoader, which is only
    // mounted while previewing.
    if (!isPreviewing()) {
        return null;
    }

    return <UserbarLoader />;
}

function UserbarLoader() {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const container = ref.current;
        let cancelled = false;

        if (container) {
            fetch(userbarEndpoint, {credentials: 'include'})
                .then((response) => (response.ok ? response.text() : ''))
                .then((html) => {
                    // Guard against double-injection (e.g. effect re-runs), the empty body
                    // the endpoint returns for non-admins, and unexpected responses.
                    if (
                        cancelled ||
                        !html ||
                        !html.includes('wagtail-userbar') ||
                        container.querySelector('wagtail-userbar')
                    ) {
                        return;
                    }
                    container.innerHTML = html;
                    userbarScripts.forEach((src) => appendScript(container, src));
                })
                .catch(() => undefined);
        }

        return () => {
            cancelled = true;
        };
    }, []);

    return <div ref={ref} className="headless-userbar" />;
}

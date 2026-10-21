import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, waitFor} from '@testing-library/preact';
import usePortalContext, {PortalContextProvider} from '~/contexts/portal';

function Links({portal, hrefs}: {portal: string; hrefs: string[]}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const {setPortal, rewriteLinks} = usePortalContext();

    React.useEffect(() => setPortal(portal), [setPortal, portal]);
    React.useLayoutEffect(() => {
        rewriteLinks(ref.current as HTMLElement);
        rewriteLinks(ref.current as HTMLElement);
    }, [rewriteLinks]);

    return (
        <div ref={ref}>
            {hrefs.map((href) => <a key={href} href={href}>{href}</a>)}
        </div>
    );
}

function renderedHrefs(container: Element) {
    return Array.from(container.querySelectorAll('a')).map((a) => a.getAttribute('href'));
}

describe('portal context rewriteLinks', () => {
    it('leaves links alone outside a portal', () => {
        const {container} = render(
            <PortalContextProvider>
                <Links portal="" hrefs={['/subjects']} />
            </PortalContextProvider>
        );

        expect(renderedHrefs(container)).toEqual(['/subjects']);
    });

    it('prefixes site links once, and leaves links already in the portal and external links alone', async () => {
        const {container} = render(
            <PortalContextProvider>
                <Links
                    portal="my-portal"
                    hrefs={['/subjects', '/my-portal', '/my-portal/details/books/x', 'https://example.org/']}
                />
            </PortalContextProvider>
        );

        await waitFor(() => expect(renderedHrefs(container)).toEqual([
            '/my-portal/subjects',
            '/my-portal',
            '/my-portal/details/books/x',
            'https://example.org/'
        ]));
    });
});

function HrefsInPortal({portal, hrefs}: {portal: string; hrefs: string[]}) {
    const {setPortal, hrefInPortal} = usePortalContext();

    React.useEffect(() => setPortal(portal), [setPortal, portal]);

    return <div>{hrefs.map((href) => <a key={href} href={hrefInPortal(href)}>{href}</a>)}</div>;
}

describe('portal context hrefInPortal', () => {
    it('returns links unchanged outside a portal', () => {
        const {container} = render(
            <PortalContextProvider>
                <HrefsInPortal portal="" hrefs={['/subjects']} />
            </PortalContextProvider>
        );

        expect(renderedHrefs(container)).toEqual(['/subjects']);
    });

    it('prefixes site links, and leaves links already in the portal and external links alone', async () => {
        const {container} = render(
            <PortalContextProvider>
                <HrefsInPortal
                    portal="my-portal"
                    hrefs={['/subjects', '/my-portal', '/my-portal/blog', 'https://example.org/', '#top']}
                />
            </PortalContextProvider>
        );

        await waitFor(() => expect(renderedHrefs(container)).toEqual([
            '/my-portal/subjects',
            '/my-portal',
            '/my-portal/blog',
            'https://example.org/',
            '#top'
        ]));
    });
});

import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, waitFor} from '@testing-library/preact';
import usePortalContext, {PortalContextProvider, pathAfterPrefix} from '~/contexts/portal';
import {schoolDataFor} from '~/../../test/helpers/in-portal';

function Links({portal, hrefs}: {portal: string; hrefs: string[]}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const {setPortal, setSchoolData, rewriteLinks} = usePortalContext();

    React.useEffect(() => {
        setPortal(portal);
        setSchoolData(schoolDataFor(true));
    }, [setPortal, setSchoolData, portal]);
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

function LinksInPortalThatIsNotK12({hrefs}: {hrefs: string[]}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const {setPortal, setSchoolData, linkPrefix, hrefInPortal, rewriteLinks} = usePortalContext();

    React.useEffect(() => {
        setPortal('my-portal');
        setSchoolData(schoolDataFor(false));
    }, [setPortal, setSchoolData]);
    React.useLayoutEffect(() => {
        rewriteLinks(ref.current as HTMLElement);
        rewriteLinks(ref.current as HTMLElement);
    }, [rewriteLinks]);

    return (
        <div ref={ref} data-link-prefix={linkPrefix}>
            {hrefs.map((href) => <a key={href} href={hrefInPortal(href)}>{href}</a>)}
        </div>
    );
}

describe('portal context in a portal that is not K12', () => {
    it('only prefixes relative links once, and builds links without the portal', async () => {
        const {container} = render(
            <PortalContextProvider>
                <LinksInPortalThatIsNotK12
                    hrefs={[
                        '/subjects',
                        'https://openstax.org/blog',
                        '/books/biology-2e/pages/1-1',
                        '/my-portal/details/books/x',
                        // A page whose name only starts with the portal's name is a different page
                        '/my-portal-two'
                    ]}
                />
            </PortalContextProvider>
        );

        await waitFor(() => expect(renderedHrefs(container)).toEqual([
            '/my-portal/subjects',
            'https://openstax.org/blog',
            '/my-portal/books/biology-2e/pages/1-1',
            '/my-portal/details/books/x',
            '/my-portal/my-portal-two'
        ]));
        expect(container.firstElementChild?.getAttribute('data-link-prefix')).toBe('');
    });
});

function HrefsInPortal({portal, hrefs}: {portal: string; hrefs: string[]}) {
    const {setPortal, setSchoolData, hrefInPortal} = usePortalContext();

    React.useEffect(() => {
        setPortal(portal);
        setSchoolData(schoolDataFor(true));
    }, [setPortal, setSchoolData, portal]);

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

    it('leaves portal links with a query or fragment alone', async () => {
        const {container} = render(
            <PortalContextProvider>
                <HrefsInPortal
                    portal="my-portal"
                    // A page whose name only starts with the portal's name is a different page
                    hrefs={['/my-portal#faq', '/my-portal?ref=nav', '/my-portal-two']}
                />
            </PortalContextProvider>
        );

        await waitFor(() => expect(renderedHrefs(container)).toEqual([
            '/my-portal#faq',
            '/my-portal?ref=nav',
            '/my-portal/my-portal-two'
        ]));
    });

    it('keeps /general links in the portal, for its routes to redirect', async () => {
        const {container} = render(
            <PortalContextProvider>
                <HrefsInPortal
                    portal="my-portal"
                    hrefs={['https://openstax.org/general/online-resources', '/general/online-resources']}
                />
            </PortalContextProvider>
        );

        await waitFor(() => expect(renderedHrefs(container)).toEqual([
            '/my-portal/general/online-resources',
            '/my-portal/general/online-resources'
        ]));
    });

    it('treats absolute links to this site like site paths', async () => {
        const {container} = render(
            <PortalContextProvider>
                <HrefsInPortal
                    portal="my-portal"
                    hrefs={[
                        'https://openstax.org/blog?q=x#top',
                        `${window.location.origin}/subjects`,
                        // The K12 subject pages' adoption button links here
                        'https://www.openstax.org/adoption',
                        'https://openstax.org/my-portal/k12',
                        'https://openstax.org.example.com/blog',
                        'https://www.openstax.org.example.com/blog',
                        'https://',
                        '//cdn.example.org/file'
                    ]}
                />
            </PortalContextProvider>
        );

        await waitFor(() => expect(renderedHrefs(container)).toEqual([
            '/my-portal/blog?q=x#top',
            '/my-portal/subjects',
            '/my-portal/adoption',
            'https://openstax.org/my-portal/k12',
            'https://openstax.org.example.com/blog',
            'https://www.openstax.org.example.com/blog',
            'https://',
            '//cdn.example.org/file'
        ]));
    });

    it('sends REX book links to REX in the portal', async () => {
        const {container} = render(
            <PortalContextProvider>
                <HrefsInPortal
                    portal="my-portal"
                    hrefs={[
                        '/books/biology-2e/pages/1-1',
                        'https://openstax.org/books/chemistry/pages/3-1'
                    ]}
                />
            </PortalContextProvider>
        );

        await waitFor(() => expect(renderedHrefs(container)).toEqual([
            '/apps/rex/portal/my-portal/books/biology-2e/pages/1-1',
            '/apps/rex/portal/my-portal/books/chemistry/pages/3-1'
        ]));
    });

    it('keeps bare book links in the portal, for its routes to redirect to the details page', async () => {
        const {container} = render(
            <PortalContextProvider>
                <HrefsInPortal
                    portal="my-portal"
                    hrefs={[
                        '/books/biology',
                        'https://openstax.org/books/preparing-for-college-success/',
                        '/books/biology-2e?Instructor%20resources',
                        '/books/biology-2e#pages'
                    ]}
                />
            </PortalContextProvider>
        );

        await waitFor(() => expect(renderedHrefs(container)).toEqual([
            '/my-portal/books/biology',
            '/my-portal/books/preparing-for-college-success/',
            '/my-portal/books/biology-2e?Instructor%20resources',
            '/my-portal/books/biology-2e#pages'
        ]));
    });

    it('leaves links to other apps and services alone', async () => {
        const otherAppHrefs = [
            '/apps/cms/api/v2/pages/x',
            '/accounts/i/login',
            '/oxauth/logout',
            '/r/content-reuse-request',
            '/l/abc',
            '/blog-feed/',
            '/documents/file.pdf',
            'https://openstax.org/documents/file.pdf'
        ];
        const {container} = render(
            <PortalContextProvider>
                <HrefsInPortal
                    portal="my-portal"
                    // Pages that only start with one of those names are still os-webview pages
                    hrefs={[...otherAppHrefs, '/research', '/apps-and-tools']}
                />
            </PortalContextProvider>
        );

        await waitFor(() => expect(renderedHrefs(container)).toEqual([
            ...otherAppHrefs,
            '/my-portal/research',
            '/my-portal/apps-and-tools'
        ]));
    });
});

describe('pathAfterPrefix', () => {
    it('returns the rest of a path in the portal', () => {
        expect(pathAfterPrefix('/my-portal/confirmation/contact', '/my-portal')).toBe('/confirmation/contact');
        expect(pathAfterPrefix('/my-portal', '/my-portal')).toBe('');
    });

    it('returns a path that is not in the portal as it is', () => {
        expect(pathAfterPrefix('/%6Dy-portal/confirmation/contact', '/my-portal'))
            .toBe('/%6Dy-portal/confirmation/contact');
        expect(pathAfterPrefix('/my-portal-two/blog', '/my-portal')).toBe('/my-portal-two/blog');
    });

    it('returns the whole path when there is no prefix', () => {
        expect(pathAfterPrefix('/blog/post', '')).toBe('/blog/post');
    });
});

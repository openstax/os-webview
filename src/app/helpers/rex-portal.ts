import usePortalContext from '~/contexts/portal';

// This is about making TOC links to Rex work with a portal there.
// Will probably need to be revisited.
export function useRexPortalLinkOrNot(link: string) {
    const {portalPrefix} = usePortalContext();

    if (!portalPrefix) {
        return link;
    }
    return link.replace('books/', `apps/rex/portal${portalPrefix}/books/`);
}

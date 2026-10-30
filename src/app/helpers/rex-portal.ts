import usePortalContext from '~/contexts/portal';

// This is about making TOC links to Rex work with a portal there.
// Only K12 school portals keep readers in the portal when they go to Rex.
export function useRexPortalLinkOrNot(link: string) {
    const {portalPrefix, isK12Portal} = usePortalContext();

    if (!portalPrefix || !isK12Portal) {
        return link;
    }
    return link.replace('books/', `apps/rex/portal${portalPrefix}/books/`);
}

import usePortalContext from '~/contexts/portal';

export function useRexPortalLinkOrNot(link: string) {
    const {portalPrefix} = usePortalContext();

    if (!portalPrefix) {
        return link;
    }
    return link.replace('books/', `portal${portalPrefix}/books/`);
}

import cmsFetch from '~/helpers/cms-fetch';

// Cache for resolved page URLs to avoid repeated API calls
const urlCache = new Map<string, string>();

interface PageApiResponse {
    html_url?: string;
    meta?: {
        html_url?: string;
    };
}

async function getResolvedUrl(pageId: string): Promise<string | undefined> {
    const cachedUrl = urlCache.get(pageId);

    if (cachedUrl) {
        return cachedUrl;
    }

    const response = (await cmsFetch(`pages/${pageId}/`)) as PageApiResponse;
    const resolvedUrl = response.html_url ?? response.meta?.html_url;

    if (!resolvedUrl) {
        console.warn(`Page ${pageId} has no html_url in API response`);
        return undefined;
    }

    urlCache.set(pageId, resolvedUrl);
    return resolvedUrl;
}

async function resolvePageLink(link: HTMLAnchorElement): Promise<void> {
    const pageId = link.getAttribute('id');

    if (!pageId) {
        return;
    }

    try {
        const resolvedUrl = await getResolvedUrl(pageId);

        if (!resolvedUrl || link.getAttribute('href')) {
            return;
        }

        link.setAttribute('href', resolvedUrl);
    } catch (err) {
        // Log error but don't break the page
        console.error(`Failed to resolve page link for id ${pageId}:`, err);
    }
}

/**
 * Resolves internal page links that have linktype="page" and id attributes
 * but are missing href attributes. Fetches the page metadata from CMS API
 * and populates the href with the resolved URL.
 *
 * @param element - The container element to search for page links
 */
export default async function resolvePageLinks(element: HTMLElement | null | undefined): Promise<void> {
    if (!element) {
        return;
    }

    // Find all anchor tags with linktype="page" and an id attribute
    const pageLinks = element.querySelectorAll<HTMLAnchorElement>('a[linktype="page"][id]');

    if (pageLinks.length === 0) {
        return;
    }

    // Process all links in parallel
    const promises = Array.from(pageLinks).map((link) => resolvePageLink(link));

    await Promise.all(promises);
}

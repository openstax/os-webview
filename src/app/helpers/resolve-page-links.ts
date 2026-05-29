import cmsFetch from '~/helpers/cms-fetch';

// Cache for resolved page URLs to avoid repeated API calls
const urlCache = new Map<string, string>();

interface PageApiResponse {
    html_url?: string;
}

/**
 * Resolves internal page links that have linktype="page" and id attributes
 * but are missing href attributes. Fetches the page metadata from CMS API
 * and populates the href with the resolved URL.
 *
 * @param element - The container element to search for page links
 */
export default async function resolvePageLinks(element: HTMLElement): Promise<void> {
    if (!element) {
        return;
    }

    // Find all anchor tags with linktype="page" and an id attribute
    const pageLinks = element.querySelectorAll<HTMLAnchorElement>('a[linktype="page"][id]');

    if (pageLinks.length === 0) {
        return;
    }

    // Process all links in parallel
    const promises = Array.from(pageLinks).map(async (link) => {
        const pageId = link.getAttribute('id');

        if (!pageId) {
            return;
        }

        try {
            // Check cache first
            let resolvedUrl = urlCache.get(pageId);

            if (!resolvedUrl) {
                // Fetch page metadata from CMS API
                const response = await cmsFetch(`pages/${pageId}/`) as PageApiResponse;

                if (response.html_url) {
                    resolvedUrl = response.html_url;
                    // Cache the resolved URL
                    urlCache.set(pageId, resolvedUrl);
                } else {
                    console.warn(`Page ${pageId} has no html_url in API response`);
                    return;
                }
            }

            // Set the href attribute to the resolved URL
            link.setAttribute('href', resolvedUrl);
        } catch (err) {
            // Log error but don't break the page
            console.error(`Failed to resolve page link for id ${pageId}:`, err);
        }
    });

    await Promise.all(promises);
}

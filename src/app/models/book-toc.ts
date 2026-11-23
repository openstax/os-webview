import cmsFetch from '~/helpers/cms-fetch';
import fetchRexRelease from '~/models/rex-release';
import memoize from 'lodash/memoize';

export function bookToc(slug: string) {
    return cmsFetch(slug)
        .then((bi) => {
            const webviewLink = bi.webview_rex_link;

            return fetchRexRelease(webviewLink, bi.cnx_id);
        })
        .then((result) => result.tree.contents);
}

// Evict failures so a later call can retry instead of reusing the rejection
const memoizedBookToc = memoize((slug: string) =>
    bookToc(slug).catch((err) => {
        memoizedBookToc.cache.delete(slug);
        throw err;
    })
);

export default memoizedBookToc;

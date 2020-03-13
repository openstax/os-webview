import cmsFetch from './cmsFetch';
import {cnxFetch} from './table-of-contents-html';
import memoize from 'lodash/memoize';

export function bookToc(slug) {
    return cmsFetch(`books/${slug}`)
        .then((bi) => {
            const isRex = Boolean(bi.webview_rex_link);
            const webviewLink = isRex ? bi.webview_rex_link : bi.webview_link;

            return {
                isRex,
                webviewLink,
                cnxId: bi.cnx_id
            };
        })
        .then(cnxFetch)
        .then((result) => result.tree.contents);
}

export default memoize(bookToc);

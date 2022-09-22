import cmsFetch from '~/helpers/cms-fetch';
import {cnxFetch} from './table-of-contents-html';
import memoize from 'lodash/memoize';

export function bookToc(slug) {
    if (!slug) {
        return Promise.reject(new Error('No slug to fetch'));
    }
    return cmsFetch(slug)
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

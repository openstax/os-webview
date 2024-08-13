import cmsFetch from '~/helpers/cms-fetch';
import {cnxFetch} from './table-of-contents-html';
import memoize from 'lodash/memoize';

export function bookToc(slug: string) {
    return cmsFetch(slug)
        .then((bi) => {
            const isRex = true;
            const webviewLink = bi.webview_rex_link;

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

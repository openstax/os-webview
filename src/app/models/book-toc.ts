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

export default memoize(bookToc);

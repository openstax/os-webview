import settings from 'settings';
import $ from '~/helpers/$';
import memoize from 'lodash/memoize';

function rexOriginFromWebview(url) {
    return (new URL(url)).origin;
}

const fetchRexRelease = memoize((rexOrigin, cnxId) => {
    if ($.isTestingEnvironment()) {
        return fetch('https://archive.cnx.org/contents/8d50a0af-948b-4204-a71d-4826cba765b8@16.27.json')
            .then((r) => r.json());
    }
    return fetch(`${rexOrigin}/rex/environment.json`)
        .then((r) => r.json())
        .then((r) => fetch(`${rexOrigin}/rex/releases/${r.release_id}/rex/release.json`))
        .then((r) => r.json())
        .then((r) => fetch(`//archive.cnx.org/contents/${cnxId}@${r.books[cnxId].defaultVersion}`))
        .then((r) => r.json());
});

export default function (webviewLink, cnxId) {
    return fetchRexRelease(rexOriginFromWebview(webviewLink), cnxId);
};

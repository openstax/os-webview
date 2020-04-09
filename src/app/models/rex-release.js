import settings from 'settings';
import $ from '~/helpers/$';
import memoize from 'lodash/memoize';

function rexOriginFromWebview(url) {
    return (new URL(url)).origin;
}

// CAUTION: Lodash memoize only distinguishes the first parameter
const fetchRexRelease = memoize((rexOrigin) => {
    return fetch(`${rexOrigin}/rex/environment.json`)
        .then((r) => r.json())
        .then((r) => fetch(`${rexOrigin}/rex/releases/${r.release_id}/rex/release.json`))
        .then((r) => r.json());
});

// REMEMBER: The first parameter is the memo key
const fetchContents = memoize((cnxId, rexOrigin) => {
    if ($.isTestingEnvironment()) {
        return fetch(`//archive.cnx.org/contents/${cnxId}`)
            .then((r) => r.json());
    }
    return fetchRexRelease(rexOrigin)
        .then((r) => fetch(`//archive.cnx.org/contents/${cnxId}@${r.books[cnxId].defaultVersion}`))
        .then((r) => r.json());
});

export default function (webviewLink, cnxId) {
    return fetchContents(cnxId, rexOriginFromWebview(webviewLink));
};

import $ from '~/helpers/$';
import memoize from 'lodash/memoize';
import retry from '~/helpers/retry';

function rexOriginFromWebview(url) {
    return (new window.URL(url)).origin;
}

// CAUTION: Lodash memoize only distinguishes the first parameter
const fetchRexRelease = memoize((rexOrigin) => {
    return retry(() => fetch(`${rexOrigin}/rex/environment.json`))
        .then((r) => r.json())
        .then((r) => fetch(`${rexOrigin}/rex/releases/${r.release_id}/rex/release.json`))
        .then((r) => r.json());
});

// REMEMBER: The first parameter is the memo key
const fetchContents = memoize((cnxId, rexOrigin) => {
    if ($.isTestingEnvironment() || rexOrigin.includes('tutor')) {
        return retry(() => fetch(`${window.SETTINGS.apiOrigin}/contents/${cnxId}`))
            .then((r) => r.json());
    }
    return fetchRexRelease(rexOrigin)
        .then((r) => fetch(`${window.SETTINGS.apiOrigin}/contents/${cnxId}@${r.books[cnxId].defaultVersion}`))
        .then((r) => r.json());
});

export default function (webviewLink, cnxId) {
    return fetchContents(cnxId, rexOriginFromWebview(webviewLink));
}

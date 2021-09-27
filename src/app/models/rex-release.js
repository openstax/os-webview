import $ from '~/helpers/$';
import memoize from 'lodash/memoize';
import retry from '~/helpers/retry';

function rexOriginFromWebview(url) {
    return (new window.URL(url)).origin;
}

// CAUTION: Lodash memoize only distinguishes the first parameter
const fetchRexInfo = memoize((rexOrigin) => {
    return retry(() => fetch(`${rexOrigin}/rex/environment.json`))
        .then((response) => response.json())
        .then((environment) => Promise.all([
          fetch(`${rexOrigin}/rex/releases/${environment.release_id}/rex/release.json`)
            .then(response => response.json()),
          fetch(`${rexOrigin}/rex/releases/${environment.release_id}/rex/config.json`)
            .then(response => response.json())
        ]))
        .then(([release, config]) => ({release, config}))
    ;
});

// REMEMBER: The first parameter is the memo key
const fetchContents = memoize((cnxId, rexOrigin) => {
    if ($.isTestingEnvironment() || rexOrigin.includes('tutor')) {
        return retry(() => fetch(`${window.SETTINGS.apiOrigin}/contents/${cnxId}`))
            .then((r) => r.json());
    }
    return fetchRexInfo(rexOrigin)
        .then((rexInfo) => {
          const archiveVersion = rexInfo.release.books[cnxId].archiveOverride || rexInfo.config.REACT_APP_ARCHIVE;
          const bookVersion = rexInfo.release.books[cnxId].defaultVersion

          // this line is only necessary to support rex releases without the REACT_APP_ARCHIVE parameter,
          // remove after 9/22/21 release is on production
          const archivePath = archiveVersion
              ? `/apps/archive/${archiveVersion}`
              : rexInfo.config.REACT_APP_ARCHIVE_URL;

          return fetch(`${window.SETTINGS.apiOrigin}${archivePath}/contents/${cnxId}@${bookVersion}.json`)
        })
        .then((response) => response.json());
});

export default function (webviewLink, cnxId) {
    return fetchContents(cnxId, rexOriginFromWebview(webviewLink));
}

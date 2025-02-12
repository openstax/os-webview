import memoize from 'lodash/memoize';
import retry from '~/helpers/retry';

function rexOriginFromWebview(url: string) {
    return new window.URL(url).origin;
}

// CAUTION: Lodash memoize only distinguishes the first parameter
const fetchRexInfo = memoize((rexOrigin) => {
    return retry(() => fetch(`${rexOrigin}/rex/environment.json`))
        .then((response) => response.json())
        .then((environment) =>
            Promise.all([
                fetch(
                    `${rexOrigin}/rex/releases/${environment.release_id}/rex/release.json`
                ).then((response) => response.json()),
                fetch(
                    `${rexOrigin}/rex/releases/${environment.release_id}/rex/config.json`
                ).then((response) => response.json())
            ])
        )
        .then(([release, config]) => ({release, config}))
        .catch((err) => {
            throw new Error(`Fetching Rex info: ${err}`);
        });
});

// REMEMBER: The first parameter is the memo key
const fetchContents = memoize((cnxId, rexOrigin) => {
    return fetchRexInfo(rexOrigin)
        .then((rexInfo) => {
            const archiveOverride =
                rexInfo.release.books[cnxId].archiveOverride;
            const archiveVersion = archiveOverride
                ? archiveOverride.replace(/^\/apps\/archive\//, '')
                : rexInfo.config.REACT_APP_ARCHIVE;
            const bookVersion = rexInfo.release.books[cnxId].defaultVersion;
            const archivePath = `apps/archive/${archiveVersion}`;

            return fetch(
                `${process.env.API_ORIGIN}/${archivePath}/contents/${cnxId}@${bookVersion}.json`
            );
        })
        .then((response) => response.json())
        .catch((err) => {
            throw new Error(`Fetching Rex contents: ${err}`);
        });
});

export default function fetchRexRelease(webviewLink: string, cnxId: string) {
    return fetchContents(cnxId, rexOriginFromWebview(webviewLink));
}

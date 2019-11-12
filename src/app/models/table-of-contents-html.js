import settings from 'settings';

export default function ({isRex, cnxId, webviewLink}) {
    const rexUrl = new URL(webviewLink);

    function cnxFetch() {
        const rexOrigin = rexUrl.origin;

        if (isRex) {
            return fetch(`${rexOrigin}/rex/environment.json`)
                .then((r) => r.json())
                .then((r) => fetch(`${rexOrigin}/rex/releases/${r.release_id}/rex/release.json`))
                .then((r) => r.json())
                .then((r) => fetch(`//archive.cnx.org/contents/${cnxId}@${r.books[cnxId]}`))
                .then((r) => r.json());
        }
        return fetch(`//archive.cnx.org/contents/${cnxId}.json`)
            .then((r) => r.json());
    }

    function pageLink(entry) {
        const rexRoot = webviewLink.replace(/\/pages\/.*/, '');

        return isRex ?
            `${rexRoot}/pages/${entry.slug}` :
            `${webviewLink}:${entry.shortId}`;
    }

    function buildTableOfContents(contents, tag) {
        const htmlEntities = [];

        contents.forEach((entry) => {
            if (entry.contents) {
                htmlEntities.push(`${entry.title}<ul class="no-bullets">`);
                buildTableOfContents(entry.contents, 'li')
                    .forEach((e, i) => {
                        htmlEntities.push(e);
                    });
                htmlEntities.push('</ul>');
            } else {
                htmlEntities.push(
                    `<${tag}><a href="${pageLink(entry)}">${entry.title}</a></${tag}>`
                );
            }
        });
        return htmlEntities;
    }

    return cnxFetch().then(
        (cnxData) => buildTableOfContents(cnxData.tree.contents, 'div').join(''),
        (err) => {
            console.warn(`Error fetching TOC for ${cnxId}: ${err}`);
        }
    );
}

import fetchRexRelease from '~/models/rex-release';

export function cnxFetch({isRex, cnxId, webviewLink}) {
    if (isRex) {
        return fetchRexRelease(webviewLink, cnxId);
    }
    return fetch(`${window.SETTINGS.apiOrigin}/contents/${cnxId}.json`)
        .then((r) => r.json());
}

export default function ({isRex, cnxId, webviewLink, isTutor}) {
    function pageLink(entry) {
        const rexRoot = webviewLink.replace(/\/pages\/.*/, '');

        return isRex ?
            `${rexRoot}/pages/${entry.slug || entry.shortId}` :
            `${webviewLink}:${entry.shortId}`;
    }

    function buildTableOfContents(contents, tag) {
        const htmlEntities = [];

        contents.forEach((entry) => {
            if (entry.contents) {
                htmlEntities.push(`${entry.title}<ul class="no-bullets">`);
                buildTableOfContents(entry.contents, 'li')
                    .forEach((e) => {
                        htmlEntities.push(e);
                    });
                htmlEntities.push('</ul>');
            } else if (isTutor) {
                htmlEntities.push(
                    `<${tag}>${entry.title}</${tag}>`
                );
            } else {
                htmlEntities.push(
                    `<${tag}><a href="${pageLink(entry)}">${entry.title}</a></${tag}>`
                );
            }
        });
        return htmlEntities;
    }

    return cnxFetch({isRex, cnxId, webviewLink}).then(
        (cnxData) => buildTableOfContents(cnxData.tree.contents, 'div').join(''),
        (err) => {
            console.warn(`Error fetching TOC for ${cnxId}: ${err}`);
        }
    );
}

import settings from 'settings';

function cnxFetch(cnxId) {
    return fetch(`//archive.cnx.org/contents/${cnxId}.json`)
        .then((r) => r.json());
}

export default function ({isRex, cnxId, webviewLink}) {
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

    return cnxFetch(cnxId).then(
        (cnxData) => buildTableOfContents(cnxData.tree.contents, 'div').join(''),
        (err) => {
            console.warn(`Error fetching TOC for ${cnxId}: ${err}`);
        }
    );
}

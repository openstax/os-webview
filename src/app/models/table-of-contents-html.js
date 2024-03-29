import fetchRexRelease from '~/models/rex-release';

export function cnxFetch({isRex, cnxId, webviewLink}) {
    if (isRex) {
        return fetchRexRelease(webviewLink, cnxId);
    }
    return fetch(`${process.env.API_ORIGIN}/contents/${cnxId}.json`)
        .then((r) => r.json())
        .catch((err) => {throw new Error(`Fetching table of contents: ${err}`);})
    ;
}

export default function tableOfContentsHtml({isRex, cnxId, webviewLink}) {
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

import fetchRexRelease from '~/models/rex-release';

type TOCEntry = {
    title: string;
    contents: TOCEntry[];
    slug: string;
    shortId: string;
};

export default function tableOfContentsHtml({
    cnxId,
    webviewLink
}: {
    cnxId: string;
    webviewLink: string;
}) {
    const rexRoot = webviewLink.replace(/\/pages\/.*/, '');

    function pageLink(entry: TOCEntry) {
        return `${rexRoot}/pages/${entry.slug || entry.shortId}`;
    }

    function buildTableOfContents(contents: TOCEntry[], tag: string) {
        const htmlEntities: string[] = [];

        contents.forEach((entry) => {
            if (entry.contents) {
                htmlEntities.push(`${entry.title}<ul class="no-bullets">`);
                buildTableOfContents(entry.contents, 'li').forEach((e) => {
                    htmlEntities.push(e);
                });
                htmlEntities.push('</ul>');
            } else {
                htmlEntities.push(
                    `<${tag}><a href="${pageLink(entry)}">${
                        entry.title
                    }</a></${tag}>`
                );
            }
        });
        return htmlEntities;
    }

    return fetchRexRelease(webviewLink, cnxId).then(
        (cnxData) =>
            buildTableOfContents(cnxData.tree.contents, 'div').join(''),
        (err) => {
            console.warn(`Error fetching TOC for ${cnxId}: ${err}`);
            return '';
        }
    );
}

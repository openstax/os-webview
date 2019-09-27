import componentType from '~/helpers/controller/init-mixin';

export default class extends componentType({}) {

    init(...args) {
        if (super.init) {
            super.init(...args);
        }
        this.cnxDataPromise = fetch(`//archive.cnx.org/contents/${this.cnxId}.json`)
            .then((r) => r.json());
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        this.cnxDataPromise.then((cnxData) => {
            const htmlEntities = this.buildTableOfContents(cnxData.tree.contents);

            this.el.innerHTML = htmlEntities.join('');
        });
    }

    buildTableOfContents(contents) {
        const htmlEntities = [];

        contents.forEach((entry) => {
            if (entry.contents) {
                htmlEntities.push(`${entry.title}<ul class="no-bullets">`);
                this.buildTableOfContents(entry.contents)
                    .forEach((e) => htmlEntities.push(`<li>${e}</li>`));
                htmlEntities.push('</ul>');
            } else {
                htmlEntities.push(
                    `<div>
                    <a href="https://openstax.org/books/${this.slug}/pages/${entry.slug}">${entry.title}</a>
                    </div>`
                );
            }
        });
        return htmlEntities;
    }

}

import componentType from '~/helpers/controller/init-mixin';
import tableOfContentsHtml from '~/models/table-of-contents-html';
import {description as template} from './table-of-contents.html';
import css from './table-of-contents.css';

const spec = {
    template,
    view: {
        classes: ['toc-drawer']
    },
    regions: {
        tableOfContents: '.table-of-contents'
    }
};

export default class extends componentType(spec) {

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        tableOfContentsHtml({
            isRex: this.isRex,
            cnxId: this.cnxId,
            bookSlug: this.bookSlug,
            webviewLink: this.webviewLink
        }).then(
            (tocHtml) => {
                this.regions.tableOfContents.el.innerHTML = tocHtml;
            },
            (err) => {
                console.warn(`Failed to generate table of contents HTML for ${this.cnxId}: ${err}`);
            }
        );
    }

}

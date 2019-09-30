import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import LetUsKnow from '../let-us-know/let-us-know';
import TocDrawer from '../table-of-contents/table-of-contents';
import {description as template} from './details-tab.html';
import {description as templatePolish} from './details-tab-polish.html';
import css from './details-tab.css';

const spec = {
    template,
    css,
    view: {
        classes: ['details-tab']
    },
    regions: {
        getTheBook: '.get-the-book',
        letUsKnow: '.let-us-know-region'
    }
};

export default class DetailsTab extends componentType(spec, insertHtmlMixin, busMixin) {

    init(model) {
        super.init();
        if (model.polish) {
            this.template = templatePolish;
        }
        this.model = model;
    }

    onLoaded() {
        super.onLoaded();
        const includeTOC = Boolean(this.model.bookInfo.table_of_contents);
        const gtt = new GetThisTitle(
            Object.assign({includeTOC}, this.model.bookInfo)
        );

        this.regions.getTheBook.append(gtt);

        if (includeTOC) {
            gtt.on('toc', (whether) => {
                this.emit('toc', whether);
            });
            const webviewLink = this.model.bookInfo.webview_link
                .replace(/[^/]*$/, this.model.bookInfo.table_of_contents.shortId);

            this.on('put-toc-in', (region) => {
                const bi = this.model.bookInfo;
                const tocComponent = new TocDrawer({
                    isRex: Boolean(bi.webview_rex_link),
                    cnxId: bi.cnx_id,
                    bookSlug: bi.slug,
                    webviewLink
                });

                region.attach(tocComponent);
            });
            this.on('set-toc', (...args) => {
                gtt.emit('set-toc', ...args);
            });
        }

        const titleArg = this.model[this.model.polish ? 'title' : 'salesforceAbbreviation'];

        if (titleArg) {
            this.regions.letUsKnow.append(new LetUsKnow(titleArg));
        }
    }

}

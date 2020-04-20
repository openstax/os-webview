import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import LetUsKnow from '../let-us-know/let-us-know';
import TocDrawer from '../table-of-contents/table-of-contents';
import {description as template} from './details-tab.html';
import {description as templatePolish} from './details-tab-polish.html';
import WrappedJsx from '~/controllers/jsx-wrapper';
import Callout from './callout.jsx';
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

    addPdfUpdatedHoverText(url) {
        const container = this.el.querySelector('.loc-pdf-update-date .callout');

        if (container) {
            console.info('Stick a callout on here', container);
            const messageHtml = `See changes in the <a href="${url}">Revision Notes</a>.`;
            const resourceBoxes = new WrappedJsx(
                Callout, {
                    messageHtml
                },
                container
            );
        }
    }

    onLoaded() {
        super.onLoaded();
        const includeTOC = Boolean(this.model.bookInfo.book_state === 'live');
        const gtt = new GetThisTitle(
            Object.assign({includeTOC}, this.model.bookInfo)
        );

        this.regions.getTheBook.append(gtt);

        if (includeTOC) {
            gtt.on('toc', (whether) => {
                this.emit('toc', whether);
            });
            const bi = this.model.bookInfo;
            const isRex = Boolean(bi.webview_rex_link);
            const webviewLink = isRex ? bi.webview_rex_link : bi.webview_link;

            this.on('put-toc-in', (region) => {
                const tocComponent = new TocDrawer({
                    isRex,
                    cnxId: bi.cnx_id,
                    webviewLink
                });

                region.attach(tocComponent);
            });
            this.on('set-toc', (...args) => {
                gtt.emit('set-toc', ...args);
            });
            this.on('errata-resource', (url) => this.addPdfUpdatedHoverText(url));
        }

        const titleArg = this.model[this.model.polish ? 'title' : 'salesforceAbbreviation'];

        if (titleArg) {
            this.regions.letUsKnow.append(new LetUsKnow(titleArg));
        }
    }

}

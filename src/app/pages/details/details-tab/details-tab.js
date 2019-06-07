import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import LetUsKnow from '../let-us-know/let-us-know';
import TocDrawer from './toc-drawer/toc-drawer';
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

        if (!this.model.comingSoon) {
            const gtt = new GetThisTitle(
                Object.assign({includeTOC: true}, this.model.bookInfo)
            );

            this.regions.getTheBook.append(gtt);
            gtt.on('toc', (whether) => {
                this.emit('toc', whether);
            });
            this.on('put-toc-in', (region) => {
                const tocComponent = new TocDrawer({
                    data: Object.assign(
                        {
                            webviewLink: this.model.bookInfo.webview_link
                        },
                        this.model.bookInfo.table_of_contents
                    )
                });

                tocComponent.on('close-toc', () => {
                    gtt.emit('set-toc', false);
                });
                region.attach(tocComponent);
            });
        }

        const titleArg = this.model[this.model.polish ? 'title' : 'salesforceAbbreviation'];

        if (titleArg) {
            this.regions.letUsKnow.append(new LetUsKnow(titleArg));
        }
    }

}

import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import LetUsKnow from '../let-us-know/let-us-know.jsx';
import TocDrawer from '../table-of-contents/table-of-contents';
import {description as template} from './details-tab.html';
import {description as templatePolish} from './details-tab-polish.html';
import WrappedJsx from '~/controllers/jsx-wrapper';
import PublicationInfo from './publication-info.jsx';
import css from './details-tab.css';

const spec = {
    template,
    css,
    view: {
        classes: ['details-tab']
    },
    regions: {
        getTheBook: '.get-the-book',
        letUsKnow: '.let-us-know-region',
        publicationInfo: '.publication-info'
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
        const includeTOC = ['live', 'new_edition_available'].includes(this.model.bookInfo.book_state);
        const isRex = this.model.isRex;
        const webviewLink = this.model.webviewLink;
        const gtt = new GetThisTitle(
            Object.assign(
                {
                    includeTOC,
                    isRex,
                    isTutor: this.model.isTutor,
                    webviewLink
                }, this.model.bookInfo
            )
        );

        this.regions.getTheBook.append(gtt);

        if (includeTOC) {
            gtt.on('toc', (whether) => {
                this.emit('toc', whether);
            });
            const bi = this.model.bookInfo;

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
        }

        const titleArg = this.model[this.model.polish ? 'title' : 'salesforceAbbreviation'];

        if (titleArg) {
            const letUsKnow = new WrappedJsx(
                LetUsKnow,
                {title: titleArg},
                this.regions.letUsKnow.el
            );
        }

        const pubInfo = new WrappedJsx(
            PublicationInfo,
            {model: this.model, url: null},
            this.regions.publicationInfo.el
        );

        this.on('errata-resource', (url) => {
            pubInfo.updateProps({url});
        });
    }

}

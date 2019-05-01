import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import LetUsKnow from '../let-us-know/let-us-know';
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

export default class DetailsTab extends componentType(spec, insertHtmlMixin) {

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
            this.regions.getTheBook.append(
                new GetThisTitle(
                    Object.assign({includeTOC: true}, this.model.bookInfo)
                )
            );
        }

        const titleArg = this.model[this.model.polish ? 'title' : 'salesforceAbbreviation'];

        if (titleArg) {
            this.regions.letUsKnow.append(new LetUsKnow(titleArg));
        }
    }

}

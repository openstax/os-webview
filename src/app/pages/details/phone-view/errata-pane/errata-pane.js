import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './errata-pane.html';
import {description as templatePolish} from './errata-pane-polish.html';
import css from './errata-pane.css';

const spec = {
    template,
    css,
    view: {
        classes: ['errata-pane']
    }
};

export default class ErrataPane extends componentType(spec, insertHtmlMixin) {

    init(model) {
        super.init();
        this.model = model;
        if (this.model.polish) {
            this.template = templatePolish;
        }
    }

}

import $ from '~/helpers/$';
import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './info-pane.html';
import css from './info-pane.css';

const spec = {
    template,
    css,
    view: {
        classes: ['info-pane']
    }
};

export default class InfoPane extends componentType(spec) {

    init(model) {
        super.init({
            model
        });
    }

    onUpdate() {
        this.insertHtml();
    }

}

import componentType from '~/helpers/controller/init-mixin';
import $ from '~/helpers/$';
import {description as template} from './let-us-know.html';
import {description as templatePolish} from './let-us-know-polish.html';
import css from './let-us-know.css';

const spec = {
    template,
    css,
    view: {
        classes: ['let-us-know']
    }
};

export default class LetUsKnow extends componentType(spec) {

    init(title) {
        super.init();
        this.model = {title};
        if ($.isPolish(title)) {
            this.template = templatePolish;
        }
    }

}

import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './education.html';
import css from './education.css';

const spec = {
    template,
    css,
    view: {
        classes: ['education-banner']
    }
};
const BaseClass = componentType(spec);

export default class Education extends BaseClass {

    init(model) {
        super.init();
        this.model = {
            main: model[0],
            block1: model[1],
            block2: model[2]
        };
    }

    onLoaded() {
        this.insertHtml();
    }

}

import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './multicolumn.html';

const spec = {
    template,
    view: {
        classes: ['multicolumn']
    }
};

export default class Multicolumn extends componentType(spec) {

    onLoaded() {
        this.insertHtml();
    }

}

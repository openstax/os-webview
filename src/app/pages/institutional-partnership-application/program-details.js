import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './program-details.html';

const spec = {
    template,
    view: {
        classes: ['program-details']
    }
};

export default class ProgramDetails extends componentType(spec) {

    onLoaded() {
        this.insertHtml();
    }

}

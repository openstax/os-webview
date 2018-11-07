import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './new-frontier.html';

const spec = {
    template
};

export default class NewFrontier extends componentType(spec) {

    onLoaded() {
        this.insertHtml();
    }

}

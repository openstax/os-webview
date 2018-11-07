import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './banner.html';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template
};

export default class Banner extends componentType(spec) {

    onLoaded() {
        this.insertHtml();
    }

    @on('click a[href^="#"]')
    hashClick(e) {
        $.hashClick(e);
    }

}

import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';

export default class FilterButton extends Controller {

    @on('click')
    doSetState() {
        this.setState(this.value);
    }

    init(label, value, setState) {
        this.template = () => '';
        this.label = label;
        this.value = value;
        this.view = {
            classes: ['filter-button']
        };
        this.setState = setState;
    }

    onLoaded() {
        this.el.innerHTML = this.label;
    }

}

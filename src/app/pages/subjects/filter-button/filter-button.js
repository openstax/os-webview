import BaseView from '~/helpers/backbone/view';
import {on} from '~/helpers/backbone/decorators';

export default class FilterButton extends BaseView {

    @on('click')
    selectMe() {
        this.model.set('selectedFilter', this.data);
    }

    constructor(data, model) {
        super();

        this.template = data;
        this.data = data;
        this.model = model;

        this.model.on('change:selectedFilter', () => this.setState());
    }

    setState() {
        this.el.classList.toggle(
            'selected',
            this.model.get('selectedFilter') === this.data
        );
    }

    onRender() {
        this.el.classList.add('filter-button');
        this.setState();
    }

}

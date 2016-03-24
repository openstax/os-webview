import BaseView from '~/helpers/backbone/view';
import {on} from '~/helpers/backbone/decorators';

export default class FilterButton extends BaseView {

    @on('click')
    selectMe() {
        this.model.set('selectedFilter', this.data);
        this.toggleOpenCategories();
    }

    constructor(data, model) {
        super();

        this.template = data.replace(/®/, '<sup>&reg;</sup>');
        this.data = data;
        this.model = model;

        this.model.on('change:selectedFilter', () => this.setState());
    }

    setState() {
        if (this.el && this.el.classList) {
            this.el.classList.toggle(
                'selected',
                this.model.get('selectedFilter') === this.data
            );
        }
    }

    toggleOpenCategories() {
        let w = window.innerWidth;

        if (w<=768) {
            document.querySelector('.filter-buttons').classList.toggle('active');
        }
    }

    removeOpenCategories() {
        document.querySelector('.filter-buttons').classList.remove('active');
    }

    onRender() {
        this.el.classList.add('filter-button');
        this.setState();
        window.addEventListener('resize', this.removeOpenCategories.bind(this));
    }

    onBeforeClose() {
        window.removeEventListener('resize', this.removeOpenCategories.bind(this));
    }
}

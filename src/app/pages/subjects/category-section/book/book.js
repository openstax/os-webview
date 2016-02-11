import BaseView from '~/helpers/backbone/view';
import router from '~/router';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './book.hbs';
import GetThisTitle from '~/components/get-this-title/get-this-title';

@props({
    template: template,
    regions: {
        getThis: '.get-this-title-container'
    }
})
export default class Book extends BaseView {

    @on('click img')
    selectMe() {
        this.model.set('selectedBook', this.isSelected() ? false : this.data);
    }

    @on('click .cta > .btn')
    goToDetails() {
        router.navigate(`/details?${ this.data.title}`, {
            trigger: true
        });
    }

    constructor(data, model) {
        super();

        this.templateHelpers = {
            coverUrl: data.coverUrl
        };
        this.data = data;
        this.model = model;

        this.model.on('change:selectedBook', () => this.setState());
    }

    setState() {
        this.el.classList.toggle('selected', this.model.get('selectedBook') === this.data);
    }

    onRender() {
        this.el.classList.add('cover');
        this.regions.getThis.append(new GetThisTitle(this.data, this.model));
        this.setState();
    }

    isSelected() {
        return this.model.get('selectedBook') === this.data;
    }

}

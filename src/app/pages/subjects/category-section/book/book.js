import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import GetThisTitle from '~/components/get-this-title/get-this-title';
import {description as template} from './book.html';

export default class Book extends Controller {

    init(data, model) {
        this.template = template;
        this.view = {
            classes: ['cover']
        };
        this.regions = {
            getThis: '.get-this-title-container'
        };
        this.templateHelpers = {
            coverUrl: data.cover_url || `https://placeholdit.imgix.net/~text?txtsize=33&txt=${data.title}&w=220&h=220`,
            slug: data.slug
        };
        // FIX: What is the difference between data and model?
        this.data = data;
        this.model = model;

        // FIX: listenTo vs on
        this.model.on('change:selectedBook', () => this.setState());
    }

    onLoaded() {
        this.regions.getThis.append(new GetThisTitle(this.data));
        this.setState();

        if (this.data.webview_link === '') {
            this.el.classList.add('coming-soon');
        }
    }

    setState() {
        // FIX: Manipulate model, move DOM manipulation to template
        this.el.classList.toggle('selected', this.model.get('selectedBook') === this.data);
    }

    isSelected() {
        return this.model.get('selectedBook') === this.data;
    }

    @on('click img')
    selectMe(event) {
        // FIX: Why are we just passing a click event around?
        this.el.querySelector('.cta>.btn').click(event);
    }

}

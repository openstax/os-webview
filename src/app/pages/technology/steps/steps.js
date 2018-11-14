import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './steps.html';
import {bookPromise} from '~/models/book-titles';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    regions: {
        bookSelector: 'book-selector'
    }
};

export default class Steps extends componentType(spec) {

    onLoaded() {
        bookPromise.then((data) => {
            const options = data.map((obj) => ({label: obj.title, value: obj.meta.slug}))
                .sort((a, b) => a.label.localeCompare(b.label));

            this.model.items[0].selector.setOptions(options);
            this.regions.bookSelector.attach(this.model.items[0].selector);
        });
    }

    @on('change select[name="book"]')
    updateLinks(e) {
        const slug = e.target.value;
        const url = slug ? `/details/books/${slug}` : null;
        const items = this.model.items;

        items[1].url = items[2].url = url;
        this.update();
    }

}

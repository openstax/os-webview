import componentType from '~/helpers/controller/init-mixin';
import css from './mobile-filters.css';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import BookOptions from '../controls/book-options/book-options';
import Checkboxes from '../controls/checkboxes-linked-to-store/checkboxes-linked-to-store';
import {setupOptionsList, typeOptions} from '../controls/controls.js';
import {books, types, advanced, sort} from '../store';
import sortBy from 'lodash/sortBy';

const spec = {
    css,
    // For specifying the tag (default div) and classes of the container element
    view: {
        classes: ['mobile-filters']
    }
};

export default class extends componentType(spec) {

    onLoaded() {
        const advancedFilters = new AccordionGroup({
            items: sortBy(
                this.advancedFilterOptions
                    .map((group) => ({
                        title: group.title,
                        contentComponent: new Checkboxes({
                            options: group.options,
                            store: advanced
                        })
                    })),
                'title'
            ),
            noScroll: true
        });

        this.regions.self.attach(new AccordionGroup({
            items: [
                {
                    title: 'Books',
                    contentComponent: new BookOptions({
                        store: books
                    })
                },
                {
                    title: 'Type',
                    contentComponent: setupOptionsList(types, typeOptions)
                },
                {
                    title: 'Advanced Filters',
                    contentComponent: advancedFilters
                }
            ]
        }));
    }

}

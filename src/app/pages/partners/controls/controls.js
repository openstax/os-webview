import componentType, {cleanupMixin} from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './controls.html';
import css from './controls.css';
import PopoverControlButton from './button-with-popover/button-with-popover';
import BookOptions from './book-options/book-options';
import OptionsList from './options-list/options-list';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import Checkboxes from './checkboxes-linked-to-store/checkboxes-linked-to-store';
import {books, types, advanced, sort} from '../store';
import {RadioPanel} from '~/components/radio-panel/radio-panel';
import shellBus from '~/components/shell/shell-bus';
import sortBy from 'lodash/sortBy';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    css,
    view: {
        classes: ['controls']
    },
    regions: {
        buttonRow: '.button-row',
        otherControls: '.other-controls',
        popoverContainer: '.popover-container'
    },
    model() {
        return {
            triangleClass: `triangle-${this.triangleColor}`,
            putAwayHidden: $.booleanAttribute(!['Books', 'Advanced Filters'].includes(this.selectedFilter))
        };
    },
    selectedFilter: null
};

export function setupOptionsList(selected, items) {
    const ol = new OptionsList({
        items,
        selected
    });

    return ol;
}

const sortOptions = [
    {
        label: 'A-Z',
        value: '1'
    },
    {
        label: 'Z-A',
        value: '-1'
    }
];

export default class extends componentType(spec, busMixin, cleanupMixin) {

    get triangleColor() {
        let color = 'white';

        if (this.selectedFilter === 'Advanced Filters') {
            if (this.openLabel === this.advancedFilterOptions[0].title) {
                color = 'dark';
            } else {
                color = 'light';
            }
        }

        return color;
    }

    updateSelected(label, isOpen) {
        this.selectedFilter = isOpen ? label : null;
        this.emit('update', {
            selectedFilter: this.selectedFilter
        });
        this.update();
        shellBus.emit('with-sticky', isOpen);
    }

    attachButtons() {
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

        this.cleanup.push(
            advanced.on('notify', () => this.update())
        );
        advancedFilters.on('open', (openLabel) => {
            this.openLabel = openLabel;
            this.update();
        });
        [
            {
                label: 'Books',
                content: new BookOptions({
                    store: books
                }),
                style: 'detached',
                container: this.regions.popoverContainer
            },
            {
                label: 'Type',
                content: setupOptionsList(types, this.typeOptions),
                style: 'attached',
                closeOnSelect: types
            },
            {
                label: 'Advanced Filters',
                content: advancedFilters,
                style: 'detached',
                container: this.regions.popoverContainer
            },
            {
                label: 'Sort',
                content: setupOptionsList(sort, sortOptions),
                region: this.regions.otherControls,
                closeOnSelect: sort
            }
        ].forEach(({label, region=this.regions.buttonRow, content, style, container, closeOnSelect}) => {
            const bwd = new PopoverControlButton({
                label,
                open: false,
                content,
                style,
                container
            });

            if (closeOnSelect) {
                this.cleanup.push(
                    closeOnSelect.on('notify', () => {
                        this.updateSelected(label, false);
                    })
                );
            }
            bwd.on('toggle', (isOpen) => {
                this.updateSelected(label, isOpen);
            });
            this.on('update', (obj) => {
                if ('selectedFilter' in obj) {
                    bwd.emit('update-props', {
                        open: this.selectedFilter === label
                    });
                }
            });
            region.append(bwd);
        });
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        this.attachButtons();
    }

    @on('click .popover-closer')
    closePopups() {
        this.updateSelected(null);
    }

}

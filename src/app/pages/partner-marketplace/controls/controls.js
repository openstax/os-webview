import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './controls.html';
import css from './controls.css';
import PopoverControlButton from './button-with-popover/button-with-popover';
import BookOptions from './book-options/book-options';
import OptionsList from './options-list/options-list';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import Checkboxes from './checkboxes-linked-to-store/checkboxes-linked-to-store';
import {books, types, advanced} from '../store';
import {RadioPanel} from '~/components/radio-panel/radio-panel';
import shellBus from '~/components/shell/shell-bus';
import sortBy from 'lodash/sortBy';

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
            triangleClass: `triangle-${this.triangleColor}`
        };
    },
    selectedFilter: null,
    cleanup: []
};

function setupOptionsList(selected, items) {
    const ol = new OptionsList({
        items,
        selected
    });

    return ol;
}

const typeOptions = [
    {
        label: 'Content customization',
        value: 'customization'
    },
    {
        label: 'Online homework',
        value: 'homework'
    },
    {
        label: 'Clicker / classroom',
        value: 'clicker'
    },
    {
        label: 'Adaptive courseware',
        value: 'adaptive'
    },
    {
        label: 'Reading comprehension',
        value: 'reading'
    }
];

export default class extends componentType(spec, busMixin) {

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

        advanced.on('notify', () => this.update());
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
                content: setupOptionsList(types, typeOptions),
                style: 'attached'
            },
            {
                label: 'Advanced Filters',
                content: advancedFilters,
                style: 'detached',
                container: this.regions.popoverContainer
            },
            {
                label: 'Sort',
                region: this.regions.otherControls
            }
        ].forEach(({label, region=this.regions.buttonRow, content, style, container}) => {
            const bwd = new PopoverControlButton({
                label,
                open: false,
                content,
                style,
                container
            });

            bwd.on('toggle', (isOpen) => {
                this.selectedFilter = isOpen ? label : null;
                this.emit('update', {
                    selectedFilter: this.selectedFilter
                });
                this.update();
                shellBus.emit('with-sticky', isOpen);
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

    attachDisplayFormatController() {
        const displayControl = new RadioPanel({
            items: [
                {value: 'grid', html: 'Grid'},
                {value: 'list', html: 'List'}
            ],
            selectedValue: this.displayMode.value
        });

        this.regions.otherControls.append(displayControl);
        displayControl.on('change', (newValue) => {
            this.displayMode.value = newValue;
        });
        this.cleanup.push(
            this.displayMode.on('notify', () => {
                displayControl.emit('update-props', {
                    selectedValue: this.displayMode.value
                });
            })
        );
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        this.attachButtons();
        this.attachDisplayFormatController();
    }

    onClose() {
        this.cleanup.forEach((fn) => fn());
    }

}

import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './controls.html';
import css from './controls.css';
import PopoverControlButton from './button-with-popover/button-with-popover';
import BookOptions from './book-options/book-options';
import OptionsList from './options-list/options-list';
import AccordionGroup from '~/components/accordion-group/accordion-group';
import Checkboxes from './checkboxes-linked-to-store/checkboxes-linked-to-store';
import {costs, types, advanced} from '../filter-store';
import {RadioPanel} from '~/components/radio-panel/radio-panel';

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
    selectedFilter: null
};

function setupOptionsList(selected, items) {
    const ol = new OptionsList({
        items,
        selected
    });

    return ol;
}

const costOptions = [
    {
        label: 'Free - $10',
        value: '10'
    },
    {
        label: '$11 - $25',
        value: '25'
    },
    {
        label: '$26 - $40',
        value: '40'
    },
    {
        label: '> $40',
        value: '999'
    }
];

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

const advancedFilterOptions = [
    {
        title: 'Adaptivity',
        options: [
            {
                label: 'Adaptive presentation based on learner goals',
                value: 'adaptive-goals'
            },
            {
                label: 'Adaptive complexity or presentation of content based on a learner\'s affective state',
                value: 'adaptive-state'
            }
        ]
    },
    {
        title: 'Affordability',
        options: [
            {
                label: 'Affordable for something or other',
                value: 'affordable-1'
            },
            {
                label: 'Affordable for rich people',
                value: 'affordable-2'
            }
        ]
    }
];

export default class extends componentType(spec, busMixin) {

    get triangleColor() {
        let color = 'white';

        if (this.selectedFilter === 'Advanced Filters') {
            if (this.openLabel === advancedFilterOptions[0].title) {
                color = 'dark';
            } else {
                color = 'light';
            }
        }

        return color;
    }

    attachButtons() {
        const advancedFilters = new AccordionGroup({
            items: advancedFilterOptions
                .map((group) => {
                    return {
                        title: group.title,
                        contentComponent: new Checkboxes({
                            options: group.options,
                            store: advanced
                        })
                    };
                }),
            noScroll: true
        });

        advancedFilters.on('open', (openLabel) => {
            this.openLabel = openLabel;
            this.update();
        });
        [
            {
                label: 'Books',
                content: new BookOptions(),
                style: 'detached',
                container: this.regions.popoverContainer
            },
            {
                label: 'Cost',
                content: setupOptionsList(costs, costOptions),
                style: 'attached'
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
        this.displayControl = new RadioPanel({
            items: [
                {value: 'grid', html: 'Grid'},
                {value: 'list', html: 'List'}
            ],
            selectedValue: this.displayMode
        });
        this.regions.otherControls.append(this.displayControl);
        this.displayControl.on('change', (newValue) => {
            this.emit('update', {
                displayMode: newValue
            });
        });
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        this.attachButtons();
        this.attachDisplayFormatController();
    }

    whenPropsUpdated(obj) {
        if ('displayMode' in obj) {
            this.displayControl.emit('update-props', {
                selectedValue: obj.displayMode
            });
        }
    }

}

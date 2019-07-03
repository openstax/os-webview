import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './search-box.html';
import css from './search-box.css';
import querySchools from '~/models/querySchools';
import Inputs from './inputs/inputs';
import ResultBox from './result-box/result-box';
import Filters from './filters/filters';

const spec = {
    template,
    css,
    view: {
        classes: ['search-box']
    },
    model() {
        return {
            minimized: this.minimized,
            searchMessage: this.searchMessage,
            resultsHidden: this.resultsHidden || this.minimized,
            filtersHidden: this.filtersHidden || this.minimized
        };
    },
    regions: {
        inputs: '.top-box',
        filterSettings: '.filter-settings-region',
        searchResults: '.search-results-region'
    },
    searchValue: '',
    filtersHidden: true,
    resultsHidden: true
};

export default class extends componentType(spec, busMixin) {

    attachResults(schools) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        });
        const resultBoxes = schools.map((info) =>
            new ResultBox({
                model: {
                    name: info.fields.name,
                    location: info.cityState,
                    savingsThisYear: formatter.format(info.fields.all_time_savings),
                    savingsTotal: formatter.format(info.fields.current_year_savings),
                    isOpen: schools.length === 1,
                    testimonial: info.testimonial,
                    loggedIn: this.loggedIn
                },
                testimonialBus: this,
                info
            })
        );

        this.closeAllExcept = (theOpenOne) => {
            resultBoxes.forEach((component) => {
                component.emit('close-if-not', theOpenOne);
            });
            if (theOpenOne && theOpenOne.lngLat) {
                this.emit('show-details', theOpenOne);
            } else {
                this.emit('results', schools);
            }
        };
        this.resultsHidden = schools.length === 0;
        this.singleResult = schools.length === 1;
        this.update();
        this.regions.searchResults.empty();
        const appendBoxes = (index = 0) => {
            if (index < resultBoxes.length) {
                this.regions.searchResults.append(resultBoxes[index]);
                resultBoxes[index].on('set-open-result', this.closeAllExcept);
                window.requestAnimationFrame(() => appendBoxes(index + 1));
            }
        };

        appendBoxes();
    }

    whenPropsUpdated() {
        this.update();
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        const inputs = new Inputs(
            {
                textValue: this.searchValue,
                minimized: this.minimized,
                filtersHidden: this.filtersHidden
            }
        );
        const filters = new Filters();

        this.regions.inputs.attach(inputs);
        this.regions.filterSettings.attach(filters);

        inputs.on('search-value', (value) => {
            this.searchValue = value;
            inputs.emit('update-props', {textValue: this.searchValue});
        });
        inputs.on('toggle-minimized', () => {
            this.emit('toggle-minimized');
            this.update();
            inputs.emit('update-props', {
                minimized: this.minimized
            });
        });
        inputs.on('run-search', () => {
            this.runQuery();
        });
        inputs.on('filter-toggle', () => {
            this.filtersHidden = !this.filtersHidden;
            inputs.emit('update-props', {
                filtersHidden: this.filtersHidden
            });
            this.update();
        });
        filters.on('change', (selectedFilters) => {
            this.selectedFilters = (Reflect.ownKeys(selectedFilters).length > 0) ? selectedFilters : null;
            this.runQuery();
        });
        this.on('show-one-school', (schoolInfo) => {
            if (this.resultsHidden || this.singleResult) {
                this.attachResults([schoolInfo]);
            } else {
                this.closeAllExcept(schoolInfo);
            }
        });
    }

    runQuery() {
        const value = this.el.querySelector('.search-input').value;
        const schoolsPromise = querySchools(value, this.selectedFilters);

        this.searchMessage = null;
        if (schoolsPromise) {
            schoolsPromise.then(
                (schools) => {
                    this.attachResults(schools);
                    this.emit('results', schools);
                    if (schools.length === 0) {
                        this.searchMessage = 'No matching results';
                        this.update();
                    }
                }
            );
        } else {
            this.emit('reset');
            this.attachResults([]);
        }
    }

}

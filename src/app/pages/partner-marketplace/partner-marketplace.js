import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './partner-marketplace.html';
import css from './partner-marketplace.css';
import Controls from './controls/controls';
import Results from './results/results';
import ActiveFilters from './active-filters/active-filters';
import PartnerDetails from './partner-details/partner-details';
import partnerFeaturePromise from '~/models/salesforce-partners';
import {displayMode, books, costs, types, advanced, sort} from './store';
import shellBus from '~/components/shell/shell-bus';
import routerBus from '~/helpers/router-bus';

const spec = {
    template,
    css,
    view: {
        classes: ['partner-marketplace', 'page'],
        tag: 'main'
    },
    slug: 'pages/new-partners-page',
    model() {
        return {
            headline: this.heading,
            description: this.description
        };
    },
    heading: '',
    description: ''
};

function advancedFilterKeys(partnerEntry) {
    return Reflect.ownKeys(partnerEntry).filter((k) => [false, true].includes(partnerEntry[k]));
}

function getFilterOptions(data) {
    const excludeList = ['Book', 'Type'];
    const categoryKeys = Reflect.ownKeys(data.category_mapping)
        .filter((title) => !excludeList.includes(title));
    const result = categoryKeys
        .map((title) => ({
            title,
            options: []
        }));
    const mapToTitle = categoryKeys
        .map((k) => [k, data.category_mapping[k]])
        .reduce((obj, [text, prefix]) => {
            obj[prefix] = text;
            return obj;
        }, {});

    Object.entries(data.field_name_mapping)
        .filter(([_, label]) => label !== 'Cost per semester')
        .forEach(([value, label]) => {
            const entry = {
                label,
                value
            };
            const categoryPrefix = Reflect.ownKeys(mapToTitle)
                .find((prefix) => value.substr(0, prefix.length) === prefix);
            const itemInResult = result.find((obj) => obj.title === mapToTitle[categoryPrefix]);

            if (itemInResult) {
                itemInResult.options.push(entry);
            } else {
                console.warn('No match', categoryPrefix, value);
            }
        });

    return result;
}

export default class extends componentType(spec, insertHtmlMixin) {

    get searchPartner() {
        const searchStr = decodeURIComponent(window.location.search.substr(1));

        return searchStr;
    }

    get baseHref() {
        const h = new URL(window.location.href);

        h.search = '';
        return h.href;
    }

    attachResults(entries) {
        const results = new Results({
            el: this.el.querySelector('.results'),
            entries,
            displayMode,
            books,
            types,
            advanced,
            costs,
            sort
        });

        results.on('select', (href) => {
            history.replaceState('', '', href);
            // Dialog closes on navigation; need to wait for that before opening it.
            setTimeout(() => {
                this.showDetailDialog(this.baseHref);
            }, 0);
        });
    }

    showDetailDialog(href) {
        if (this.searchPartner) {
            const pd = new PartnerDetails();

            shellBus.emit('showDialog', () => ({
                title: '',
                content: pd,
                onClose() {
                    pd.detach();
                    history.replaceState('', '', href);
                }
            }));
        }
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        if (this.heading) {
            // already loaded, we came back
            return;
        }
        this.activeFilters = new ActiveFilters({
            el: this.el.querySelector('.active-filters')
        });
        this.showDetailDialog(this.baseHref);
    }

    onDataLoaded() {
        if (super.onDataLoaded) {
            super.onDataLoaded();
        }
        this.heading = this.pageData.heading;
        this.description = this.pageData.description;
        this.update();
        this.controls = new Controls({
            el: this.el.querySelector('.controls'),
            displayMode,
            advancedFilterOptions: getFilterOptions(this.pageData)
        });

        partnerFeaturePromise.then((partnerData) => {
            const resultData = partnerData.map((pd) => {
                const result = {
                    title: pd.partner_name,
                    description: pd.partner_description || '[no description]',
                    logoUrl: pd.partner_logo,
                    books: (pd.books||'').split(/;/),
                    type: pd.partner_type,
                    advancedFeatures: advancedFilterKeys(pd).filter((k) => pd[k] === true),
                    cost: pd.affordability_cost
                };

                return result;
            });

            this.attachResults(resultData);
        });
    }

}

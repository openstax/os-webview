import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './partner-marketplace.html';
import css from './partner-marketplace.css';
import Controls from './controls/controls';
import Results from './results/results';
import ActiveFilters from './active-filters/active-filters';
import PartnerDetails from './partner-details/partner-details';
import partnerFeaturePromise from '~/models/salesforce-partners';
import {displayMode, books, costs, types, advanced} from './store';
import shellBus from '~/components/shell/shell-bus';
import routerBus from '~/helpers/router-bus';

const spec = {
    template,
    css,
    view: {
        classes: ['partner-marketplace', 'page'],
        tag: 'main'
    },
    slug: 'pages/partners',
    model() {
        return {
            headline: this.heading,
            description: this.description
        };
    }
};

function advancedFilterKeys(partnerEntry) {
    return Reflect.ownKeys(partnerEntry).filter((k) => [false, true].includes(partnerEntry[k]));
}

function getAdvancedFilters(partnerEntry) {
    const keys = advancedFilterKeys(partnerEntry);
    const result = [];

    keys.forEach((k) => {
        const label = k.replace(/_(.)/g, (_, char) => ` ${char.toUpperCase()}`)
            .replace(/./, (char) => char.toUpperCase());
        const firstWord = label.split(' ')[0];
        const thisEntry = {
            label,
            value: k
        };
        const inResult = result.find((entry) => entry.title === firstWord);

        if (!inResult) {
            result.push({
                title: firstWord,
                options: [thisEntry]
            });
        } else {
            inResult.options.push(thisEntry);
        }
    });
    return result;
}

export default class extends componentType(spec) {

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
            advanced
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
        this.heading = 'Courseware Concierge';
        this.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        this.activeFilters = new ActiveFilters({
            el: this.el.querySelector('.active-filters')
        });
        this.showDetailDialog(this.baseHref);
    }

    onDataLoaded() {
        if (super.onDataLoaded) {
            super.onDataLoaded();
        }
        partnerFeaturePromise.then((partnerData) => {
            const advancedFilterOptions = getAdvancedFilters(partnerData[0]);

            this.controls = new Controls({
                el: this.el.querySelector('.controls'),
                displayMode,
                advancedFilterOptions
            });
            const resultData = partnerData.map((pd) => {
                const allies = Reflect.ownKeys(this.pageData.allies).map((k) => this.pageData.allies[k]);
                const matchingAlly = allies.find((ally) => ally.title === pd.partner_name);
                const logoUrl = (matchingAlly||{}).ally_bw_logo;
                const result = {
                    title: pd.partner_name,
                    description: pd.partner_description || '[no description]',
                    logoUrl,
                    books: (pd.books||'').split(/;/),
                    type: pd.partner_type,
                    advancedFeatures: advancedFilterKeys(pd).filter((k) => pd[k] === true)
                };

                return result;
            });

            this.attachResults(resultData);
        });
        this.update();
    }

}

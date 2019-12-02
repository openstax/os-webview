import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './partner-marketplace.html';
import css from './partner-marketplace.css';
import Controls from './controls/controls';
import Results from './results/results';
import ActiveFilters from './active-filters/active-filters';
import PartnerDetails from './partner-details/partner-details';
import partnerFeaturePromise from '~/models/salesforce-partners';
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
    },
    resultData: [
        {
            logoUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/images/TopHat_Lockup_FullColor_RGB.original.jpg',
            title: 'Top Hat',
            description: `
            Top Had lorem ipsum <b>dolor</b> sit amet, consectetur adipiscing elit.
            `
        }],
    displayMode: 'grid'
};

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

    attachResults() {
        const results = new Results({
            el: this.el.querySelector('.results'),
            entries: this.resultData,
            displayMode: this.displayMode
        });

        this.updateResults = () => {
            results.emit('update-props', {
                displayMode: this.displayMode
            });
        };
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
        this.controls = new Controls({
            el: this.el.querySelector('.controls'),
            displayMode: this.displayMode
        });
        this.controls.on('update', (obj) => {
            if ('displayMode' in obj) {
                this.displayMode = obj.displayMode;
                this.controls.emit('update-props', {
                    displayMode: this.displayMode
                });
                if (this.updateResults) {
                    this.updateResults();
                }
            }
        });
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
            this.resultData = partnerData.map((pd) => {
                const allies = Reflect.ownKeys(this.pageData.allies).map((k) => this.pageData.allies[k]);
                const matchingAlly = allies.find((ally) => ally.title === pd.partner_name);
                const logoUrl = (matchingAlly||{}).ally_bw_logo;

                return {
                    title: pd.partner_name,
                    description: pd.partner_description || '[no description]',
                    logoUrl
                };
            });
            this.attachResults();
        });
        this.update();
    }

}

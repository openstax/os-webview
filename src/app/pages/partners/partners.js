import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './partners.html';
import css from './partners.css';
import Controls from './controls/controls';
import MobileFilters from './mobile-filters/mobile-filters';
import Results, {costOptions} from './results/results';
import ActiveFilters from './active-filters/active-filters';
import PartnerDetails from './partner-details/partner-details';
import partnerFeaturePromise, {tooltipText} from '~/models/salesforce-partners';
import {displayMode, books, types, advanced, sort} from './store';
import shellBus from '~/components/shell/shell-bus';
import routerBus from '~/helpers/router-bus';
import analyticsEvents from './analytics-events';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    css,
    view: {
        classes: ['partners', 'page'],
        tag: 'main'
    },
    slug: 'pages/partners',
    model() {
        return {
            headline: this.heading,
            description: this.description,
            confirmation: (history.state || {}).confirmation,
            bookSlug: (history.state || {}).slug
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
        .forEach(([label, value]) => {
            const entry = {
                label,
                value
            };
            const categoryPrefix = Reflect.ownKeys(mapToTitle)
                .find((prefix) => value.substr(0, prefix.length) === prefix);
            const itemInResult = result.find((obj) => obj.title === mapToTitle[categoryPrefix]);

            if (itemInResult) {
                if (label === 'Cost per semester') {
                    costOptions.forEach((opt) => itemInResult.options.push(opt));
                } else {
                    itemInResult.options.push(entry);
                }
            }
        });

    return result;
}

function baseHref() {
    const h = new URL(window.location.href);

    h.search = '';
    return h.href;
}

export default class extends componentType(spec, insertHtmlMixin) {

    get searchPartner() {
        const searchStr = decodeURIComponent(window.location.search.substr(1));

        return searchStr;
    }

    attachResults(entries) {
        const results = new Results({
            el: this.el.querySelector('.results'),
            entries,
            displayMode,
            books,
            types,
            advanced,
            sort
        });

        results.on('select', (entry) => {
            const href = `?${entry.title}`;

            history.replaceState('', '', href);
            analyticsEvents.partnerDetails(entry.title);
            // Dialog closes on navigation; need to wait for that before opening it.
            setTimeout(() => {
                this.showDetailDialog(entry);
            }, 0);
        });
    }

    showDetailDialog(detailData) {
        const pd = new PartnerDetails(detailData);
        const onOutsideClick = (event) => {
            if (pd.el.contains(event.target)) {
                return;
            }
            shellBus.emit('hideDialog');
        };

        window.addEventListener('click', onOutsideClick);
        shellBus.emit('showDialog', () => ({
            title: '',
            content: pd,
            onClose() {
                window.removeEventListener('click', onOutsideClick);
                pd.detach();
                history.replaceState('', '', baseHref());
            }
        }));
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        if (history.state && history.state.book) {
            ([].concat(history.state.book)).forEach((book) => {
                books.toggle(book);
            });
        }
        if (this.heading) {
            // already loaded, we came back
            return;
        }
    }

    onDataLoaded() {
        if (super.onDataLoaded) {
            super.onDataLoaded();
        }
        this.heading = this.pageData.heading;
        this.description = this.pageData.description;
        this.update();
        const advancedFilterOptions = getFilterOptions(this.pageData);
        const typeOptions = this.pageData.partner_type_choices
            .sort()
            .map((k) => ({
                label: k,
                value: k
            }));

        this.controls = new Controls({
            el: this.el.querySelector('.controls.desktop'),
            displayMode,
            advancedFilterOptions,
            typeOptions
        });
        this.mobileFilters = new MobileFilters({
            el: this.el.querySelector('.controls.mobile'),
            advancedFilterOptions,
            typeOptions
        });
        this.activeFilters = new ActiveFilters({
            el: this.el.querySelector('.active-filters'),
            advancedFilterOptions
        });

        partnerFeaturePromise.then((partnerData) => {
            // eslint-disable-next-line complexity
            const resultData = partnerData.map((pd) => ({
                title: pd.partner_name,
                blurb: pd.short_partner_description ||
                    '[no description]',
                tags: [
                    {
                        label: 'type',
                        value: pd.partner_type
                    },
                    {
                        label: 'cost',
                        value: pd.affordability_cost
                    }
                ].filter((v) => Boolean(v.value)),
                richDescription: pd.rich_description ||
                    pd.partner_description ||
                    '[no rich description]',
                logoUrl: pd.partner_logo,
                books: (pd.books||'').split(/;/),
                advancedFeatures: advancedFilterKeys(pd).filter((k) => pd[k] === true),
                website: pd.landing_page,
                websiteLinkText: this.pageData.partner_landing_page_link,
                images: [pd.image_1, pd.image_2, pd.image_3, pd.image_4, pd.image_5]
                    .filter((img) => Boolean(img)),
                videos: [pd.video_1, pd.video_2]
                    .filter((vid) => Boolean(vid)),
                type: pd.partner_type,
                cost: pd.affordability_cost,
                infoUrl: pd.formstack_url,
                infoLinkText: this.pageData.partner_request_info_link,
                verifiedFeatures: pd.verified_by_instructor ? tooltipText : false
            }));

            this.attachResults(resultData);
            if (this.searchPartner) {
                const partnerName = decodeURIComponent(this.searchPartner);
                const foundEntry = resultData.find((entry) => entry.title === partnerName);

                if (foundEntry) {
                    this.showDetailDialog(foundEntry);
                }
            }
        });
    }

    onClose() {
        if (super.onClose) {
            super.onClose();
        }
        [books, types, advanced].forEach((store) => store.clear());
    }

    @on('click .put-away')
    closeConfirmation() {
        delete history.state.confirmation;
        this.update();
    }

}

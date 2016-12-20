import settings from 'settings';
import router from '~/router';
import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './partners.html';

function urlify(str) {
    return str.toLowerCase().split(' ').join('_');
}

const categories = ['Math', 'Science', 'Social Sciences', 'Humanities', 'AP'];
const filterButtons = ['View All', ...categories];
const categoryMap = categories
    .map((item) => ({[urlify(item)]: item}))
    .reduce(((prev, current) => Object.assign(prev, current)), {});
const pagePath = '/partners';

export default class Partners extends CMSPageController {

    static description = 'OpenStax partners have united with us to increase ' +
        'access to high-quality learning materials. Their low-cost tools ' +
        'integrate seamlessly with OpenStax books.';

    init() {
        document.title = 'Partners - OpenStax';
        this.slug = 'pages/partners';
        this.template = template;
        this.css = '/app/pages/partners/partners.css';
        this.view = {
            classes: ['partners-page', 'page']
        };
        this.model = {
            title: '',
            'page_description': '',
            book: null,
            partners: [],
            filterButtons,
            filterButtonsActive: false
        };

        router.replaceState({
            filter: categoryMap[location.pathname.replace('/partners/', '')] || 'View All',
            path: pagePath
        });

        this.filterPartnersEvent = this.filterPartners.bind(this);

        window.addEventListener('popstate', this.filterPartnersEvent);
    }

    changeAllyLogoColor() {
        const colors = ['Blue', 'Yellow', 'Gray', 'Green', 'Orange'];
        const index = Math.floor(Math.random() * colors.length);

        this.model.allyLogoColor = 'Gray';
        this.update();
    }

    onDataLoaded() {
        this.model = Object.assign(this.model, this.pageData);
        this.model.allPartners = Object.keys(this.pageData.allies)
        .sort((a, b) => a < b ? -1 : 1)
        .map((slug) => this.pageData.allies[slug])
        .filter((info) => !info.do_not_display);

        this.filterPartners();
        this.changeAllyLogoColor();
    }

    onUpdate() {
        $.insertHtml(this.el, this.model);
        this.el.querySelector('.filter-button[data-value="AP"]').innerHTML = 'AP<sup>&reg;</sup>';
    }

    filterPartners() {
        if (!Array.isArray(this.model.allPartners)) {
            return;
        }

        this.model.partners = this.model.allPartners.filter((partner) => {
            if (history.state.filter === 'View All') {
                return true;
            } else if (history.state.filter === 'AP') {
                return partner.is_ap;
            }

            return partner.subjects.includes(history.state.filter);
        });

        this.update();
    }

    @on('click .filter-button')
    setFilter(e) {
        this.model.filterButtonsActive = !this.model.filterButtonsActive;
        this.update();
        const value = e.target.dataset.value;

        if (history.state.filter === value) {
            return;
        }

        const subpath = urlify(value);

        router.navigate(`/partners/${subpath}`, {
            filter: value,
            path: pagePath,
            x: history.state.x,
            y: history.state.y
        });

        this.filterPartners();
    }

    @on('click .logo-text')
    onLogoClick(e) {
        e.preventDefault();
        const href = e.delegateTarget.getAttribute('href');
        const el = document.getElementById(href.substr(1));
        const state = {
            filter: history.state.filter,
            path: pagePath,
            target: href
        };
        const pushOrReplaceState = history.state.target ? 'replaceState' : 'pushState';

        $.scrollTo(el);
        history[pushOrReplaceState](state, '', href);
    }

    @on('click .to-top')
    scrollToFilterButtons(e) {
        e.preventDefault();
        const hasTarget = 'target' in history.state;
        const state = {
            filter: history.state.filter,
            path: pagePath
        };

        $.scrollTo(this.el.querySelector('.filter')).then(() => {
            if (hasTarget) {
                history.back();
            } else {
                history.replaceState(state, '', state.target);
            }
        });
    }

    onClose() {
        window.removeEventListener('popstate', this.filterPartnersEvent);
    }

}

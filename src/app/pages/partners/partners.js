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

export default class Partners extends CMSPageController {

    static description = 'OpenStax partners have united with us to increase ' +
        'access to high-quality learning materials. Their low-cost tools ' +
        'integrate seamlessly with OpenStax books.';

    init() {
        this.slug = 'pages/partners';
        this.template = template;
        this.css = '/app/pages/partners/partners.css';
        this.view = {
            classes: ['partners-page', 'page']
        };
        this.model = {
            title: '',
            'classroom_text': '',
            book: null,
            partners: [],
            filterButtons,
            filterButtonsActive: false
        };

        router.replaceState({
            filter: categoryMap[location.pathname.replace('/partners/', '')] || 'View All',
            path: '/partners'
        });

        this.filterPartnersEvent = this.filterPartners.bind(this);

        window.addEventListener('popstate', this.filterPartnersEvent);
    }

    onDataLoaded() {
        this.model = Object.assign(this.model, this.pageData);
        this.model.allPartners = Object.keys(this.pageData.allies)
        .sort((a, b) => a < b ? -1 : 1)
        .map((slug) => this.pageData.allies[slug]);

        this.filterPartners();
    }

    onUpdate() {
        // NOTE: Incremental-DOM currently lacks the ability to inject HTML into a node.
        for (const partner of this.model.partners) {
            const el = document.getElementById(`${partner.title}-blurb`);

            el.querySelector('h2').innerHTML = partner.title;
            el.querySelector('p').innerHTML = partner.long_description;
        }
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
            path: '/partners',
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

        $.scrollTo(el);
        history.replaceState({
            filter: history.state.filter,
            path: '/partners'
        }, '', href);
    }

    @on('click .to-top')
    scrollToFilterButtons(e) {
        e.preventDefault();

        $.scrollTo(this.el.querySelector('.filter'));
        history.replaceState({
            filter: history.state.filter,
            path: '/partners'
        }, '', window.location.pathname);
    }

    onClose() {
        window.removeEventListener('popstate', this.filterPartnersEvent);
    }

}

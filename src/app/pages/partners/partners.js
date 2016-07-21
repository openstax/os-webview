import settings from 'settings';
import router from '~/router';
import CMSPageController from '~/controllers/cms';
import cms from '~/helpers/cms';
import CategorySelector from '~/components/category-selector/category-selector';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './partners.html';

export default class Partners extends CMSPageController {

    static description = `OpenStax partners have united with us to increase
        access to high-quality learning materials. Their low-cost tools
        integrate seamlessly with OpenStax books.`;

    init() {
        this.id = 50;
        this.template = template;
        this.css = '/app/pages/partners/partners.css';
        this.view = {
            classes: ['partners-page', 'page']
        };
        this.model = {
            title: '',
            'classroom_text': '',
            book: null,
            partners: []
        };
        this.regions = {
            filter: '#filter'
        };

        router.setState({filter: 'View All'});

        this.filterPartnersEvent = this.filterPartners.bind(this);

        window.addEventListener('popstate', this.filterPartnersEvent);
    }

    onDataLoaded() {
        this.model = Object.assign(this.model, this.pageData);
        this.update();

        const fields = ['ally_subject_list', 'title', 'short_description', 'long_description',
            'heading', 'is_ap', 'ally_bw_logo'];

        cms.query({
            type: 'allies.Ally',
            fields
        }).then((json) => {
            this.model.allPartners = json.pages;
            this.filterPartners();
        });

        const categorySelectorView = new CategorySelector((category) => {
            if (category === history.state.filter) {
                return;
            }
            router.pushState({filter: category});
            this.filterPartners();
        });

        this.regions.filter.attach(categorySelectorView);
    }

    onUpdate() {
        // NOTE: Incremental-DOM currently lacks the ability to inject HTML into a node.
        for (const partner of this.model.partners) {
            const el = document.getElementById(`${partner.title}-blurb`);

            el.querySelector('h2').innerHTML = partner.title;
            el.querySelector('p').innerHTML = partner.long_description;
        }
    }

    filterPartners() {
        if (!Array.isArray(this.model.allPartners)) {
            return;
        }

        if (!history.state.filter) {
            router.setState({filter: 'View All'});
        }

        this.model.partners = this.model.allPartners.filter((partner) => {
            if (history.state.filter === 'View All') {
                return true;
            } else if (history.state.filter === 'AP') {
                return partner.is_ap;
            }

            return partner.ally_subject_list.includes(history.state.filter);
        });

        this.update();
    }

    @on('click .logo-text')
    onLogoClick(e) {
        e.preventDefault();

        router.navigate(e.delegateTarget.getAttribute('href'), {
            filter: history.state.filter
        });
    }

    @on('click .to-top')
    scrollToFilterButtons(e) {
        e.preventDefault();

        const el = document.getElementById('filter');
        const bodyRect = document.body.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const offset = elRect.top - bodyRect.top;

        window.scrollTo(0, offset);
    }

    onClose() {
        window.removeEventListener('popstate', this.filterPartnersEvent);
    }

}

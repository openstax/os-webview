import settings from 'settings';
import router from '~/router';
import CMSPageController from '~/controllers/cms';
import $ from '~/helpers/$';
import shell from '~/components/shell/shell';
import CategorySelector from '~/components/category-selector/category-selector';
import PartnerViewer from './partner-viewer/partner-viewer';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './partners.html';

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
        this.regions = {
            filter: '.filter',
            iconViewer: 'icon-viewer',
            blurbViewer: 'blurb-viewer'
        };
        this.model = {
            title: '',
            'page_description': '',
            partners: []
        };
        this.categorySelector = new CategorySelector((category) => this.filterPartners(category));
        shell.showLoader();

        router.replaceState({
            filter: this.categoryFromPath(),
            path: pagePath
        });

        this.filterPartnersEvent = () => {
            const category = history.state.filter;
            const cms = CategorySelector.byValue[category].cms;

            this.categorySelector.updateSelected(category);
            this.partnerViewer.filterPartners(cms);
        };
        window.addEventListener('popstate', this.filterPartnersEvent);
    }

    categoryFromPath() {
        return window.location.pathname.replace(/.*partners/, '').substr(1).toLowerCase() || 'view-all';
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

        this.partnerViewer = new PartnerViewer(this.model);
        this.regions.iconViewer.attach(this.partnerViewer.iconViewer);
        this.regions.blurbViewer.attach(this.partnerViewer.blurbViewer);

        const category = this.categoryFromPath();

        this.regions.filter.attach(this.categorySelector);
        this.categorySelector.updateSelected(category);
        this.filterPartners(category);
        this.changeAllyLogoColor();
        shell.hideLoader();
    }

    filterPartners(category) {
        const path = category === 'view-all' ? pagePath : `${pagePath}/${category}`;
        const cms = CategorySelector.byValue[category].cms;

        router.navigate(path, {
            filter: category,
            path: pagePath,
            x: history.state.x,
            y: history.state.y
        });
        this.partnerViewer.filterPartners(cms);
    }

    @on('click .logo-text')
    onLogoClick(e) {
        e.preventDefault();
        this.cameFrom = e.delegateTarget;
        const href = this.cameFrom.getAttribute('href');
        const el = document.getElementById(href.substr(1));
        const state = {
            filter: history.state.filter,
            path: pagePath,
            target: href
        };

        const pushOrReplaceState = history.state.target ? 'replaceState' : 'pushState';

        $.scrollTo(el).then(() => {
            el.querySelector('a').focus();
        });
        history[pushOrReplaceState](state, '', href);
    }

    @on('click .to-top')
    scrollToFilterButtons(e) {
        e.preventDefault();
        e.target.blur();
        const hasTarget = 'target' in history.state;
        const state = {
            filter: history.state.filter,
            path: pagePath
        };

        $.scrollTo(this.el.querySelector('.filter'), 20).then(() => {
            if (hasTarget) {
                history.back();
            } else {
                history.replaceState(state, '', state.target);
            }
            if (this.cameFrom) {
                this.cameFrom.focus();
            }
            this.cameFrom = null;
        });
    }

    onClose() {
        window.removeEventListener('popstate', this.filterPartnersEvent);
    }

}

import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import $ from '~/helpers/$';
import {description as iconTemplate} from './icons.html';
import {description as blurbTemplate} from './blurbs.html';

// The PartnerViewer is an ordinary class that has two CMSPageController members,
// Icons and Blurbs

const Icons = componentType({
    template: iconTemplate,
    view: {
        classes: ['container', 'boxed']
    }
});

const Blurbs = componentType({
    template: blurbTemplate,
    view: {
        classes: ['blurbs', 'text-content']
    }
}, insertHtmlMixin);

export default class PartnerViewer {

    constructor(model) {
        this.model = model;
        this.iconViewer = new Icons({model});
        this.blurbViewer = new Blurbs({model});
    }

    filterPartners(category) {
        this.model.partners = this.model.allPartners.filter((partner) => {
            if (category === '') {
                return true;
            } else if (history.state.filter === 'ap') {
                return partner.is_ap;
            }

            return partner.subjects.includes(category);
        });
        this.update();
    }

    update() {
        this.iconViewer.update();
        this.blurbViewer.update();
    }

}

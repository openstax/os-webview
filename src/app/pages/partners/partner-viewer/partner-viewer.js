import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as iconTemplate} from './icons.html';
import {description as blurbTemplate} from './blurbs.html';

// The PartnerViewer is an ordinary class that has two CMSPageController members,
// Icons and Blurbs

class Icons extends Controller {

    init(model) {
        this.template = iconTemplate;
        this.view = {
            classes: ['container', 'boxed']
        };
        this.model = model;
    }

}

class Blurbs extends Controller {

    init(model) {
        this.template = blurbTemplate;
        this.view = {
            classes: ['blurbs', 'text-content']
        };
        this.model = model;
    }

    onUpdate() {
        $.insertHtml(this.el, this.model);
    }

}

export default class PartnerViewer {

    constructor(model) {
        this.model = model;
        this.iconViewer = new Icons(model);
        this.blurbViewer = new Blurbs(model);
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

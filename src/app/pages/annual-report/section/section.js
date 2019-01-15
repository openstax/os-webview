import {css as foundingCss} from './founding.css';
import {css as mapCss} from './map.css';
import {css as philanthropicPartnersCss} from './philanthropic-partners.css';
import {css as reachCss} from './reach.css';
import {css as revolutionCss} from './revolution.css';
import {css as tutorCss} from './tutor.css';
import {description as bannerTemplate} from './banner.html';
import {description as disruptionTemplate} from './disruption.html';
import {description as foundingTemplate} from './founding.html';
import {description as lookingAheadTemplate} from './lookingAhead.html';
import {description as reachTemplate} from './reach.html';
import {description as revolutionTemplate} from './revolution.html';
import {description as sustainabilityTemplate} from './sustainability.html';
import {description as testimonialsTemplate} from './testimonials.html';
import {description as philanthropicPartnersTemplate} from './philanthropic-partners.html';
import {description as givingTemplate} from './giving.html';
import {description as mapTemplate} from './map.html';
import {description as tutorTemplate} from './tutor.html';
import componentType from '~/helpers/controller/init-mixin';

const templates = {
    banner: bannerTemplate,
    disruption: disruptionTemplate,
    founding: foundingTemplate,
    giving: givingTemplate,
    lookingAhead: lookingAheadTemplate,
    map: mapTemplate,
    'philanthropic-partners': philanthropicPartnersTemplate,
    reach: reachTemplate,
    revolution: revolutionTemplate,
    sustainability: sustainabilityTemplate,
    testimonials: testimonialsTemplate,
    tutor: tutorTemplate
};

const css = {
    founding: foundingCss,
    map: mapCss,
    'philanthropic-partners': philanthropicPartnersCss,
    revolution: revolutionCss,
    reach: reachCss,
    tutor: tutorCss
};

function createSection(name, model, content=true) {
    const spec = {
        template: templates[name],
        view: {
            classes: content ? [name, 'content'] : [name]
        },
        css: css[name]
    };
    const Constructor = componentType(spec);

    Constructor.prototype.onLoaded = function () {
        this.insertHtml();
    };

    return new Constructor({ model });
}

export default createSection;

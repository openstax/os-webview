import {Controller} from 'superb';
import {description as template} from './support.html';

const supportHost = 'http://openstax.force.com/support?l=en_US';
const resources = [{
    name: 'OpenStax Textbooks',
    description: `Information on adopting OpenStax books, using our additional
    resources, and more.`,
    linkText: 'Find answers',
    linkUrl: `${supportHost}&c=Products%3ACollege`
}, {
    name: 'OpenStax CNX',
    description: `Help with using, contributing, and remixing content from
    our open library.`,
    linkText: 'Find answers',
    linkUrl: `${supportHost}&c=Products%3ACNX`
}, {
    name: 'Concept Coach',
    description: `Resources on piloting, setting up, and using our Concept
    Coach tool.`,
    linkText: 'Find answers',
    linkUrl: `${supportHost}&c=Products%3AConcept_Coach`
}, {
    name: 'OpenStax Tutor',
    description: `Answers to your questions about piloting, setting up, and
    using OpenStax Tutor courseware.`,
    linkText: 'Find answers',
    linkUrl: `${supportHost}&c=Products%3ATutor`
}/* , {
    name: 'General OpenStax Info',
    description: `Information about the OpenStax organization, mission, and
    other nonproduct-related topics.`,
    linkText: 'Find answers',
    linkUrl: '404'
}*/];

export default class Support extends Controller {

    init() {
        this.template = template;
        this.css = '/app/pages/support/support.css';
        this.view = {
            classes: ['support-page', 'page']
        };
        this.model = resources;
    }

}

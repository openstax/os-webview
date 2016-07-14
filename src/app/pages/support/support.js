import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './support.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

const supportHost = 'http://openstax.force.com/support?l=en_US';

@props({
    template: template,
    css: '/app/pages/support/support.css',
    templateHelpers: {
        strips,
        resources: [
            {
                name: 'OpenStax Textbooks',
                description: `Information on adopting OpenStax books, using our additional
                resources, and more.`,
                linkText: 'Find answers',
                linkUrl: `${supportHost}&c=Products%3ACollege`
            },
            {
                name: 'OpenStax CNX',
                description: `Help with using, contributing, and remixing content from
                our open library.`,
                linkText: 'Find answers',
                linkUrl: `${supportHost}&c=Products%3ACNX`
            },
            {
                name: 'Concept Coach',
                description: `Resources on piloting, setting up, and using our Concept
                Coach tool.`,
                linkText: 'Find answers',
                linkUrl: `${supportHost}&c=Products%3AConcept_Coach`
            },
            {
                name: 'OpenStax Tutor',
                description: `Answers to your questions about piloting, setting up, and
                using OpenStax Tutor courseware.`,
                linkText: 'Find answers',
                linkUrl: `${supportHost}&c=Products%3ATutor`
            }/*
            ,
            {
                name: 'General OpenStax Info',
                description: `Information about the OpenStax organization, mission, and
                other nonproduct-related topics.`,
                linkText: 'Find answers',
                linkUrl: '404'
            }
            */
        ]
    }
})

export default class support extends BaseView {

    onRender() {
        this.el.classList.add('support-page');
    }
}

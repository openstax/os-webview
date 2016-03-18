import BaseView from '~/helpers/backbone/view';
import Headshot from './headshot/headshot';
import {props} from '~/helpers/backbone/decorators';
import {template} from './about-us.hbs';
import {template as strips} from '~/components/strips/strips.hbs';
import bios from './bios.js';

function toHeadshot(bioEntry) {
    return {
        name: bioEntry.name,
        url: bioEntry.image ? `/images/about-us/${bioEntry.image}` : null,
        title: bioEntry.title,
        description: bioEntry.bio,
        bgColor: bioEntry.bgColor,
        textColor: bioEntry.textColor
    };
}

@props({
    template,
    templateHelpers: {strips},
    regions: {
        team: '.our-team>.headshots',
        advisors: '.strategic-advisors>.headshots'
    }
})
export default class AboutUs extends BaseView {
    onRender() {
        this.el.classList.add('about-us-page', 'text-content');
        for (let person of bios.team) {
            this.regions.team.append(new Headshot(toHeadshot(person)));
        }
        for (let person of bios.advisors) {
            this.regions.advisors.append(new Headshot(toHeadshot(person)));
        }
    }
}

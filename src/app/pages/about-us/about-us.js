import LoadingView from '~/helpers/backbone/loading-view';
import BaseModel from '~/helpers/backbone/model';
import Headshot from './headshot/headshot';
import $ from '~/helpers/$';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './about-us.hbs';
import Hero from './hero/hero';
import {template as strips} from '~/components/strips/strips.hbs';
import bios from './bios.js';

function toHeadshot(bioEntry) {
    return {
        name: bioEntry.name,
        url: bioEntry.image ? `/images/about-us/${bioEntry.image}` : null,
        title: bioEntry.title,
        description: bioEntry.bio,
        bgColor: bioEntry.bgColor,
        textColor: bioEntry.textColor,
        hidden: bioEntry.hidden
    };
}

function lastName(bioEntry) {
    return bioEntry.name.substr(1 + bioEntry.name.lastIndexOf(' ')).toLowerCase();
}

let colorCombos = [
    ['gray', 'orange'],
    ['cyan', 'blue'],
    ['orange', 'white'],
    ['turquoise', 'blue'],
    ['cyan', 'white'],
    ['blue', 'green'],
    ['turquoise', 'white'],
    ['gray', 'yellow'],
    ['cyan', 'blue'],
    ['orange', 'yellow'],
    ['deep-green', 'white']
];

function assignColorsToTeam(team) {
    let i = 0;

    for (let entry of team) {
        entry.bgColor = colorCombos[i][0];
        entry.textColor = colorCombos[i][1];
        ++i;
        if (Math.random() > 0.9) {
            ++i;
        }
        i %= colorCombos.length;
    }
}

@props({
    template,
    templateHelpers: {strips},
    regions: {
        hero: '.hero',
        team: '.our-team>.headshots',
        advisors: '.strategic-advisors>.headshots'
    }
})
export default class AboutUs extends LoadingView {
    @on('click')
    closeBios() {
        if (this.stateModel) {
            this.stateModel.set('active', null);
        }
    }

    onRender() {
        this.regions.hero.show(new Hero());

        this.stateModel = new BaseModel();

        bios.team.sort((a, b) => lastName(a) > lastName(b) ? 1 : -1);
        assignColorsToTeam(bios.team);
        for (let person of bios.team) {
            this.regions.team.append(new Headshot(toHeadshot(person), this.stateModel));
        }
        for (let person of bios.advisors.sort((a, b) => lastName(a) > lastName(b) ? 1 : -1)) {
            this.regions.advisors.append(new Headshot(toHeadshot(person), this.stateModel));
        }
        super.onRender();
    }

    onLoaded() {
        super.onLoaded();
        this.el.querySelector('.page').classList.remove('hidden');
        this.el.classList.add($.isTouchDevice() ? 'touch' : 'no-touch');
    }
}

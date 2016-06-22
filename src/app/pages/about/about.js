import LoadingView from '~/controllers/loading-view';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './about.html';
import bios from './bios.js';

function lastName(bioEntry) {
    return bioEntry.name.substr(1 + bioEntry.name.lastIndexOf(' ')).toLowerCase();
}

const colorCombos = [
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

function assignColors(team) {
    let i = 0;

    for (const member of team) {
        member.bgColor = colorCombos[i][0];
        member.textColor = colorCombos[i][1];
        i++;

        if (Math.random() > 0.9) {
            i++;
        }

        i %= colorCombos.length;
    }
}

function assignIds(teams) {
    let i = 1;

    for (const team of teams) {
        for (const member of team.members) {
            member.id = i;
            i++;
        }
    }
}

export default class AboutUs extends LoadingView {

    init() {
        this.template = template;
        this.css = '/app/pages/about/about.css';
        this.view = {
            classes: ['about-page', 'page']
        };

        bios.forEach((team) => {
            team.members.sort((a, b) => lastName(a) > lastName(b) ? 1 : -1);

            if (team.name === 'team') {
                assignColors(team.members);
            }
        });

        assignIds(bios);
        this.model = {bios};

        this.description = `OpenStax is a nonprofit based at Rice University,
            and it's our mission to improve student access to education.
            Read more about who we are and what we do.`;
    }

    @on('click .headshot')
    openBios(e) {
        e.stopPropagation();

        const tapped = Number(e.delegateTarget.getAttribute('data-id'));

        if (tapped === this.model.tapped) {
            this.model.tapped = null;
        } else {
            this.model.tapped = tapped;
        }

        this.update();
    }

    @on('click')
    closeBios() {
        this.model.tapped = null;
        this.update();
    }

}

import CMSPageController from '~/controllers/cms';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './about.html';

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
            // Because the image names are different
            member.image = member.team_member_image || member.advisor_image;
        }
    }
}

export default class AboutUs extends CMSPageController {

    static description = 'OpenStax is a nonprofit based at Rice University, ' +
        'and it\'s our mission to improve student access to education. ' +
        'Read more about who we are and what we do.';

    init() {
        this.slug = 'about-us';
        this.template = template;
        this.css = '/app/pages/about/about.css';
        this.view = {
            classes: ['about-page', 'page']
        };

        this.model = {bios: []};

        // FIX: Move to an inherited controller so all pages can get this for free
        document.querySelector('head meta[name="description"]').content = AboutUs.description;
    }

    onDataLoaded() {
        assignColors(this.pageData.openstax_team);

        this.model = {
            tagline: this.pageData.tagline,
            introHeading: this.pageData.intro_heading,
            introParagraph: this.pageData.intro_paragraph,
            ourTeamHeading: this.pageData.our_team_heading,
            bios: [{
                name: 'team',
                members: this.pageData.openstax_team
            }, {
                name: 'advisors',
                members: this.pageData.strategic_advisors
            }]
        };

        assignIds(this.model.bios);

        this.update();
        this.el.querySelector('insert-html[data-name="introParagraph"]').innerHTML = this.model.introParagraph;
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

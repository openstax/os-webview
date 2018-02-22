import CMSPageController from '~/controllers/cms';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './about.html';
import $ from '~/helpers/$';
import shell from '~/components/shell/shell';

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
        this.slug = 'pages/about-us';
        this.template = template;
        this.css = '/app/pages/about/about.css?v2.6.0';
        this.view = {
            classes: ['about-page', 'page', 'hide-until-loaded']
        };

        this.model = {
            bios: [],
            introHeading: '',
            introParagraph: '',
            tagline: ''
        };

        shell.showLoader();
    }

    onLoaded() {
        document.title = 'About Us - OpenStax';
    }

    onDataLoaded() {
        assignColors(this.pageData.openstax_team);
        assignColors(this.pageData.strategic_advisors);

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
        this.el.classList.add('loaded');
        this.update();
        $.insertHtml(this.el, this.model);
        shell.hideLoader();
    }

    @on('click .headshot')
    openBios(e) {
        /* eslint complexity: 0 */
        e.stopPropagation();

        const tapped = Number(e.delegateTarget.getAttribute('data-id'));

        this.model.tapped = tapped === this.model.tapped ? null : tapped;
        this.update();
        if (this.model.tapped) {
            const el = e.delegateTarget;
            const tooltipId = el.querySelector('[aria-describedby]').getAttribute('aria-describedby');
            const tooltipEl = document.getElementById(tooltipId);
            const elRect = el.getBoundingClientRect();
            const ttRect = tooltipEl.getBoundingClientRect();
            const topMost = Math.min(elRect.top, ttRect.top);
            const bottomMost = Math.max(elRect.bottom, ttRect.bottom);
            const totalHeight = bottomMost - topMost;

            if (topMost < 0) {
                $.scrollTo(elRect.top < ttRect.top ? el : tooltipEl, 0);
            }

            if (bottomMost > window.innerHeight) {
                $.scrollTo(elRect.top < ttRect.top ? el : tooltipEl, window.innerHeight - totalHeight - 60);
            }
        }
        document.body.classList.toggle('frozen', this.model.tapped);
    }

    @on('click')
    closeBios() {
        this.model.tapped = null;
        this.update();
    }

}

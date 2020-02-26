import componentType from '~/helpers/controller/init-mixin';
import {on} from '~/helpers/controller/decorators';
import {description as template} from './quiz-results.html';
import css from './quiz-results.css';
import Persona from './persona/persona';
import routerBus from '~/helpers/router-bus';
import partnerFeaturePromise from '~/models/salesforce-partners';
import shuffle from 'lodash/shuffle';

const spec = {
    template,
    css,
    view: {
        classes: ['quiz-results', 'page'],
        tag: 'main'
    },
    regions: {
        topResult: '.top-result',
        otherResults: '.other-results'
    },
    model() {
        return {
            heading: 'What\'s your equation?',
            introduction: `Lorem ipsum dolor sit amet, consectetuer adipiscing
            elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna
            aliquam`,
            expanded: this.expanded
        };
    },
    expanded: false
};

const personas = [
    {
        title: 'Director',
        description: `Highly skilled Directors expertly guide students through
        new lessons. They introduce concepts to their students in class, and assign
        homework that helps students practice those concepts. Directors need a homework
        system that aligns closely with their lectures to reinforce what they’ve
        taught.`
    },
    {
        title: 'Script-Flipper',
        description: `Innovative Script-Flippers use the flipped classroom model
        to help their students own their learning process. Their students start learning
        new concepts before class, so Script-Flippers need technology that will engage
        students during class and help them practice the things they’ve been learning on
        their own.`
    },
    {
        title: 'Ensemblist',
        description: `Creative Ensemblists bring their students into the teaching
        process. Their students work together on activities during class, so they need
        technology that will help organize in-class work. They can also use tools that
        help their students write their own problems and activities.`
    },
    {
        title: 'Technician',
        description: `Investigative Technicians use cutting-edge technology to support
        and inform their teaching. Technicians need tools that guide students through
        self-paced activities and provide them with powerful analytics to help them see
        where students need help.`
    }
];

partnerFeaturePromise.then((pd) => {
    const logos = pd.map((entry) => entry.partner_logo);

    personas.forEach((persona) => {
        persona.logos = shuffle(logos).slice(0, 12);
    });
});

export default class extends componentType(spec) {

    get topResult() {
        return personas.find((entry) => entry.title.toLowerCase() === this.selectedTitle);
    }

    get otherResults() {
        return personas.filter((entry) => entry.title.toLowerCase() !== this.selectedTitle);
    }

    init(...args) {
        super.init(...args);
        this.selectedTitle = window.location.pathname.match(/quiz-results\/([^/]*)/)[1];
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        partnerFeaturePromise.then(() => {
            this.onDataLoaded();
        });
    }

    // Fires when the slug has been loaded (data returned in this.pageData)
    // Content probably needs to be updated
    onDataLoaded() {
        if (super.onDataLoaded) {
            super.onDataLoaded();
        }
        const topResult = this.topResult;
        const trProps = Object.assign(
            {},
            topResult,
            {
                el: this.regions.topResult.el,
                title: `You're the ${topResult.title}`,
            }
        );

        if (!topResult) {
        }
        const tr = new Persona(trProps);

        this.otherResults.forEach((props) => {
            this.regions.otherResults.append(new Persona(props));
        });
    }

    @on('click #expander')
    toggleExpanded() {
        this.expanded = !this.expanded;
        this.update();
    }

}

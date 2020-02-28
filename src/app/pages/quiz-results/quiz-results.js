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
        const data = this.pageData || {};

        return {
            heading: data.heading,
            introduction: data.description,
            expanded: this.expanded
        };
    },
    slug: 'pages/quiz-results',
    expanded: false
};

export default class extends componentType(spec) {

    get personas() {
        console.info('Data', this.pageData);
        return this.pageData ?
            this.pageData.results.flat().map((d) => ({
                title: d.headline,
                description: d.description,
                imageUrl: d.image.image,
                partners: d.partners.map((p) => p.partner)
            })) : [];
    }

    get topResult() {
        return this.personas.find((entry) => entry.title.toLowerCase() === this.selectedTitle);
    }

    get otherResults() {
        return this.personas.filter((entry) => entry.title.toLowerCase() !== this.selectedTitle);
    }

    init(...args) {
        super.init(...args);
        this.selectedTitle = window.location.pathname.match(/quiz-results\/([^/]*)/)[1];
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
    }

    // Fires when the slug has been loaded (data returned in this.pageData)
    // Content probably needs to be updated
    onDataLoaded() {
        if (super.onDataLoaded) {
            super.onDataLoaded();
        }
        this.update();
        const topResult = this.topResult;
        const trProps = Object.assign(
            {},
            topResult,
            {
                el: this.regions.topResult.el,
                title: `You're the ${topResult.title}`
            }
        );

        if (!topResult) {
        }
        const tr = new Persona(trProps);

        partnerFeaturePromise.then(() => {

        });
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

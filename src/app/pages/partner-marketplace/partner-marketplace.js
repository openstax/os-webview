import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './partner-marketplace.html';
import css from './partner-marketplace.css';
import Controls from './controls/controls';
import Results from './results/results';
import ActiveFilters from './active-filters/active-filters';

const spec = {
    template,
    css,
    view: {
        classes: ['partner-marketplace', 'page'],
        tag: 'main'
    },
    slug: 'pages/partner-marketplace',
    model() {
        return {
            headline: this.heading,
            description: this.description
        };
    },
    resultData: [
        {
            logoUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/images/TopHat_Lockup_FullColor_RGB.original.jpg',
            title: 'Top Hat',
            description: `
            Top Had lorem ipsum <b>dolor</b> sit amet, consectetur adipiscing elit.
            `
        },
        {
            logoUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/images/TopHat_Lockup_FullColor_RGB.original.jpg',
            title: 'Top Hat',
            description: `
            Top Had lorem ipsum <b>dolor</b> sit amet, consectetur adipiscing elit.
            `
        },
        {
            logoUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/images/TopHat_Lockup_FullColor_RGB.original.jpg',
            title: 'Top Hat',
            description: `
            Top Had lorem ipsum <b>dolor</b> sit amet, consectetur adipiscing elit.
            `
        },
        {
            logoUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/images/TopHat_Lockup_FullColor_RGB.original.jpg',
            title: 'Top Hat',
            description: `
            Top Had lorem ipsum <b>dolor</b> sit amet, consectetur adipiscing elit.
            `
        },
        {
            logoUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/images/TopHat_Lockup_FullColor_RGB.original.jpg',
            title: 'Top Hat',
            description: `
            Top Had lorem ipsum <b>dolor</b> sit amet, consectetur adipiscing elit.
            `
        },
        {
            logoUrl: 'https://d3bxy9euw4e147.cloudfront.net/oscms-dev/media/images/TopHat_Lockup_FullColor_RGB.original.jpg',
            title: 'Top Hat',
            description: `
            Top Had lorem ipsum <b>dolor</b> sit amet, consectetur adipiscing elit.
            `
        }
    ],
    displayMode: 'grid'
};

export default class extends componentType(spec) {

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        if (this.heading) {
            // already loaded, we came back
            return;
        }
        this.heading = 'Courseware Concierge';
        this.description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
        this.onDataLoaded();
        this.controls = new Controls({
            el: this.el.querySelector('.controls'),
            displayMode: this.displayMode
        });
        this.results = new Results({
            el: this.el.querySelector('.results'),
            entries: this.resultData,
            displayMode: this.displayMode
        });

        this.controls.on('update', (obj) => {
            if ('displayMode' in obj) {
                this.displayMode = obj.displayMode;
                this.controls.emit('update-props', {
                    displayMode: this.displayMode
                });
                this.results.emit('update-props', {
                    displayMode: this.displayMode
                });
            }
        });
        this.activeFilters = new ActiveFilters({
            el: this.el.querySelector('.active-filters')
        });
    }

    onDataLoaded() {
        if (super.onDataLoaded) {
            super.onDataLoaded();
        }
        this.update();
    }

}

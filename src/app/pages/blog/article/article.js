import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './article.html';
import bodyUnitView from '~/components/body-units/body-units';
import css from './article.css';
import Byline from '~/components/byline/byline';
import ProgressRing from '~/components/progress-ring/progress-ring';
import throttle from '~/helpers/throttle';
import Share from '~/components/share/share';

const spec = {
    template,
    slug: 'set in init',
    preserveWrapping: true,
    view: {
        classes: ['article']
    },
    model() {
        const data = this.pageData;

        return data && {
            image: data.article_image,
            imageAlt: data.featured_image_alt_text,
            title: data.heading,
            subheading: data.subheading,
            tags: data.tags
        };
    },
    regions: {
        sidebar: '.sticky-bit'
    },
    setsPageTitleAndDescription: true
};

export default class extends componentType(spec) {

    get progress() {
        const divRect = this.el.querySelector('.body').getBoundingClientRect();
        const viewportBottom = window.innerHeight;
        const visibleHeight = viewportBottom - divRect.top;
        const totalHeight = divRect.height;

        if (visibleHeight <= 0) {
            return 0;
        }
        if (viewportBottom >= divRect.bottom) {
            return 100;
        }

        return Math.round(100 * visibleHeight / totalHeight);
    }

    attachProgressRing() {
        const progressRing = new ProgressRing({
            radius: 45,
            progress: this.progress,
            stroke: 4,
            message: this.readTime
        });

        this.regions.sidebar.attach(progressRing);
        this.handleScroll = throttle(
            () => {
                progressRing.emit('update-props', {
                    progress: this.progress
                });
            }
        );
        this.el.querySelectorAll('img')
            .forEach((img) => {
                img.onload = this.handleScroll;
            });
        window.addEventListener('scroll', this.handleScroll);
        window.addEventListener('resize', this.handleScroll);
        this.regions.sidebar.append(
            new Share(
                `${window.location.href}`,
                'Check out this OpenStax blog article!',
                true
            )
        );
    }

    attachUnits() {
        this.update();
        const bodyRegion = this.regionFrom('.body');
        const bylineRegion = this.regionFrom('.byline');

        this.pageData.body.forEach((unit) => {
            bodyRegion.append(bodyUnitView(unit));
        });
        bylineRegion.attach(new Byline({
            date: this.pageData.date,
            author: this.pageData.author
        }));
        this.attachProgressRing();
    }

    get readTime() {
        const div = this.el.querySelector('.body');
        const words = div.textContent.split(/\W+/);
        const WORDS_PER_MINUTE = 225;

        return Math.round(words.length / WORDS_PER_MINUTE);
    }

    onLoaded() {
        if (super.onLoaded) {
            super.onLoaded();
        }
        if (this.pageData) {
            this.attachUnits();
        }
    }

    onDataLoaded() {
        if (super.onDataLoaded) {
            super.onDataLoaded();
        }
        if (this.el) {
            this.attachUnits();
        }
        const meta = this.pageData.meta;
    }

    onClose() {
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleScroll);
    }

}

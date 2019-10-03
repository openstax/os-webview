import componentType from '~/helpers/controller/init-mixin';
import busMixin from '~/helpers/controller/bus-mixin';
import {description as template} from './paginator.html';
import css from './paginator.css';
import $ from '~/helpers/$';
import {on} from '~/helpers/controller/decorators';

const spec = {
    template,
    css,
    view: {
        classes: ['paginator']
    },
    model() {
        return {
            pages: this.pages,
            disablePrevious: $.booleanAttribute(this.currentPage === 1),
            disableNext: $.booleanAttribute(this.currentPage === this.pages),
            pageIndicators: this.pageIndicators(),
            resultRange: this.resultRange,
            totalResults: this.totalResults,
            searchTerm: this.searchTerm
        };
    },
    currentPage: 1
};

export default class extends componentType(spec, busMixin) {

    /* eslint complexity: 0 */
    pageIndicators() {
        const dotsBefore = (this.pages > 5) && this.currentPage > 3;
        const dotsAfter = (this.pages > 5) && this.pages - this.currentPage > 2;
        const indicatorCount = Math.min(this.pages, 5);
        const propsFor = (label) => ({
            label,
            page: `page ${label}`,
            disabled: $.booleanAttribute(label === this.currentPage),
            selected: label === this.currentPage
        });
        const result = Array(indicatorCount).fill();

        result[0] = propsFor(1);
        result[indicatorCount - 1] = propsFor(this.pages);
        if (dotsBefore) {
            const pageAfterDots = Math.min(this.currentPage, this.pages - 2);

            result[1] = propsFor('…');
            result[2] = propsFor(pageAfterDots);
            if (dotsAfter) {
                result[3] = propsFor('…');
            } else {
                result[3] = propsFor(pageAfterDots + 1);
            }
        } else {
            for (let i = 1; i < Math.min(4, this.pages); ++i) {
                result[i] = propsFor(i+1);
            }
            if (dotsAfter) {
                result[3] = propsFor('…');
            }
        }
        return result;
    }

    whenPropsUpdated() {
        this.update();
    }

    @on('click button')
    buttonClick(event) {
        const text = event.target.textContent;
        const newPage = {
            'Previous': this.currentPage - 1,
            'Next': this.currentPage + 1
        };

        this.emit('change', newPage[text] || text);
    }

}

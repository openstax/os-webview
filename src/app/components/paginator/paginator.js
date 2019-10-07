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
        const indicatorCount = Math.min(this.pages, 5);
        const propsFor = (label) => ({
            label,
            page: `page ${label}`,
            disabled: $.booleanAttribute(label === this.currentPage),
            selected: label === this.currentPage
        });
        const result = Array(indicatorCount).fill();

        if (this.pages - this.currentPage < 3) {
            result[0] = this.pages - indicatorCount + 1;
        } else {
            result[0] = (this.currentPage > 3) ? this.currentPage - 2 : 1;
        }
        for (let i = 1; i < indicatorCount; ++i) {
            result[i] = result[i-1] + 1;
        }
        return result.map(propsFor);
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

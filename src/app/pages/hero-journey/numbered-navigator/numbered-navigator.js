import componentType from '~/helpers/controller/init-mixin';
import {description as template} from './numbered-navigator.html';
import css from './numbered-navigator.css';
import {on} from '~/helpers/controller/decorators';

const nodeStatuses = ['future', 'on', 'done'];
const spec = {
    template,
    view: {
        classes: ['numbered-navigator']
    },
    css,
    model() {
        const result = this.getProps();

        result.nodeStatus = (nodeIndex) => {
            return nodeStatuses[1 + Math.sign(result.lastCompleted - nodeIndex)];
        };
        result.hiddenClass = this.hiddenClass;
        result.tooltipMessage = result.steps.map((s) => s.task)[result.lastCompleted];
        return result;
    },
    lastLastCompleted: null,
    hiddenClass: 'invisible'
};

export default class extends componentType(spec) {

    positionToolTips(nodeEl) {
        const nRect = nodeEl.getBoundingClientRect();
        const thisRect = this.el.getBoundingClientRect();

        if (nRect.height === 0) {
            this.lastLastCompleted = null;
        }
        if (this.lastLastCompleted !== null && !this.showing) {
            this.showToolTip();
            setTimeout(this.hideToolTip.bind(this), 2000);
        }
        ['.right-tooltip', '.left-tooltip', '.phone-tooltip'].forEach((selector) => {
            const ttEl = this.el.querySelector(selector);
            const ttRect = ttEl.getBoundingClientRect();

            if (ttRect.width > 0) {
                const direction = selector === '.phone-tooltip' ? 'left' : 'top';
                const values = {
                    top: nRect.top + nRect.height / 2 - ttRect.height / 2 - thisRect.top,
                    left: nRect.left + nRect.width / 2 - ttRect.width / 2 - thisRect.left
                };

                ttEl.style[direction] = `${values[direction]}px`;
            }
        });
    }

    onUpdate() {
        const {lastCompleted} = this.getProps();

        if (this.el && lastCompleted !== this.lastLastCompleted) {
            const nodeEl = this.el.querySelector('.node-and-bar.on .node');

            if (nodeEl) {
                this.lastLastCompleted = lastCompleted;
                this.positionToolTips(nodeEl);
            }
        }
    }

    @on('mouseenter')
    showToolTip() {
        this.hiddenClass = '';
        this.showing = true;
        this.update();
    }

    @on('mouseleave')
    hideToolTip() {
        this.hiddenClass = 'invisible';
        this.showing = false;
        this.update();
    }

}

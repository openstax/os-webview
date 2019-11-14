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
        const currentNode = typeof this.visitingNode === 'number' ?
            Math.min(this.visitingNode, result.lastCompleted) : result.lastCompleted;

        result.nodeStatus = (nodeIndex) => {
            return nodeStatuses[1 + Math.sign(result.lastCompleted - nodeIndex)];
        };
        result.hiddenClass = this.hiddenClass;
        result.tooltipMessage = result.steps[currentNode].task || '';
        return result;
    },
    lastLastCompleted: null,
    hiddenClass: 'invisible',
    showing: true,
    visitingNode: null
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

            if (selector === '.phone-tooltip') {
                if (nodeEl.textContent === '1') {
                    ttEl.style.paddingLeft = '65px';
                    ttEl.style.width = '15rem';
                } else {
                    ttEl.style.removeProperty('padding-left');
                    ttEl.style.removeProperty('width');
                }
            }
            const ttRect = ttEl.getBoundingClientRect();
            const keepPhoneTipOnscreen = (lefValue) => {
                if (selector === '.phone-tooltip') {
                    if (leftValue < 0) {
                        // Magic numbers because I don't know how this should be figured.
                        ttEl.style.paddingLeft = '3.7rem';
                        ttEl.style.width = '11.3rem';
                    }
                }
            };

            if (ttRect.width > 0) {
                const direction = selector === '.phone-tooltip' ? 'left' : 'top';
                const values = {
                    top: nRect.top + nRect.height / 2 - ttRect.height / 2 - thisRect.top,
                    left: nRect.left + nRect.width / 2 - ttRect.width / 2 - thisRect.left
                };

                keepPhoneTipOnscreen(values.left);
                ttEl.style[direction] = `${values[direction]}px`;
            }
        });
    }

    onUpdate() {
        if (super.onUpdate) {
            super.onUpdate();
        }
        const {lastCompleted} = this.getProps();

        if (this.el && this.showing) {
            const nodeEl = this.el.querySelector('.node-and-bar.on .node');

            if (nodeEl) {
                this.lastLastCompleted = lastCompleted;
                this.positionToolTips(nodeEl);
            }
        }
    }

    showToolTip() {
        this.hiddenClass = '';
        this.showing = true;
        this.update();
    }

    hideToolTip() {
        this.hiddenClass = 'invisible';
        this.showing = false;
        this.update();
    }

    @on('mouseout .numbered-navigator')
    hideToolTipForNode(event) {
        const node = event.target;
        const newNode = event.relatedTarget;

        if (!node.contains(newNode)) {
            this.hideToolTip();
        }
    }


    nodeToIndex(node) {
        const nodeAndBars = Array.from(this.el.querySelectorAll('.node-and-bar'));

        return nodeAndBars.indexOf(node.parentNode);
    }

    @on('mouseover .node')
    showToolTipForNode(event) {
        const node = event.delegateTarget;

        if (node === event.target) {
            this.showToolTip();
            const {steps} = this.getProps();
            const index = this.nodeToIndex(node);
            const tooltips = this.el.querySelectorAll('.left-tooltip,.right-tooltip,.phone-tooltip');

            tooltips.forEach((t) => {
                t.textContent = steps[index].task;
            });
            this.positionToolTips(node);
        }
    }

    @on('click .node')
    moveToNode(event) {
        const index = this.nodeToIndex(event.delegateTarget);
        const {visitNode, lastCompleted} = this.getProps();

        this.visitingNode = Math.min(index, lastCompleted);
        visitNode(this.visitingNode);
    }

}

import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';
import {description as template} from './section-navigator.html';
import css from './section-navigator.css';
import debounce from 'lodash/debounce';

export default class SectionNavigator extends Controller {

    init(idList) {
        this.template = template;
        this.model = {
            idList,
            selectedId: idList[0]
        };
        this.view = {
            classes: ['section-navigator']
        };
        this.css = css;
        this.boundScrollFn = debounce(this.setSelectedIdToNearest.bind(this), 40);
    }

    onLoaded() {
        window.addEventListener('scroll', this.boundScrollFn);
    }

    onClose() {
        window.removeEventListener('scroll', this.boundScrollFn);
    }

    setSelectedIdToNearest() {
        const sections = this.model.idList.map((id) => document.getElementById(id));
        const firstWhoseMiddleIsVisible = sections.find((el) => {
            const rect = el.getBoundingClientRect();
            const middle = (rect.top + rect.bottom) / 2;

            return middle >= 0;
        });

        this.model.selectedId = firstWhoseMiddleIsVisible && firstWhoseMiddleIsVisible.id;
        this.update();
    }

    @on('click .hotspot')
    selectDot(event) {
        this.model.selectedId = event.delegateTarget.dataset.id;
        let targetEl = document.getElementById(`${this.model.selectedId}-target`);

        if (!targetEl) {
            targetEl = document.getElementById(this.model.selectedId);
        }

        $.scrollTo(targetEl);
        this.update();
    }

}

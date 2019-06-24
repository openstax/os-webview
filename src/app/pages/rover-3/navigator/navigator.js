import componentType, {insertHtmlMixin} from '~/helpers/controller/init-mixin';
import {description as template} from './navigator.html';
import css from './navigator.css';
import {on} from '~/helpers/controller/decorators';
import $ from '~/helpers/$';

const spec = {
    template,
    css,
    view: {
        classes: ['boxed', 'navigator']
    }
};

export default class extends componentType(spec, insertHtmlMixin) {

    init(...args) {
        super.init(...args);
        this.setToFirst();
        this.model.currentClass = (id) => id === this.currentId ? 'selected' : '';
    }

    setToFirst() {
        this.currentId = this.model[0].id;
    }

    @on('click .navigation-item')
    navigate(event) {
        const id = event.delegateTarget.dataset.targetId;
        const targetEl = document.getElementById(id);

        this.currentId = id;
        this.update();
        setTimeout(() => {
            $.scrollTo(targetEl).then(() => {
                this.setToFirst();
                this.update();
            });
        }, 200);
    }

    @on('keydown .navigation-item')
    navigateIfEnterOrSpace(event) {
        if ([' ', 'Enter'].includes(event.key)) {
            event.preventDefault();
            event.delegateTarget.blur();
            this.navigate(event);
        }
    }

};

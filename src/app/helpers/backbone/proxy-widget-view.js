import BaseView from './view.js';
import {on} from '~/helpers/backbone/decorators';
import TagMultiSelect from '~/components/tag-multi-select/tag-multi-select';
import SingleSelect from '~/components/single-select/single-select';

class ProxyWidgetView extends BaseView {
    @on('click')
    closeNonContainers(e) {
        if (e.target.classList.contains('hidden')) {
            return;
        }
        for (let w of this.selectWidgets) {
            if (!w.el.contains(e.target)) {
                w.togglePulldown(true);
            }
        }
    }

    // Override in form
    // Should set/clear invalid class on items that have custom validation
    doValidChecks() {}

    failIfInvalid(event) {
        this.formEl.classList.add('has-been-submitted');
        for (let widget of this.selectWidgets) {
            widget.doValidChecks();
        }
        this.doValidChecks();
        let invalid = this.el.querySelectorAll('.invalid,input:invalid');

        if (invalid.length > 0) {
            event.preventDefault();
        }
    }

    findProxyFor(originalWidget) {
        for (let w of this.selectWidgets) {
            if (w.originalSelect === originalWidget) {
                return w;
            }
        }
        return null;
    }

    onRender() {
        this.formEl = this.el.querySelector('input').form;
        this.selectWidgets = [];
        for (let ms of this.el.querySelectorAll('select[multiple]')) {
            let widget = new TagMultiSelect();

            widget.replace(ms);
            this.selectWidgets.push(widget);
            widget.originalSelect = ms;
        }
        for (let ss of this.el.querySelectorAll('select:not([multiple])')) {
            let widget = new SingleSelect();

            widget.replace(ss);
            this.selectWidgets.push(widget);
            widget.originalSelect = ss;
        }
        this.attachListenerTo(this.formEl.querySelector('[type=submit]'), 'click', this.failIfInvalid.bind(this));
    }
}

export default ProxyWidgetView;

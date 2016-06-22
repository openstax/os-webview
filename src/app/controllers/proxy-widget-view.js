import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
// import TagMultiSelect from '~/components/tag-multi-select/tag-multi-select';
// import SingleSelect from '~/components/single-select/single-select';

class ProxyWidgetView extends Controller {

    @on('click')
    closeNonContainers(e) {
        if (e.target.classList.contains('hidden')) {
            return;
        }
        for (const w of this.selectWidgets) {
            if (!w.el.contains(e.target)) {
                w.togglePulldown(true);
            }
        }
    }

    // Override in form
    // Should set/clear invalid class on items that have custom validation
    doValidChecks() {}

    /*
    failIfInvalid(event) {
        this.formEl.classList.add('has-been-submitted');
        for (const widget of this.selectWidgets) {
            widget.doValidChecks();
        }
        this.doValidChecks();
        const invalid = this.el.querySelectorAll('.invalid,input:invalid');

        if (invalid.length > 0) {
            event.preventDefault();
        }
    }

    findProxyFor(originalWidget) {
        for (const w of this.selectWidgets) {
            if (w.originalSelect === originalWidget) {
                return w;
            }
        }
        return null;
    }

    onLoaded() {
        this.formEl = this.el.querySelector('input').form;
        this.selectWidgets = [];
        for (const ms of this.el.querySelectorAll('select[multiple]')) {
            const widget = new TagMultiSelect();

            widget.replace(ms);
            this.selectWidgets.push(widget);
            widget.originalSelect = ms;
        }
        for (const ss of this.el.querySelectorAll('select:not([multiple])')) {
            const widget = new SingleSelect();

            widget.replace(ss);
            this.selectWidgets.push(widget);
            widget.originalSelect = ss;
        }
        this.attachListenerTo(this.formEl.querySelector('[type=submit]'), 'click', this.failIfInvalid.bind(this));
    }
    */

}

export default ProxyWidgetView;

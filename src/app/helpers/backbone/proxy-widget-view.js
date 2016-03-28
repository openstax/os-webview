import BaseView from './view.js';
import TagMultiSelect from '~/components/tag-multi-select/tag-multi-select';
import SingleSelect from '~/components/single-select/single-select';

class ProxyWidgetView extends BaseView {

    failIfInvalid(event) {
        this.el.querySelector('form').classList.add('has-been-submitted');
        for (let widget of this.selectWidgets) {
            widget.doValidChecks();
        }
        let invalid = this.el.querySelectorAll('.invalid,input:invalid');

        if (invalid.length > 0) {
            event.preventDefault();
        }
    }

    onRender() {
        this.selectWidgets = [];
        for (let ms of this.el.querySelectorAll('select[multiple]')) {
            let widget = new TagMultiSelect();

            widget.replace(ms);
            this.selectWidgets.push(widget);
        }
        for (let ss of this.el.querySelectorAll('select:not([multiple])')) {
            let widget = new SingleSelect();

            widget.replace(ss);
            this.selectWidgets.push(widget);
        }
        this.el.querySelector('[type=submit]').addEventListener('click', this.failIfInvalid.bind(this));
    }

    onBeforeClose() {
        this.el.querySelector('[type=submit]').removeEventListener('click', this.failIfInvalid.bind(this));
    }
}

export default ProxyWidgetView;

import _ from 'underscore';
import Backbone from 'backbone';
import NativeView from 'backbone.nativeview';

Backbone.View = NativeView;

function dispose(obj) {
    delete obj.parent;
    delete obj.el;
    delete obj.regions;
}

class Region {

    constructor(el, parent) {
        this.el = el;
        this.parent = parent;
    }

    show(view) {
        this.empty();
        this.append(view);
    }

    append(view) {
        this.appendAs('div', view);
    }

    appendAs(type, view) {
        if (typeof this.el === 'string') {
            this.el = this.parent.el.querySelector(this.el);
        }

        view.el = document.createElement(type);
        view.parent = this.parent;
        this.views = this.views || [];
        this.views.push(view);
        this.el.appendChild(view.el);
        view.render();
        view.onShow();
    }

    empty() {
        _.each(this.views, (view) => view.close());

        if (this.el instanceof Element) {
            while (this.el.firstChild) {
                this.el.removeChild(this.el.firstChild);
            }
        }

        this.views = null;
    }

    close() {
        this.empty();
        dispose(this);
    }

}

class Regions {

    constructor(regions = {}, context) {
        _.each(_.keys(regions), (region) => {
            this[region] = new Region(regions[region], context);
        });

        // Add a self-referential region to attach views to
        this.self = new Region(null, context);
    }

}

class BaseView extends Backbone.View {

    constructor() {
        super(...arguments);
        this.regions = new Regions(this.regions, this);
        this.unbinders = [];
    }

    delegate(eventName, selector, listener) {
        /* eslint no-param-reassign: 0 */

        if (typeof selector === 'function') {
            listener = selector;
            selector = null;
        }

        if (selector) {
            let nodes = this.el.querySelectorAll(selector);

            for (let node of nodes) {
                node.addEventListener(eventName, listener, true);
                this._domEvents.push({el: node, eventName: eventName, listener: listener, selector: selector});
            }
        } else {
            this.el.addEventListener(eventName, listener, true);
            this._domEvents.push({el: this.el, eventName: eventName, listener: listener});
        }

        return this;
    }

    undelegate(eventName, selector, listener) {
        /* eslint no-param-reassign: 0 */

        if (typeof selector === 'function') {
            listener = selector;
            selector = null;
        }

        let handlers = this._domEvents.slice();

        for (let i = 0, len = handlers.length; i < len; i++) {
            let item = handlers[i];
            let match = item.eventName === eventName &&
                item.listener === listener &&
                (selector ? item.selector === selector : true);

            if (!match) {
                continue;
            }

            item.el.removeEventListener(eventName, listener, true);
            this._domEvents.splice(handlers.indexOf(item), 1);
        }

        return this;
    }

    undelegateEvents() {
        if (this.el) {
            for (let i = 0, len = this._domEvents.length; i < len; i++) {
                let item = this._domEvents[i];

                item.el.removeEventListener(item.eventName, item.handler);
            }

            this._domEvents.length = 0;
        }

        return this;
    }

    renderDom() {
        return new Promise((resolve) => {
            if (this.el) {
                let template = this.getTemplate();
                let range = document.createRange();

                range.selectNode(this.el);

                let documentFragment = range.createContextualFragment(template);

                window.requestAnimationFrame(() => {
                    while (this.el.firstChild) {
                        this.el.removeChild(this.el.firstChild);
                    }

                    this.el.appendChild(documentFragment);
                    resolve(this);
                });
            } else {
                resolve(this);
            }
        });
    }

    getTemplate() {
        if (typeof this.template === 'function') {
            return this.template(this.getTemplateData());
        }

        return this.template;
    }

    getTemplateData() {
        let data = this.model ? this.model.toJSON() : {};
        let view = this;

        if (typeof this.templateHelpers === 'function') {
            _.extend(data, this.templateHelpers());
        } else if (typeof this.templateHelpers === 'object') {
            // Add data from template helpers to the model's data
            _.each(this.templateHelpers, (value, key) => {
                if (typeof value === 'function') {
                    data[key] = Reflect.apply(value, view, []);
                } else {
                    data[key] = value;
                }
            });
        }

        return data;
    }

    _render() {
        _.each(this.regions, (region) => region.empty());
        return this.renderDom();
    }

    render() {
        let view = this;

        (async function() {
            view.onBeforeRender();
            await view._render();
            view.setElement(view.el);
            view.onRender();

            if (view._rendered) {
                view.onDomRefresh();
            } else {
                view._rendered = true;
            }

            view.onAfterRender();
        })();

        return this;
    }

    onShow() {} // noop
    onBeforeRender() {} // noop
    onRender() {} // noop
    onAfterRender() {} // noop
    onDomRefresh() {} // noop

    attachListenerTo(el, ...options) {
        el.addEventListener(...options);
        this.unbinders.push(() => {
            el.removeEventListener(...options);
        });
    }

    onBeforeClose() {
        while (this.unbinders.length) {
            let unbind = this.unbinders.pop();

            unbind();
        }
    }

    close() {
        this.onBeforeClose();

        _.each(this.regions, (region) => region.close());

        this._removeElement();
        dispose(this);

        return this;
    }

}

export default BaseView;

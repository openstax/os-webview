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
        view._setElement(view.el);
        view.render();
        view.onShow();
    }

    empty() {
        _.each(this.views, (view) => view.close());

        if (this.el instanceof Element) {
            this.el.innerHTML = '';
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
        super();
        this.regions = new Regions(this.regions, this);
    }

    renderDom() {
        if (this.el) {
            this.el.innerHTML = this.getTemplate();
        }
    }

    getTemplate() {
        if (typeof this.template === 'function') {
            return this.template(this.getTemplateData());
        }

        return this.template;
    }

    getTemplateData() {
        let data = this.model ? this.model.toJSON() : {};

        if (typeof this.templateHelpers === 'function') {
            _.extend(data, this.templateHelpers());
        } else {
            // Add data from template helpers to the model's data
            _.each(this.templateHelpers, function (value, key) {
                if (typeof value === 'function') {
                    data[key] = Reflect.apply(value, this);
                } else {
                    data[key] = value;
                }
            });

            return data;
        }
    }

    _render() {
        _.each(this.regions, (region) => region.empty());
        window.requestAnimationFrame(this.renderDom.bind(this));
    }

    render() {
        this.onBeforeRender();
        this._render();
        window.requestAnimationFrame(this.onRender.bind(this));
        if (this._rendered) {
            window.requestAnimationFrame(this.onDomRefresh.bind(this));
        } else {
            this._rendered = true;
        }
        window.requestAnimationFrame(this.onAfterRender.bind(this));

        return this;
    }

    onShow() {} // noop
    onBeforeRender() {} // noop
    onRender() {} // noop
    onAfterRender() {} // noop
    onDomRefresh() {} // noop
    onBeforeClose() {} // noop

    close() {
        this.onBeforeClose();

        _.each(this.regions, (region) => region.close());

        this._removeElement();
        dispose(this);

        return this;
    }

}

export default BaseView;

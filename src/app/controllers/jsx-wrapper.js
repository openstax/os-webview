import {Controller} from 'superb.js';
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

function makeStateFor(props, Child) {
    const state = {};
    const setters = {};
    const result = () => {
        if (props instanceof Object) {
            Object.entries(props).forEach(([key, value]) => {
                [state[key], setters[key]] = useState(value);
                if (state[key] !== value) {
                    // force it -- functions need this
                    state[key] = value;
                }
            });
        }
        return React.createElement(Child, state);
    };

    result.setters = setters;
    return result;
}

export default class WrappedJsx extends Controller {

    init(jsxComponent, props, el) {
        this.child = makeStateFor(props, jsxComponent);
        this.props = props;
        if (el) {
            this.el = el;
        }
    }

    onLoaded() {
        const root = React.createElement(this.child);

        ReactDOM.render(root, this.regions.self.el);
    }

    onClose() {
        ReactDOM.unmountComponentAtNode(this.regions.self.el);
    }

    updateProps(newProps) {
        Object.assign(this.props, newProps);
        Reflect.ownKeys(newProps)
            .filter((k) => k in this.child.setters)
            .forEach((k) => {
                this.child.setters[k](newProps[k]);
            });
    }

    update() {}

    template() {}

}

export function pageWrapper(jsxComponent, view) {
    return class extends WrappedJsx {

        init(props) {
            super.init(jsxComponent, props);
            this.view = view;
        }

    };
}

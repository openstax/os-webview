import {Controller} from 'superb.js';
import React, {useState, useEffect, useRef} from 'react';
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

    init(jsxComponent, props, el, view) {
        this.child = makeStateFor(props, jsxComponent);
        this.props = props;
        if (el) {
            this.el = el;
        }
        if (view) {
            this.view = view;
        }
    }

    onLoaded() {
        const root = React.createElement(this.child);
        const save = [this.el, this.regions];

        ReactDOM.render(root, this.regions.self.el);
        [this.el, this.regions] = save;
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

export function pageWrapper(jsxComponent, view = {}) {
    return class extends WrappedJsx {

        init(props={}) {
            super.init(jsxComponent, props, props.el);
            this.view = view;
        }

    };
}

// Reverse wrapper, when React needs to host a Superb component
export function SuperbItem({component, Tag='div', ...divProps}) {
    const root = useRef();
    const Region = component.regions.self.constructor;

    useEffect(() => {
        const region = new Region(root.current, component);

        region.attach(component);
        return () => {
            region.detach();
        };
    }, [Region]);

    if (!component) {
        return null;
    }


    return (
        <Tag ref={root} {...divProps} />
    );
}

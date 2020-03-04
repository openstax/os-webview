import {Controller} from 'superb.js';
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';

function makeStateFor(props, Child) {
    const state = {};
    const setters = {};
    const result = () => {
        Reflect.ownKeys(props).forEach((k) => {
            [state[k], setters[k]] = useState(props[k]);
        });

        return React.createElement(Child, state);
    };

    result.setters = setters;
    return result;
}

export default class extends Controller {

    init(jsxComponent, props) {
        this.child = makeStateFor(props, jsxComponent);
    }

    onLoaded() {
        const root = React.createElement(this.child);

        ReactDOM.render(root, this.regions.self.el);
    }

    onClose() {
        ReactDOM.unmountComponentAtNode(this.regions.self.el);
    }

    updateProps(newProps) {
        Reflect.ownKeys(newProps).forEach((k) => this.child.setters[k](newProps[k]));
    }

    update() {

    }

    template() {

    }

}

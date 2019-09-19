import componentType from '~/helpers/controller/init-mixin';
// Several utility functions, including scrollTo
// import $ from '~/helpers/$';
import {description as template} from './a-component-template.html';
import css from './a-component-template.css';
// Global-replace a-component-template with the file name of your component
// Replace AComponentTemplate with the object name of your component

const spec = {
    template,
    css,
    // For specifying the tag (default div) and classes of the container element
    view: {
        classes: ['a-component-template']
    },
    model() {
        return {
            message: this.message
        };
    }
};

// Default "init" takes an object whose members it will copy to "this"
// This example expects to be called like
// new AComponentTemplate({
//     message: someVariable
// })
export default class AComponentTemplate extends componentType(spec) {
}

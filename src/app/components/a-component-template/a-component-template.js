import {pageWrapper} from '~/controllers/jsx-wrapper';
import Child from './a-component-template.jsx';

/**
 * You do not need a separate JS file to wrap a JSX component
 * Within the parent component, simply create an instance of
 * WrappedJsx and attach it normally.
 */

// const form = new WrappedJsx(Child, {model: formModel});
//
// this.regions.form.attach(form);

export default pageWrapper(Child);

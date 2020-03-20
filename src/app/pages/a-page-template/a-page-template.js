import {pageWrapper} from '~/controllers/jsx-wrapper';
import Page from './a-page-template.jsx';

const view = {
    classes: ['a-page-template', 'page'],
    tag: 'main' // if the HTML doesn't contain a main tag
};

export default pageWrapper(Page, view);

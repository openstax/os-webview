import {pageWrapper} from '~/controllers/jsx-wrapper';
import Page from './footer-page.jsx';

const view = {
    classes: ['footer-page', 'page']
};

export default pageWrapper(Page, view);

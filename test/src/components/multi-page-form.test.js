import MultiPageForm from '~/components/multi-page-form/multi-page-form';
import {Controller} from 'superb.js';
import {clickElement, doKeyDown} from '../../test-utils';

class SuperSimpleForm extends Controller {

    init() {
        this.template = () => '';
    }

    onLoaded() {
        const i = document.createElement('input');

        this.el.appendChild(i);
    }

}

describe('MultiPageForm', () => {
    it('handles next and back', () => {
        const contents = [0, 1].map(i => new SuperSimpleForm());
        const p = new MultiPageForm(() => ({
            action: '//submit-somewhere',
            contents
        }), {});

        expect(p).toBeTruthy();
        expect(p.currentPage).toBe(0);
        const nextButton = p.el.querySelector('.next');

        clickElement(nextButton);
        expect(p.currentPage).toBe(1);
        const backButton = p.el.querySelector('.back');

        clickElement(backButton);
        expect(p.currentPage).toBe(0);
        const inputEl = p.el.querySelector('input');

        doKeyDown(inputEl, 'Enter');
        expect(p.currentPage).toBe(1);
    });
    it('handles submit', () => {
        const contents = [0, 1].map(i => new SuperSimpleForm());
        let submitted = false;
        const p = new MultiPageForm(() => ({
            contents
        }), {
            onSubmit() {
                submitted = true;
            }
        });
        // Jest does not do actual submit events; just test the associated method
        p.handleSubmit(new Event('submit'));
        expect(submitted).toBe(true);
        p.onClose();
    });
});

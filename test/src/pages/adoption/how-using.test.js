import HowUsing from '~/pages/adoption/how-using/how-using';
import instanceReady from '../../../helpers/instance-ready';
import {clickElement, doInput} from '../../../test-utils';

describe('HowUsing', () => {
    let props, instance, ready, usingInfo;

    beforeEach(() => {
        props = {
            selectedBooks: [],
            disable: false
        };
        ({instance, ready} = instanceReady(
            HowUsing,
            () => props,
            (newValue) => {
                usingInfo = newValue;
            }
        ));
    });

    function selectABook(instance) {
        props.selectedBooks = [{
            text: 'First Book',
            value: 'first-book'
        }];
        instance.update();
    }

    it('creates', () =>
        ready.then(() => {
            expect(instance).toBeTruthy();
            expect(instance.el.textContent).toBe('');
        })
    );
    it('updates based on selectedBooks', () =>
        ready.then(() => {
            selectABook(instance);
            expect(instance.el.textContent).toContain('How are you using First Book?');
        })
    );
    it('updates states based on radio buttons', () =>
        ready.then(() => {
            selectABook(instance);
            const radioEls = Array.from(instance.el.querySelectorAll('[type="radio"]'));

            expect(radioEls.length).toBe(2);
            clickElement(radioEls[0]);
            expect(usingInfo).toHaveProperty('checked');
            expect(usingInfo.checked).toHaveProperty('first-book');
            expect(usingInfo.checked['first-book']).toBe('Confirmed Adoption Won');
            clickElement(radioEls[1]);
            expect(usingInfo.checked['first-book']).toBe('Confirmed Will Recommend');
        })
    );
    it('updates student number', () =>
        ready.then(() => {
            selectABook(instance);
            const inputEl = instance.el.querySelector('[type="number"]');

            expect(inputEl).toBeTruthy();
            expect(instance.howMany).not.toHaveProperty('first-book');
            doInput(inputEl, '5');
            expect(instance.howMany).toHaveProperty('first-book', '5');
            expect(instance.validate()).toBeTruthy(); // no radio checked
            clickElement(instance.el.querySelector('[type="radio"]'));
            expect(instance.validate()).toBeNull();
        })
    );

});

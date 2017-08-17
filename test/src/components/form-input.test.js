import FormInput from '~/components/form-input/form-input';
import {doKeyDown} from '../../test-utils';

describe('FormInput', () => {
    const p = new FormInput({
        name: 'first_name',
        type: 'text',
        label: 'First name',
        required: true,
        suggestions: ['one', 'only', 'two'],
        validationMessage: () => 'validation message'
    });
    const inputEl = p.el.querySelector('input');

    it('creates', () => {
        expect(p).toBeTruthy();
    });

    it('sets and gets value', () => {
        p.setValue('on');
        expect(p.getValue()).toBe('on');
    });

    it('does matching', () => {
        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true
        });

        inputEl.dispatchEvent(inputEvent);
        expect(p.model.matches.length).toBe(2);
    });

    it('keyboard navigates matches', () => {
        doKeyDown(inputEl, 'ArrowDown');
        expect(p.model.activeSuggestion).toBe('one');
        doKeyDown(inputEl, 'ArrowDown');
        expect(p.model.activeSuggestion).toBe('only');
        doKeyDown(inputEl, 'ArrowUp');
        expect(p.model.activeSuggestion).toBe('one');
        doKeyDown(inputEl, 'Enter');
        expect(p.getValue()).toBe('one');
    });
});

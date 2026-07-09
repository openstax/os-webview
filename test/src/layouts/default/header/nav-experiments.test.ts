import {
    isNodeVisible,
    dropdownLabel,
    PRODUCTS_DROPDOWN_KEY
} from '~/layouts/default/header/menus/main-menu/nav-experiments';

describe('isNodeVisible', () => {
    it('is visible with no feature_flag', () => {
        expect(isNodeVisible({}, () => undefined)).toBe(true);
    });
    it('is visible iff the flag is truthy when flag_value is blank', () => {
        expect(isNodeVisible({feature_flag: 'nav-example-item'}, () => true)).toBe(true);
        expect(isNodeVisible({feature_flag: 'nav-example-item'}, () => undefined)).toBe(false);
    });
    it('matches flag_value as a string', () => {
        expect(isNodeVisible({feature_flag: 'f', flag_value: 'control'}, () => 'control')).toBe(true);
        expect(isNodeVisible({feature_flag: 'f', flag_value: 'control'}, () => 'tools')).toBe(false);
        expect(isNodeVisible({feature_flag: 'f', flag_value: 'false'}, () => false)).toBe(true);
    });
});

describe('dropdownLabel', () => {
    it('keeps the name for non-target dropdowns', () => {
        expect(dropdownLabel({key: 'subjects', name: 'Subjects'}, 'tools')).toBe('Subjects');
    });
    it('keeps the name for the control variant', () => {
        expect(dropdownLabel({key: PRODUCTS_DROPDOWN_KEY, name: 'Products'}, undefined)).toBe('Products');
    });
    it('swaps to Tools for the target key in the tools variant', () => {
        expect(dropdownLabel({key: PRODUCTS_DROPDOWN_KEY, name: 'Products'}, 'tools')).toBe('Tools');
    });
    it('falls back to an empty string when name is missing', () => {
        expect(dropdownLabel({key: 'subjects'}, undefined)).toBe('');
    });
});

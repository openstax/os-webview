import {
    hasFlaggedNodes,
    isNodeVisible,
    dropdownLabel,
    PRODUCTS_DROPDOWN_KEY,
    usesExperiments
} from '~/layouts/default/header/menus/main-menu/nav-experiments';

/* eslint-disable camelcase */

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
    it('does not match flag_value "undefined" while the flag is unresolved', () => {
        expect(isNodeVisible({feature_flag: 'f', flag_value: 'undefined'}, () => undefined)).toBe(false);
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

describe('usesExperiments', () => {
    it('is true for the Products dropdown even with no flagged node', () => {
        expect(usesExperiments([{name: 'Products', key: 'products-dropdown', menu: []}])).toBe(true);
        expect(usesExperiments([{name: 'More', menu: [{name: 'P', key: 'products-dropdown'}]}])).toBe(true);
    });
    it('is true for a flagged node and false otherwise', () => {
        expect(usesExperiments([{label: 'A', feature_flag: 'f'}])).toBe(true);
        expect(usesExperiments([{name: 'Learn', key: 'learn-dropdown', menu: [{label: 'A'}]}])).toBe(false);
        expect(usesExperiments({error: 'CMS unreachable'})).toBe(false);
    });
});

describe('hasFlaggedNodes', () => {
    it('is false for a non-array, an empty list and unflagged nodes', () => {
        expect(hasFlaggedNodes({error: 'CMS unreachable'})).toBe(false);
        expect(hasFlaggedNodes([])).toBe(false);
        expect(hasFlaggedNodes([{label: 'A'}, {name: 'B', menu: [{label: 'C'}]}])).toBe(false);
    });
    it('finds a flagged node at the top level or nested', () => {
        expect(hasFlaggedNodes([{label: 'A', feature_flag: 'f'}])).toBe(true);
        expect(hasFlaggedNodes([{name: 'B', menu: [{label: 'C', feature_flag: 'f'}]}])).toBe(true);
    });
});

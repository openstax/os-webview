import {hasFlaggedNodes, isNodeVisible} from '~/layouts/default/header/menus/main-menu/nav-experiments';

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

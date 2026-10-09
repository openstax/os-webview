import {isNodeVisible} from '~/layouts/default/header/menus/main-menu/nav-experiments';

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

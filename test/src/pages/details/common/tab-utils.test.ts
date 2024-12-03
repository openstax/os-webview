import { replaceSearchTerm } from '~/pages/details/common/tab-utils';

describe('tab-utils', () => {
    const labels = ['one', 'two'];
    const newValue = 'three';

    it('adds new param if no tabs in search params', () => {
        expect(replaceSearchTerm(labels, newValue)).toBe('?three');
    });
    it('replaces param if tab is in search params', () => {
        Reflect.defineProperty(window, 'location', {
            writable: true,
            value: { search: '?fluff&two' }
          });
          expect(replaceSearchTerm(labels, newValue)).toBe('?fluff&three');
    });
});

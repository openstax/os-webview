import { findSelectedTab, replaceSearchTerm } from '~/pages/details/common/tab-utils';

function setSearch(search: string) {
    Reflect.defineProperty(window, 'location', {
        writable: true,
        value: { search }
    });
}

describe('tab-utils', () => {
    const labels = ['one', 'two'];
    const newValue = 'three';

    it('adds new param if no tabs in search params', () => {
        setSearch('');
        expect(replaceSearchTerm(labels, newValue)).toBe('?three');
    });
    it('replaces param if tab is in search params', () => {
        setSearch('?fluff&two');
        expect(replaceSearchTerm(labels, newValue)).toBe('?fluff&three');
    });
    it('replaces param when the key case does not match a label', () => {
        setSearch('?TWO');
        expect(replaceSearchTerm(labels, newValue)).toBe('?three');
    });

    describe('findSelectedTab', () => {
        const tabLabels = ['Book details', 'Instructor resources', 'Student resources'];

        it('selects the matching tab', () => {
            setSearch('?Instructor%20resources');
            expect(findSelectedTab(tabLabels)).toBe('Instructor resources');
        });
        it('matches a lower-case deep link', () => {
            setSearch('?instructor%20resources');
            expect(findSelectedTab(tabLabels)).toBe('Instructor resources');
        });
        it('falls back to the first label when no key matches', () => {
            setSearch('?nothing');
            expect(findSelectedTab(tabLabels)).toBe('Book details');
        });
        it('replaces a lower-case key instead of keeping it', () => {
            setSearch('?instructor%20resources');
            expect(replaceSearchTerm(tabLabels, 'Student resources')).toBe('?Student%20resources');
        });
    });
});

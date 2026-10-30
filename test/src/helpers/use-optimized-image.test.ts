import useOptimizedImage, {maxDimIfNarrowerThan} from '~/helpers/use-optimized-image';

describe('useOptimizedImage', () => {
    it('short-circuits if src is empty', () => {
        expect(useOptimizedImage('')).toBe('');
    });
});

describe('maxDimIfNarrowerThan', () => {
    it('caps the dimension when the window is narrower', () => {
        expect(maxDimIfNarrowerThan(window.innerWidth + 1)).toBe(window.innerWidth + 1);
    });

    it('leaves it uncapped when the window is at least that wide', () => {
        expect(maxDimIfNarrowerThan(window.innerWidth)).toBeUndefined();
    });
});

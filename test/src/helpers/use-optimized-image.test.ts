import useOptimizedImage from '~/helpers/use-optimized-image';

describe('useOptimizedImage', () => {
    it('short-circuits if src is empty', () => {
        expect(useOptimizedImage('')).toBe('');
    });
});

import isSupported from '~/helpers/device';

describe('Helpers($)', () => {
    it('checks browser', () => {
        expect(isSupported()).toBe(false);
    });
});

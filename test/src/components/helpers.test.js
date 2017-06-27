import $ from '~/helpers/$';

describe('Helpers($)', () => {
    it('checks browser', () => {
        expect($.isSupported()).toBe(false);
    });
});

import Share from '~/components/share/share';

describe('Share', () => {
    const p = new Share('some_url', 'some_message');

    it('creates', () => {
        expect(p).toBeTruthy();
    });
});

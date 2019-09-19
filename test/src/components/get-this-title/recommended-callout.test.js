import addCallout from '~/components/get-this-title/recommended-callout/recommended-callout';

describe('recommended-callout', () => {
    const container = document.createElement('div');
    const getTitle = (callout) => {
        const title = callout.el.querySelector('.callout-title');

        expect(title).toBeTruthy();
        return title.textContent;
    };
    const getBlurbEl = (callout) => callout.el.querySelector('.callout-blurb');

    it('defaults to "Recommended"', () => {
        const callout = addCallout(container);

        expect(callout).toBeTruthy();
        expect(getTitle(callout)).toBe('Recommended');
    });
    it('displays custom title', () => {
        const callout = addCallout(container, 'Custom title');

        expect(getTitle(callout)).toBe('Custom title');
        const blurbEl = getBlurbEl(callout);

        expect(blurbEl).toBeNull();
    });
    it('displays custom blurb', () => {
        const blurbHtml = '<b>some text</b>';
        const callout = addCallout(container, null, blurbHtml);
        const blurbEl = getBlurbEl(callout);

        expect(blurbEl).toBeTruthy();
        expect(blurbEl.innerHTML).toBe(blurbHtml);
    })
});

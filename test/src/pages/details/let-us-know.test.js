import WrappedJsx from '~/controllers/jsx-wrapper';
import LetUsKnow from '~/pages/details/let-us-know/let-us-know.jsx';

const englishTitle = 'Some book';
const polishTitle = 'Fizyka dla szkół wyższych. Tom 1';
describe('details/Let Us Know section', () => {
    it('handles English title', () => {
        const p = new WrappedJsx(LetUsKnow, {
            title: englishTitle
        });

        expect(p).toBeTruthy();
        const linkText = p.el.querySelector('a.link').textContent;

        expect(linkText).toBe('Using this book? Let us know.')
    });
    it('handles Polish title', () => {
        const p = new WrappedJsx(LetUsKnow, {
            title: polishTitle
        });

        expect(p).toBeTruthy();
        const linkText = p.el.querySelector('a.link').textContent;

        expect(linkText).toBe('Korzystasz z tej książki? Daj nam znać.');
    });
});

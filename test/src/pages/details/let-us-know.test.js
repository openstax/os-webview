import LetUsKnow from '~/pages/details/common/let-us-know/let-us-know';
import {makeMountRender} from '../../../helpers/jsx-test-utils.jsx';

const englishTitle = 'Some book';
const polishTitle = 'Fizyka dla szkół wyższych. Tom 1';

describe('details/Let Us Know section', () => {
    it('handles English title', () => {
        const p = makeMountRender(LetUsKnow, {
            title: englishTitle
        })();

        expect(p).toBeTruthy();
        const linkText = p.find('a.link').text();

        expect(linkText).toBe('Using this book? Let us know.')
    });
    it('handles Polish title', () => {
        const p = makeMountRender(LetUsKnow, {
            title: polishTitle
        })();

        expect(p).toBeTruthy();
        const linkText = p.find('a.link').text();

        expect(linkText).toBe('Korzystasz z tej książki? Daj nam znać.');
    });
});

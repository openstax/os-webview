import BookSelector from '~/components/book-selector/book-selector';
import instanceReady from '../../helpers/instance-ready';

describe('BookSelector', () => {
    const {instance:p, ready} = instanceReady(BookSelector, {
        prompt: 'Which textbook(s) are you currently using?',
        required: true,
        preselectedTitle: 'College Physics'
    });

    it ('lists the books', () =>
        ready.then(() => {
            const labels = Array.from(p.el.querySelectorAll('label:not(.field-label)'));

            expect(labels.length).toBe(32);
        })
    );
});

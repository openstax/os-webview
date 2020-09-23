import {makeMountRender} from '../../helpers/jsx-test-utils.jsx';
import BookSelector from '~/components/book-selector/book-selector';
import cmsFetch from '~/models/cmsFetch';

describe('BookSelector', () => {
    let wrapper;

    beforeEach((done) => {
        const props = {
            prompt: 'Which textbook(s) are you currently using?',
            required: true,
            preselectedTitle: 'College Physics',
            selectedBooks: [],
            toggleBook(book) {
                console.log('Toggled', book);
            }
        };
        wrapper = makeMountRender(BookSelector, props)();
        setTimeout(() => {
            wrapper.update();
            done();
        }, 10);
    });

    it ('lists the books', () => {
        const checkableItems = wrapper.find('[aria-checked]');

        expect(checkableItems).toHaveLength(24);
    });
});

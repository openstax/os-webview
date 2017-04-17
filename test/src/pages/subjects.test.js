import 'babel-polyfill';
import "~/../../test/system.src";
import "~/main";
import settings from 'settings';
import Subjects from '~/pages/subjects/subjects';
import BookViewer from '~/pages/subjects/book-viewer/book-viewer';
import books from '../data/books';

describe('Subjects', () => {
    it ('can instantiate page', () => {
        const p = new Subjects();
    });
    test('has two classes', () => {
        const p = new Subjects();

        expect(p.el.classList.length).toBe(2);
    });
});

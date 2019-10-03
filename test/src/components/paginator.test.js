import Paginator from '~/components/paginator/paginator';
import {clickElement} from '../../test-utils';

const RESULTS_PER_PAGE = 10;
const pageCount = (articleCount) => Math.ceil(articleCount / RESULTS_PER_PAGE);
const props = (articleCount, currentPage=1) => ({
    searchTerm: 'open',
    resultRange: 'who cares',
    totalResults: articleCount,
    pages: pageCount(articleCount),
    currentPage
});

describe('paginator', () => {
    it('creates', () => {
        const p = new Paginator(props(80));
        expect(p).toBeTruthy();
        const barEl = p.el.querySelector('.button-bar');

        expect(barEl).toBeTruthy();
    });
    it('creates without the button-bar for fewer than 10', () => {
        const p = new Paginator(props(9));
        const barEl = p.el.querySelector('.button-bar');

        expect(barEl).toBeFalsy();
    });
    it('creates with up to five buttons, current button disabled', () => {
        const p = new Paginator(props(30, 2));
        const buttons = Array.from(p.el.querySelectorAll('button'))
            .filter((b) => !(/[a-z]/).test(b.textContent));
        const disabledButton = buttons.find((b) => b.disabled);

        expect(buttons.length).toBe(3);
        expect(disabledButton.textContent).toBe('2');
        expect(disabledButton.getAttribute('aria-selected')).toBe('true');
    });
    it('puts ellipsis buttons in for more than 5 pages', () => {
        const p = new Paginator(props(80, 4));
        const buttons = Array.from(p.el.querySelectorAll('button'))
            .filter((b) => !(/[a-z]/).test(b.textContent));
        expect(buttons.map(b => b.textContent).join(',')).toBe('1,…,4,…,8');
        p.emit('update-props', {currentPage: 7});
        expect(buttons.map(b => b.textContent).join(',')).toBe('1,…,6,7,8');
    });
    it('emits change events', () => {
        const p = new Paginator(props(80, 4));
        const selectedButton = () => p.el.querySelector('[aria-selected="true"]');
        expect(selectedButton().textContent).toBe('4');
        const prev = p.el.querySelector('button');
        expect(prev.textContent).toBe('Previous');
        p.on('change', (newPage) => {
            p.emit('update-props', {currentPage:newPage});
        });
        clickElement(prev);
        expect(selectedButton().textContent).toBe('3');
    });
});

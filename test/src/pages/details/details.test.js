import '../../../helpers/fetch-mocker';
import Details from '~/pages/details/details';
import instanceReady from '../../../helpers/instance-ready';
import {clickElement} from '../../../test-utils';

let pathname = '/details/no-such-book';
let ready;
let p;

beforeEach(function () {
    window.history.pushState({}, 'details', pathname);
    window.location.assign = jest.fn();
    ({instance:p, ready} = instanceReady(Details));
});

const englishTabs = ['Book details', 'Instructor resources', 'Student resources'];

describe('Book Details page', () => {

    it('404s on invalid title', () =>
        ready.then(() => {
            expect(window.location.assign).toBeCalledWith('/_404');
        })
    );

    it('[set biology title]', () => {
        pathname = '/details/biology-2e';
    });
    it('creates', () =>
        ready.then(() => {
            expect(p).toBeTruthy();
            expect(p.slug).toBe('books/biology-2e');
        })
    );
    it('has the expected tabs', () =>
        ready.then(() => {
            const tabs = Array.from(p.el.querySelectorAll('.tab-group > .tab'));
            const isActive = (el) => el.getAttribute('aria-current') === 'page';

            englishTabs.forEach((label) => {
                expect(tabs.find((el) => el.textContent === label)).toBeTruthy();
            });

            expect(isActive(tabs[1])).toBeFalsy();
            clickElement(tabs[1]);
            expect(isActive(tabs[1])).toBeTruthy();
        })
    );
    it('has expected accordion groups in mobile', () =>
        ready.then(() => {
            const expectedLabels = [
                'Book details',
                'Table of contents',
                'Instructor resources',
                'Student resources',
                'Report errata'
            ];
            const accordionItems = Array.from(p.el.querySelectorAll('.accordion-group .accordion-item .label'));

            expect(accordionItems.length).toBe(expectedLabels.length);
            expectedLabels.forEach((label, i) => expect(accordionItems[i].textContent).toBe(label));
        })
    );
    it ('[set Polish title]', () => {
        pathname = '/details/fizyka-dla-szkół-wyższych-tom-1'
    });

    it ('creates polish', () =>
        ready.then(() => {
            const tabs = Array.from(p.el.querySelectorAll('.tab-group > .tab'));

            return ready.then(() => {
                expect(p).toBeTruthy();
                expect(decodeURIComponent(p.slug)).toBe('books/fizyka-dla-szkół-wyższych-tom-1');
                ['Book details', 'Instructor resources', 'Student resources'].forEach((label) => {
                    expect(tabs.find((el) => el.textContent === label)).toBeFalsy();
                });
            })
        })
    );
    it ('has no English tabs for Polish book', () =>
        ready.then(() => {
            const tabs = Array.from(p.el.querySelectorAll('.tab-group > .tab'));

            return ready.then(() => {
                expect(decodeURIComponent(p.slug)).toBe('books/fizyka-dla-szkół-wyższych-tom-1');
                englishTabs.forEach((label) => {
                    expect(tabs.find((el) => el.textContent === label)).toBeFalsy();
                });
            })
        })
    );
});

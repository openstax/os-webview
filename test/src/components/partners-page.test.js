import '../../helpers/fetch-mocker';
import scrollPromise from '../../helpers/scrollTo-mock';
import Partners from '~/pages/partners/partners';
import CategorySelector from '~/components/category-selector/category-selector';
import {clickElement} from '../../test-utils';
import instanceReady from '../../helpers/instance-ready';

describe('Partners Page', () => {
    beforeEach(function () {
        window.history.replaceState({
            length: 3,
            scrollRestoration: 'manual',
            state: {
                filter: 'view-all',
                path: '/partners',
                x: 0,
                y: 0
            }
        }, 'MOCK');
    });

    const {instance:p, ready} = instanceReady(Partners);
    const allReady = Promise.all([ready, CategorySelector.loaded]);

    it('creates', () =>
        allReady.then(() => {
            expect(p).toBeTruthy();

            const iconViewer = p.partnerViewer.iconViewer;
            const categories = CategorySelector.categories;
            const currentCategory = p.categoryFromPath();
            const logoCount = iconViewer.el.querySelectorAll('.logo').length;
            const blurbsCount = Array.from(p.partnerViewer.blurbViewer.el.querySelectorAll('.text')).length;

            expect(iconViewer).toBeTruthy();
            expect(p.categoryFromPath()).toBe('view-all');
            expect(logoCount).toBe(39);
            expect(blurbsCount).toBe(logoCount);
        })
    );
    const expectedNumbers = {
            'view-all': 39,
            math: 18,
            science: 26,
            humanities: 11,
            'social-sciences': 19,
            business: 0,
            ap: 6
    };
    it('selects each category', () =>
        allReady.then(() => {
            const buttons = Array.from(p.el.querySelectorAll('.filter-button'));
            const iconViewer = p.partnerViewer.iconViewer;
            const blurbViewer = p.partnerViewer.blurbViewer;
            const testButtonClick = (b) =>
                new Promise((resolve) => {
                    p.categorySelector.on('change', resolve, 'once');
                    history.state.filter = b.getAttribute('data-value');
                    clickElement(b);
                }).then((b) => {
                    const logoCount = Array.from(iconViewer.el.querySelectorAll('.logo')).length;
                    const pressedButtonValue = p.el.querySelector('.filter-button[aria-pressed="true"]')
                        .getAttribute('data-value');

                    expect(pressedButtonValue).toBe(b);
                    expect(logoCount).toBe(expectedNumbers[b]);
                });
            const promiseSequence = buttons.reduce(
                (p, button) => p.then(() => testButtonClick(button)),
                Promise.resolve()
            );

            expect(buttons.length).toBe(7);
            return promiseSequence;
        })
    );
    it('has corresponding logos and paragraphs', () =>
        allReady.then(() => {
            const humanitiesButton = p.el.querySelector('.filter-button[data-value="humanities"]');

            return new Promise((resolve) => {
                p.categorySelector.on('change', resolve, 'once');
                clickElement(humanitiesButton);
            }).then((b) => {
                const logos = Array.from(p.el.querySelectorAll('a.logo-text'));

                expect(humanitiesButton).toBeTruthy();
                expect(logos.length).toBe(11);
                logos.forEach((t) => {
                    const href = t.getAttribute('href');
                    const targetParagraph = p.el.querySelector(href);

                    expect(targetParagraph).toBeTruthy();
                });
            });
        })
    );
    it('scrolls to paragraph', () =>
        allReady.then(() => {
            const logo = p.el.querySelector('a.logo-text');
            const blurbs = Array.from(p.partnerViewer.blurbViewer.el.querySelectorAll('.text'));

            clickElement(logo);
            return scrollPromise.then((el) => {
                expect(el.id).toBe(logo.getAttribute('href').substr(1));
            });
        })
    );
});

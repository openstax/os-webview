import stickyNote from '~/components/shell/sticky-note/sticky-note';

jest.mock('~/components/shell/header/header');
jest.mock('~/router');

const data1 = {
content: "Help us make more free high-quality textbooks!",
emergency_content: "Our errata submission tool is undergoing upgrades, and you will not be able to submit errata from March 31 to April 5. Urgent requests can be sent to support@openstax.org.",
show: true,
emergency_expires: "2017-04-04T03:00:00Z",
expires: "2017-09-29T16:16:00Z"
};



describe('stickyNote', () => {
    it('creates', () => {
        expect(stickyNote).toBeTruthy();
    });
    it('displays', () => {
        stickyNote.pageData = data1;
        stickyNote.onDataLoaded();
        expect(stickyNote.el.querySelector('[data-amount="50"]')).toBeTruthy();
    });
});

import trackLink from '~/pages/details/common/track-link';
import type {TrackedMouseEvent} from '~/components/shell/router-helpers/use-link-handler';

jest.mock('~/models/usermodel', () => ({
    __esModule: true,
    default: {
        load: () =>
            Promise.resolve({
                accounts_id: 12345, // eslint-disable-line camelcase
                uuid: 'user-uuid-1',
                salesforce_contact_id: 'contact-1' // eslint-disable-line camelcase
            })
    }
}));

function clickOn(attributes: Record<string, string>) {
    const link = document.createElement('a');

    link.setAttribute('href', '/a-file.pdf');
    Object.entries(attributes).forEach(([name, value]) => link.setAttribute(name, value));
    document.body.append(link);

    const event = {target: link, defaultPrevented: false} as unknown as TrackedMouseEvent;

    trackLink(event, '42');
    link.remove();

    return event;
}

describe('trackLink', () => {
    // The user request has to have settled before trackLink will report at all.
    beforeAll(() => new Promise((resolve) => setTimeout(resolve, 0)));

    it('reports the page the download came from', () => {
        window.history.pushState({}, '', '/k12/subjects/math');

        expect(clickOn({'data-track': 'Answer Guide'}).trackingInfo?.source).toBe(
            '/k12/subjects/math'
        );
    });

    it('reports a flex-page path as itself, not as a generic page type', () => {
        window.history.pushState({}, '', '/dual-credit');

        expect(clickOn({'data-track': 'Answer Guide'}).trackingInfo?.source).toBe(
            '/dual-credit'
        );
    });

    it('leaves the query string out of the path', () => {
        window.history.pushState({}, '', '/details/books/college-algebra?Instructor resources');

        expect(clickOn({'data-track': 'Answer Guide'}).trackingInfo?.source).toBe(
            '/details/books/college-algebra'
        );
    });

    it('files a resource under resource_name and a book format under book_format', () => {
        window.history.pushState({}, '', '/details/books/college-algebra');

        const resource = clickOn({'data-track': 'Answer Guide', 'data-variant': 'resource'});
        const format = clickOn({'data-track': 'PDF'});

        expect(resource.trackingInfo?.resource_name).toBe('Answer Guide');
        expect(format.trackingInfo?.book_format).toBe('PDF');
    });

    it('reports nothing for a link with no data-track', () => {
        expect(clickOn({}).trackingInfo).toBeUndefined();
    });
});

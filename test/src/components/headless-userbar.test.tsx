import React from 'react';
import {render, waitFor} from '@testing-library/preact';
import HeadlessUserbar from '~/components/headless-userbar/headless-userbar';

function setLocation(pathAndSearch: string) {
    window.history.replaceState({}, '', pathAndSearch);
}

describe('HeadlessUserbar', () => {
    beforeEach(() => {
        setLocation('/');
        (global.fetch as jest.Mock).mockClear();
    });

    it('fetches and injects the userbar when previewing a draft', async () => {
        setLocation('/some-page/?preview=auto');
        (global.fetch as jest.Mock).mockImplementation(() =>
            Promise.resolve({
                ok: true,
                text: () =>
                    Promise.resolve('<wagtail-userbar></wagtail-userbar>')
            })
        );

        const {container} = render(<HeadlessUserbar />);

        await waitFor(() =>
            expect(container.querySelector('wagtail-userbar')).not.toBeNull()
        );

        const fetchUrl = (global.fetch as jest.Mock).mock.calls[0][0];

        // TEMP: riding the salesforce/reviews/* CloudFront behavior until the
        // dedicated userbar behavior is deployed (see headless-userbar.tsx).
        expect(fetchUrl).toMatch('/apps/cms/api/salesforce/reviews/userbar/');

        const scriptSrcs = Array.from(
            container.querySelectorAll('script')
        ).map((s) => s.getAttribute('src'));

        expect(
            scriptSrcs.some((s) => s?.includes('wagtailadmin/js/vendor.js'))
        ).toBe(true);
        expect(
            scriptSrcs.some((s) => s?.includes('wagtailadmin/js/userbar.js'))
        ).toBe(true);
    });

    it('does nothing when not previewing', () => {
        setLocation('/some-page/');

        const {container} = render(<HeadlessUserbar />);

        expect(global.fetch as jest.Mock).not.toHaveBeenCalled();
        expect(container.querySelector('wagtail-userbar')).toBeNull();
    });
});

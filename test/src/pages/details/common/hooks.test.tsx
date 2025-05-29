import React from 'react';
import {render, waitFor, screen} from '@testing-library/preact';
import {
    useTableOfContents,
    usePartnerFeatures
} from '~/pages/details/common/hooks';
import * as UDC from '~/pages/details/context';

const mockTocHtml = jest.fn();

jest.mock('~/models/table-of-contents-html', () => () => mockTocHtml());

describe('details/common/hooks', () => {
    const originalWarn = console.warn;

    it('(useTableOfContents) handles rejection', async () => {
        jest.spyOn(UDC, 'default').mockReturnValue(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {webviewRexLink: 'https://openstax.org/books/thing'} as any
        );
        console.warn = jest.fn();

        mockTocHtml.mockReturnValue(Promise.reject(new Error('oh no')));

        function Component() {
            const tocHtml = useTableOfContents();

            return <div>{tocHtml}</div>;
        }

        render(<Component />);
        await waitFor(() =>
            expect(console.warn).toHaveBeenCalledWith(
                expect.stringContaining('Failed to generate table')
            )
        );
        console.warn = originalWarn;
    });
    it('(useTableOfContents) handles empty webviewLink', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jest.spyOn(UDC, 'default').mockReturnValue({webviewRexLink: ''} as any);

        function Component() {
            const tocHtml = useTableOfContents();

            return <div>{tocHtml}</div>;
        }

        render(<Component />);
        expect(document.body.textContent).toBe('');
    });
    it('(usePartnerFeatures) sets its values', async () => {
        function Component() {
            const [blurbs, includePartners] = usePartnerFeatures('Economics');
            const idList = (blurbs as {id: number}[]).map((b) => b.id).sort().join(',');

            return <div>{includePartners ? idList : 'nothing found'}</div>;
        }

        render(<Component />);

        await screen.findByText('1938,1951,1955,1962,1984,2109');
    });
    it('(usePartnerFeatures) handles no matches found', async () => {
        function Component() {
            const [_blurbs, includePartners] = usePartnerFeatures('Whoops');

            return <div>{includePartners ? 'found something!' : 'nothing found'}</div>;
        }

        render(<Component />);

        // not a great test; this happens immediately
        await screen.findByText('nothing found');
    });
});

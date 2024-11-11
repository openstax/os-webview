import React from 'react';
import {render, waitFor, screen} from '@testing-library/preact';
import {
    useTableOfContents,
    usePartnerFeatures
} from '~/pages/details/common/hooks';

const mockTocHtml = jest.fn();

jest.mock('~/models/table-of-contents-html', () => () => mockTocHtml());

describe('details/common/hooks', () => {
    const originalWarn = console.warn;

    it('(useTableOfContents) handles rejection', async () => {
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
    it('(usePartnerFeatures) sets its values', async () => {
        function Component() {
            const [blurbs, includePartners] = usePartnerFeatures('Economics');
            const idList = (blurbs as {id: number}[]).map((b) => b.id).sort().join(',');

            return <div>{includePartners ? idList : 'nothing found'}</div>;
        }

        render(<Component />);

        await screen.findByText('28,29,31,32,39,41,42,48,55,56,61,7,70,79,9');
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

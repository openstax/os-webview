import React from 'react';
import {render, screen} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import GeneralPageLoader from '~/pages/general/general';
import * as DH from '~/helpers/use-document-head';
import * as PDU from '~/helpers/page-data-utils';


jest.spyOn(DH, 'default').mockReturnValue();

describe('general page', () => {
    it(
        'renders kinetic page',
        async () => {
            render(
                <MemoryRouter initialEntries={['/general/kinetic']}>
                    <GeneralPageLoader />
                </MemoryRouter>
            );
            await screen.findByText(/Example activities/i);
        }
    );
    it('renders kinetic page (trailing slash)', async () => {
        document.title = 'OpenStax Test';
        render(
            <MemoryRouter initialEntries={['/general/kinetic/']}>
                <GeneralPageLoader />
            </MemoryRouter>
        );
        await screen.findByText(/Example activities/i);
        expect(document.head.querySelector('link')?.getAttribute('href')).toBe('https://openstax.org/kinetic');
    });
    it('handles page load error', async () => {
        const mockUseTextFromSlug = jest.spyOn(PDU, 'useTextFromSlug').mockReturnValueOnce({
            head: {},
            text: new Error('whoops')
        });

        render(
            <MemoryRouter initialEntries={['/general/whoops/']}>
                <GeneralPageLoader />
            </MemoryRouter>
        );

        const h = screen.getByRole('heading', {level: 1});

        expect(h.textContent).toBe('Error: {}');
        mockUseTextFromSlug.mockRestore();
    });
});

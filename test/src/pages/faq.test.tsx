import React from 'react';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import {render, screen} from '@testing-library/preact';
import FAQLoader from '~/pages/faq/faq';

describe('FAQ page', () => {
    const mainMockFetch = global.fetch;

    global.fetch = jest.fn().mockImplementation((url: string) => {
        if (url.includes('sample')) {
            return Promise.resolve({
                json: () => ({
                    title: 'the-title',
                    meta: {download_url: 'file-path'} // eslint-disable-line camelcase
                })
            });
        }
        if (url.endsWith('this-one-fails')) {
            return Promise.reject('expected fail');
        }
        return mainMockFetch(url);
    });
    it('Renders', async () => {
        render(
            <ShellContextProvider>
                <MemoryRouter>
                    <FAQLoader />
                </MemoryRouter>
            </ShellContextProvider>
        );
        expect(await screen.findAllByRole('group')).toHaveLength(14);
        await screen.findByRole('link', {name: 'Download'});
    });
});

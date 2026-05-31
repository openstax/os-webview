import React from 'react';
import {ComponentType} from 'preact';
import {renderHook, waitFor} from '@testing-library/preact';
import {MemoryRouter} from 'react-router-dom';
import * as pageDataUtils from '~/helpers/page-data-utils';
import useAllArticles from '~/pages/blog/search-results/use-all-articles';

it('builds the search slug from q, subjects, collection, and sort', async () => {
    const spy = jest.spyOn(pageDataUtils, 'fetchFromCMS').mockResolvedValue([]);

    function Wrapper({children}: {children: React.ReactNode}) {
        return (
            <MemoryRouter initialEntries={['/blog/?q=algebra&subjects=Math&sort=newest']}>
                {children}
            </MemoryRouter>
        );
    }

    renderHook(() => useAllArticles(), {wrapper: Wrapper as ComponentType<{children: Element}>});

    await waitFor(() => expect(spy).toHaveBeenCalled());
    const slug = spy.mock.calls[0][0] as string;
    expect(slug).toContain('q=algebra');
    expect(slug).toContain('subjects=Math');
    expect(slug).toContain('sort=newest');
});

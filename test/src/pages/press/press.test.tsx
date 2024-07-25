import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import {MemoryRouter} from 'react-router-dom';
import Press from '~/pages/press/press';

const mockPathname = jest.fn();
const mockNavigate = jest.fn();
const mockCarousel = ({children}: React.PropsWithChildren<object>) => <div>{children}</div>;

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        get pathname() {return mockPathname();}
    }),
    Navigate: () => mockNavigate()
}));
jest.mock('~/components/carousel/carousel', () => mockCarousel);

describe('press page', () => {
    it('renders main press page', async () => {
        mockPathname.mockReturnValueOnce('').mockReturnValueOnce('');
        render(
            <MemoryRouter initialEntries={['/']}>
                <Press />
            </MemoryRouter>
        );
        await screen.findByText('In the press');
        await waitFor(() => expect(document.title).toMatch('- OpenStax'));
        document.title = '';
    });
    it('renders press article page', async () => {
        render(
            <MemoryRouter initialEntries={['/article-slug']}>
                <Press />
            </MemoryRouter>
        );
        expect(await screen.findAllByRole('heading')).toHaveLength(2);
    });
    it('tries to Navigate on slash', async () => {
        mockPathname.mockReturnValueOnce('/').mockReturnValueOnce('');
        mockNavigate.mockReturnValue(<div>This is navigate</div>);
        render(
            <MemoryRouter initialEntries={['/']}>
                <Press />
            </MemoryRouter>
        );
        await screen.findByText('This is navigate');
    });
});

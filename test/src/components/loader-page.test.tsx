import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import LoaderPage, { LoadedPage } from '~/components/jsx-helpers/loader-page';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import * as DH from '~/helpers/use-document-head';
import * as PageDataUtils from '~/helpers/page-data-utils';
import { LayoutContextProvider } from '~/contexts/layout';

jest.spyOn(DH, 'default').mockReturnValue(undefined);

const fetchFromCMS = jest.spyOn(PageDataUtils, 'fetchFromCMS');

function renderPage(ui: React.JSX.Element) {
    return render(
        <MemoryRouter initialEntries={['/testpage']}>
            <LayoutContextProvider>{ui}</LayoutContextProvider>
        </MemoryRouter>
    );
}

describe('loader-page', () => {
    beforeEach(() => {
        fetchFromCMS.mockReset();
    });

    it('sets document metadata when requested', async () => {
        const data = {title: 'A title'};
        const Child = () => <div>the page</div>;
        const setPageTitleAndDescriptionFromBookData = jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData');

        renderPage(<LoadedPage data={data} Child={Child} props={{}} doDocumentSetup />);

        await screen.findByText('the page');
        expect(setPageTitleAndDescriptionFromBookData).toHaveBeenCalledWith(data);
    });

    // The rest of the code is exercised in other tests.
    it('loads 404 on data error', async () => {
        const data = {
            error: true
        };
        const Child = () => <div>This should not render</div>;

        renderPage(<LoadedPage data={data} Child={Child} props={{}} />);

        await screen.findByText('Uh-oh, no page here');
    });

    // A rejected CMS fetch used to leave the loading placeholder up forever.
    it('offers a retry when the page data never arrives', async () => {
        const Child = () => <div>the page</div>;

        fetchFromCMS.mockRejectedValue(new Error('Failed to fetch sticky/'));
        renderPage(<LoaderPage slug="pages/whatever" Child={Child} />);

        await screen.findByText("This page didn't load");

        fetchFromCMS.mockResolvedValue({title: 'a_page'});
        await userEvent.click(screen.getByRole('button', {name: 'Try again'}));

        await screen.findByText('the page');
    });

    it('clears a failed attempt when the slug changes', async () => {
        const Child = ({data}: {data: {title: string}}) => <div>{data.title}</div>;

        fetchFromCMS.mockRejectedValueOnce(new Error('Failed to fetch first/'));
        const {rerender} = renderPage(<LoaderPage slug="pages/first" Child={Child} />);

        await screen.findByText("This page didn't load");

        fetchFromCMS.mockResolvedValueOnce({title: 'second page'});
        rerender(
            <MemoryRouter initialEntries={['/testpage']}>
                <LayoutContextProvider>
                    <LoaderPage slug="pages/second" Child={Child} />
                </LayoutContextProvider>
            </MemoryRouter>
        );

        await screen.findByText('second page');
    });
});

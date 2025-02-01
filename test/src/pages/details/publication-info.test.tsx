import React from 'react';
import {render, screen, waitFor} from '@testing-library/preact';
import PublicationInfo from '~/pages/details/common/publication-info';
import ShellContextProvider from '../../../helpers/shell-context';
import bookData from '../../data/details-college-algebra';
import {camelCaseKeys, Json} from '~/helpers/page-data-utils';
import * as DC from '~/pages/details/context';
import * as UC from '~/contexts/user';

function WrappedPublicationInfo({additionalItems = {}, polish = false}) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockUseDetailsContext.mockReturnValue({...ccBookData, ...additionalItems} as any);

    return (
        <ShellContextProvider>
            <PublicationInfo url="/some/path" polish={polish} />
        </ShellContextProvider>
    );
}

const mockUseDetailsContext = jest.spyOn(DC, 'default');
const ccBookData = camelCaseKeys(bookData as Json) as object;
const mockRexRelease = jest.fn();

jest.mock('~/models/rex-release', () => ({
    __esModule: true,
    default: () => mockRexRelease()
}));

jest.spyOn(UC, 'UserContextProvider').mockImplementation(
    ({children}: any) => children // eslint-disable-line
);

describe('details/common/publication-info', () => {
    beforeEach(() => {
        mockRexRelease.mockReturnValue(
            Promise.resolve({
                webviewRexLink: 'http://path/to/book',
                contents: [],
                revised: '5 Nov 2024'
            })
        );
    });
    test('Shows publication dates', async () => {
        render(<WrappedPublicationInfo />);
        await screen.findByText('Publish Date:');
        screen.getByText('Color:');
        screen.getByText('Black and White:');
        expect(screen.queryAllByText('iBooks', {exact: false})).toHaveLength(0);
        screen.getByText('Web Version Last Updated:');
    });
    test('Shows no web pub date when it has no Rex link', async () => {
        const additionalItems = {
            webviewRexLink: ''
        };

        render(<WrappedPublicationInfo additionalItems={additionalItems} />);
        await expect(screen.findByText('Web Version Last Updated:')).rejects.toThrow();
    });
    test('Shows iBooks publication dates when present', async () => {
        const additionalItems = {
            ibookIsbn10: 'fakeISBN1',
            ibookVolume2Isbn10: 'fakeISBN2'
        };

        render(<WrappedPublicationInfo additionalItems={additionalItems} />);
        await screen.findByText('Publish Date:');
        expect(screen.queryAllByText('iBooks', {exact: false})).toHaveLength(2);
    });
    test('Shows PDF update info when present', async () => {
        const additionalItems = {
            lastUpdatedPdf: '10 July 2024'
        };

        render(<WrappedPublicationInfo additionalItems={additionalItems} />);
        await screen.findByText('PDF Version Last Updated:');
    });
    test('Shows sharealike license icon when license name includes "share"', async () => {
        const additionalItems = {
            licenseName: 'cc-share-alike',
            licenseText: 'Some text for the license'
        };

        render(<WrappedPublicationInfo additionalItems={additionalItems} />);
        expect((await screen.findByRole('img')).getAttribute('src')).toEqual(
            expect.stringContaining('by-nc-sa')
        );
        screen.getByText('Some text for the license');
    });
    test('Shows no license info when there is no license', async () => {
        const additionalItems = {
            licenseName: ''
        };

        render(<WrappedPublicationInfo additionalItems={additionalItems} />);
        await expect(screen.findByRole('img')).rejects.toThrow();
    });
    test('Warns when Rex fetch is rejected', async () => {
        mockRexRelease.mockReturnValue(Promise.reject('oops'));
        const originalWarn = console.warn;

        console.warn = jest.fn();
        render(<WrappedPublicationInfo />);
        await waitFor(() =>
            expect(console.warn).toHaveBeenCalledWith(
                'Error fetching Rex info:',
                'oops'
            )
        );
        console.warn = originalWarn;
    });
    test('Shows publication dates for Polish book', async () => {
        render(<WrappedPublicationInfo polish={true} />);
        await screen.findByText('Data publikacji:');
        screen.getByText('Wydrukowane:');
        screen.getByText('Wersja cyfrowa:');
    });
    test('Shows custom license text in Polish book', async () => {
        const additionalItems = {
            licenseName: 'cc-share-alike',
            licenseText: 'Some text for the license'
        };

        render(
            <WrappedPublicationInfo
                additionalItems={additionalItems}
                polish={true}
            />
        );
        expect(
            (await screen.findAllByRole('img'))[0].getAttribute('src')
        ).toEqual(expect.stringContaining('by-nc-sa'));
        screen.getByText('Some text for the license');
    });
    test('Polish shows no license info when there is no license', async () => {
        const additionalItems = {
            licenseName: ''
        };

        render(
            <WrappedPublicationInfo
                additionalItems={additionalItems}
                polish={true}
            />
        );
        await expect(screen.findByRole('img')).rejects.toThrow();
    });
    test('Polish ISBN skipped if 10 and 13 are empty', async () => {
        const additionalItems = {
            printIsbn10: '',
            printIsbn13: '',
            publishDate: '' // there is also a skip for this
        };

        render(
            <WrappedPublicationInfo
                additionalItems={additionalItems}
                polish={true}
            />
        );

        await expect(screen.findByText('Wydrukowane:')).rejects.toThrow();
    });
});

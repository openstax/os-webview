import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen, waitFor} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import BodyUnit, {UnitType} from '~/components/body-units/body-units';

// The PDF library is not jestable
const mockDocument = jest.fn();

type mockDocumentSignature = React.PropsWithChildren<{
    onLoadSuccess: ({numPages}: {numPages: number}) => void
}>;

jest.mock('react-pdf', () => ({
    Document: (...props: unknown[]) => mockDocument(...props),
    Page: jest.fn()
}));
jest.mock('react-pdf/dist/esm/Page/TextLayer.css', () => null);

describe('body-units', () => {
    const user = userEvent.setup();
    // Mock fullscreen property so we can test exiting fullscreen mode
    let mockFullscreenElement: Element | null;

    beforeEach(() => {
        jest.resetAllMocks();

        Reflect.defineProperty(document, 'fullscreenElement', {
            get: () => mockFullscreenElement,
            set: (value) => {mockFullscreenElement = value;}
        });
        mockFullscreenElement = null;
    });

    it('warns on unknown', () => {
        const saveWarn = console.warn;
        const whoopsUnit = {
            type: 'whoops',
            value: 'terrible mistake'
        } as unknown as UnitType;

        console.warn = jest.fn();

        render(<BodyUnit unit={whoopsUnit} />);
        expect(console.warn).toHaveBeenCalled();
        console.warn = saveWarn;
        screen.getByText('terrible mistake', {exact: false});
    });
    it('handles CTA', () => {
        const unit: UnitType = {
            id: 'meh',
            type: 'blog_cta',
            value: {
                alignment: 'left',
                heading: 'Heading',
                description: 'description text',
                buttonHref: '#',
                buttonText: 'click me'
            }
        };

        render(<BodyUnit unit={unit} />);
        screen.getByRole('link', {name: 'click me'});
    });
    it('handles pull-quote', () => {
        const unit: UnitType = {
            id: 'pq',
            type: 'pullquote',
            value: {
                quote: 'what it says',
                attribution: 'who said it'
            }
        };

        render(<BodyUnit unit={unit} />);
        screen.getByText('what it says', {exact: true});
    });
    it('handles document (pdf)', async () => {
        mockDocument.mockImplementation(
            ({onLoadSuccess, children}: mockDocumentSignature) => {
                onLoadSuccess({numPages: 3});

                return <div>{children}</div>;
            });
        const unit: UnitType = {
            id: 'pdf',
            type: 'document',
            value: {
                download_url: 'something'
            }
        };

        render(<BodyUnit unit={unit} />);
        await waitFor(() => expect(mockDocument).toHaveBeenCalled());
        await user.click(screen.getByLabelText('Next page'));
        const viewerDiv = document.querySelector('.pdf-container');

        // Where requestFullscreen is undefined
        await user.click(screen.getByRole('link', {name: 'Full screen'}));

        // Defining it
        const mockFS = jest.fn();
        const mockExitFS = jest.fn();

        mockFS.mockImplementation(() => {
            window.dispatchEvent(new Event('fullscreenchange'));
            return Promise.resolve();
        });
        mockExitFS.mockImplementation(() => {
            window.dispatchEvent(new Event('fullscreenchange'));
            return Promise.resolve();
        });
        expect(viewerDiv).toBeTruthy();
        (viewerDiv as HTMLElement).requestFullscreen = mockFS;
        await user.click(screen.getByRole('link', {name: 'Full screen'}));
        expect(mockFS).toHaveBeenCalled();

        mockFullscreenElement = viewerDiv;
        document.exitFullscreen = mockExitFS;
        await user.click(screen.getByRole('link', {name: 'Full screen'}));
        expect(mockExitFS).toHaveBeenCalled();
        await user.click(screen.getByLabelText('Previous page'));
    });
    it('handles fullscreen failure', async () => {
        process.env.API_ORIGIN = 'local testing';
        mockDocument.mockImplementation(
            ({onLoadSuccess, children}: mockDocumentSignature) => {
                onLoadSuccess({numPages: 3});

                return <div>{children}</div>;
            });
        const unit: UnitType = {
            id: 'pdf',
            type: 'document',
            value: {
                download_url: 'something'
            }
        };
        const saveInfo = console.info;
        const mockInfo = jest.fn();

        console.info = mockInfo;

        render(<BodyUnit unit={unit} />);
        await waitFor(() => expect(mockDocument).toHaveBeenCalled());
        await user.click(screen.getByLabelText('Next page'));
        const viewerDiv = document.querySelector('.pdf-container');

        expect(mockInfo).toHaveBeenCalledWith('*** USING TESTING PDF ***');
        // Where requestFullscreen is undefined
        await user.click(screen.getByRole('link', {name: 'Full screen'}));

        // Defining it
        const mockFS = jest.fn();
        const mockAlert = jest.fn();

        mockFS.mockImplementation(() => {
            return Promise.reject({name: 'whoops', message: 'fullscreen crashed'});
        });
        window.alert = mockAlert;
        expect(viewerDiv).toBeTruthy();
        (viewerDiv as HTMLElement).requestFullscreen = mockFS;
        await user.click(screen.getByRole('link', {name: 'Full screen'}));
        expect(mockFS).toHaveBeenCalled();
        expect(mockAlert).toHaveBeenCalled();
        console.info = saveInfo;
    });
});

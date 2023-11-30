import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import FindTranslation from '~/pages/subjects/new/specific/find-translation';
import {useNavigate} from 'react-router-dom';
import usePageData from '~/helpers/use-page-data';

function Component() {
    return (
        <ShellContextProvider>
            <FindTranslation />
        </ShellContextProvider>
    );
}

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    __esModule: true,
    useNavigate: jest.fn()
}));
jest.mock('~/helpers/use-page-data');
jest.useFakeTimers();

describe('translation-selector', () => {
    it('handles no page data', () => {
        const {container} = render(<Component />);

        expect(container.innerHTML).toBe('');
    });
    it('handles page with no translations', () => {
        (usePageData as jest.Mock).mockReturnValueOnce({
            translations: [[]]
        });
        render(<Component />);

        expect(usePageData).toHaveBeenCalled();
        expect(
            screen.getByText('Subject not found', {exact: false})
        ).toBeTruthy();
    });
    it('handles pageData with error', () => {
        (usePageData as jest.Mock).mockReturnValueOnce({
            error: 'whoops'
        });
        render(<Component />);

        expect(usePageData).toHaveBeenCalled();
        expect(
            screen.getByText('Subject not found', {exact: false})
        ).toBeTruthy();
    });
    it('handles page with en translations', () => {
        const navigate = jest.fn();

        (useNavigate as jest.Mock).mockReturnValue(navigate);
        (usePageData as jest.Mock).mockReturnValueOnce({
            translations: [[{locale: 'en', slug: 'something'}]]
        });

        const {container} = render(<Component />);

        jest.runAllTimers();

        expect(usePageData).toHaveBeenCalled();
        expect(navigate).toHaveBeenCalled();
        expect(container.innerHTML).toBe('');
    });
});

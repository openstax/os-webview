import React from 'react';
import {describe, expect, it} from '@jest/globals';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '~/../../test/helpers/shell-context';
import TranslationSelector from '~/pages/subjects/new/specific/translation-selector';
import {useNavigate} from 'react-router-dom';

function Component({
    translations = []
}: Partial<Parameters<typeof TranslationSelector>[0]>) {
    return (
        <ShellContextProvider>
            <TranslationSelector translations={translations} />
        </ShellContextProvider>
    );
}

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    __esModule: true,
    useNavigate: jest.fn()
}));

describe('translation-selector', () => {
    it('handles no translation case', () => {
        render(<Component />);
        expect(
            screen.queryAllByText('This page is available in', {exact: false})
        ).toHaveLength(0);
        expect(
            screen.getAllByText('We also have books in', {exact: false})
        ).toHaveLength(1);
    });
    it('handles one language', () => {
        const navigate = jest.fn();

        (useNavigate as jest.Mock).mockReturnValue(navigate);
        render(
            <Component translations={[{locale: 'en', slug: 'something'}]} />
        );
        expect(navigate).toHaveBeenCalled();
        expect(
            screen.getAllByText('This page is available in', {exact: false})
        ).toHaveLength(1);
    });
    it('handles no slug', () => {
        const navigate = jest.fn();

        (useNavigate as jest.Mock).mockReturnValue(navigate);
        render(<Component translations={[{locale: 'en', slug: ''}]} />);
        expect(navigate).not.toHaveBeenCalled();
        expect(
            screen.getAllByText('This page is available in', {exact: false})
        ).toHaveLength(1);
    });
});

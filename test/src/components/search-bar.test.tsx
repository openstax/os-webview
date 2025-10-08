import React from 'react';
import {describe, it, expect} from '@jest/globals';
import {render, screen, fireEvent} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import SearchBar from '~/components/search-bar/search-bar';

describe('search-bar', () => {
    const searchFor = jest.fn();
    let input: HTMLInputElement;

    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={['/selector?Calculus']}>
                <SearchBar searchFor={searchFor} amongWhat='things' />
            </MemoryRouter>
        );
        input = screen.getByRole('textbox');
        searchFor.mockReset();
    });


    it('handles search input and submits on enter', () => {
        fireEvent.input(input, {target: {value: 'education'}});

        fireEvent.keyDown(input, {
            key: 'Enter'
        });
        expect(searchFor).toBeCalled();
    });
    it('ignores non-Enter', () => {
        fireEvent.keyDown(input, {
            key: 'a'
        });
        expect(searchFor).not.toBeCalled();
    });
    it('handles clear button', () => {
        const clear = screen.getAllByRole('button').find((el) => el.getAttribute('aria-label') === 'clear search');

        fireEvent.input(input, {target: {value: 'education'}});
        expect(input.value).toBe('education');
        expect(clear).toBeTruthy();
        fireEvent.click(clear as HTMLButtonElement);
        expect(input.value).toBe('');
    });
});

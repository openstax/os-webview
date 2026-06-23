import React from 'react';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import SortToggle from '~/components/sort-toggle/sort-toggle';
import '@testing-library/jest-dom';

describe('components/sort-toggle', () => {
    const user = userEvent.setup();

    it('renders with relevance selected by default', () => {
        const setSort = jest.fn();

        render(
            <SortToggle
                sort="relevance"
                setSort={setSort}
                labelId="test-sort-label"
            />
        );

        const relevanceButton = screen.getByRole('radio', {name: 'Relevance'});
        const newestButton = screen.getByRole('radio', {name: 'Newest'});

        expect(relevanceButton).toHaveAttribute('aria-checked', 'true');
        expect(newestButton).toHaveAttribute('aria-checked', 'false');
        expect(relevanceButton).toHaveAttribute('tabIndex', '0');
        expect(newestButton).toHaveAttribute('tabIndex', '-1');
    });

    it('renders with newest selected', () => {
        const setSort = jest.fn();

        render(
            <SortToggle
                sort="newest"
                setSort={setSort}
                labelId="test-sort-label"
            />
        );

        const relevanceButton = screen.getByRole('radio', {name: 'Relevance'});
        const newestButton = screen.getByRole('radio', {name: 'Newest'});

        expect(relevanceButton).toHaveAttribute('aria-checked', 'false');
        expect(newestButton).toHaveAttribute('aria-checked', 'true');
        expect(relevanceButton).toHaveAttribute('tabIndex', '-1');
        expect(newestButton).toHaveAttribute('tabIndex', '0');
    });

    it('calls setSort with undefined when clicking relevance', async () => {
        const setSort = jest.fn();

        render(
            <SortToggle
                sort="newest"
                setSort={setSort}
                labelId="test-sort-label"
            />
        );

        const relevanceButton = screen.getByRole('radio', {name: 'Relevance'});

        await user.click(relevanceButton);
        expect(setSort).toHaveBeenCalledWith(undefined);
    });

    it('calls setSort with "newest" when clicking newest', async () => {
        const setSort = jest.fn();

        render(
            <SortToggle
                sort="relevance"
                setSort={setSort}
                labelId="test-sort-label"
            />
        );

        const newestButton = screen.getByRole('radio', {name: 'Newest'});

        await user.click(newestButton);
        expect(setSort).toHaveBeenCalledWith('newest');
    });

    it('navigates forward with ArrowRight key', async () => {
        const setSort = jest.fn();

        render(
            <SortToggle
                sort="relevance"
                setSort={setSort}
                labelId="test-sort-label"
            />
        );

        const relevanceButton = screen.getByRole('radio', {name: 'Relevance'});
        const newestButton = screen.getByRole('radio', {name: 'Newest'});

        relevanceButton.focus();
        await user.keyboard('{ArrowRight}');

        expect(setSort).toHaveBeenCalledWith('newest');
        expect(newestButton).toHaveFocus();
    });

    it('navigates forward with ArrowDown key', async () => {
        const setSort = jest.fn();

        render(
            <SortToggle
                sort="relevance"
                setSort={setSort}
                labelId="test-sort-label"
            />
        );

        const relevanceButton = screen.getByRole('radio', {name: 'Relevance'});
        const newestButton = screen.getByRole('radio', {name: 'Newest'});

        relevanceButton.focus();
        await user.keyboard('{ArrowDown}');

        expect(setSort).toHaveBeenCalledWith('newest');
        expect(newestButton).toHaveFocus();
    });

    it('navigates backward with ArrowLeft key', async () => {
        const setSort = jest.fn();

        render(
            <SortToggle
                sort="newest"
                setSort={setSort}
                labelId="test-sort-label"
            />
        );

        const relevanceButton = screen.getByRole('radio', {name: 'Relevance'});
        const newestButton = screen.getByRole('radio', {name: 'Newest'});

        newestButton.focus();
        await user.keyboard('{ArrowLeft}');

        expect(setSort).toHaveBeenCalledWith(undefined);
        expect(relevanceButton).toHaveFocus();
    });

    it('navigates backward with ArrowUp key', async () => {
        const setSort = jest.fn();

        render(
            <SortToggle
                sort="newest"
                setSort={setSort}
                labelId="test-sort-label"
            />
        );

        const relevanceButton = screen.getByRole('radio', {name: 'Relevance'});
        const newestButton = screen.getByRole('radio', {name: 'Newest'});

        newestButton.focus();
        await user.keyboard('{ArrowUp}');

        expect(setSort).toHaveBeenCalledWith(undefined);
        expect(relevanceButton).toHaveFocus();
    });

    it('wraps navigation from end to beginning', async () => {
        const setSort = jest.fn();

        render(
            <SortToggle
                sort="newest"
                setSort={setSort}
                labelId="test-sort-label"
            />
        );

        const relevanceButton = screen.getByRole('radio', {name: 'Relevance'});
        const newestButton = screen.getByRole('radio', {name: 'Newest'});

        newestButton.focus();
        await user.keyboard('{ArrowRight}');

        expect(setSort).toHaveBeenCalledWith(undefined);
        expect(relevanceButton).toHaveFocus();
    });

    it('wraps navigation from beginning to end', async () => {
        const setSort = jest.fn();

        render(
            <SortToggle
                sort="relevance"
                setSort={setSort}
                labelId="test-sort-label"
            />
        );

        const relevanceButton = screen.getByRole('radio', {name: 'Relevance'});
        const newestButton = screen.getByRole('radio', {name: 'Newest'});

        relevanceButton.focus();
        await user.keyboard('{ArrowLeft}');

        expect(setSort).toHaveBeenCalledWith('newest');
        expect(newestButton).toHaveFocus();
    });

    it('applies custom className when provided', () => {
        const setSort = jest.fn();

        const {container} = render(
            <SortToggle
                sort="relevance"
                setSort={setSort}
                labelId="test-sort-label"
                className="custom-class"
            />
        );

        const wrapper = container.querySelector('.sort-toggle-wrap');

        expect(wrapper).toHaveClass('sort-toggle-wrap');
        expect(wrapper).toHaveClass('custom-class');
    });

    it('has proper ARIA labeling', () => {
        const setSort = jest.fn();

        render(
            <SortToggle
                sort="relevance"
                setSort={setSort}
                labelId="test-sort-label"
            />
        );

        const radiogroup = screen.getByRole('radiogroup');
        const label = screen.getByText('Sort by');

        expect(label).toHaveAttribute('id', 'test-sort-label');
        expect(radiogroup).toHaveAttribute('aria-labelledby', 'test-sort-label');
    });
});

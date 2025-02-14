import React from 'react';
import {render} from '@testing-library/preact';

// The date needs to be set before the import
jest.useFakeTimers().setSystemTime(new Date('2024-04-04'));
describe('year-selector', () => {
    it('starts with 2 years back when before July', async () => {
        const YearSelector = (await import('~/components/year-selector/year-selector')).default;

        render(<YearSelector />);
        const options = Array.from(document.querySelectorAll('[role="option"]'));

        expect(options[0].textContent).toBe('2022-2023');
        expect(options[1].getAttribute('aria-selected')).toBeTruthy();
    });
});

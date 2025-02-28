import React from 'react';
import {render, screen} from '@testing-library/preact';
import * as AG from '~/components/accordion-group/accordion-group';
import FAQ from '~/components/faq-section/faq-section';

describe('components/faq-section', () => {
    it('renders', () => {
        const mockAG = jest.fn();

        jest.spyOn(AG, 'default').mockImplementation(() => mockAG());
        render(<FAQ heading='the faq' items={[]} />);
        const h = screen.getByRole('heading', {level: 1});

        expect(h.textContent).toBe('the faq');
        expect(mockAG).toHaveBeenCalled();
    });
});

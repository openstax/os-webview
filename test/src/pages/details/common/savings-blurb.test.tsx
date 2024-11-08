import React from 'react';
import {render, screen} from '@testing-library/preact';
import SavingsBlurb from '~/pages/details/common/savings-blurb';
import * as DC from '~/pages/details/context';

const spyDetailsContext = jest.spyOn(DC, 'default');

describe('details/common/savings-blurb', () => {
    it('renders', () => {
        spyDetailsContext.mockReturnValue({
            supportStatement: `With philanthropic support, this book is used
            in <span id='adoption_number'></span> classrooms,
            saving students <span id='savings'></span> dollars this school year.`,
            adoptions: '1000',
            savings: '69420'
        } as any);

        render(<SavingsBlurb />);
        screen.getByText('philanthropic support', {exact: false});
        screen.getByText('1,000');
        screen.getByText('69,420');
    });
});

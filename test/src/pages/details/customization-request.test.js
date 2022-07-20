import React from 'react';
import {render, screen} from '@testing-library/preact';
import CustomizationForm from '~/pages/details/common/customization-form/customization-form';
import rawData from '../../data/details-biology-2e';
import {transformData} from '~/helpers/controller/cms-mixin';

const data = transformData(rawData);

test('shows the form', () => {
    render(<CustomizationForm model={data} />)
    expect(screen.getByRole('form')).not.toBeNull();
    expect(screen.getAllByRole('textbox')).toHaveLength(2);
    expect(screen.getAllByRole('button')).toHaveLength(1);
});

import React from 'react';
import {render, screen} from '@testing-library/preact';
import {BookstorePage} from '~/pages/bookstore-suppliers/bookstore-suppliers';
import pageData from '../data/print-order';
import {camelCaseKeys} from '~/helpers/page-data-utils';

test('renders some links', () => {
    render(<BookstorePage data={camelCaseKeys(pageData)} />);
    expect(screen.queryAllByRole('link')).toHaveLength(1);
    expect(screen.queryAllByText('XanEdu', {exact: false})).toHaveLength(1);
});

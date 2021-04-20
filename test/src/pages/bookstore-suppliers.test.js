import React from 'react';
import {render, screen} from '@testing-library/preact';
import {BookstorePage} from '~/pages/bookstore-suppliers/bookstore-suppliers';
import pageData from '../data/print-order';

test('renders some links', () => {
    render(<BookstorePage data={pageData} />);
    expect(screen.queryAllByRole('link')).toHaveLength(1);
    expect(screen.queryAllByText('XanEdu', {exact: false})).toHaveLength(1);
});

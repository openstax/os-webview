import React from 'react';
import {render, screen} from '@testing-library/preact';
import Buckets from '~/pages/home/buckets/buckets';
import higherEd from '../../data/buckets';

const data = higherEd.row_3.map((x) => ('value' in x) ? x.value : x);
test('creates two buckets', () => {
    render(<Buckets bucketModels={data} />);
    expect(screen.queryAllByRole('link')).toHaveLength(2);
});

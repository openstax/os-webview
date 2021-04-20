import React from 'react';
import {render, screen} from '@testing-library/preact';
import HomeLoader from '~/pages/home/home';

test('creates and has a lot of content', (done) => {
    render(<HomeLoader />);
    setTimeout(() => {
        expect(screen.queryAllByText('Learn more')).not.toBeNull();
        expect(screen.queryAllByRole('link')).toHaveLength(3);
        done();
    }, 0);
});

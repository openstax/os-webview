import React from 'react';
import {render, screen} from '@testing-library/preact';
import HomeLoader from '~/pages/home/home';

test('creates and has a lot of content', async () => {
    render(<HomeLoader />);
    expect(await screen.findAllByRole('link')).toHaveLength(3);
    expect(screen.getByText('More than just books.')).not.toBeNull();
    expect(screen.getByText('Explore now')).not.toBeNull();
});

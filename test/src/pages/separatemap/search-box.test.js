import React from 'react';
import {render, screen} from '@testing-library/preact';
import SearchBox from '~/pages/separatemap/search-box/search-box';

// Not a lot to test in isolation. Needs to be part of a map.
// Has a desktop view then a phone view
test('indicates minimized', () => {
    render(<SearchBox minimized={true} />);
    expect(screen.getAllByRole('button', {pressed: true})).toHaveLength(2);
});
test('indicates unminimized', () => {
    render(<SearchBox minimized={false} />);
    expect(screen.queryAllByRole('button', {pressed: true})).toHaveLength(0);
});

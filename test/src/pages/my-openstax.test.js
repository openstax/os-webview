import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import MyOpenStax from '~/pages/my-openstax/my-openstax';

test(`shows up with links`, (done) => {
    render(<BrowserRouter><Route><MyOpenStax /></Route></BrowserRouter>);
    setTimeout(() => {
        expect(screen.getByRole('navigation')).toBeTruthy();
        expect(screen.getAllByRole('link')).toHaveLength(3);
        userEvent.click(screen.getByText('My Assistant', {selector: 'a'}));
        done();
    }, 200);
});

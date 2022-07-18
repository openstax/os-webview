import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import {render, screen} from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import MyOpenStax from '~/pages/my-openstax/my-openstax';

test(`can render (tests broke with Jest upgrade)`, (done) => {
    render(<BrowserRouter><Routes><Route><MyOpenStax /></Route></Routes></BrowserRouter>);
    done();
});

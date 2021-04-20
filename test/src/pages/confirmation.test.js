import React from 'react';
import {render, screen} from '@testing-library/preact';
import Confirmation from '~/pages/confirmation/confirmation';

const referrers = {
    contact: 'Thanks for contacting us',
    'errata?id=7199': 'Thanks for your help!'
};

Reflect.ownKeys(referrers).forEach((ref) => {
    test(`does ${ref} thanks`, () => {
        window.history.pushState({}, 'confirmation', `/confirmation/${ref}`);
        render(<Confirmation />)
        expect(screen.getByRole('heading').textContent).toBe(referrers[ref]);
    });
});

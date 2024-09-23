import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import AboutPage from '~/pages/about/about';
import aboutData from '../../src/data/about';
import { MemoryRouter } from 'react-router-dom';

const anImage = {
    id: 482,
    file: 'https://assets.openstax.org/oscms-dev/media/original_images/About_Us_Icon.png',
    title: 'About Us Icon.png',
    height: 308,
    width: 540,
    /* eslint camelcase: 0 */
    created_at: '2018-08-13T23:26:44.689948-05:00'
};

global.fetch = jest.fn().mockImplementation(
    (args: [string]) => {
        const payload = (args.includes('pages/about')) ? aboutData : anImage;

        return Promise.resolve({
            ok: true,
            json() {
                return Promise.resolve(payload);
            }
        });
    }
);

describe('about page', () => {
    it('renders', async () => {
        render(<MemoryRouter initialEntries={['/about']}><AboutPage /></MemoryRouter>);
        await screen.findByText('Who we are');
    });
    it('sets maxdim based on window.innerwidth', async () => {
        window.innerWidth = 2000;
        render(<MemoryRouter initialEntries={['/about']}><AboutPage /></MemoryRouter>);
        await screen.findByText('Who we are');
    });
});

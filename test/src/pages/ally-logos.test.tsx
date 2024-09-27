import React from 'react';
import {render, screen} from '@testing-library/preact';
import AllyLogosLoader from '~/pages/ally-logos/ally-logos';
import {MemoryRouter} from 'react-router-dom';

const allyLogos = [
    {
        image: {
            id: 100,
            file: 'http://first/url',
            title: 'First logo'
        }
    }
];
const bookAllyLogos = [
    {
        image: {
            id: 101,
            file: 'http://book/url',
            title: 'Book logo'
        }
    }
];
/* eslint-disable camelcase */
const pageData = {
    heading: 'page head',
    description: 'page description',
    ally_logos_heading: 'above logos',
    allyLogosDescription: 'about logos',
    ally_logos: [allyLogos],
    bookAllyLogosHeading: 'above book logos',
    bookAllyLogosDescription: 'about book logos',
    bookAllyLogos: [bookAllyLogos]
};
/* eslint-enable camelcase */

global.fetch = jest.fn().mockReturnValue(
    Promise.resolve({
        ok: true,
        json() {
            return Promise.resolve(pageData);
        }
    })
);

const writeText = jest.fn();

Object.assign(navigator, {
    clipboard: {writeText}
});

describe('ally-logos', () => {
    it('renders', async () => {
        render(
            <MemoryRouter initialEntries={['/ally-logos']}>
                <AllyLogosLoader />
            </MemoryRouter>
        );
        await screen.findByText('about book logos');
        const [copyButton] = screen.getAllByRole('button');

        copyButton.click();
        expect(writeText).toHaveBeenCalled();
    });
});

import React from 'react';
import {render, screen} from '@testing-library/preact';
import ImpactLoader from '~/pages/impact/impact';
import {MemoryRouter} from 'react-router-dom';
import * as DH from '~/helpers/use-document-head';

jest.spyOn(DH, 'setPageTitleAndDescriptionFromBookData').mockReturnValue();

// react-aria-carousel does not play nice with Jest
jest.mock('react-aria-carousel', () => ({
    Carousel: jest.fn()
}));

// @ts-expect-error does not exist on
const {routerFuture} = global;

describe('impact page', () => {
    it('Renders', async () => {
        render(
            <MemoryRouter initialEntries={['/impact']} future={routerFuture}>
                <ImpactLoader />
            </MemoryRouter>
        );
        expect(((await screen.findByRole('heading', {level: 1}))).textContent).toBe('Our Mission');
    });
});

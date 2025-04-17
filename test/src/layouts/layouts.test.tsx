import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import { MemoryRouter } from 'react-router-dom';
import LandingLayout from '~/layouts/landing/landing';

describe('layouts/landing', () => {
    const data: Parameters<typeof LandingLayout>[0]['data'] = {
        title: 'the-title',
        layout: []
    };

    it('renders without layout values', () => {
        render(
            <MemoryRouter initialEntries={['']}>
                <LandingLayout data={data}>
                    <div>child contents</div>
                </LandingLayout>
            </MemoryRouter>
        );
        expect(screen.getAllByRole('img')).toHaveLength(2);
        expect(screen.getAllByRole('link')).toHaveLength(3);
    });
    it('renders with layout values', () => {
        data.layout.push({
            value: {
                navLinks: [
                    {
                        text: 'link-name',
                        target: {
                            type: 'link-type',
                            value: 'link-value'
                        }
                    }
                ]
            }
        });
        render(
            <MemoryRouter initialEntries={['']}>
                <LandingLayout data={data}>
                    <div>child contents</div>
                </LandingLayout>
            </MemoryRouter>
        );
        expect(screen.getAllByRole('link')).toHaveLength(4);
    });
    it('renders the default footer for non-flex pages', async () => {
        data.meta = { type: 'not-a-flex-page' };
        render(
            <MemoryRouter initialEntries={['']}>
                <LandingLayout data={data}>
                    <div>child contents</div>
                </LandingLayout>
            </MemoryRouter>
        );

        // Find social links by title
        expect(await screen.findAllByTitle(/^OpenStax on .+$/)).toHaveLength(5);
    });
    it('renders the flex footer for flex pages', async () => {
        data.meta = { type: 'pages.FlexPage' };
        render(
            <MemoryRouter initialEntries={['']}>
                <LandingLayout data={data}>
                    <div>child contents</div>
                </LandingLayout>
            </MemoryRouter>
        );

        // Flex footer does not have social links
        await expect(screen.findAllByTitle(/^OpenStax on .+$/))
            .rejects
            .toThrow(/Unable to find an element/);
    });
});

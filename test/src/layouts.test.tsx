import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import LandingLayout from '~/layouts/landing/landing';
import { MemoryRouter } from 'react-router-dom';

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
});

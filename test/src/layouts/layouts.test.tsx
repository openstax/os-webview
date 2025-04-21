import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import { MemoryRouter } from 'react-router-dom';
import LandingLayout from '~/layouts/landing/landing';

// @ts-expect-error does not exist on
const {routerFuture} = global;

type Layout = Parameters<typeof LandingLayout>[0]['data']['layout'];

describe('layouts/landing', () => {
    function Component({layout}: {layout: Layout}) {
        const data: Parameters<typeof LandingLayout>[0]['data'] = {
            title: 'the-title',
            layout
        };

        return (
            <MemoryRouter initialEntries={['']} future={routerFuture}>
                <LandingLayout data={data}>
                    <div>child contents</div>
                </LandingLayout>
            </MemoryRouter>
        );
    }

    it('renders without layout values', () => {
        render(<Component layout={[]} />);
        expect(screen.getAllByRole('img')).toHaveLength(2);
        expect(screen.getAllByRole('link')).toHaveLength(1);
    });
    it('suppresses the Give link when specified', () => {
        const layout = [{
            value: {
                navLinks: [],
                showGive: false
            }
        }];

        render(<Component layout={layout} />);
        expect(screen.getAllByRole('img')).toHaveLength(2);
        expect(screen.queryAllByRole('link')).toHaveLength(0);
    });
    it('renders with layout values', () => {
        const layout = [{
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
        }];

        render(<Component layout={layout} />);
        expect(screen.getAllByRole('link')).toHaveLength(2);
    });
});

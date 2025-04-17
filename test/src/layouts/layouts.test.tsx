import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import { MemoryRouter } from 'react-router-dom';
import LandingLayout from '~/layouts/landing/landing';

// @ts-expect-error does not exist on
const {routerFuture} = global;


describe('layouts/landing', () => {
    const data: Parameters<typeof LandingLayout>[0]['data'] = {
        title: 'the-title',
        layout: []
    };

    function Component({showGive}: {showGive?: boolean}) {
        return (
            <MemoryRouter initialEntries={['']} future={routerFuture}>
                <LandingLayout data={data} showGive={showGive}>
                    <div>child contents</div>
                </LandingLayout>
            </MemoryRouter>
        );
    }

    it('renders without layout values', () => {
        render(<Component />);
        expect(screen.getAllByRole('img')).toHaveLength(2);
        expect(screen.getAllByRole('link')).toHaveLength(1);
    });
    it('suppresses the Give link when specified', () => {
        render(<Component showGive={false} />);
        expect(screen.getAllByRole('img')).toHaveLength(2);
        expect(screen.queryAllByRole('link')).toHaveLength(0);
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
        render(<Component />);
        expect(screen.getAllByRole('link')).toHaveLength(2);
    });
});

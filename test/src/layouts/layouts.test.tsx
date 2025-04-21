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
        // Default footer has 16 links + 4 links in layout = 20 links
        expect(await screen.findAllByRole('link')).toHaveLength(20);
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
        // Flex footer has 4 links + 4 links in layout = 8 links
        expect(await screen.findAllByRole('link')).toHaveLength(8);
    });
});

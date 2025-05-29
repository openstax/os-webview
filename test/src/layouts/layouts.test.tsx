import React from 'react';
import {render, screen} from '@testing-library/preact';
import {describe, it} from '@jest/globals';
import { MemoryRouter } from 'react-router-dom';
import LandingLayout from '~/layouts/landing/landing';

// @ts-expect-error does not exist on
const {routerFuture} = global;

type Data = Parameters<typeof LandingLayout>[0]['data'];
type Layout = Exclude<Data, undefined>['layout'];

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

    it('renders without data object', () => {
        render(<MemoryRouter initialEntries={['']} future={routerFuture}>
            <LandingLayout>
                <div>child contents</div>
            </LandingLayout>
        </MemoryRouter>);
        expect(screen.getAllByRole('img')).toHaveLength(2);
        expect(screen.getAllByRole('link')).toHaveLength(1);
    });
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
        const title = 'some-title';
        const layout = [{value: {navLinks: []}}];
        const type = 'not-a-flex-page';
        const meta = {type};
        const data = {title, layout, meta} as const;

        render(
            <MemoryRouter initialEntries={['']} future={routerFuture}>
                <LandingLayout data={data}>
                    <div>child contents</div>
                </LandingLayout>
            </MemoryRouter>
        );

        // Find social links by title
        expect(await screen.findAllByTitle(/^OpenStax on .+$/)).toHaveLength(5);
        // Default footer has 16 links + 1 link in layout = 17 links
        expect(await screen.findAllByRole('link')).toHaveLength(17);
    });
    it('renders the flex footer for flex pages', async () => {
        const title = 'some-title';
        const layout = [{value: {navLinks: []}}];
        const type = 'pages.FlexPage';
        const meta = {type};
        const data = {title, layout, meta} as const;

        render(
            <MemoryRouter initialEntries={['']} future={routerFuture}>
                <LandingLayout data={data}>
                    <div>child contents</div>
                </LandingLayout>
            </MemoryRouter>
        );

        // Flex footer does not have social links
        await expect(screen.findAllByTitle(/^OpenStax on .+$/))
            .rejects
            .toThrow(/Unable to find an element/);
        // Default footer has 4 links + 1 link in layout = 5 links
        expect(await screen.findAllByRole('link')).toHaveLength(5);
    });
});

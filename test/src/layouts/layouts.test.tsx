import React from 'react';
import {render, screen} from '@testing-library/preact';
import MemoryRouter from '~/../../test/helpers/future-memory-router';
import LandingLayout from '~/layouts/landing/landing';
import usePortalContext, {PortalContextProvider} from '~/contexts/portal';
import '@testing-library/jest-dom';

type Data = Parameters<typeof LandingLayout>[0]['data'];
type Layout = Exclude<Data, undefined>['layout'];

describe('layouts/landing', () => {
    function dataForLayout(layout: Layout) {
        return {
            title: 'the-title',
            layout
        };
    }
    function Component({data}: Parameters<typeof LandingLayout>[0]) {
        return (
            <MemoryRouter initialEntries={['']}>
                <LandingLayout data={data}>
                    <div>child contents</div>
                </LandingLayout>
            </MemoryRouter>
        );
    }

    it('renders without data object', () => {
        render(<Component />);
        expect(screen.getAllByRole('img')).toHaveLength(2);
        expect(screen.getAllByRole('link')).toHaveLength(1);
    });
    it('renders without layout values', () => {
        render(<Component data={dataForLayout([])} />);
        expect(screen.getAllByRole('img')).toHaveLength(2);
        expect(screen.getAllByRole('link')).toHaveLength(1);
    });
    it('suppresses the Give link when specified', () => {
        const layout = [
            {
                value: {
                    navLinks: [],
                    showGiveNowButton: false
                }
            }
        ];

        render(<Component data={dataForLayout(layout)} />);
        expect(screen.getAllByRole('img')).toHaveLength(2);
        expect(screen.queryAllByRole('link')).toHaveLength(0);
    });
    it('renders with layout values', () => {
        const layout = [
            {
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
            }
        ];

        render(<Component data={dataForLayout(layout)} />);
        expect(screen.getAllByRole('link')).toHaveLength(2);
    });
    it('renders the default footer for non-flex pages', async () => {
        const title = 'some-title';
        const layout = [{value: {navLinks: []}}];
        const type = 'not-a-flex-page';
        const meta = {type};
        const data = {title, layout, meta} as const;

        render(<Component data={data} />);

        // Find social links by title
        expect(await screen.findAllByTitle(/^OpenStax on .+$/)).toHaveLength(5);
        // Default footer has 17 links + 1 link in layout = 18 links
        expect(await screen.findAllByRole('link')).toHaveLength(19);
    });
    it('renders the flex footer for flex pages', async () => {
        const title = 'some-title';
        const layout = [{value: {navLinks: []}}];
        const type = 'pages.FlexPage';
        const meta = {type};
        const data = {title, layout, meta} as const;

        render(
            <PortalContextProvider>
                <Component data={data} />
            </PortalContextProvider>
        );

        // Flex footer does not have social links
        await expect(screen.findAllByTitle(/^OpenStax on .+$/)).rejects.toThrow(
            /Unable to find an element/
        );
        // Default footer has 4 links + 1 link in layout = 5 links
        expect(await screen.findAllByRole('link')).toHaveLength(5);
    });
    it('rewrites footer links in portal', async () => {
        const title = 'some-title';
        const layout = [{value: {navLinks: []}}];
        const type = 'pages.FlexPage';
        const meta = {type};
        const ComponentInPortal = ({data}: Parameters<typeof Component>[0]) => {
            const {setPortal} = usePortalContext();

            setPortal('/a-portal');
            return <Component data={data} />;
        };

        render(
            <PortalContextProvider>
                <ComponentInPortal data={{title, layout, meta} as const} />
            </PortalContextProvider>
        );

        // Flex footer does not have social links
        await expect(screen.findAllByTitle(/^OpenStax on .+$/)).rejects.toThrow(
            /Unable to find an element/
        );
        // Default footer has 4 links + 1 link in layout = 5 links
        const links = await screen.findAllByRole('link');

        expect(links[1]).toHaveAttribute('href', '//a-portal/tos');
    });
});

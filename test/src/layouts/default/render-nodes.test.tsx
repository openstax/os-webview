import '@testing-library/jest-dom';
import React from 'react';
import {render, screen} from '@testing-library/preact';
import ShellContextProvider from '../../../helpers/shell-context';
import MemoryRouter from '../../../helpers/future-memory-router';
import {RenderNodes} from '~/layouts/default/header/menus/shared/render-nodes';
import type {NavNode} from '~/helpers/nav-nodes';

function renderNodes(nodes: NavNode[]) {
    return render(
        <ShellContextProvider>
            <MemoryRouter>
                <ul>
                    <RenderNodes nodes={nodes} getVariant={() => undefined} />
                </ul>
            </MemoryRouter>
        </ShellContextProvider>
    );
}

describe('RenderNodes', () => {
    it('renders a link node as an anchor', () => {
        renderNodes([
            {type: 'link', region: 'utility', label: 'Blog', partial_url: '/blog'}
        ]);
        expect(screen.getByRole('link', {name: 'Blog'})).toHaveAttribute(
            'href',
            '/blog'
        );
    });

    it('renders a dropdown node with its label', () => {
        renderNodes([
            {type: 'dropdown', region: 'main', name: 'About', menu: [
                {type: 'link', region: 'main', label: 'Team', partial_url: '/team'}
            ]}
        ]);
        expect(screen.getByText('About')).toBeTruthy();
    });

    it('hides a node gated by a flag that is off', () => {
        renderNodes([
            {type: 'link', region: 'utility', label: 'Secret',
             partial_url: '/x', feature_flag: 'nav-secret'}
        ]);
        expect(screen.queryByText('Secret')).toBeNull();
    });
});

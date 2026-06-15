import {describe, it, expect} from '@jest/globals';
import {nodesForRegion, type NavNode} from '~/helpers/nav-nodes';

const nodes: NavNode[] = [
    {type: 'dropdown', region: 'main', name: 'About', menu: []},
    {type: 'link', region: 'utility', label: 'Blog', partial_url: '/blog'},
    {type: 'link', region: 'main', label: 'K12', partial_url: '/k12'},
    {type: 'dynamic', region: 'footer', component: 'rice-logo', label: ''}
];

describe('nodesForRegion', () => {
    it('returns only nodes for the requested region', () => {
        expect(nodesForRegion(nodes, 'main')).toHaveLength(2);
        expect(nodesForRegion(nodes, 'utility')).toHaveLength(1);
        expect(nodesForRegion(nodes, 'footer')).toHaveLength(1);
    });

    it('is safe when structure is undefined', () => {
        expect(nodesForRegion(undefined, 'main')).toEqual([]);
    });
});

import React from 'react';
import type {FlagValue} from '~/helpers/posthog';
import type {NavNode} from '~/helpers/nav-nodes';
import {isNodeVisible, dropdownLabel, NAV_PRODUCTS_LABEL_FLAG}
    from '../main-menu/nav-experiments';
import Dropdown, {MenuItem} from '../main-menu/dropdown/dropdown';
import LoginMenu from '../main-menu/login-menu/login-menu';
import GiveButton from '../give-button/give-button';
import RiceLogo from './rice-logo';

/** component_key -> component. Add new dynamic nodes here. */
const DYNAMIC_COMPONENTS: Record<string, React.ComponentType> = {
    'user-menu': LoginMenu,
    'give-button': GiveButton,
    'rice-logo': RiceLogo
};

export function NodeRenderer({
    node,
    getVariant,
    navContext = 'Menu'
}: {
    node: NavNode;
    getVariant: (flag: string) => FlagValue;
    navContext?: string;
}) {
    if (!isNodeVisible(node, getVariant)) {
        return null;
    }
    if (node.type === 'dynamic') {
        const Component = DYNAMIC_COMPONENTS[node.component];

        return Component ? <Component /> : null;
    }
    if (node.type === 'dropdown') {
        const label = dropdownLabel(node, getVariant(NAV_PRODUCTS_LABEL_FLAG));

        return (
            <Dropdown label={label} navAnalytics={`${navContext} (${node.name})`}>
                <RenderNodes nodes={node.menu} getVariant={getVariant} navContext={navContext} />
            </Dropdown>
        );
    }
    return <MenuItem label={node.label} url={node.partial_url} />;
}

export function RenderNodes({
    nodes,
    getVariant,
    navContext = 'Menu'
}: {
    nodes: NavNode[];
    getVariant: (flag: string) => FlagValue;
    navContext?: string;
}) {
    return (
        <React.Fragment>
            {nodes.map((node, index) => (
                <NodeRenderer
                    key={'label' in node ? `${node.label}-${index}` : index}
                    node={node}
                    getVariant={getVariant}
                    navContext={navContext}
                />
            ))}
        </React.Fragment>
    );
}

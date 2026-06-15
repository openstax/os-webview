import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import type {FlagValue} from '~/helpers/posthog';
import type {NavNode} from '~/helpers/nav-nodes';
import linkHelper from '~/helpers/link';
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
    navContext = 'Menu',
    wrapInListItem = true
}: {
    node: NavNode;
    getVariant: (flag: string) => FlagValue;
    navContext?: string;
    wrapInListItem?: boolean;
}) {
    if (!isNodeVisible(node, getVariant)) {
        return null;
    }
    if (node.type === 'dynamic') {
        const Component = DYNAMIC_COMPONENTS[node.component];
        const rendered = Component ? <Component /> : null;

        if (wrapInListItem && node.component === 'give-button') {
            return rendered ? <li className="give-button-item">{rendered}</li> : null;
        }
        return rendered;
    }
    if (node.type === 'dropdown') {
        const label = dropdownLabel(node, getVariant(NAV_PRODUCTS_LABEL_FLAG));

        return (
            <Dropdown label={label} navAnalytics={`${navContext} (${node.name})`}>
                <RenderNodes
                    nodes={node.menu}
                    getVariant={getVariant}
                    navContext={navContext}
                    wrapInListItem={false}
                />
            </Dropdown>
        );
    }

    const href = linkHelper.stripOpenStaxDomain(node.partial_url);
    const link = linkHelper.isExternal(href) ? (
        <RawHTML Tag="a" html={node.label} href={href} tabIndex={0} />
    ) : (
        <MenuItem label={node.label} url={href} />
    );

    return wrapInListItem ? <li className="nav-menu-item">{link}</li> : link;

export function RenderNodes({
    nodes,
    getVariant,
    navContext = 'Menu',
    wrapInListItem = true
}: {
    nodes: NavNode[];
    getVariant: (flag: string) => FlagValue;
    navContext?: string;
    wrapInListItem?: boolean;
}) {
    return (
        <React.Fragment>
            {nodes.map((node, index) => (
                <NodeRenderer
                    key={'label' in node ? `${node.label}-${index}` : index}
                    node={node}
                    getVariant={getVariant}
                    navContext={navContext}
                    wrapInListItem={wrapInListItem}
                />
            ))}
        </React.Fragment>
    );
}

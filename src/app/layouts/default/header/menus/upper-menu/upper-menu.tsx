import React from 'react';
import JITLoad from '~/helpers/jit-load';
import useGiveToday from '~/models/give-today';
import {useDataFromSlug} from '~/helpers/page-data-utils';
import {useExperimentReader} from '~/helpers/posthog';
import {nodesForRegion, type NavNode} from '~/helpers/nav-nodes';
import {RenderNodes} from '../shared/render-nodes';
import RiceLogo from '../shared/rice-logo';
import './upper-menu.scss';

const importGiveButton = () => import('../give-button/give-button');

// The Give button is rendered automatically below when GiveToday is active.
// Do NOT add a separate "Give" link in the CMS utility region — to place Give
// explicitly, use a `give-button` dynamic component node instead.
export default function UpperMenu() {
    const {showButton}: {showButton?: boolean} = useGiveToday();
    const getVariant = useExperimentReader();
    const structure = useDataFromSlug<NavNode[]>('oxmenus');
    const utilityNodes = nodesForRegion(structure, 'utility');

    return (
        <ul className="container no-bullets" data-analytics-nav="Upper Menu">
            <RenderNodes nodes={utilityNodes} getVariant={getVariant} navContext="Upper Menu" />
            <RiceLogo />
            {showButton ? <JITLoad importFn={importGiveButton} /> : null}
        </ul>
    );
}

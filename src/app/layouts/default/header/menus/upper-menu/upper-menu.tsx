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
const GIVE_LINK = 'https://riceconnect.rice.edu/donation/support-openstax-header';

// Give is intentionally kept OUT of the CMS-driven nav — its GiveToday
// settings are shared with flex landing pages. It keeps its existing
// behavior here: the Give button when GiveToday is active, otherwise a
// plain Give link. Don't add a "Give" item to the CMS utility region.
export default function UpperMenu() {
    const {showButton}: {showButton?: boolean} = useGiveToday();
    const getVariant = useExperimentReader();
    const structure = useDataFromSlug<NavNode[]>('oxmenus');
    const utilityNodes = nodesForRegion(structure, 'utility');

    return (
        <ul className="container no-bullets" data-analytics-nav="Upper Menu">
            <RenderNodes nodes={utilityNodes} getVariant={getVariant} navContext="Upper Menu" />
            {showButton ? null : (
                <li className="nav-menu">
                    <a target="_blank" rel="noreferrer" href={GIVE_LINK}>Give</a>
                </li>
            )}
            <RiceLogo />
            {showButton ? <JITLoad importFn={importGiveButton} /> : null}
        </ul>
    );
}

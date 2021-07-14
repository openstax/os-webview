import React from 'react';
import NavigationContext from '../navigator/navigation-context';
import Collection from './collection/collection';
import Assistant from './assistant/assistant';
import Account from './account/account';

export const targetIds = ['collection', 'assistant', 'account'];

export default function MainPanel() {
    const {activeId} = React.useContext(NavigationContext);

    return (
        <React.Fragment>
            <Collection id={targetIds[0]} hidden={activeId!==targetIds[0]} />
            <Assistant id={targetIds[1]} hidden={activeId!==targetIds[1]} />
            <Account id={targetIds[2]} hidden={activeId!==targetIds[2]} />
        </React.Fragment>
    );
}

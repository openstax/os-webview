import React from 'react';
import Header from './header/header';
import Navigator from './navigator/navigator';
import MainPanel, {targetIds} from './main-panel/main-panel';
import NavigationContext from './navigation-context';
import './main-card.scss';

export default function MainCard() {
    const initialId = window.location.hash.substr(1) || targetIds[0];
    const idState = React.useState(initialId);

    return (
        <div className='main-card'>
            <NavigationContext.Provider value={idState}>
                <div className='layout-grid'>
                    <div className='banner'>
                        <Header />
                    </div>
                    <div className='left-bar'>
                        <Navigator targetIds={targetIds} />
                    </div>
                    <main className='main-content'>
                        <MainPanel />
                    </main>
                </div>
            </NavigationContext.Provider>
        </div>
    );
}

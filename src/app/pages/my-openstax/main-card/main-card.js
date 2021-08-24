import React from 'react';
import Header from './header/header';
import Navigator from './navigator/navigator';
import {NavigationContextProvider} from './navigator/navigation-context';
import MainPanel, {targetIds} from './main-panel/main-panel';
import { useStoreon } from 'storeon/preact';
import linkHelper from '~/helpers/link';
import './main-card.scss';

function NotLoggedIn() {
    return (
        <div>
            <h1>You are not logged in</h1>
            <div>
                In order to use MyOpenStax, you need to{' '}
                <a href={linkHelper.loginLink()}>log in</a>.
            </div>
        </div>
    );
}

export default function MainCard() {
    const {user} = useStoreon('user');

    if (user.error) {
        return (<NotLoggedIn />);
    }

    return (
        <div className='main-card'>
            <NavigationContextProvider contextValueParameters={targetIds}>
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
            </NavigationContextProvider>
        </div>
    );
}

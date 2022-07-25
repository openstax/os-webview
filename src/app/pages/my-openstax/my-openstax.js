import React from 'react';
import {MyOpenStaxContextProvider} from './store/context';
import MainCard from './main-card/main-card';
import './my-openstax.scss';

export default function MyOpenStax() {
    return (
        <div className="my-openstax page">
            <MyOpenStaxContextProvider>
                <MainCard />
            </MyOpenStaxContextProvider>
        </div>
    );
}

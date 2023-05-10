import React from 'react';
import JITLoad from '~/helpers/jit-load';
import useGiveToday from '~/models/give-today';
import useOptimizedImage from '~/helpers/use-optimized-image';
import './upper-menu.scss';

const menuStructure = {
    Bookstores: '/bookstore-suppliers',
    'Our Impact': '/impact',
    Supporters: '/foundation',
    Blog: '/blog',
    Give: 'https://riceconnect.rice.edu/donation/support-openstax-header',
    Help: 'https://help.openstax.org/s/'
};

const menuData = Object.entries(menuStructure).map(
    ([key, value]) => ({label: key, url: value})
);

function MenuItem({label, url, showButton}) {
    if (label === 'Give') {
        return showButton ?
            null :
            <a className="nav-menu" target="_blank" rel="noreferrer" href={url}>
                {label}
            </a>
        ;
    }

    return (
        <a className="nav-menu" href={url}>{label}</a>
    );
}

const importGiveButton = () => import('../give-button/give-button');

export default function UpperMenu() {
    const {showButton} = useGiveToday();
    const riceLogo = useOptimizedImage('https://openstax.org/dist/images/rice.webp', 80);

    return (
        <div className="container" data-analytics-nav="Upper Menu">
            {
                menuData.map(
                    ({label, url}) => <MenuItem key={label} label={label} url={url} showButton={showButton} />
                )
            }
            <a className="logo rice-logo logo-wrapper" href="http://www.rice.edu">
                <img src={riceLogo} alt="Rice University logo" height="30" width="79" />
            </a>
            {showButton ? <JITLoad importFn={importGiveButton} /> : null}
        </div>
    );
}

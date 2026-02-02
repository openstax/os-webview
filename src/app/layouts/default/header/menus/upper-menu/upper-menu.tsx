import React from 'react';
import JITLoad from '~/helpers/jit-load';
import useGiveToday from '~/models/give-today';
import useOptimizedImage from '~/helpers/use-optimized-image';
import './upper-menu.scss';

const menuStructure = {
    'Order Print': '/print/',
    'Our Impact': '/impact',
    Supporters: '/foundation',
    Blog: '/blog',
    Give: 'https://riceconnect.rice.edu/donation/support-openstax-header',
    Help: 'https://help.openstax.org/s/'
};

const menuData = Object.entries(menuStructure).map(
    ([key, value]) => ({label: key, url: value})
);

function MenuItem({label, url, showButton}: {
    label: string;
    url: string;
    showButton?: boolean;
}) {
    if (label === 'Give') {
        return showButton ?
            null :
            <li className="nav-menu"><a target="_blank" rel="noreferrer" href={url}>
                {label}
            </a></li>
        ;
    }

    return (
        <li className="nav-menu"><a href={url}>{label}</a></li>
    );
}

const importGiveButton = () => import('../give-button/give-button');

export default function UpperMenu() {
    const {showButton}: {showButton?: boolean} = useGiveToday();
    const riceLogo = useOptimizedImage('https://assets.openstax.org/oscms-prodcms/media/images/rice-logo-blue.original.webp', 80);

    return (
        <ul className="container no-bullets" data-analytics-nav="Upper Menu">
            {
                menuData.map(
                    ({label, url}) => <MenuItem key={label} label={label} url={url} showButton={showButton} />
                )
            }
            <li className="logo rice-logo logo-wrapper"><a href="http://www.rice.edu">
                <img src={riceLogo} alt="Rice University logo" height="30" width="79" />
            </a></li>
            {showButton ? <JITLoad importFn={importGiveButton} /> : null}
        </ul>
    );
}

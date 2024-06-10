import React from 'react';
import JITLoad from '~/helpers/jit-load';
import useGiveToday from '~/models/give-today';
import useOptimizedImage from '~/helpers/use-optimized-image';
import './upper-menu.scss';

const menuStructure = {
    Bookstores: 'https://he.kendallhunt.com/sites/default/files/uploadedFiles/Kendall_Hunt/OPENSTAX_PRICE_LIST_and_ORDER_FORM.pdf',
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
    showButton: boolean;
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
    const {showButton} = useGiveToday();
    const riceLogo = useOptimizedImage('https://openstax.org/dist/images/rice.webp', 80);

    return (
        <menu className="container" data-analytics-nav="Upper Menu">
            {
                menuData.map(
                    ({label, url}) => <MenuItem key={label} label={label} url={url} showButton={showButton} />
                )
            }
            <li className="logo rice-logo logo-wrapper"><a href="http://www.rice.edu">
                <img src={riceLogo} alt="Rice University logo" height="30" width="79" />
            </a></li>
            {showButton ? <JITLoad importFn={importGiveButton} /> : null}
        </menu>
    );
}

import React from 'react';
import {useDialog} from '~/components/dialog/dialog';
import {useDataFromSlug} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {TakeoverContextProvider} from './takeover-context';
import {useLocation} from 'react-router-dom';
import $ from '~/helpers/$';
import cn from 'classnames';
import DesktopContent from './content-desktop';
import MobileContent from './content-mobile';
import './takeover-dialog.scss';

export default function TakeoverBanner() {
    const [Dialog, _, close] = useDialog(true);
    const [data] = [].concat($.camelCaseKeys(useDataFromSlug('donations/fundraiser')));
    const location = useLocation();
    const initialLoc = React.useRef(location);

    React.useEffect(() => {
        if (location !== initialLoc.current) {
            close();
        }
    }, [location, initialLoc, close]);

    if (!data) {
        return null;
    }

    data.image = data.fundraiserImage;
    return (
        <Dialog className={cn('takeover-dialog', data.colorScheme)}>
            <TakeoverContextProvider contextValueParameters={{close}}>
                <DesktopContent data={data} />
                <MobileContent data={data} />
            </TakeoverContextProvider>
        </Dialog>
    );
}

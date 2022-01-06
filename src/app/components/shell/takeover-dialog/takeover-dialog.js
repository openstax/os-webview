import React from 'react';
import {useDialog} from '~/components/dialog/dialog';
import {useDataFromSlug} from '~/components/jsx-helpers/jsx-helpers.jsx';
import $ from '~/helpers/$';
import cn from 'classnames';
import DesktopContent from './content-desktop';
import MobileContent from './content-mobile';
import './takeover-dialog.scss';

export default function TakeoverBanner() {
    const [Dialog] = useDialog(true);
    const [data] = [].concat($.camelCaseKeys(useDataFromSlug('donations/fundraiser')));

    if (!data) {
        return null;
    }

    data.image = data.fundraiserImage;
    console.info('DATA', data);
    return (
        <Dialog className={cn('takeover-dialog', data.colorScheme)}>
            <DesktopContent data={data} />
            <MobileContent data={data} />
        </Dialog>
    );
}

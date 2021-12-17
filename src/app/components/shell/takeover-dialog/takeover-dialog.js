import React from 'react';
import {useDialog} from '~/components/dialog/dialog';
import sample from 'lodash/sample';
import cn from 'classnames';
import DesktopContent from './content-desktop';
import MobileContent from './content-mobile';
import './takeover-dialog.scss';

function useData() {
    return {
        colorScheme: sample(['red', 'blue', 'green', 'orange']),
        messageType: sample(['goal', 'message']),
        headline: 'Pay it <span class="color">forward.</span>',
        message: `Messaging that talks about how OpenStax free resources help
        students graduate, and how OpenStax relies on charitable contributions.
        Lorem ipsum dolor lorem ipsum dolor.`,
        buttonText: 'Give today',
        buttonUrl: '/give',
        boxHeadline: 'Lorem ipsum dolor sit amet lorem ipsum dolor lorem sit amet.',
        boxHtml: 'Even donations of just <b>$1, $5, or $10</b> can lorem ipsum dolor sit amet.',
        image: 'https://via.placeholder.com/485x780',
        goalAmount: 4321,
        goalTime: 'August 19, 2022 23:15:30'
    };
}

export default function TakeoverBanner() {
    const [Dialog] = useDialog(true);
    const data = useData();

    console.info('MESSAGE TYPE:', data.messageType);

    return (
        <Dialog className={cn('takeover-dialog', data.colorScheme)}>
            <DesktopContent data={data} />
            <MobileContent data={data} />
        </Dialog>
    );
}
